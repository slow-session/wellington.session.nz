/*
 * Audio controls for the browser audio player
 *
 * Version: 2.0
 * Date: 11 Jan 2017
 *
 * Developed as part of websites for https://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/wellington.session.nz/blob/master/js/audioID_controls.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */

/*
 ################################################################################
 #
 # Comment out the line with "console.log" to turn off console logging
 #
 ################################################################################
*/
function myDebug(message){
    console.log(message);
}

var BeginLoopTime = 0;
var EndLoopTime = 0;
var PreviouspButton = null;
var CurrentAudioSlider = null;
var presetLoopSegments = [];

var isIOS = testForIOS();
myDebug("isIOS: " + isIOS);

function createAudioPlayer() {
    var pagePlayer = '';
    pagePlayer += '<!-- declare an Audio Player for this page-->';
    pagePlayer += '<audio id="OneAudioPlayer">';
    pagePlayer += '    <source id="mp3Source" type="audio/mp3"></source> ';
    pagePlayer += '    Your browser does not support the audio format.';
    pagePlayer += '</audio>';

    return (pagePlayer);
}

function createMP3player(tuneID, mp3url) {
    var mp3player = '';
    // build the MP3 player for each tune

    mp3player += '<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
    mp3player += '    <div id="audioplayer' + tuneID + '">';
    mp3player += '    <div class="audioParentOuter">';
    // Col 1 - play button
    mp3player += '      <div class="audioChildOuter">';
    mp3player += '        <button id="playMP3' + tuneID + '" class="playButton"';
    mp3player += '            onclick="playAudio(audioplayer' + tuneID + ', playMP3' + tuneID + ',  positionMP3' + tuneID + ', speedSliderMP3' + tuneID + ', \'' + mp3url + '\')">';
    mp3player += '        </button>';
    mp3player += '      </div>';
    // Nested row in second column
    mp3player += '      <div class="audioChildOuter">';
    mp3player += '        <div class="audioParentInner">';
    // Col 2 - audio slider
    mp3player += '          <div class="audioChildInner">';
    mp3player += '            <div class="audio">';
    mp3player += '              <span title="Play tune, select loop starting point, then select loop end point">';
    mp3player += '                <div id="positionMP3' + tuneID + '" class="mp3AudioControl"></div>'
    mp3player += '              </span>';
    mp3player += '            </div>';
    mp3player += '            <div class="mp3LoopControl">';
    mp3player += '              <span title="Play tune, select loop starting point, then select loop end point">';
    mp3player += '              <input type="button" class="loopButton" id="LoopStart" value=" Loop Start " onclick="setFromSlider()" />';
    mp3player += '              <input type="button" class="loopButton" id="LoopEnd" value=" Loop End " onclick="setToSlider()" />';
    mp3player += '              <input type="button" class="loopButton" id="Reset" value=" Reset " onclick="resetFromToSliders()" />';
    mp3player += '              </span>';
    mp3player += '            </div>';
    mp3player += '          </div>';
    // Col 3 - speed slider
    mp3player += '          <div class="audioChildInner">';
    mp3player += '            <div id="speedControl' + tuneID + '" class="mp3SpeedControl">';
    mp3player += '              <span title="Adjust playback speed with slider">';
    mp3player += '                <div id="speedSliderMP3' + tuneID + '"></div>'
    mp3player += '                <p class="mp3SpeedLabel"><strong>Playback Speed</strong></p>';
    mp3player += '              </span>';
    mp3player += '            </div>';
    mp3player += '          </div>';
    mp3player += '        </div>';
    mp3player += '      </div>';
    mp3player += '    </div>';
    mp3player += '  </div>';
    mp3player += '</form>';

    return (mp3player);
}

