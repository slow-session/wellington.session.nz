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
 # Comment in line with "console.log" to turn on console logging
 #
 ################################################################################
*/
function myDebug(message){
    console.log(message);
}

var BeginLoopTime = 0;
var EndLoopTime = 0;
var PreviousTrID = null;
var PreviouspButton = null;
var CurrentAudioSlider = null;

var isIOS = testForIOS();
myDebug("isIOS: " + isIOS);

function createAudioPlayer() {
    var pagePlayer = '';
    pagePlayer += '<!-- declare an Audio Player for this page-->';
    pagePlayer += '<audio id="OneAudioPlayer" loop">';
    pagePlayer += '    <source id="mp3Source" type="audio/mp3"></source> ';
    pagePlayer += '    Your browser does not support the audio format.';
    pagePlayer += '</audio>';

    return (pagePlayer);
}

function createMP3player(tuneID, mp3url, playerClass) {
    var mp3player = '';
    var trID = 'tr' + tuneID;
    // build the MP3 player for each tune

    mp3player += '<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
    mp3player += '    <div id="audioplayer' + tuneID + '" class="' + playerClass + '">';
    mp3player += '    <div class="row">';
    // Col 1 - play button
    mp3player += '      <div class="small-2 columns">';
    mp3player += '        <button id="playButton' + tuneID + '" class="playButton"';
    mp3player += '            onclick="playAudio(\'' + trID + '\', audioplayer' + tuneID + ', playButton' + tuneID + ',  playPosition' + tuneID + ', speedSlider' + tuneID + ', \'' + mp3url + '\')">';
    mp3player += '        </button>';
    mp3player += '      </div>';
    // Nested row in second column
    mp3player += '      <div class="small-9 columns end">';
    mp3player += '        <div class="row small-up-1 medium-up-2 large-up-2">';
    // Col 2 - audio slider
    mp3player += '          <div class="small-6 columns">';
    mp3player += '            <div class="audio">';
    mp3player += '              <span title="Play tune, select loop starting point, then select loop end point">';
    mp3player += '                <div id="playPosition' + tuneID + '" class="mp3AudioControl"></div>'
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
    mp3player += '          <div class="small-6 columns end">';
    mp3player += '            <div id="speedControl' + tuneID + '" class="mp3SpeedControl">';
    mp3player += '              <span title="Adjust playback speed with slider">';
    mp3player += '                <div id="speedSlider' + tuneID + '"></div>'
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
    var audioSlider = document.getElementById('playPosition' + tuneID);
    var speedSlider = document.getElementById('speedSlider' + tuneID);

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
            EndLoopTime = values[2];
            saveUserLoop(values);
        } else if (handle === 2) {
            BeginLoopTime = values[0];
            EndLoopTime = values[2];
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

// If/when move away from the old style tables like the original tunes_archive layout
// we won't need this
var sliderArray = [];

function Create_archive_sliders() {
    for (var i = 0; i < sliderArray.length; i++) {
        createSliders(sliderArray[i]);
    }
}

function playAudio(trID, audioplayer, playButton, playPosition, speedSlider, audioSource) {
    if (playButton.className == "playButton") {
        myDebug(OneAudioPlayer.src + ', ' + audioSource);
        if (!OneAudioPlayer.src.includes(audioSource)) {
            if (OneAudioPlayer.src != null) { //reset previous audio player
                //audioSlider.noUiSlider.values[1] = 0;
                if (PreviouspButton != null) {
                    PreviouspButton.className = "playButton";
                }
                if (document.getElementById(PreviousTrID)) {
                    document.getElementById(PreviousTrID).style.backgroundColor = '';
                }
            }
            PreviouspButton = playButton;
            PreviousTrID = trID;
            if (document.getElementById(trID)) {
                document.getElementById(trID).style.backgroundColor = 'khaki';
            }

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
        if (document.getElementById(trID)) {
            document.getElementById(trID).style.backgroundColor = '';
        }
    }

}

function changeTune(tuneNumber) {
    var item = store[tuneNumber];
    document.getElementById("abcText").innerHTML = item.abc;

    // Clear the loop preset display
    loopPresetControls.innerHTML = '';
    tuneInfo.innerHTML = '';
    document.getElementById('loopForm').style.display = "none";
    segments = [];

    // If we have a modal make it visible
    var modal = document.getElementById('tuneModal');
    if (modal) {
        modal.style.display = "block";
    }

    // Add info to page
    document.getElementById("tuneTitle").innerHTML = '<h2>' + item.title + '<span style="font-size:16px;"> - ' + item.key + ' ' + item.rhythm + '</span></h2>';
    if (item.mp3_source) {
        document.getElementById("tuneInfo").innerHTML = 'Source: ' + item.mp3_source;
    }

    if (item.mp3.includes('mp3')) {
        // make the MP3 player
        showPlayer.innerHTML = createMP3player(tuneNumber, item.mp3, 'mp3player_tunepage');
        createSliders(tuneNumber);

        var playPosition = document.getElementById('playPosition' + tuneNumber);
        LoadAudio(item.mp3, playPosition);

        // calculate segments and set up preset loops
        OneAudioPlayer.onloadedmetadata = function() {
            myDebug("OneAudioPlayer.duration: " + OneAudioPlayer.duration);
            if ((item.repeats && item.parts) || item.abc) {
                myDebug('setupPresetLoops: ' + OneAudioPlayer.duration);
                buildSegments(tuneNumber);
                loopPresetControls.innerHTML = createLoopControlsContainer();
            }
            initialiseAudioSlider();
        };

        // Show the button that allows show/hide of dots
        document.getElementById('dotsForm').style.display = "block";
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
            document.getElementById('paper0').innerHTML = '<fieldset><strong> \
            The ABC notation for this tune is not available yet. Qualify for glory by \
            writing the ABC for this tune using our <a href="/editABC/">editABC</a> page \
            (or write out the dots) and send it to us. \
            </strong></fieldset>';
        }
        // Reset paper state to original value
        document.getElementById('paper0').style.display = currentPaperState;
    } else {
        // show ABC player
        document.getElementById('loopForm').style.display = "none";
        document.getElementById('dotsForm').style.display = "none";
        showPlayer.innerHTML = '<p>A recording for this tune is not available.</p>';
        showPlayer.innerHTML += '<input class="loopButton" type="button" onclick="location.href=\'' + item.url + '\';" value="Go to Tune Page" />'
    }
}

function LoadAudio(audioSource, playPosition) {
    myDebug("Loading: " + audioSource)
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
            'max': Number(OneAudioPlayer.duration)
        }
    });
    resetFromToSliders();
}

