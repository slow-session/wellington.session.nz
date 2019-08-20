function changeTune(tuneNumber) {
    var item = store[tuneNumber];
    var abc_text = item.abc;
    document.getElementById("abcText").innerHTML = abc_text;

    // If we have a modal make it visible
    var modal = document.getElementById('myModal');
    if (modal) {
        modal.style.display = "block";
    }
    // Add info to page
    document.getElementById("tuneTitle").innerHTML = '<h2>' + item.title + '</h2>';
    document.getElementById("tuneInfo").innerHTML = item.key + ' ' + item.rhythm;
    // make the player
    showPlayer.innerHTML = createMP3player('playABC', item.mp3, 'mp3player_tunepage');
    createSlider('playPositionplayABC', 'RSplayABC');
    LoadAudio('playABC', audioplayerplayABC, pButtonplayABC, playPositionplayABC, item.mp3, RSSplayABC);
    // Show the button that allows show/hide of dots
    document.getElementById('dotsForm').style.display = "block";
    // Get the current paper state
    var currentPaperState = document.getElementById('paper0').style.display;
    // Set the paper state to 'block'
    document.getElementById('paper0').style.display = "block";
    // Draw the dots
    abc_editor = new window.ABCJS.Editor('abcText', {
        paper_id: "paper0",
        warnings_id: "warnings",
        render_options: {
            responsive: 'resize'
        },
        indicate_changed: "true"
    });
    // Reset paper state to original value
    document.getElementById('paper0').style.display = currentPaperState;
    // calculate segments and set up preset loops
    var total_note_count = count_bars_abc(item.abc);
    OneAudioPlayer.ondurationchange = function() {
        delay_updateSegments(tuneNumber, total_note_count)
    };
}

function delay_updateSegments(tuneNumber, total_note_count) {
    buildSegments(tuneNumber, total_note_count);

    loopPresetControls.innerHTML = createLoopControlsContainer();

    CurrentAudioSlider.noUiSlider.updateOptions({
        range: {
            'min': 0,
            'max': Number(OneAudioPlayer.duration)
        }
    });
    CurrentAudioSlider.noUiSlider.setHandle(2, Number(OneAudioPlayer.duration));
}

// We'll build a segments structure on the fly for each tune
var segments = [];