function createSliders(tuneID) {
    var audioSlider = document.getElementById('positionMP3' + tuneID);
    var speedSlider = document.getElementById('speedSliderMP3' + tuneID);

    noUiSlider.create(audioSlider, {
        start: [0, 0, 100],
        connect: [false, true, true, false],
        behaviour: 'drag',
        step: 0.25,
        range: {
            'min': 0,
            'max': 100
        }
    });

    noUiSlider.create(speedSlider, {
        start: [100],
        tooltips: [wNumb({
            decimals: 0,
            postfix: ' %'
        })],
        range: {
            'min': 50,
            'max': 120
        }
    });

    audioSlider.noUiSlider.on('change', function(values, handle) {
        if (handle === 0) {
            BeginLoopTime = values[0];
            EndLoopTime = assignEndLoopTime(values[2]);
            saveUserLoop(values);
        } else if (handle === 2) {
            BeginLoopTime = values[0];
            EndLoopTime = assignEndLoopTime(values[2]);
            saveUserLoop(values);
        } else if (handle === 1) {
            OneAudioPlayer.currentTime = values[1];
        }
    });
    speedSlider.noUiSlider.on('change', function(value) {
        myDebug("playbackRate: " + value / 100);
        OneAudioPlayer.playbackRate = value / 100;
    });
    //How to disable handles on audioslider.
    speedSlider.noUiSlider.on('start', function(value) {
        OneAudioPlayer.onplaying = function() {
                OneAudioPlayer.pause();
        };
    });
    speedSlider.noUiSlider.on('end', function(value) {
        OneAudioPlayer.onplaying = function() {
                OneAudioPlayer.play();
        };
    });
    audioSlider.noUiSlider.on('start', function(value) {
        OneAudioPlayer.onplaying = function() {
                OneAudioPlayer.pause();
        };
    });
    audioSlider.noUiSlider.on('end', function(value) {
        OneAudioPlayer.onplaying = function() {
                OneAudioPlayer.play();
        };
    });
}