function positionUpdate() {
    if ((OneAudioPlayer.currentTime >= (OneAudioPlayer.duration - .25)) ||
        (OneAudioPlayer.currentTime >= EndLoopTime)) {
        OneAudioPlayer.currentTime = BeginLoopTime;
    }
    CurrentAudioSlider.noUiSlider.setHandle(1, OneAudioPlayer.currentTime);
}

// We'll build a segments structure on the fly for each tune
var segments = [];

function buildSegments(tuneNumber) {
    var item = store[tuneNumber];
    var parts = item.parts;
    var repeats = item.repeats;

    var mySegment;
    segments = [];

    // If parts is not defined then attempt to infer it
    if (!parts) {
        parts = calculateParts(item.rhythm, item.abc);
    }

    // if repeats is not defined - default value = 2 possibly use total length?
    if (!repeats) {
        repeats = calculateRepeats();
    }

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
            segments.push(mySegment);
            lastPart = part_names[i];
        }
    } else {
        // We'll default to an AABB(CC) structure if we don't know
        var partName = 'A';
        for (i = 0; i < parts; i++) {
            mySegment = {
                name: 0,
                start: 0,
                end: 0
            };
            mySegment.name = partName + ' Repeat 1';
            segments.push(mySegment);
            mySegment = {
                name: 0,
                start: 0,
                end: 0
            };
            mySegment.name = partName + ' Repeat 2';
            segments.push(mySegment);
            partName = nextChar(partName);
        }
    }
    // Insert the values
    var start = 0.0;
    var end = 0.0;
    var each_part = OneAudioPlayer.duration / repeats / segments.length;
    for (var key in segments) {
        start = each_part * key
        end = start + each_part;
        segments[key].start = start.toFixed(1);
        segments[key].end = end.toFixed(1);
    }
    // Add segment for user-defined use
    mySegment = {
        name: 0,
        start: 0,
        end: 0
    };
    mySegment.name = 'User-1';
    mySegment.end = OneAudioPlayer.duration.toFixed(1);
    segments.push(mySegment);
}

