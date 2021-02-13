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
    
    function createAudioPlayer() {
        let audioPlayer = `
<!-- declare an Audio Player for this page-->
<audio id="OneAudioPlayer">
    <source id="mp3Source" type="audio/mp3"></source> 
    <source id="wavSource" type="audio/wav"></source>
    Your browser does not support the audio format.
</audio>`;

        return audioPlayer;
    }

    function createMP3player(tuneID, mp3URL) {

        // build the MP3 player for each tune
        let mp3player = `
<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">
    <div id="mp3Player-${tuneID}" class="audioParentOuter">
        <!-- Col 1 - play button -->
        <div class="playpauseButton">
            <button id="playMP3-${tuneID}" class="playButton" 
            onclick="audioPlayer.playAudio(${tuneID}, '${mp3URL}')"></button>
        </div>
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
                        <input type="button" class="loopButton" id="LoopStart" value=" Loop Start " onclick="audioPlayer.setFromSlider()" />
                        <input type="button" class="loopButton" id="LoopEnd" value=" Loop End " onclick="audioPlayer.setToSlider()" />
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
                document.getElementById("loopControlStart").value = beginLoopTime;
            } else if (handle === 2) {
                endLoopTime = setEndLoopTime(values[2]);
                document.getElementById("loopControlEnd").value = endLoopTime;
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
        let playButton = document.getElementById(`playMP3-${tuneID}`);
        let playPosition = document.getElementById(`positionMP3-${tuneID}`);
        let speedSlider = document.getElementById(`speedSliderMP3-${tuneID}`);

        if (playButton.className == "playButton") {
            if (!OneAudioPlayer.src.includes(audioSource)) {
                if (OneAudioPlayer.src != null) {
                    //reset previous audio player
                    if (previousPlayButton != null) {
                        previousPlayButton.className = "playButton";
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
            playButton.className = "";
            playButton.className = "pauseButton";
        } else {
            OneAudioPlayer.pause();
            playButton.className = "";
            playButton.className = "playButton";
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
                //console.log("OneAudioPlayer.duration: " + OneAudioPlayer.duration);
                if (item.repeats && item.parts) {
                    //console.log('setupPresetLoops: ' + OneAudioPlayer.duration);
                    buildSegments(item);
                    if (presetLoopSegments.length) {
                        document.getElementById("loopPresetControls").innerHTML = createLoopControlsContainer();
                    }
                }
                initialiseAudioSlider();
            };
        } else {
            // no recording available
            if (pageMP3player) {
                let recordingMessage =
                    "<fieldset><strong> \
            A recording for this tune is not available.";
                if (modal) {
                    recordingMessage +=
                        '<br /><input class="filterButton" type="button" onclick="location.href=\'' +
                        item.url +
                        '\';" value="Go to Tune Page" />';
                    if (dotsForm) {
                        dotsForm.style.display = "none";
                    }
                }
                recordingMessage += "</strong></fieldset>";

                pageMP3player.style.overflow = "auto";
                pageMP3player.innerHTML = recordingMessage;
            }
        }

        // show the dots and the abc player
        displayABC(item.abc);
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
                        displayLoop: false,
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
            document.getElementById("abcPaper").style.paddingBottom = "0px";
            document.getElementById("abcPaper").style.overflow = "auto";
            let urlTheSession = "https://thesession.org/tunes/";
            document.getElementById("abcPaper").innerHTML =
                "<fieldset><strong> \
    <p>We don't have dots for this tune. If you find a version of the tune that's a good match, send \
    us a copy of the ABC and we'll get it added to the site. You might find it on The Session \
    at this link:</p>\
    <a href=\"" + urlTheSession + '">' + urlTheSession + "</a>\
    </strong></fieldset>";
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

    function stopAudio(){
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
        <button id="buttonStartDown" class="downButton" title=" - 1/5 second" onclick="audioPlayer.adjustDown('loopControlStart', loopControlStart.value)"></button>

        <input id="loopControlStart" class="loopClass" type="number" size="4" min="0" step=0.1 value=0.0 onchange="audioPlayer.setStartSlider(loopControlStart.value)"> 

        <button id="buttonStartUp" class="upButton" title=" + 1/5 second" onclick="audioPlayer.adjustUp('loopControlStart', loopControlStart.value)"></button> 
    </div>

    <!-- adjust end of loop -->
    <div class="loopControl">
        <button id="buttonEndDown" class="downButton" title=" - 1/5 second" onclick="audioPlayer.adjustDown('loopControlEnd', loopControlEnd.value)"></button>
        
        <input id="loopControlEnd" class="loopClass" type="number" size="4" min="0" step=0.1 value=${OneAudioPlayer.duration.toFixed(1)} onchange="audioPlayer.setEndSlider(loopControlEnd.value)"> 

        <button id="buttonEndUp" class="upButton" title=" + 1/5 second" onclick="audioPlayer.adjustUp('loopControlEnd', loopControlEnd.value)"></button> 
    </div>`;

        for (let segmentNumber = 0; segmentNumber < presetLoopSegments.length; segmentNumber++) {
            // build each row
            loopControlsContainer += `
    <div class="loopLabel">
        <strong>Part ${presetLoopSegments[segmentNumber].name}</strong>
    </div>
    <div class="loopLabel">
        <input type="checkbox" onclick="audioPlayer.applySegments()" id="segment${segmentNumber}">${presetLoopSegments[segmentNumber].repeat}</input>
    </div>`;
            let nextSegment = segmentNumber + 1;
            if (nextSegment == presetLoopSegments.length) {
                loopControlsContainer += `
    <div class="loopLabel"></div>`;
                break;
            }
            if (presetLoopSegments[nextSegment].name == presetLoopSegments[segmentNumber].name) {
                loopControlsContainer += `
    <div class="loopLabel">
        <input type="checkbox" onclick="audioPlayer.applySegments()" id="segment${nextSegment}">${presetLoopSegments[nextSegment].repeat}</input>
    </div>`;
                segmentNumber = nextSegment;
            } else {
                loopControlsContainer += `
    <div class="loopLabel"></div>`;
            }
        }

        return loopControlsContainer;
    }

    function setStartSlider(startTime){
        if (startTime >  OneAudioPlayer.currentTime) {
            currentAudioSlider.noUiSlider.setHandle(1, startTime);
        }
        currentAudioSlider.noUiSlider.setHandle(0, startTime);
        beginLoopTime = startTime;
    }

    function setEndSlider(endTime){
        if (endTime <  OneAudioPlayer.currentTime) {
            currentAudioSlider.noUiSlider.setHandle(1, endTime);
        }
        currentAudioSlider.noUiSlider.setHandle(2, setEndLoopTime(endTime));
        endLoopTime = endTime;
    }

    function adjustUp(elementName, inputTime) {
        let loopInput = document.getElementById(elementName);

        if (inputTime <= OneAudioPlayer.duration - 0.2) {
            let newTime = parseFloat(inputTime) + parseFloat(0.2);
            newTime = newTime.toFixed(1);
        
            if (newTime >  OneAudioPlayer.currentTime) {
                currentAudioSlider.noUiSlider.setHandle(1, newTime);
            }
            if (elementName == "loopControlStart") {
                currentAudioSlider.noUiSlider.setHandle(0, newTime);
                beginLoopTime = newTime;
            } else {
                currentAudioSlider.noUiSlider.setHandle(2, setEndLoopTime(newTime));
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
            
            if (newTime <  OneAudioPlayer.currentTime) {
                currentAudioSlider.noUiSlider.setHandle(1, newTime);
            }
            if (elementName == "loopControlStart") {
                currentAudioSlider.noUiSlider.setHandle(0, newTime);
                beginLoopTime = newTime;
            } else {
                currentAudioSlider.noUiSlider.setHandle(2, setEndLoopTime(newTime));
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
           endLoopTime = setEndLoopTime(parseFloat(presetLoopSegments[lastSegment].end));
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

    function setFromSlider() {
        beginLoopTime = OneAudioPlayer.currentTime;
        currentAudioSlider.noUiSlider.setHandle(0, beginLoopTime);
        document.getElementById("loopControlStart").value = beginLoopTime;        
    }

    function setToSlider() {
        endLoopTime = OneAudioPlayer.currentTime;
        currentAudioSlider.noUiSlider.setHandle(2, endLoopTime);
        document.getElementById("loopControlEnd").value = endLoopTime;
    }

    function resetFromToSliders() {
        beginLoopTime = 0;
        currentAudioSlider.noUiSlider.setHandle(0, beginLoopTime);
        currentAudioSlider.noUiSlider.setHandle(1, beginLoopTime);
        document.getElementById("loopControlStart").value = beginLoopTime;        
        
        endLoopTime = OneAudioPlayer.duration.toFixed(1);
        currentAudioSlider.noUiSlider.setHandle(2, endLoopTime);
        document.getElementById("loopControlEnd").value = endLoopTime;

        // Uncheck all the checkboxes in the Preset Loops
        for (let segmentNumber = 0; segmentNumber < presetLoopSegments.length; segmentNumber++) {
            document.getElementById("segment" + segmentNumber).checked = false;
        }
    }

    function setEndLoopTime(endLoopValue) {
        // Don't allow endLoopTime to be >= OneAudioPlayer.duration
        if (endLoopValue > OneAudioPlayer.duration) {
            endLoopValue = OneAudioPlayer.duration;
        }
        return endLoopValue;
    }

    function testForIOS() {
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (
            userAgent.match(/iPad/i) ||
            userAgent.match(/iPhone/i) ||
            userAgent.match(/iPod/i)
        ) {
            return true;
        } else {
            return false;
        }
    }

    return {
        createAudioPlayer: createAudioPlayer,
        createMP3player: createMP3player,
        createSliders: createSliders,
        playAudio: playAudio,
        stopAudio: stopAudio,
        selectTune: selectTune,
        setStartSlider: setStartSlider,
        setEndSlider: setEndSlider,
        setFromSlider: setFromSlider,
        setToSlider: setToSlider,
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