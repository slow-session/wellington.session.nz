/*
 * Controls for the abc  player
 *
 * Version: 1.0
 * Date: 7 Dec 2016
 *
 * Developed as part of websites for https://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/wellington.session.nz/blob/master/js/audioID_controls.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */

var playingNow = 0;
var abcStopped = 0;
var ABCheader = /^([A-Za-z]):\s*(.*)$/;
var ABCPosition = {
    Ptr: 0
};
var lastplayButton;
var ABCCurrentTime = 0;
var ABCduration = 0;
var IntervalHandle;

// Select a timbre that sounds like an electric piano.
var instrument;


function createABCplayer (tuneID, timbre) {
    /*
     * Generate the HTML needed to play ABC tunes
     */
    instrument = makeInstrument(timbre);

    var abcPlayer = '';
    abcPlayer += '<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
    abcPlayer += '    <div class="audioParentOuter" id="' + tuneID + '">';
    // Col 1
    abcPlayer += '      <div class="audioChildOuter">';
    abcPlayer += '      <button id="playABC' + tuneID + '" class="playButton"';
    abcPlayer += '          onclick="playABC(ABC' + tuneID + ', playABC' + tuneID + ', positionABC' + tuneID + ', speedSliderABC' + tuneID + '.value)">';
    abcPlayer += '      </button>';
    abcPlayer += '      </div>';
    // Nested row in second column
    abcPlayer += '      <div class="audioChildOuter">';
    abcPlayer += '        <div class="audioParentInner">';
    // Col 2
    abcPlayer += '         <div class="audioChildInner">';
    abcPlayer += '           <input name="positionABC' + tuneID + '" id="positionABC' + tuneID + '" type="range" class="abcAudioControl slider" min="0" max="500" value="0"';
    abcPlayer += '             oninput="setABCPosition(value/100)" />';
    abcPlayer += '           <p class="audioLabel">Playing the <i>dots</i>!</p>';
    abcPlayer += '         </div>';
    // Col 3
    abcPlayer += '         <div class="audioChildInner">';
    abcPlayer += '           <span title="Adjust playback speed with slider">';
    abcPlayer += '              <input name="flevel" id="speedSliderABC' + tuneID + '" class="abcSpeedControl slider" type="range" min="50" max="120" value="100"';
    abcPlayer += '                  onchange="changeABCspeed(ABC' + tuneID + ', playABC' + tuneID + ', value)">';
    abcPlayer += '              <p class="audioLabel">Speed - <strong><output name="level">100</output>%</strong></p>';
    abcPlayer += '          </span>';
    abcPlayer += '         </div>';
    abcPlayer += '      </div>';
    abcPlayer += '</form>';

    return (abcPlayer);
}

function makeInstrument(timbre) {
    /*
     * Some old iPads break badly running more recent Javascript
     * We abstract this out into a separate function so that when it fails
     * the rest of the code continues on working - Arghh!
     */
    var tempInstrument = new Instrument(timbre);
    return (tempInstrument);
}

function playABC(tune, playButton, playPosition, bpm) {
    /*
     * Play an ABC tune when the button gets pushed
     */
    CalculateTuneDuration(tune, bpm);

    var ticks;
    // The ABC L: value scales the ticks value!
    var noteLenStr = getABCheaderValue("L:", tune.value);
    if (!noteLenStr) {
        noteLenStr = "1/8";
    }
    ticks = bpm / (2 * eval(noteLenStr));

    // If we have multiple ABC tunes on a page and we start a second one,
    // close the previous one cleanly
    if (lastplayButton && lastplayButton != playButton) {
        lastplayButton.className = "";
        lastplayButton.className = "playButton";
        setABCPosition(0);
    }
    lastplayButton = playButton;
    ABCPosition.Ptr = playPosition;

    if (playButton.className == "playButton") {
        stopABC(tune);
        startABC(tune, ticks);
        playButton.className = "";
        playButton.className = "stopButton";
    } else {
        stopABC(tune);
        playButton.className = "";
        playButton.className = "playButton";
    }
}