function createLoopControlsContainer() {
    document.getElementById('loopForm').style.display = "block";
    toggleLoops("Show Preset Loops");

    var loopControlsContainer = '<div class="container loop-container"><div class="row row-title">';
    loopControlsContainer += '<div class="small-4 columns"><strong>Select Preset Loops</strong></div>';
    loopControlsContainer += '<div class="small-4 columns" style="text-align: center;"><strong>Start</strong></div>';
    loopControlsContainer += '<div class="small-4 columns" style="text-align: center;"><strong>Finish</strong></div>';
    loopControlsContainer += '</div>';

    for (i = 0; i < segments.length; i++) {
        if (i % 2) {
            loopControlsContainer += '<div class="row row-even">';
        } else {
            loopControlsContainer += '<div class="row row-odd">';
        }
        loopControlsContainer += '<div class="small-4 columns"><input class="loopClass" type="checkbox" onclick="applySegments()" id="check' + i + '">' + segments[i].name + '</div>';
        loopControlsContainer += '<div class="small-4 columns" style="text-align: center;"> \
        <a href="javascript:void(0);" \
        class = "downButton" type="button" id= "button' + i + 'dn" onclick="Adjust_down(' + i + ', 0)"> \
        <span title=" - 1/5 second">&lt;&lt;</a> \
        <input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'from" size="4" style= "height: 18px;" value=' + segments[i].start + '> \
        <a href="javascript:void(0);" \
        class = "upButton" type="button" id= "button' + i + 'up" onclick="Adjust_up(' + i + ', 0)"> \
        <span title=" + 1/5 second">&gt;&gt;</a> \
        </div>';
        loopControlsContainer += '<div class="small-4 columns" style="text-align: center;"> \
        <a href="javascript:void(0);" \
        class = "downButton" type="button" id= "button' + i + 'Dn" onclick="Adjust_down(' + i + ', 2)"> \
        <span title=" - 1/5 second">&lt;&lt;</a> \
        <input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'to" size="4" style= "height: 18px;" value=' + segments[i].end + '> \
        <a href="javascript:void(0);" \
        class = "upButton" type="button" id= "button' + i + 'up" onclick="Adjust_up(' + i + ', 2)"> \
        <span title=" + 1/5 second">&gt;&gt;</a> \
        </div>';
        loopControlsContainer += '</div>'
    }
    loopControlsContainer += '</div>'

    return (loopControlsContainer);
}

function calculateParts(tune_rhythm, abcText) {
    var parts;
    var total_note_count = countBarsABC(abcText);
    var base_length = calculateBaseLength(tune_rhythm);

    var divisions = total_note_count / base_length; // see if tune fits a pattern
    var int_divisions = Math.floor(divisions + 0.1);

    if ((divisions - int_divisions) < 0.2) { // parts can be calculated
        parts = int_divisions;
    } else {
        parts = 2; // parts can't be calculated - assigned to default value=2
    }
    return (parts);
}