function buildSegments(tuneNumber, total_note_count) {
    var item = store[tuneNumber];
    var parts = item.parts;
    var tune_rhythm = item.rhythm;
    var repeats = item.repeats;
    var seg_full = Number(OneAudioPlayer.duration);

    var mySegment;
    segments = [];

    // If parts is not defined then attempt to infer it
    if (!parts) {
        parts = calculateParts(tune_rhythm, total_note_count);
    }
    console.log('Parts: ' + parts);

    // if repeats is not defined - default value = 2 possibly use total length?
    if (!repeats) {
        repeats = 2;
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
    var each_part = seg_full / repeats / segments.length;
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
    mySegment.end = seg_full.toFixed(1);
    segments.push(mySegment);

    for (var key in segments) {
        var item = segments[key];
        console.log(key + ', ' + item.name + ', ' + item.start + ', ' + item.end);
    }
}

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function calculateParts(tune_rhythm, total_note_count) {
    var parts;

    switch (tune_rhythm) { //attempt to calculate number of parts
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
    var divisions = total_note_count / base_length; // see if tune fits a pattern
    var int_divisions = Math.floor(divisions + 0.1);

    if ((divisions - int_divisions) < 0.2) { // parts can be calculated
        parts = int_divisions;
    } else {
        parts = 2; // parts can't be calculated - assigned to default value=2
    }
    console.log("calculated parts: " + parts);
    return (parts);
}

var ArchiveSliderName = document.getElementById('tableSlider');

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
    ArchiveSliderName.noUiSlider.set(scrolled);
    scrollTable(scrolled);
}

function scrollTable(value) { // when dragging the slider
    var elmnt = document.getElementById("tunes");
    var height = elmnt.scrollHeight - elmnt.clientHeight
    elmnt.scrollTop = (height * value / 100);
}

function reloadPage() {
    window.location.reload(true);
}

function setFromSlider() {
    CurrentAudioSlider.noUiSlider.setHandle(0, OneAudioPlayer.currentTime);
    BeginLoopTime = OneAudioPlayer.currentTime;
}

function setToSlider() {
    CurrentAudioSlider.noUiSlider.setHandle(2, OneAudioPlayer.currentTime);
    EndLoopTime = OneAudioPlayer.currentTime;
    OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
}

function resetFromToSliders() {
    CurrentAudioSlider.noUiSlider.setHandle(0, 0);
    BeginLoopTime = 0;
    CurrentAudioSlider.noUiSlider.setHandle(2, Number(OneAudioPlayer.duration));
    EndLoopTime = Number(OneAudioPlayer.duration);
    OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
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

function adjust_segment_controls(values, handle) {
    var checked_slider = -1;
    var multiple_sliders = 0;
    for (i = 0; i < segments.length; i++) {
        document.getElementById("check" + i).checked;
        if (document.getElementById("check" + i).checked) {
            checked_slider = i;
            multiple_sliders++;
        }
    }
    if ((multiple_sliders > 1) || (multiple_sliders == 0)) {
        return;
    } //quit if more than one slider is checked

    document.getElementById("check" + checked_slider + "from").value = values[0];
    document.getElementById("check" + checked_slider + "to").value = values[2];
}

function applySegments() {
    var text = '';
    var fullBeginLoopTime = parseFloat(OneAudioPlayer.duration);
    var fullEndLoopTime = 0.0;
    var numCheckedBoxes = 0.0;
    var tempBeginLoopTime = 0.0;
    var tempEndLoopTime = 0.0;
    for (i = 0; i < segments.length; i++) {

        checkBox = document.getElementById("check" + i);
        fromId = document.getElementById("check" + i + "from");
        toId = document.getElementById("check" + i + "to");

        if (checkBox.checked == true) {
            numCheckedBoxes++;
            tempBeginLoopTime = parseFloat(fromId.value);
            tempEndLoopTime = parseFloat(toId.value);
            //alert("Is "+fullBeginLoopTime+" greater than "+tempBeginLoopTime);
            if (fullBeginLoopTime > tempBeginLoopTime) {
                //alert("A, "+BeginLoopTime+", "+fullBeginLoopTime);
                fullBeginLoopTime = tempBeginLoopTime;
            }
            //alert("Is "+fullEndLoopTime+" less than "+tempEndLoopTime);
            if (fullEndLoopTime < tempEndLoopTime) {
                //alert("B, "+tempEndLoopTime+", "+fullEndLoopTime);
                fullEndLoopTime = tempEndLoopTime;
            }
            //alert(i+", "+BeginLoopTime+", "+EndLoopTime+", "+fullBeginLoopTime+", "+fullEndLoopTime);
        }
    }
    //alert(fullBeginLoopTime+", "+fullEndLoopTime);
    if (numCheckedBoxes > 0) {
        // do nothing unless at least one box is checked
        OneAudioPlayer.currentTime = fullBeginLoopTime;
        OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
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
        OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
        if (turnAudioBackOn) {
            // audio was  playing when they fiddled with the checkboxes
            var promise = OneAudioPlayer.play();
            // then turn it back on
            if (promise) {
                promise.catch(function(error) {
                    console.error(error);
                });
            }
            turnAudioBackOn = false; // and reset the flag
        }
    } else {
        resetFromToSliders();
    }
}

function Adjust_up(row, inputBox) {
    var elName = "check" + row;
    if (document.getElementById(elName).checked == false) return;
    // Need to check if other selected segments emcompas this action
    if (inputBox == 0) {
        elName += "from";
    } else if (inputBox == 2) {
        elName += "to";
    }
    target = checkBox = document.getElementById(elName);
    NumValue = Number(target.value)
    if (NumValue <= (OneAudioPlayer.duration - 0.2)) {
        //alert("up "+target.value);
        target.value = Number(NumValue + 0.2).toFixed(1);
        if ((inputBox == 0) & (OneAudioPlayer.currentTime < target.value)) {
            OneAudioPlayer.currentTime = target.value;
        }
        CurrentAudioSlider.noUiSlider.setHandle(inputBox, target.value);
        //alert(target.value);
        if (inputBox == 0) {
            BeginLoopTime = target.value;
        } else if (inputBox == 2) {
            EndLoopTime = target.value;
        }
    }
}

function Adjust_down(row, inputBox) {
    var elName = "check" + row;
    if (document.getElementById(elName).checked == false) return;
    // Need to check if other selected segments emcompas this action
    if (inputBox == 0) {
        elName += "from";
    } else if (inputBox == 2) {
        elName += "to";
    }
    target = checkBox = document.getElementById(elName);
    NumValue = Number(target.value)
    if (NumValue >= 0.2) {
        //alert("dn "+target.value);
        target.value = Number(NumValue - 0.2).toFixed(1);
        if ((inputBox == 2) & (OneAudioPlayer.currentTime > target.value)) {
            OneAudioPlayer.currentTime = target.value;
        }
        CurrentAudioSlider.noUiSlider.setHandle(inputBox, target.value);
        if (inputBox == 0) {
            BeginLoopTime = target.value;
        } else if (inputBox == 2) {
            EndLoopTime = target.value;
        }
    }
}

function LoadAudio(trID, audioplayer, pButton, positionSlider, audioSource, audioSpeed) {
    if (pButton.className == "playButton") {
        if (PreviousAudioID != audioplayer) { //only load if necessary
            OneAudioPlayer.src = audioSource;
            if (PreviousAudioID != null) { //reset previous audio player
                //audioSlider.noUiSlider.values[1] = 0;
                if (PreviouspButton != null) PreviouspButton.className = "playButton";
                OneAudioPlayer.removeEventListener("timeupdate", positionUpdate);
                OneAudioPlayer.removeEventListener("timeupdate", setAudioLoops);
                if (PreviousButton1ID != null) {
                    PreviousButton1ID.value = " Loop Start ";
                    PreviousButton2ID.value = " Loop End ";
                }
                if (document.getElementById(PreviousTrID)) {
                    document.getElementById(PreviousTrID).style.backgroundColor = '';
                }
                //alert(audioplayer.id+"::"+PreviousAudioID.id+"\n"+timeline.id+"::"+Previoustimeline.id+"\n"+Eventhandler);
            }
            PreviousAudioID = audioplayer;
            Previoustimeline = positionSlider;
            PreviouspButton = pButton;
            PreviousTrID = trID;
            AudioSpeed = audioSpeed;
            // modify slider
            positionSlider.noUiSlider.updateOptions({
                tooltips: [wNumb({
                    decimals: 1
                }), wNumb({
                    decimals: 1
                }), wNumb({
                    decimals: 1
                })],
            });
            if (document.getElementById(trID)) {
                document.getElementById(trID).style.backgroundColor = 'khaki';
            }
        }
        CurrentAudioSlider = positionSlider;
        //OneAudioPlayer.playbackRate = audioSpeed.value / 100;
        OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
        delay_load_update();
    }
}

function count_bars_abc(str) {
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
    for (j = 0; j < lines.length; ++j) {
        header = ABCheader.exec(lines[j]);
        if (header) {
            // put the header lines back in place
            newABCHeader += lines[j] + "\n"; // consider special case of a keychange header K: in the middle
        } else if (/^\s*(?:%.*)?$/.test(lines[j])) {
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