function playAudio(audioplayer, playButton, playPosition, speedSlider, audioSource) {
    if (playButton.className == "playButton") {
        //myDebug(OneAudioPlayer.src + ', ' + audioSource);
        if (!OneAudioPlayer.src.includes(audioSource)) {
            if (OneAudioPlayer.src != null) { //reset previous audio player
                //audioSlider.noUiSlider.values[1] = 0;
                if (PreviouspButton != null) {
                    PreviouspButton.className = "playButton";
                }
            }
            PreviouspButton = playButton;

            LoadAudio(audioSource, playPosition);

            OneAudioPlayer.onloadedmetadata = function() {
                initialiseAudioSlider();
            };
        }
        // Initialise the loop and audioSlider
        if (!EndLoopTime) {
            EndLoopTime = OneAudioPlayer.duration;
        }

        // This event listener keeps track of the cursor and restarts the loops
        // when needed - we don't need to set it elsewhere
        OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
        OneAudioPlayer.addEventListener("ended", restartLoop);

        OneAudioPlayer.playbackRate = speedSlider.noUiSlider.get() / 100;

        var promise = OneAudioPlayer.play();
        if (promise) {
            promise.catch(function(error) {
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

function changeTune(tuneID) {
    var item = store[tuneID];
    document.getElementById('abcText').innerHTML = item.abc;

    // Clear the loop preset display
    document.getElementById('loopPresetControls').innerHTML = '';
    var tuneInfo = document.getElementById("tuneInfo");
    if (tuneInfo) {
        tuneInfo.innerHTML = '';
    }
    document.getElementById('loopForm').style.display = "none";
    presetLoopSegments = [];

    // If we have a modal make it visible
    var modal = document.getElementById('tuneModal');
    if (modal) {
        modal.style.display = "block";
    }

    // Add info to page if needed
    var tuneTitle = document.getElementById("tuneTitle");
    if (tuneTitle) {
        tuneTitle.innerHTML = '<h2>' + item.title + '<span style="font-size:16px;"> - ' + item.key + ' ' + item.rhythm + '</span></h2>';
    }
    var tuneInfo = document.getElementById("tuneInfo");
    if (tuneInfo && item.mp3_source) {
        tuneInfo.innerHTML = 'Source: ' + item.mp3_source;
    }

    var dotsForm = document.getElementById('dotsForm');
    if (item.mp3.includes('mp3')) {
        // make the MP3 player
        document.getElementById('showPlayer').innerHTML = createMP3player(tuneID, item.mp3);
        createSliders(tuneID);

        var playPosition = document.getElementById('positionMP3' + tuneID);
        LoadAudio(item.mp3, playPosition);

        // calculate presetLoopSegments and set up preset loops
        OneAudioPlayer.onloadedmetadata = function() {
            myDebug("OneAudioPlayer.duration: " + OneAudioPlayer.duration);
            if (item.repeats && item.parts) {
                myDebug('setupPresetLoops: ' + OneAudioPlayer.duration);
                buildSegments(tuneID);
                if (presetLoopSegments.length){
                    document.getElementById('loopPresetControls').innerHTML = createLoopControlsContainer();
                }
            }
            initialiseAudioSlider();
        };

        // Show the button that allows show/hide of dots
        if (dotsForm) {
            dotsForm.style.display = "block";
        }
        // Get the current paper state
        var currentPaperState = document.getElementById('paper0').style.display;
        // Set the paper state to 'block'
        document.getElementById('paper0').style.display = "block";
        if (item.abc) {
            // Draw the dots
            abc_editor = new window.ABCJS.Editor('abcText', {
                paper_id: "paper0",
                warnings_id: "warnings",
                render_options: {
                    responsive: 'resize'
                },
                indicate_changed: "true"
            });
        } else {
            document.getElementById('paper0').style.paddingBottom = '0px';
            document.getElementById('paper0').style.overflow = 'auto';
            var urlSessionSearch = 'https://thesession.org/tunes/search?type=' + item.rhythm + '&q=' + item.title.replace(/\s+/g, '+');
            document.getElementById('paper0').innerHTML = '<fieldset><strong> \
            <p>We don\'t have dots for this tune. If you find a version of the tune that\'s a good match, send \
            us a copy of the ABC and we\'ll get it added to the site. You might find it on The Session \
            at this link:</p>\
            <a href="' + urlSessionSearch + '">' + urlSessionSearch + '</a>\
            </strong></fieldset>';

            var showABCform = document.getElementById('showABCform');
            if (showABCform) {
                showABCform.style.display= "none" ;
            }
        }
        // Reset paper state to original value
        document.getElementById('paper0').style.display = currentPaperState;
    } else {
        // no recording available
        document.getElementById('loopForm').style.display = "none";

        if (dotsForm) {
            dotsForm.style.display = "none";
        }
        var recordingMessage = '<fieldset><strong> \
        A recording for this tune is not available.';
        if (modal) {
            recordingMessage += '<br /><input class="filterButton" type="button" onclick="location.href=\'' + item.url + '\';" value="Go to Tune Page" />'
        }
        recordingMessage += '</strong></fieldset>';
        document.getElementById('showPlayer').style.overflow = 'auto';
        document.getElementById('showPlayer').innerHTML = recordingMessage;
    }
}

function LoadAudio(audioSource, playPosition) {
    //myDebug("Loading: " + audioSource)
    OneAudioPlayer.src = audioSource;
    playPosition.noUiSlider.updateOptions({
        tooltips: [wNumb({
            decimals: 1
        }), wNumb({
            decimals: 1
        }), wNumb({
            decimals: 1
        })],
    });
    CurrentAudioSlider = playPosition;
}

function initialiseAudioSlider() {
    myDebug('initialiseAudioSlider: ' + OneAudioPlayer.duration);
    CurrentAudioSlider.noUiSlider.updateOptions({
        range: {
            'min': 0,
            'max': OneAudioPlayer.duration
        }
    });
    resetFromToSliders();
}

function positionUpdate() {
    if (OneAudioPlayer.currentTime >= EndLoopTime) {
        myDebug("Current time: " + OneAudioPlayer.currentTime);
        OneAudioPlayer.currentTime = BeginLoopTime;
        myDebug("Reset loop start to: " + OneAudioPlayer.currentTime);
    }
    CurrentAudioSlider.noUiSlider.setHandle(1, OneAudioPlayer.currentTime);
}

function restartLoop() {
    OneAudioPlayer.currentTime = BeginLoopTime;
    myDebug("Restarting loop at: " + OneAudioPlayer.currentTime);
    OneAudioPlayer.play();
}

function buildSegments(tuneID) {
    var item = store[tuneID];
    var parts = item.parts;
    var repeats = item.repeats;
    var mySegment;

    presetLoopSegments = [];

    // If tune MD file has AABB notation use that
    if (parts.toString().includes('A')) {
        var lastPart = '';
        var part_names = parts.split("");
        var repeatCount = 1;
        for (i = 0; i < part_names.length; i++) {
            mySegment = {
                name: 0,
                start: 0,
                end: 0
            };
            if (lastPart == part_names[i]) {
                repeatCount = 2;
            } else {
                repeatCount = 1;
            }
            mySegment.name = part_names[i] + ' Repeat ' + repeatCount;
            presetLoopSegments.push(mySegment);
            lastPart = part_names[i];
        }
        // Insert the values
        var start = 0.0;
        var end = 0.0;
        var each_part = OneAudioPlayer.duration / repeats / presetLoopSegments.length;
        for (var key in presetLoopSegments) {
            start = each_part * key
            end = start + each_part;
            presetLoopSegments[key].start = start.toFixed(1);
            presetLoopSegments[key].end = end.toFixed(1);
        }
    }
    // Add segment for user-defined use
    mySegment = {
        name: 0,
        start: 0,
        end: 0
    };
    mySegment.name = 'User-1';
    mySegment.end = OneAudioPlayer.duration.toFixed(1);
    presetLoopSegments.push(mySegment);
}

function createLoopControlsContainer() {
    document.getElementById('loopForm').style.display = "block";
    toggleLoops("Show Preset Loops");

    var loopControlsContainer = '<div class="container loop-container"><div class="row row-title">';
    loopControlsContainer += '<div class="small-4 columns"><strong>Select Preset Loops</strong></div>';
    loopControlsContainer += '<div class="small-4 columns" style="text-align: center;"><strong>Start</strong></div>';
    loopControlsContainer += '<div class="small-4 columns" style="text-align: center;"><strong>Finish</strong></div>';
    loopControlsContainer += '</div>';

    for (i = 0; i < presetLoopSegments.length; i++) {
        if (i % 2) {
            loopControlsContainer += '<div class="row row-odd">';
        } else {
            loopControlsContainer += '<div class="row">';
        }
        loopControlsContainer += '<div class="small-4 columns"><input class="loopClass" type="checkbox" onclick="applySegments()" id="check' + i + '">' + presetLoopSegments[i].name + '</div>';
        loopControlsContainer += '<div class="small-4 columns" style="text-align: center;"> \
        <a href="javascript:void(0);" \
        class = "downButton" type="button" id= "button' + i + 'dn" onclick="Adjust_down(' + i + ', 0)"> \
        <span title=" - 1/5 second">&lt;&lt;</a> \
        <input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'from" size="4" style= "height: 18px;" value=' + presetLoopSegments[i].start + '> \
        <a href="javascript:void(0);" \
        class = "upButton" type="button" id= "button' + i + 'up" onclick="Adjust_up(' + i + ', 0)"> \
        <span title=" + 1/5 second">&gt;&gt;</a> \
        </div>';
        loopControlsContainer += '<div class="small-4 columns" style="text-align: center;"> \
        <a href="javascript:void(0);" \
        class = "downButton" type="button" id= "button' + i + 'Dn" onclick="Adjust_down(' + i + ', 2)"> \
        <span title=" - 1/5 second">&lt;&lt;</a> \
        <input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'to" size="4" style= "height: 18px;" value=' + presetLoopSegments[i].end + '> \
        <a href="javascript:void(0);" \
        class = "upButton" type="button" id= "button' + i + 'up" onclick="Adjust_up(' + i + ', 2)"> \
        <span title=" + 1/5 second">&gt;&gt;</a> \
        </div>';
        loopControlsContainer += '</div>'
    }
    loopControlsContainer += '</div>'

    return (loopControlsContainer);
}

function createArchiveSlider(tableSlider) {

    var ArchiveSlider = document.getElementById(tableSlider);
    noUiSlider.create(ArchiveSlider, {
        start: 0,
        orientation: 'vertical',
        range: {
            'min': 0,
            'max': 100
        }
    });

    ArchiveSlider.noUiSlider.on('slide', function(value) {
        document.getElementById("tunes").removeEventListener("scroll", scroll_indicator);
        scrollTable(value);
    });
    ArchiveSlider.noUiSlider.on('end', function(value) {
        document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
        scrollTable(value);
    });

}

function scroll_indicator() {
    var elmnt = document.getElementById("tunes");
    var tuneScroll = elmnt.scrollTop;
    var height = elmnt.scrollHeight - elmnt.clientHeight;
    var scrolled = (tuneScroll / height) * 100;
    document.getElementById('tableSlider').noUiSlider.set(scrolled);
    scrollTable(scrolled);
}

function scrollTable(value) { // when dragging the slider
    var elmnt = document.getElementById("tunes");
    var height = elmnt.scrollHeight - elmnt.clientHeight
    elmnt.scrollTop = (height * value / 100);
}

function saveUserLoop(values) {
    if (presetLoopSegments.length) {
        // Preset loop 'User-1' is always the last segment
        var lastSegment = presetLoopSegments.length - 1;

        if (document.getElementById("check" + lastSegment).checked) {
            document.getElementById("check" + lastSegment + "from").value = Number(values[0]).toFixed(1);
            document.getElementById("check" + lastSegment + "to").value = Number(values[2]).toFixed(1);
        }
    }
}

function applySegments() {
    var fullBeginLoopTime = parseFloat(OneAudioPlayer.duration);
    var fullEndLoopTime = 0.0;
    var numCheckedBoxes = 0;
    var tempBeginLoopTime = 0.0;
    var tempEndLoopTime = 0.0;
    var checkBox, fromId, toId;

    for (i = 0; i < presetLoopSegments.length; i++) {
        checkBox = document.getElementById("check" + i);
        fromId = document.getElementById("check" + i + "from");
        toId = document.getElementById("check" + i + "to");

        if (checkBox.checked == true) {
            numCheckedBoxes++;
            tempBeginLoopTime = parseFloat(fromId.value);
            tempEndLoopTime = parseFloat(toId.value);
            //myDebug("Is " + fullBeginLoopTime + " greater than " + tempBeginLoopTime);
            if (fullBeginLoopTime > tempBeginLoopTime) {
                //myDebug("A, " + BeginLoopTime + ", " + fullBeginLoopTime);
                fullBeginLoopTime = tempBeginLoopTime;
            }
            //myDebug("Is " + fullEndLoopTime + " less than " + tempEndLoopTime);
            if (fullEndLoopTime < tempEndLoopTime) {
                //myDebug("B, "+tempEndLoopTime+", "+fullEndLoopTime);
                fullEndLoopTime = tempEndLoopTime;
            }
            //myDebug(i + ", " + BeginLoopTime + ", "+ EndLoopTime + ", " + fullBeginLoopTime + ", " + fullEndLoopTime);
        }
    }
    //myDebug(fullBeginLoopTime + ", " + fullEndLoopTime);
    // do nothing unless at least one box is checked
    if (numCheckedBoxes > 0) {
        // iOS audio player workaround for initial call to OneAudioPlayer.currentTime
        if (isIOS) {
            OneAudioPlayer.oncanplaythrough = function() {
                OneAudioPlayer.currentTime = fullBeginLoopTime;
            }
        } else {
            OneAudioPlayer.currentTime = fullBeginLoopTime; // look here
        }
        // first reset to ends, then reposition
        CurrentAudioSlider.noUiSlider.setHandle(0, 0);
        CurrentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.duration);
        CurrentAudioSlider.noUiSlider.setHandle(1, 0);
        // then set to positions in row
        CurrentAudioSlider.noUiSlider.setHandle(1, fullBeginLoopTime);
        CurrentAudioSlider.noUiSlider.setHandle(0, fullBeginLoopTime);
        CurrentAudioSlider.noUiSlider.setHandle(2, fullEndLoopTime);
        BeginLoopTime = fullBeginLoopTime;
        EndLoopTime = assignEndLoopTime(fullEndLoopTime);
        if (OneAudioPlayer.paused == false) {
            // audio was  playing when they fiddled with the checkboxes
            var promise = OneAudioPlayer.play();
            // then turn it back on
            if (promise) {
                promise.catch(function(error) {
                    console.error(error);
                });
            }
        }
    } else {
        resetFromToSliders();
    }
}

function Adjust_up(row, inputBox) {
    var elementName = "check" + row;
    if (document.getElementById(elementName).checked == false) {
        return;
    }
    if (inputBox == 0) {
        elementName += "from";
    } else if (inputBox == 2) {
        elementName += "to";
    }
    var checkBox = document.getElementById(elementName);
    NumValue = Number(checkBox.value)
    if (NumValue <= (OneAudioPlayer.duration - 0.2)) {
        //alert("up "+checkBox.value);
        checkBox.value = Number(NumValue + 0.2).toFixed(1);
        if (((EndLoopTime - checkBox.value) > 0.21) & (inputBox == 2)) {
            // don't change sliders if not at either end (0.21 overcomes rounding)
            return;
        }
        if (((checkBox.value - BeginLoopTime) > 0.21) & (inputBox == 0)) {
            // don't change sliders if not at either end
            return;
        }
        if ((inputBox == 0) & (OneAudioPlayer.currentTime < checkBox.value)) {
            OneAudioPlayer.currentTime = checkBox.value;
        }
        CurrentAudioSlider.noUiSlider.setHandle(inputBox, checkBox.value);
        //alert(checkBox.value);
        if (inputBox == 0) {
            BeginLoopTime = checkBox.value;
        } else if (inputBox == 2) {
            EndLoopTime = assignEndLoopTime(checkBox.value);
        }
    }
}

function Adjust_down(row, inputBox) {
    var elementName = "check" + row;
    if (document.getElementById(elementName).checked == false) {
        return;
    }
    if (inputBox == 0) {
        elementName += "from";
    } else if (inputBox == 2) {
        elementName += "to";
    }
    var checkBox = document.getElementById(elementName);
    NumValue = Number(checkBox.value)
    if (NumValue >= 0.2) {
        //alert("dn "+checkBox.value);
        checkBox.value = Number(NumValue - 0.2).toFixed(1);
        if (((EndLoopTime - checkBox.value) > 0.21) & (inputBox == 2)) {
            // don't change sliders if not at either end (0.21 overcomes rounding)
            return;
        }
        if (((checkBox.value - BeginLoopTime) > 0.21) & (inputBox == 0)) {
            // don't change sliders if not at either end
            return;
        }
        if ((inputBox == 2) & (OneAudioPlayer.currentTime > checkBox.value)) {
            OneAudioPlayer.currentTime = checkBox.value;
        }
        CurrentAudioSlider.noUiSlider.setHandle(inputBox, checkBox.value);
        if (inputBox == 0) {
            BeginLoopTime = checkBox.value;
        } else if (inputBox == 2) {
            EndLoopTime = assignEndLoopTime(checkBox.value);
        }

    }
}

function toggleLoops(button) {
    switch (button.value) {
        case "Show Preset Loops":
            button.value = "Hide Preset Loops";
            document.getElementById('loopPresetControls').style.display = "block";
            break;
        case "Hide Preset Loops":
            button.value = "Show Preset Loops";
            document.getElementById('loopPresetControls').style.display = "none";
            break;
    }
}

function toggleTheDots(button) {
    switch (button.value) {
        case "Show the Dots":
            button.value = "Hide the Dots";
            document.getElementById('paper0').style.display = "block";
            break;
        case "Hide the Dots":
            button.value = "Show the Dots";
            document.getElementById('paper0').style.display = "none";
            break;
    }
}

function setFromSlider() {
    CurrentAudioSlider.noUiSlider.setHandle(0, OneAudioPlayer.currentTime);
    BeginLoopTime = OneAudioPlayer.currentTime;
}

function setToSlider() {
    CurrentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.currentTime);
    EndLoopTime = OneAudioPlayer.currentTime;
}

function resetFromToSliders() {
    CurrentAudioSlider.noUiSlider.setHandle(0, 0);
    BeginLoopTime = 0;
    CurrentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.duration);
    EndLoopTime = OneAudioPlayer.duration;
    // Uncheck all the checkboxes in the Preset Loops
    for (i = 0; i < presetLoopSegments.length; i++) {
        document.getElementById("check" + i).checked = false;
    }
}

function assignEndLoopTime(endLoopValue) {
    // Don't allow EndLoopTime to be >= OneAudioPlayer.duration
    if (endLoopValue > OneAudioPlayer.duration) {
        endLoopValue = OneAudioPlayer.duration;
    }
    return (endLoopValue);
}

function testForIOS() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        return true;
    } else {
        return false;
    }
}

function nextChar(c) {
    return (String.fromCharCode(c.charCodeAt(0) + 1));
}