function calculateRepeats() {
    var repeats;

    // some smarts needed here!
    repeats = 2;

    return (repeats);
}

function calculateBaseLength(tune_rhythm) {
    var base_length;

    //attempt to calculate number of parts
    switch (tune_rhythm) {
        case "reel":
        case "hornpipe":
        case "barndance":
            base_length = 128;
            break;
        case "mazurka":
        case "waltz":
        case "jig":
            base_length = 96;
            break;
        case "slip jig":
            base_length = 72;
            break;
        case "polka":
            base_length = 64;
            break;
        default:
            base_length = 128;
    }
    return (base_length);
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
    if (segments.length) {
        // Preset loop 'User-1' is always the last segment
        var lastSegment = segments.length - 1;

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

    for (i = 0; i < segments.length; i++) {
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
        EndLoopTime = fullEndLoopTime;
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
            EndLoopTime = checkBox.value;
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
            EndLoopTime = checkBox.value;
        }

    }
}

function countBarsABC(str) {
    /*
     * Our simple ABC player doesn't handle repeats well.
     * This function unrolls the ABC so that things play better.
     */
    var lines = str.split('\n'),
        j, header, newABCHeader = "",
        newABCNotes = "",
        tempStr = "",
        index = 0,
        res = "";
    var tokens = "";
    var headerRegex = /^([A-Za-z]):\s*(.*)$/;
    var blankRegex = /^\s*(?:%.*)?$/;
    for (j = 0; j < lines.length; ++j) {
        header = headerRegex.exec(lines[j]);
        if (header) {
            // put the header lines back in place
            newABCHeader += lines[j] + "\n"; // consider special case of a keychange header K: in the middle
        } else if (blankRegex.test(lines[j])) {
            // Skip blank and comment lines.
            continue;
        } else {
            // Parse the notes.
            newABCNotes += lines[j];
        }
    }

    /*
     * Regular expression used to parse ABC - https://regex101.com/ was very helpful in decoding
     *

    ABCString = (?:\[[A-Za-z]:[^\]]*\])|\s+|%[^\n]*|![^\s!:|\[\]]*!|\+[^+|!]*\+|[_<>@^]?"[^"]*"|\[|\]|>+|<+|(?:(?:\^+|_+|=|)[A-Ga-g](?:,+|'+|))|\(\d+(?::\d+){0,2}|\d*\/\d+|\d+\/?|\/+|[xzXZ]|\[?\|:\]?|:?\|:?|::|.

    (?:\[[A-Za-z]:[^\]]*\]) matches nothing
    \s+|%[^\n]* matches spaces
    ![^\s!:|\[\]]*! no matches
    \+[^+|!]*\+ no matches
    [_<>@^]?"[^"]*" matches chords
    \[|\] matches [ or ]
    [_<>@^]?{[^"]*} matches grace note phrases {...}
    :?\|:? matches :| or |:
    (?:(?:\^+|_+|=|)[A-Ga-g](?:,+|'+|)) matches letters A-Ga-g in or out of chords and other words
    \(\d+(?::\d+){0,2} matches triplet, or quad symbol (3
    \d*\/\d+ matches fractions i.e. 4/4 1/8 etc
    \d+\/? matches all single digits
    \[\d+|\|\d+ matches first and second endings
    \|\||\|\] matches double bars either || or |]
    (\|\|)|(\|\])|:\||\|:|\[\d+|\|\d+ matches first and second endings, double bars, and right and left repeats

    */

    var fEnding = /\|1/g,
        sEnding = /\|2/g,
        lRepeat = /\|:/g,
        rRepeat = /:\|/g,
        dblBar = /\|\|/g,
        firstBar = /\|/g;
    var fEnding2 = /\[1/g,
        sEnding2 = /\[2/g,
        dblBar2 = /\|\]/g;
    var match, fBarPos = [],
        fEndPos = [],
        sEndPos = [],
        lRepPos = [],
        rRepPos = [],
        dblBarPos = [];
    var firstRepeat = 0,
        tokenString = [],
        tokenLocations = [],
        tokenCount = 0,
        sortedTokens = [],
        sortedTokenLocations = [];
    var pos = 0,
        endPos = 0,
        i = 0,
        k = 0,
        l = 0,
        m = 0,
        ntokenString = [];
    var bigABCNotes = "";


    while ((match = firstBar.exec(newABCNotes)) != null) {
        fBarPos.push(match.index);
    }
    tokenString[tokenCount] = "fb";
    if (fBarPos[0] > 6) {
        fBarPos[0] = 0;
    }
    tokenLocations[tokenCount++] = fBarPos[0]; // first bar
    while (((match = fEnding.exec(newABCNotes)) || (match = fEnding2.exec(newABCNotes))) != null) {
        fEndPos.push(match.index);
        tokenString[tokenCount] = "fe";
        tokenLocations[tokenCount++] = match.index; // first endings
    }
    while (((match = sEnding.exec(newABCNotes)) || (match = sEnding2.exec(newABCNotes))) != null) {
        sEndPos.push(match.index);
        tokenString[tokenCount] = "se";
        tokenLocations[tokenCount++] = match.index; // second endings
    }
    while ((match = rRepeat.exec(newABCNotes)) != null) {
        rRepPos.push(match.index);
        tokenString[tokenCount] = "rr";
        tokenLocations[tokenCount++] = match.index; // right repeats
    }
    while ((match = lRepeat.exec(newABCNotes)) != null) {
        lRepPos.push(match.index);
        tokenString[tokenCount] = "lr";
        tokenLocations[tokenCount++] = match.index; // left repeats
    }
    while (((match = dblBar.exec(newABCNotes)) || (match = dblBar2.exec(newABCNotes))) != null) {
        dblBarPos.push(match.index);
        tokenString[tokenCount] = "db";
        tokenLocations[tokenCount++] = match.index; // double bars
    }
    tokenString[tokenCount] = "lb";
    tokenLocations[tokenCount++] = fBarPos[fBarPos.length - 1]; // last bar


    var indices = tokenLocations.map(function(elem, index) {
        return index;
    });
    indices.sort(function(a, b) {
        return tokenLocations[a] - tokenLocations[b];
    });

    for (j = 0; j < tokenLocations.length; j++) {
        sortedTokens[j] = tokenString[indices[j]];
        sortedTokenLocations[j] = tokenLocations[indices[j]];
    }
    pos = 0;
    for (i = 0; i < sortedTokens.length; i++) {
        if (bigABCNotes.length > 1000) {
            break; //safety check
        }
        if ((sortedTokens[i] == "rr") || (sortedTokens[i] == "se")) { //find next repeat or second ending
            bigABCNotes += newABCNotes.substr(pos, sortedTokenLocations[i] - pos); //notes from last location to rr or se
            for (k = i - 1; k >= 0; k--) { //march backward from there
                // check for likely loop point
                if ((sortedTokens[k] == "se") || (sortedTokens[k] == "rr") || (sortedTokens[k] == "fb") || (sortedTokens[k] == "lr")) {
                    pos = sortedTokenLocations[k]; // mark loop beginning point
                    for (j = k + 1; j < sortedTokens.length; j++) { //walk forward from there
                        if ((sortedTokens[j] == "fe") || (sortedTokens[j] == "rr")) { // walk to likely stopping point (first ending or repeat)
                            bigABCNotes += newABCNotes.substr(pos, sortedTokenLocations[j] - pos);
                            pos = sortedTokenLocations[j]; // mark last position encountered
                            i = j + 1; //consume tokens from big loop
                            if (sortedTokens[j] == "fe") { //if we got to a first ending we have to skip it...
                                for (l = j; l < sortedTokens.length; l++) { //walk forward from here until the second ending
                                    if (sortedTokens[l] == "se") {
                                        for (m = l; m < sortedTokens.length; m++) { //look for end of second ending
                                            if (sortedTokens[m] == "db") { //a double bar marks the end of a second ending
                                                bigABCNotes += newABCNotes.substr(sortedTokenLocations[l],
                                                    sortedTokenLocations[m] - sortedTokenLocations[l]); //record second ending
                                                pos = sortedTokenLocations[m]; //mark most forward progress
                                                i = m + 1; //consume the tokens from the main loop
                                                break; //quit looking
                                            }
                                        } //for m
                                        i = l + 1; //consume tokens TED: CHECK THIS
                                        break; //quit looking
                                    }
                                } //for l
                            }
                            break;
                        }
                    } //for j
                    break;
                } //if
            } //for k
        } //if
    } //for i

    bigABCNotes += newABCNotes.substr(pos, sortedTokenLocations[sortedTokens.length - 1] - pos);
    bigABCNotes += "\""; //hack to make sure the newBigABCNotes gets fills when there are not quotes

    var newBigABCNotes = "";
    for (j = 0; j < bigABCNotes.length; j++) {
        if (bigABCNotes[j] == "\"") {
            newBigABCNotes = [bigABCNotes.slice(0, j), "\\\"", bigABCNotes.slice(j)].join('');
        }
        newBigABCNotes = newBigABCNotes.substring(0, newBigABCNotes.length - 3); //undo hack
    }
    tempABCNotes = newBigABCNotes.toLowerCase();
    tempABCNotes = tempABCNotes.replace(/(?=[(])/g, 'z');

    var count = (tempABCNotes.match(/a/g) || []).length;
    count += (tempABCNotes.match(/b/g) || []).length;
    count += (tempABCNotes.match(/c/g) || []).length;
    count += (tempABCNotes.match(/d/g) || []).length;
    count += (tempABCNotes.match(/e/g) || []).length;
    count += (tempABCNotes.match(/f/g) || []).length;
    count += (tempABCNotes.match(/g/g) || []).length;
    count += (tempABCNotes.match(/2/g) || []).length; // note already counted so +1
    count += (tempABCNotes.match(/3/g) || []).length * 2; // note + 2
    count += (tempABCNotes.match(/4/g) || []).length * 3; // note + 3
    count -= (tempABCNotes.match(/z/g) || []).length * 3; //remove triplets (confusing, but correct)
    /*  count is the total number of beats,
        A 16 bar A part reel = 128 beats,
        A 16 bar A part jig = 96 beats,
        for a normal AA BB reel, count should be ~256.
        For a normal AA BB jig, ~192.
        if count ~ 384 it is probably an AA BB CC reel
        if count ~ 288 it is probably an AA BB CC jig
        For normally structured tunes (e.g. AA BB) using various values of count,
        and tune type (jig/reel) we can guess at the structure.
        We know the tune duration, but not the number of repeats of the tune
        on the recording.  If we knew that we could approximate the timing loops.
        We could guess most tunes have 2 full repeats...
        We should add one or two values to the tune.md files:
            number of times tune is repeated (needed)
            and number of parts e.g. 2 if A and B parts, 3 if A B C, etc,
            perhaps it could be in the form of AABB, AABBCC, ABCDE, etc.
        If a 2 part (A&B) reel is repeated 3 times
        duration (found when mp3 file is read) / 3 = time for 1 full loop;
        From 0 to (duration / 3) / 2 = A part.
        From (duration / 3) / 2 to (duration / 3) = B part, etc.
    */
    return (count);
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
    CurrentAudioSlider.noUiSlider.setHandle(2, Number(OneAudioPlayer.duration));
    EndLoopTime = Number(OneAudioPlayer.duration);
    // Uncheck all the checkboxes in the Preset Loops
    for (i = 0; i < segments.length; i++) {
        document.getElementById("check" + i).checked = false;
    }
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
