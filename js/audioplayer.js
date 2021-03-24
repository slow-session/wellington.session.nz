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
    let previousPlayButton = null;
    let currentAudioSlider = null;
    let presetLoopSegments = [];
    let isIOS = testForIOS();
    let abcEditor = null;

    console.log("isIOS: ", isIOS);

    /*
     ***************************************************************************
     * The function createABCPlayer() is no longer used and is replaced by using:
     *
     * {% include audioPlayerControls.html %}
     * 
     * in the relevant .md or .html file
     ***************************************************************************
     */

    function createMP3player(tuneID, mp3URL) {

        // build the MP3 player for each tune
        let mp3player = `
<form onsubmit="return false">
    <div class="audioParentOuter">
        <!-- Col 1 - play button -->
        <button id="playButtonMP3-${tuneID}" class="playButton icon-play2" aria-label="play/pause button" onclick="audioPlayer.playAudio(${tuneID}, '${mp3URL}')"></button>  
        <!-- Nested row in second column -->
        <div class="audioParentInner">
            <!-- Col 2 - audio slider -->
            <div class="audioChildInner">
                <div class="audio">
                    <span title="Play the tune and then create a loop using the Start and End sliders">
                        <div id="positionMP3-${tuneID}"></div>
                    </span>
                </div>
                <div class="mp3LoopControl">
                    <span title="Play the tune and then create a loop using the Loop Start and Loop End buttons">
                        <input type="button" class="loopButton" id="LoopStart" value=" Loop Start " onclick="audioPlayer.setSliderLoopStart()" />
                        <input type="button" class="loopButton" id="LoopEnd" value=" Loop End " onclick="audioPlayer.setSliderLoopEnd()" />
                        <input type="button" class="loopButton" id="Reset" value=" Reset " onclick="audioPlayer.resetFromToSliders()" />
                    </span>
                </div>
            </div>
            <!-- Col 3 - speed slider -->
            <div class="audioChildInner">
                <div id="speedControl-${tuneID}">
                    <span title="Adjust playback speed with slider">
                        <div id="speedSliderMP3-${tuneID}"></div>
                        <p class="speedLabel"><strong>Playback Speed</strong></p>
                    </span>
                </div>
            </div>
        </div>
    </div>
</form>`;

        return mp3player;
    }

    function createSliders(tuneID) {
        let audioSlider = document.getElementById(`positionMP3-${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

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
        audioSlider.noUiSlider.on("start", function (value) {
            OneAudioPlayer.onplaying = function () {
                OneAudioPlayer.pause();
            };
        });
        audioSlider.noUiSlider.on("end", function (value) {
            OneAudioPlayer.onplaying = function () {
                OneAudioPlayer.play();
            };
        });
        speedSlider.noUiSlider.on("change", function (value) {
            //console.log("playbackRate: " + value / 100);
            OneAudioPlayer.playbackRate = value / 100;
        });
        //How to disable handles on audioslider.
        speedSlider.noUiSlider.on("start", function (value) {
            OneAudioPlayer.onplaying = function () {
                OneAudioPlayer.pause();
            };
        });
        speedSlider.noUiSlider.on("end", function (value) {
            OneAudioPlayer.onplaying = function () {
                OneAudioPlayer.play();
            };
        });
    }

    function playAudio(tuneID, audioSource) {
        let playButton = document.getElementById(`playButtonMP3-${tuneID}`);
        let playPosition = document.getElementById(`positionMP3-${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

        if (playButton.classList.contains("icon-play2")) {
            // time to play this tune
            if (!OneAudioPlayer.src.includes(audioSource)) {
                if (OneAudioPlayer.src != null) {
                    //reset previous audio player
                    // not sure we need this
                    if (previousPlayButton && previousPlayButton.classList.contains("icon-pause")) {
                        previousPlayButton.classList.remove("icon-pause");
                        previousPlayButton.classList.add("icon-play2");
                    }
                }
                previousPlayButton = playButton;

                LoadAudio(audioSource, playPosition);

                OneAudioPlayer.onloadedmetadata = function () {
                    initialiseAudioSlider();
                };
            }
            // Initialise the loop and audioSlider
            if (!endLoopTime) {
                endLoopTime = OneAudioPlayer.duration;
            }

            // This event listener keeps track of the cursor and restarts the loops
            // when needed - we don't need to set it elsewhere
            OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
            OneAudioPlayer.addEventListener("ended", restartLoop);

            OneAudioPlayer.playbackRate = speedSlider.noUiSlider.get() / 100;

            let playPromise = OneAudioPlayer.play();
            if (playPromise) {
                playPromise.catch(function (error) {
                    console.error(error);
                });
            }
            playButton.classList.remove("icon-play2");
            playButton.classList.add("icon-pause");
        } else {
            // if we're playing the tune then we pause
            OneAudioPlayer.pause();
            playButton.classList.remove("icon-pause");
            playButton.classList.add("icon-play2");
        }
    }

    function selectTune(storeID, tuneID) {
        let item = storeID[tuneID];

        let pageMP3player = document.getElementById("pageMP3player");

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

        // make the MP3 player
        if (item.mp3.includes("mp3") && pageMP3player) {
            pageMP3player.innerHTML = audioPlayer.createMP3player(tuneID, item.mp3);
            createSliders(tuneID);

            let playPosition = document.getElementById(`positionMP3-${tuneID}`);
            LoadAudio(item.mp3, playPosition);

            // calculate presetLoopSegments and set up preset loops
            OneAudioPlayer.onloadedmetadata = function () {
                displayPresetLoops(item);
            };
        } else {
            // no recording available
            if (pageMP3player) {
                let recordingMessage =
                    "<fieldset><strong> \
            A recording for this tune is not available.";
                if (modal) {
                    recordingMessage +=
                        `<br /><input class="filterButton" type="button" onclick="location.href='${item.url}';" value="Go to Tune Page" />`;
                }
                recordingMessage += "</strong></fieldset>";

                pageMP3player.style.overflow = "auto";
                pageMP3player.innerHTML = recordingMessage;
            }
        }

        // show the dots and the abc player
        displayABC(item.abc);
    }

    function displayPresetLoops(item) {
        let presetLoops = document.getElementById("presetLoops");
        if (presetLoops && item.mp3) {
            presetLoops.innerHTML = `
    <details>
        <summary class="filterButton">Preset Loops</summary>
        <div id="loopPresetControls" class="loop3columnLayout"></div>
    </details>`;

            //console.log("OneAudioPlayer.duration: " + OneAudioPlayer.duration);             
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
        initialiseAudioSlider();
    }

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

    function LoadAudio(audioSource, playPosition) {
        //console.log("Loading: " + audioSource)
        OneAudioPlayer.src = audioSource;

        playPosition.noUiSlider.updateOptions({
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
        currentAudioSlider = playPosition;
    }

    function stopAudio() {
        if (document.getElementById('OneAudioPlayer')) {
            OneAudioPlayer.pause();
        }
        if (abcEditor) {
            abcEditor.synth.synthControl.pause();
        }
    }

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

    function positionUpdate() {
        if (OneAudioPlayer.currentTime >= endLoopTime) {
            //console.log("Current time: " + OneAudioPlayer.currentTime);
            OneAudioPlayer.currentTime = beginLoopTime;
            //console.log("Reset loop start to: " + OneAudioPlayer.currentTime);
        }
        currentAudioSlider.noUiSlider.setHandle(1, OneAudioPlayer.currentTime);
    }

    function restartLoop() {
        OneAudioPlayer.currentTime = beginLoopTime;
        //console.log("Restarting loop at: " + OneAudioPlayer.currentTime);
        OneAudioPlayer.play();
    }

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

    function setSliderStart(startTime) {
        if (startTime > OneAudioPlayer.currentTime) {
            currentAudioSlider.noUiSlider.setHandle(1, startTime);
        }
        currentAudioSlider.noUiSlider.setHandle(0, startTime);
        beginLoopTime = startTime;
    }

    function setSliderEnd(endTime) {
        if (endTime < OneAudioPlayer.currentTime) {
            currentAudioSlider.noUiSlider.setHandle(1, endTime);
        }
        currentAudioSlider.noUiSlider.setHandle(2, Math.min(OneAudioPlayer.duration, endTime));
        endLoopTime = endTime;
    }

    function adjustUp(elementName, inputTime) {
        let loopInput = document.getElementById(elementName);

        if (inputTime <= OneAudioPlayer.duration - 0.2) {
            let newTime = parseFloat(inputTime) + parseFloat(0.2);
            newTime = newTime.toFixed(1);

            if (newTime > OneAudioPlayer.currentTime) {
                currentAudioSlider.noUiSlider.setHandle(1, newTime);
            }
            if (elementName == "loopControlStart") {
                currentAudioSlider.noUiSlider.setHandle(0, newTime);
                beginLoopTime = newTime;
            } else {
                currentAudioSlider.noUiSlider.setHandle(2, Math.min(OneAudioPlayer.duration, newTime));
                endLoopTime = newTime;
            }
            loopInput.value = newTime;
        }
    }

    function adjustDown(elementName, inputTime) {
        let loopInput = document.getElementById(elementName);

        if (inputTime >= 0.2) {
            let newTime = parseFloat(inputTime) - parseFloat(0.2);
            newTime = newTime.toFixed(1);

            if (newTime < OneAudioPlayer.currentTime) {
                currentAudioSlider.noUiSlider.setHandle(1, newTime);
            }
            if (elementName == "loopControlStart") {
                currentAudioSlider.noUiSlider.setHandle(0, newTime);
                beginLoopTime = newTime;
            } else {
                currentAudioSlider.noUiSlider.setHandle(2, Math.min(OneAudioPlayer.duration, newTime));
                endLoopTime = newTime;
            }
            loopInput.value = newTime;
        }
    }

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
            // iOS audio player workaround for initial call to OneAudioPlayer.currentTime
            if (isIOS) {
                OneAudioPlayer.oncanplaythrough = function () {
                    OneAudioPlayer.currentTime = beginLoopTime;
                };
            } else {
                OneAudioPlayer.currentTime = beginLoopTime;
            }

            // first reset to ends, then reposition
            currentAudioSlider.noUiSlider.setHandle(0, 0);
            currentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.duration);
            currentAudioSlider.noUiSlider.setHandle(1, 0);
            // set to positions in row
            currentAudioSlider.noUiSlider.setHandle(1, beginLoopTime);
            currentAudioSlider.noUiSlider.setHandle(0, beginLoopTime);
            currentAudioSlider.noUiSlider.setHandle(2, endLoopTime);

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
            }
        } else {
            resetFromToSliders();
            OneAudioPlayer.currentTime = beginLoopTime;
        }
    }

    function setSliderLoopStart() {
        beginLoopTime = OneAudioPlayer.currentTime;
        currentAudioSlider.noUiSlider.setHandle(0, beginLoopTime);
        let loopControlStart = document.getElementById("loopControlStart");
        if (loopControlStart) {
            loopControlStart.value = beginLoopTime;
        }
    }

    function setSliderLoopEnd() {
        endLoopTime = OneAudioPlayer.currentTime;
        currentAudioSlider.noUiSlider.setHandle(2, endLoopTime);
        let loopControlEnd = document.getElementById("loopControlEnd");
        if (loopControlEnd) {
            loopControlEnd.value = endLoopTime;
        }
    }

    function resetFromToSliders() {
        beginLoopTime = 0;
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

    function testForIOS() {
        const iOS_1to13 = /^iP/.test(navigator.platform) ||
            /^Mac/.test(navigator.platform) && navigator.maxTouchPoints > 4;

        return !window.MSStream && iOS_1to13;
    }

    return {
        createMP3player: createMP3player,
        createSliders: createSliders,
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
