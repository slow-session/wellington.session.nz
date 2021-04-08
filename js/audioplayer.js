/*
 * Audio controls for the browser audio player
 *
 * Version: 2.1
 * Date: 25 Nov 2020
 *
 * Developed as part of websites for https://dev.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/dev.session.nz/blob/master/js/audioplayer.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */
"use strict";

const audioPlayer = (function () {
    let beginLoopTime = 0;
    let endLoopTime = 0;
    let currentAudioSlider = null;
    let presetLoopSegments = [];
    let abcEditor = null;

    /*
     ***************************************************************************
     * The function createAudioPlayer() is no longer used and is replaced by using:
     *
     * {% include audioPlayerControls.html %}
     * 
     * in the relevant .md or .html file
     ***************************************************************************
     */

    // Used on tune pages to create an MP3 player and display the ABC
    function selectTune(storeID, tuneID) {
        let item = storeID[tuneID];

        // Add info to page if needed
        let tuneTitle = document.getElementById("tuneTitle");
        if (tuneTitle) {
            tuneTitle.innerHTML =
                `<h2>${item.title}<span> - ${item.key} ${item.rhythm}</span></h2>`;
        }
        let tuneInfo = document.getElementById("tuneInfo");
        if (tuneInfo) {
            if (item.mp3_source) {
                tuneInfo.innerHTML = "Source: " + item.mp3_source;
            } else {
                tuneInfo.innerHTML = "";
            }
        }

        // Clear the loop preset display
        let loopPresetControls = document.getElementById("loopPresetControls");
        if (loopPresetControls) {
            loopPresetControls.innerHTML = "";
        }
        presetLoopSegments = [];

        // If we have a modal make it visible
        let modal = document.getElementById("tuneModal");
        if (modal) {
            modal.style.display = "block";
        }

        let pageMP3player = document.getElementById("pageMP3player");
        // make the MP3 player
        if (pageMP3player && item.mp3.includes("mp3")) {
            displayMP3player(pageMP3player, tuneID, item.mp3, item);
        } else {
            // no recording available
            if (pageMP3player) {
                let recordingMessage = "<fieldset><strong>A recording for this tune is not available.</strong></fieldset>";

                pageMP3player.style.overflow = "auto";
                pageMP3player.innerHTML = recordingMessage;
            }
        }

        // show the dots and the abc player
        displayABC(item.abc);
    }

    // Used on playLocalAudio page directly
    function displayMP3player(pageMP3player, tuneID, mp3, item) {

        createMP3player(pageMP3player, tuneID);

        let audioSlider = document.getElementById(`audioSliderMP3-${tuneID}`);
        LoadAudio(mp3, audioSlider);

        if (item) {
            OneAudioPlayer.onloadedmetadata = function () {
                initialiseAudioSlider();
                initialisePresetLoops(item);
            }
        } else {
            // calculate presetLoopSegments and set up preset loops
            OneAudioPlayer.onloadedmetadata = function () {
                initialiseAudioSlider();
            };
        }
    }

    // Used on pages that display ABC such as editABC, playLocalABC and the "sets" pages
    function displayABC(abcText) {
        if (abcText) {
            let textAreaABC = document.getElementById("textAreaABC");
            if (textAreaABC) {
                textAreaABC.innerHTML = abcText;
            }

            // Get the current paper state
            let currentPaperState = document.getElementById("abcPaper").style.display;
            // Set the paper state to 'block'
            document.getElementById("abcPaper").style.display = "block";

            // Draw the dots
            abcEditor = new window.ABCJS.Editor("textAreaABC", {
                paper_id: "abcPaper",
                warnings_id: "warnings",
                render_options: {
                    responsive: 'resize'
                },
                indicate_changed: "true",
                synth: {
                    el: "#abcAudio",
                    options: {
                        displayLoop: true,
                        displayRestart: true,
                        displayPlay: true,
                        displayProgress: true,
                        displayWarp: true
                    }
                }
            });

            // Reset paper state to original value
            document.getElementById("abcPaper").style.display = currentPaperState;
        } else {
            let abcPaper = document.getElementById("abcPaper");
            if (abcPaper) {
                abcPaper.style.paddingBottom = "0px";
                abcPaper.style.overflow = "auto";
                let urlTheSession = "https://thesession.org/tunes/";
                abcPaper.innerHTML =
                    `<p>We don't have dots for this tune. If you find a version of the tune that's 
    a good match, send us a copy of the ABC and we'll get it added to the site. 
    You might find it on The Session at this link: 
    <a href="${urlTheSession}">${urlTheSession}</a></p>`;
            }
        }
    }

    // creates an MP3 player - not called externally
    function createMP3player(playerdivID, tuneID) {

        // build the MP3 player for each tune
        playerdivID.innerHTML = `
    <div class="audioParentOuter">
        <!-- Col 1 - play button -->
        <button id="playButtonMP3-${tuneID}" class="playButton icon-play2" aria-label="play/pause button" 
            onclick="audioPlayer.playAudio(${tuneID})"></button>  
        <div class="audioParentInner">
            <!-- Col 2 - audio slider -->
            <div class="audioChildInner">
                <span title="Play the tune and then create a loop using the Start and End sliders">
                    <div id="audioSliderMP3-${tuneID}"></div>
                </span>
                <div class="mp3LoopControl">
                    <span title="Play the tune and then create a loop using the Loop Start and Loop End buttons">
                        <button id="LoopStart-${tuneID}" class="loopButton" aria-label="loop start" 
                            onclick="audioPlayer.setSliderLoopStart()"> Loop Start </button>
                        <button id="LoopEnd-${tuneID}" class="loopButton" aria-label="loop end" 
                            onclick="audioPlayer.setSliderLoopEnd()"> Loop End </button>
                        <button id="Reset-${tuneID}" class="loopButton"  aria-label="reset" 
                            onclick="audioPlayer.resetFromToSliders()"> Reset </button>
                    </span>
                </div>
            </div>
            <!-- Col 3 - speed slider -->
            <div class="audioChildInner">
                <span title="Adjust playback speed with slider">
                    <div id="speedSliderMP3-${tuneID}"></div>
                    <p class="speedLabel"><strong>Playback Speed</strong></p>
                </span>
            </div>
        </div>
    </div>`;

        // Add the sliders
        createSliders(tuneID);

        return true;
    }

    // creates the control sliders - not called externally
    function createSliders(tuneID) {
        let audioSlider = document.getElementById(`audioSliderMP3-${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

        // create the audio sliders
        noUiSlider.create(audioSlider, {
            start: [0, 0, 100],
            connect: [false, true, true, false],
            behaviour: "drag",
            step: 0.25,
            range: {
                min: 0,
                max: 100,
            },
        });

        // add the function that this slider calls on change
        audioSlider.noUiSlider.on("change", function (values, handle) {
            if (handle === 0) {
                beginLoopTime = values[0];
                let loopControlStart = document.getElementById("loopControlStart");
                if (loopControlStart) {
                    loopControlStart.value = beginLoopTime;
                }
            } else if (handle === 2) {
                endLoopTime = Math.min(OneAudioPlayer.duration, values[2]);
                let loopControlEnd = document.getElementById("loopControlEnd");
                if (loopControlEnd) {
                    loopControlEnd.value = endLoopTime;
                }
            } else if (handle === 1) {
                OneAudioPlayer.currentTime = values[1];
            }
        });
        // Not clear we need these!!
        audioSlider.noUiSlider.on("start", function () {
            OneAudioPlayer.onplaying = function () {
                console.log("pause");
                OneAudioPlayer.pause();
            };
        });
        audioSlider.noUiSlider.on("end", function () {
            OneAudioPlayer.onplaying = function () {
                console.log("play");
                OneAudioPlayer.play();
            };
        });
        

        // create the speed slider
        noUiSlider.create(speedSlider, {
            start: [100],
            tooltips: [
                wNumb({
                    decimals: 0,
                    postfix: " %",
                }),
            ],
            range: {
                min: 51,
                max: 121,
            },
        });

        // add the function that this slider calls on change
        speedSlider.noUiSlider.on("change", function (value) {
            //console.log("playbackRate: " + value / 100);
            OneAudioPlayer.playbackRate = value / 100;
        });
    }

    // plays the MP3 when the play button is pressed
    function playAudio(tuneID) {
        let playButton = document.getElementById(`playButtonMP3-${tuneID}`);
        let audioSlider = document.getElementById(`audioSliderMP3-${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

        if (playButton.classList.contains("icon-play2")) {
            // time to play this tune
            // These event listeners keep track of the cursor and restarts the loop
            // when needed - we don't need to set them elsewhere
            OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
            OneAudioPlayer.addEventListener("ended", restartLoop);

            OneAudioPlayer.playbackRate = speedSlider.noUiSlider.get() / 100;

            let playPromise = OneAudioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                  // Automatic playback started!
                  // Show playing UI.
                })
                .catch(error => {
                  // Auto-play was prevented
                  // Show paused UI.
                  console.error(error);
                });
            }
            // Get the position parameters from the noUiSlider controls
            beginLoopTime = audioSlider.noUiSlider.get()[0];
            OneAudioPlayer.currentTime = audioSlider.noUiSlider.get()[1];
            endLoopTime = audioSlider.noUiSlider.get()[2];

            //console.log(beginLoopTime);
            //console.log(OneAudioPlayer.currentTime);
            //console.log(endLoopTime);

            playButton.classList.remove("icon-play2");
            playButton.classList.add("icon-pause");
        } else {
            // if we're playing the tune then we pause
            OneAudioPlayer.pause();
            playButton.classList.remove("icon-pause");
            playButton.classList.add("icon-play2");
        }
    }

    // loads the MP3 file and initialises the sliders - not called externally
    function LoadAudio(audioSource, audioSlider) {
        //console.log("Loading: " + audioSource)
        OneAudioPlayer.src = audioSource;
        OneAudioPlayer.load();

        audioSlider.noUiSlider.updateOptions({
            tooltips: [
                wNumb({
                    decimals: 1,
                }),
                wNumb({
                    decimals: 1,
                }),
                wNumb({
                    decimals: 1,
                }),
            ],
        });
        currentAudioSlider = audioSlider;
    }

    // initialise the audio slider when the MP3 is loaded - not called externally
    function initialiseAudioSlider() {
        //console.log('initialiseAudioSlider: ' + OneAudioPlayer.duration);
        currentAudioSlider.noUiSlider.updateOptions({
            range: {
                min: 0,
                max: OneAudioPlayer.duration,
            },
        });
        resetFromToSliders();
    }

    // initialise the preset loops when the MP3 is loaded - not called externally
    function initialisePresetLoops(item) {
        let presetLoops = document.getElementById("presetLoops");
        if (presetLoops && item.mp3) {
            presetLoops.innerHTML = `
    <details>
        <summary class="filterButton">Preset Loops</summary>
        <div id="loopPresetControls" class="loop3columnLayout"></div>
    </details>`;
            // Add details button
            let loopPresetControls = document.getElementById("loopPresetControls");
            if (loopPresetControls) {
                loopPresetControls.innerHTML = createLoopControlsContainer();

                if (item.repeats && item.parts) {
                    //console.log('setupPresetLoops: ' + OneAudioPlayer.duration);
                    buildSegments(item);
                    if (presetLoopSegments.length) {
                        loopPresetControls.innerHTML += createPresetLoops();
                    }
                }
            }
        }
    }

    // stop any audio playing when modals are closed 
    // or new ABC is loaded in editABC and playLocalABC
    function stopAudio() {
        if (document.getElementById('OneAudioPlayer')) {
            OneAudioPlayer.pause();
        }
        if (abcEditor) {
            abcEditor.synth.synthControl.pause();
        }
    }

    // redraws the current position slider as the tune is playing - not called externally
    function positionUpdate() {
        if (OneAudioPlayer.currentTime >= endLoopTime) {
            //console.log("Current time: " + OneAudioPlayer.currentTime);
            OneAudioPlayer.currentTime = beginLoopTime;
            //console.log("Reset loop start to: " + OneAudioPlayer.currentTime);
        }
        currentAudioSlider.noUiSlider.setHandle(1, OneAudioPlayer.currentTime);
    }

    // restarts the loop at the beginning of the currently defined loop - not called externally
    function restartLoop() {
        OneAudioPlayer.currentTime = beginLoopTime;
        //console.log("Restarting loop at: " + OneAudioPlayer.currentTime);
        OneAudioPlayer.play();
    }

    // construct the tune part segments based on the parts and repeats 
    // info in the tune "md" file - not called externally
    function buildSegments(item) {
        let parts = item.parts;
        let repeats = item.repeats;
        let mySegment;

        presetLoopSegments = [];

        // Look for AABB notation in "md" file
        if (parts.toString().includes("A")) {
            let lastPart = "";
            let part_names = parts.split("");
            let repeatCount = 1;
            for (let segmentNumber = 0; segmentNumber < part_names.length; segmentNumber++) {
                mySegment = {
                    name: 0,
                    repeat: 0,
                    start: 0.0,
                    end: 0.0,
                };
                mySegment.name = part_names[segmentNumber];
                if (lastPart == part_names[segmentNumber]) {
                    mySegment.repeat = "Repeat 2";
                } else {
                    mySegment.repeat = "Repeat 1";
                }
                presetLoopSegments.push(mySegment);
                lastPart = part_names[segmentNumber];
            }
            // Insert the values
            let start = 0.0;
            let end = 0.0;
            let each_part =
                OneAudioPlayer.duration / repeats / presetLoopSegments.length;
            for (let key in presetLoopSegments) {
                start = each_part * key;
                end = start + each_part;
                presetLoopSegments[key].start = start.toFixed(1);
                presetLoopSegments[key].end = end.toFixed(1);
            }
        }
    }

    // create the container for the preset loops - not called externally
    function createLoopControlsContainer() {
        let loopControlsContainer = `
    <div class="loopLabel"><strong>Adjust Loop</strong></div>
    
    <!-- adjust start of loop  -->
    <div class="loopControl">
        <button class="loopNudgeButton icon-circle-left" aria-label="nudge start of loop down" title=" - 1/5 second" onclick="audioPlayer.adjustDown('loopControlStart', loopControlStart.value)"></button>

        <input id="loopControlStart" class="loopInput" type="number" size="4" min="0" max="${OneAudioPlayer.duration}" step=0.1 value=0.0 onchange="audioPlayer.setSliderStart(loopControlStart.value)"> 

        <button class="loopNudgeButton icon-circle-right" title=" + 1/5 second" aria-label="nudge start of loop up" onclick="audioPlayer.adjustUp('loopControlStart', loopControlStart.value)"></button> 
    </div>

    <!-- adjust end of loop -->
    <div class="loopControl">
        <button class="loopNudgeButton icon-circle-left" title=" - 1/5 second" aria-label="nudge end of loop down" onclick="audioPlayer.adjustDown('loopControlEnd', loopControlEnd.value)"></button>
        
        <input id="loopControlEnd" class="loopInput" type="number" size="4" min="0" max="${OneAudioPlayer.duration}" step=0.1 value=${OneAudioPlayer.duration.toFixed(1)} onchange="audioPlayer.setSliderEnd(loopControlEnd.value)"> 

        <button class="loopNudgeButton icon-circle-right" title=" + 1/5 second" aria-label="nudge end of loop up" onclick="audioPlayer.adjustUp('loopControlEnd', loopControlEnd.value)"></button> 
    </div>`;

        return loopControlsContainer;
    }

    // uses the info from buildSegments() to display the preset loops - not called externally
    function createPresetLoops() {
        let loopDetails = '';

        // Add the details for each "part" with "repeats"
        for (let segmentNumber = 0; segmentNumber < presetLoopSegments.length; segmentNumber++) {
            // build each row
            loopDetails += `
    <div class="loopLabel">
        <strong>Part ${presetLoopSegments[segmentNumber].name}</strong>
    </div>
    <div class="loopLabel">
        <input type="checkbox" onclick="audioPlayer.applySegments()" id="segment${segmentNumber}">${presetLoopSegments[segmentNumber].repeat}</input>
    </div>`;
            // look ahead for a part repeat
            let nextSegment = segmentNumber + 1;
            // last segment so no repeat
            if (nextSegment == presetLoopSegments.length) {
                loopDetails += `
    <div class="loopLabel"></div>`;
                break;
            }
            // add the second repeat
            if (presetLoopSegments[nextSegment].name == presetLoopSegments[segmentNumber].name) {
                loopDetails += `
    <div class="loopLabel">
        <input type="checkbox" onclick="audioPlayer.applySegments()" id="segment${nextSegment}">${presetLoopSegments[nextSegment].repeat}</input>
    </div>`;
                segmentNumber = nextSegment;
            } else {
                loopDetails += `
    <div class="loopLabel"></div>`;
            }
        }
        return loopDetails;
    }

    // called when the Start "input" box in the preset loops container changes
    function setSliderStart(startTime) {
        if (startTime > OneAudioPlayer.currentTime) {
            currentAudioSlider.noUiSlider.setHandle(1, startTime);
        }
        currentAudioSlider.noUiSlider.setHandle(0, startTime);
        beginLoopTime = startTime;
    }

    // called when the End "input" box in the preset loops container changes
    function setSliderEnd(endTime) {
        if (endTime < OneAudioPlayer.currentTime) {
            currentAudioSlider.noUiSlider.setHandle(1, endTime);
        }
        currentAudioSlider.noUiSlider.setHandle(2, Math.min(OneAudioPlayer.duration, endTime));
        endLoopTime = endTime;
    }

    // called by the "up" arrow keys in the preset loops containers
    function adjustUp(elementName, inputTime) {
        let loopInput = document.getElementById(elementName);

        let newTime = parseFloat(inputTime) + parseFloat(0.2);
        newTime = newTime.toFixed(1);
        console.log("up - newTime: ", newTime);

        if (elementName == "loopControlStart") {
            // don't push the beginning of the loop past the current end of the loop
            if (newTime < endLoopTime - 0.2) {
                if (newTime > OneAudioPlayer.currentTime) {
                    currentAudioSlider.noUiSlider.setHandle(1, newTime);
                }
                currentAudioSlider.noUiSlider.setHandle(0, newTime);
                beginLoopTime = newTime;
                loopInput.value = newTime;
            }
        } else {
            if (newTime > OneAudioPlayer.duration) {
                // don't push the end of the loop past the end of the tune
                currentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.duration);
                endLoopTime = OneAudioPlayer.duration;
                loopInput.value = OneAudioPlayer.duration.toFixed(1);
            } else {
                // adjust the end of the loop
                currentAudioSlider.noUiSlider.setHandle(2, newTime);
                endLoopTime = newTime;
                loopInput.value = newTime;
            }
        }
    }

    // called by the "down" arrow keys in the preset loops containers
    function adjustDown(elementName, inputTime) {
        let loopInput = document.getElementById(elementName);

        let newTime = parseFloat(inputTime) - parseFloat(0.2);
        newTime = newTime.toFixed(1);
        console.log("down - newTime: ", newTime);

        if (elementName == "loopControlStart") {
            if (newTime < 0) {
                // don't push the beginning of the loop past the start of the tune
                currentAudioSlider.noUiSlider.setHandle(0, 0);
                beginLoopTime = 0;
                loopInput.value = 0;
            } else {
                // adjust the beginning of the loop
                currentAudioSlider.noUiSlider.setHandle(0, newTime);
                beginLoopTime = newTime;
                loopInput.value = newTime;
            }
        } else {
            if (newTime >= beginLoopTime + 0.2) {
                // don't push the end of the loop past the current begining of the loop
                currentAudioSlider.noUiSlider.setHandle(2, newTime);
                endLoopTime = newTime;
                loopInput.value = newTime;
            }
        }
    }

    // called when the preset loop tick boxes are selected/deselected
    function applySegments() {
        let checkBox;
        let firstSegment = null;
        let lastSegment = null;

        for (let segmentNumber = 0; segmentNumber < presetLoopSegments.length; segmentNumber++) {
            checkBox = document.getElementById("segment" + segmentNumber);

            if (checkBox.checked == true) {
                if (firstSegment == null) {
                    firstSegment = segmentNumber;
                }
                lastSegment = segmentNumber;
            }
        }
        if (firstSegment != null) {
            beginLoopTime = parseFloat(presetLoopSegments[firstSegment].start);
        }
        if (lastSegment != null) {
            endLoopTime = Math.min(OneAudioPlayer.duration, parseFloat(presetLoopSegments[lastSegment].end));
        }

        // do nothing unless at least one box is checked
        if (firstSegment != null || lastSegment != null) {
            /*
            // iOS audio player workaround for initial call to OneAudioPlayer.currentTime
            if (isIOS) {
                OneAudioPlayer.oncanplaythrough = function () {
                    OneAudioPlayer.currentTime = beginLoopTime; 
                };
            } else {
                OneAudioPlayer.currentTime = beginLoopTime;
            }
            */

            // first reset to ends, then reposition
            currentAudioSlider.noUiSlider.setHandle(0, 0);
            currentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.duration);
            currentAudioSlider.noUiSlider.setHandle(1, 0);
            // set to positions in row
            currentAudioSlider.noUiSlider.setHandle(1, beginLoopTime);
            currentAudioSlider.noUiSlider.setHandle(0, beginLoopTime);
            currentAudioSlider.noUiSlider.setHandle(2, endLoopTime);
            // get current position handle on top
            currentAudioSlider.noUiSlider.setHandle(1, beginLoopTime);

            document.getElementById("loopControlStart").value = beginLoopTime;
            document.getElementById("loopControlEnd").value = endLoopTime;

            if (OneAudioPlayer.paused == false) {
                // audio was  playing when they fiddled with the checkboxes
                let promise = OneAudioPlayer.play();
                // then turn it back on
                if (promise) {
                    promise.catch(function (error) {
                        console.error(error);
                    });
                }
                OneAudioPlayer.currentTime = beginLoopTime;
            }
        } else {
            resetFromToSliders();
        }
    }

    // called when the "Loop Start" button is pressed
    function setSliderLoopStart() {
        beginLoopTime = OneAudioPlayer.currentTime;
        currentAudioSlider.noUiSlider.setHandle(0, beginLoopTime);
        let loopControlStart = document.getElementById("loopControlStart");
        if (loopControlStart) {
            loopControlStart.value = beginLoopTime;
        }
    }

    // called when the "Loop End" button is pressed
    function setSliderLoopEnd() {
        endLoopTime = OneAudioPlayer.currentTime;
        currentAudioSlider.noUiSlider.setHandle(2, endLoopTime);
        let loopControlEnd = document.getElementById("loopControlEnd");
        if (loopControlEnd) {
            loopControlEnd.value = endLoopTime;
        }
    }

    // called when the "Reset" button is pressed
    function resetFromToSliders() {
        beginLoopTime = 0;
        OneAudioPlayer.currentTime = 0;
        currentAudioSlider.noUiSlider.setHandle(0, beginLoopTime);
        currentAudioSlider.noUiSlider.setHandle(1, beginLoopTime);
        let loopControlStart = document.getElementById("loopControlStart");
        if (loopControlStart) {
            loopControlStart.value = beginLoopTime;
        }

        endLoopTime = OneAudioPlayer.duration.toFixed(1);
        currentAudioSlider.noUiSlider.setHandle(2, endLoopTime);
        let loopControlEnd = document.getElementById("loopControlEnd");
        if (loopControlEnd) {
            loopControlEnd.value = endLoopTime;
        }

        // Uncheck all the checkboxes in the Preset Loops
        for (let segmentNumber = 0; segmentNumber < presetLoopSegments.length; segmentNumber++) {
            document.getElementById("segment" + segmentNumber).checked = false;
        }
    }

    return {
        displayMP3player: displayMP3player,
        playAudio: playAudio,
        stopAudio: stopAudio,
        selectTune: selectTune,
        setSliderStart: setSliderStart,
        setSliderEnd: setSliderEnd,
        setSliderLoopStart: setSliderLoopStart,
        setSliderLoopEnd: setSliderLoopEnd,
        resetFromToSliders: resetFromToSliders,
        applySegments: applySegments,
        adjustUp: adjustUp,
        adjustDown: adjustDown,
        displayABC: displayABC,
    };
})();

if (typeof module !== "undefined" && module.exports) {
    module.exports = audioPlayer;
}