function changeABCspeed(tune, playButton, bpm) {
    // Change the speed of playback
    CalculateTuneDuration(tune, bpm);

    // The ABC L: value scales the bpm value!
    var ticks;
    var noteLenStr = getABCheaderValue("L:", tune.value);
    if (!noteLenStr) {
        noteLenStr = "1/8";
    }
    ticks = bpm / (2 * eval(noteLenStr));

    CalculateTuneDuration(tune, bpm);

    if (playButton.className == "stopButton") {
        stopABC(tune);
        playButton.className = "";
        playButton.className = "stopButton";
        setABCPosition(0);
        ABCCurrentTime = 0;
        startABC(tune, ticks);
    } else {
        stopABC(tune);
        playButton.className = "";
        playButton.className = "playButton";
    }
}

function CalculateTuneDuration(tune, bpm) {
    // Clean up the ABC bar markers
    var tempTune = tune.value.replace(/:\|/g, "|");
    tempTune = tempTune.replace(/\|:/g, "|");
    tempTune.replace(/::/g, "|");
    tempTune = tempTune.replace(/\|+/g, "|");

    // Calculate number of bars
    var bars;
    bars = tempTune.split("|").length;
    bars = Math.round(bars / 8) * 8;

    // Get the meter from the ABC
    var meterStr = getABCheaderValue("M:", tune.value);
    if (meterStr == "C") {
        meterStr = "4/4";
    }
    if (meterStr == "C|") {
        meterStr = "2/2";
    }
    var noteLenStr = getABCheaderValue("L:", tune.value);
    if (!noteLenStr) {
        noteLenStr = "1/8";
    }
    // Calculate the length of the tune

    ABCduration = bars * eval(meterStr) * 16 * eval(noteLenStr) * 60 / bpm;
}

function getABCheaderValue(key, tuneStr) {
    // Extract the value of one of the ABC keywords e.g. T: Out on the Ocean
    var regex = new RegExp(key);
    var lines = tuneStr.split("\n");
    var ABCvalue = '';
    var i;

    for (i = 0; i < lines.length; i += 1) {
        if (lines[i].match(regex)) {
            ABCvalue = lines[i].replace(regex, '')
            ABCvalue = ABCvalue.replace(/^\s+|\s+$/g, "");
            break;
        }
    }
    return ABCvalue;
}

function startABC(tune, ticks) {
    playingNow = 1;
    abcStopped = 0;
    instrument.silence();
    instrument.play({
        tempo: ticks
    }, tune.value, function() {
        playingNow = 0;
        loopABCTune(tune, ticks);
    });
    setABCPosition(0);
    ABCCurrentTime = 0;
    ABCtimer();
}

function simplePlayABC(tune, ticks, timbre) {
    instrument = new Instrument(timbre);

    instrument.silence();
    instrument.play({
        tempo: ticks
    }, tune.value);
}

function stopABC(tune) {
    clearInterval(IntervalHandle);
    abcStopped = 1;
    instrument.silence();
    setABCPosition(0);
}

function loopABCTune(tune, ticks) {
    instrument.silence();
    clearInterval(IntervalHandle);
    if ((playingNow == 0) && (abcStopped == 0)) {
        startABC(tune, ticks);
        setABCPosition(0);
        ABCCurrentTime = 0;
    }
}

function ABCtimer() {
    IntervalHandle = setInterval(nudgeABCSlider, 100);
}

function nudgeABCSlider() {
    ABCCurrentTime += 0.1;
    var floatTime = (ABCCurrentTime / ABCduration) * 500;
    ABCPosition.Ptr.value = floatTime;
}

function setABCPosition(ticks) {
    // move position of ABC tune via the slider
    ABCPosition.Ptr.value = ticks;
}

function preProcessABC(str) {
    /*
     * Our simple ABC player doesn't handle repeats well.
     * This function unrolls the ABC so that things play better.
     */
    var lines = str.split('\n');
    var ABCHeader = [""];
    var ABCNotes = [""];
    var headerRegex = /^([A-Za-z]):\s*(.*)$/;
    var blankRegex = /^\s*(?:%.*)?$/;
    var tuneIndex = 0;
    var endOfHeaderFound = false;
    var processedABC = "";
    for (var j = 0; j < lines.length; ++j) {
        if (headerRegex.exec(lines[j])) {
            if (endOfHeaderFound) {
                endOfHeaderFound = false;
                tuneIndex++;
                ABCHeader[tuneIndex] = "";
                ABCNotes[tuneIndex] = "";
                if (lines[j].startsWith('X:')) {
                    continue;
                }
            }
            // put the header lines back in place
            ABCHeader[tuneIndex] += lines[j] + "\n";
            //
            if (lines[j].startsWith('K:')) {
                endOfHeaderFound = true;
            }
        } else if (blankRegex.test(lines[j])) {
            // Skip blank and comment lines.
            continue;
        } else {
            // Notes to parse
            ABCNotes[tuneIndex] += lines[j];
        }
    }
    for (i = 0; i < ABCHeader.length; ++i) {
        processedABC += ABCHeader[i] + unRollABC(ABCNotes[i]) + "\n";;
    }
    return (processedABC);
}

function unRollABC(ABCNotes) {
    var index = 0;
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

    while ((match = firstBar.exec(ABCNotes)) != null) {
        fBarPos.push(match.index);
    }
    tokenString[tokenCount] = "fb";
    if (fBarPos[0] > 6) {
        fBarPos[0] = 0;
    }
    tokenLocations[tokenCount++] = fBarPos[0]; // first bar
    while (((match = fEnding.exec(ABCNotes)) || (match = fEnding2.exec(ABCNotes))) != null) {
        fEndPos.push(match.index);
        tokenString[tokenCount] = "fe";
        tokenLocations[tokenCount++] = match.index; // first endings
    }
    while (((match = sEnding.exec(ABCNotes)) || (match = sEnding2.exec(ABCNotes))) != null) {
        sEndPos.push(match.index);
        tokenString[tokenCount] = "se";
        tokenLocations[tokenCount++] = match.index; // second endings
    }
    while ((match = rRepeat.exec(ABCNotes)) != null) {
        rRepPos.push(match.index);
        tokenString[tokenCount] = "rr";
        tokenLocations[tokenCount++] = match.index; // right repeats
    }
    while ((match = lRepeat.exec(ABCNotes)) != null) {
        lRepPos.push(match.index);
        tokenString[tokenCount] = "lr";
        tokenLocations[tokenCount++] = match.index; // left repeats
    }
    while (((match = dblBar.exec(ABCNotes)) || (match = dblBar2.exec(ABCNotes))) != null) {
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
            bigABCNotes += ABCNotes.substr(pos, sortedTokenLocations[i] - pos); //notes from last location to rr or se
            for (k = i - 1; k >= 0; k--) { //march backward from there
                // check for likely loop point
                if ((sortedTokens[k] == "se") || (sortedTokens[k] == "rr") || (sortedTokens[k] == "fb") || (sortedTokens[k] == "lr")) {
                    pos = sortedTokenLocations[k]; // mark loop beginning point
                    for (j = k + 1; j < sortedTokens.length; j++) { //walk forward from there
                        if ((sortedTokens[j] == "fe") || (sortedTokens[j] == "rr")) { // walk to likely stopping point (first ending or repeat)
                            bigABCNotes += ABCNotes.substr(pos, sortedTokenLocations[j] - pos);
                            pos = sortedTokenLocations[j]; // mark last position encountered
                            i = j + 1; //consume tokens from big loop
                            if (sortedTokens[j] == "fe") { //if we got to a first ending we have to skip it...
                                for (l = j; l < sortedTokens.length; l++) { //walk forward from here until the second ending
                                    if (sortedTokens[l] == "se") {
                                        for (m = l; m < sortedTokens.length; m++) { //look for end of second ending
                                            if (sortedTokens[m] == "db") { //a double bar marks the end of a second ending
                                                bigABCNotes += ABCNotes.substr(sortedTokenLocations[l],
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

    bigABCNotes += ABCNotes.substr(pos, sortedTokenLocations[sortedTokens.length - 1] - pos);
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
        count += (tempABCNotes.match(/3/g) || []).length*2; // note + 2
        count += (tempABCNotes.match(/4/g) || []).length*3; // note + 3
        count -= (tempABCNotes.match(/z/g) || []).length*3; //remove triplets (confusing, but correct)
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
    return (newBigABCNotes);
}
