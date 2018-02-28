/*
 * Controls for the abc  player
 *
 * Version: 1.0
 * Date: 7 Dec 2016
 *
 * Developed as part of websites for http://session.nz and http://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/session.nz/blob/master/js/audioID_controls.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */


var playingNow = 0;
var abcStopped = 0;
var mp3Available = 1;
var ABCTuneName = "tune";
var ABCheader = /^([A-Za-z]):\s*(.*)$/;
var ABCPosition = {
    Ptr: 0
};
var lastpButton;
var ABCCurrentTime = 0;
var ABCduration = 0;
var IntervalHandle;
var ABCLocation;
var ABCdurationP;

// Select a timbre that sounds like an electric piano.
var inst = new Instrument('piano');

// Magic code!!!
var timbre = inst.getTimbre();
alert(timbre.wave);
inst.setTimbre('fiddle');
timbre = inst.getTimbre();
alert(timbre.wave);
// End of magic!!!

function createABCplayer (tuneID, playerClass) {
    var abcPlayer = '';
    abcPlayer += '<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
    abcPlayer += '  <div class="' + playerClass + '">';
    abcPlayer += '      <button id="pButton' + tuneID + '" class="playButton"';
    abcPlayer += '          onclick="playABC(ABC' + tuneID + ', pButton' + tuneID + ', playPosition' + tuneID + ', RS' + tuneID + '.value, APos' + tuneID + ' , Dur' + tuneID + ')">';
    abcPlayer += '          <div id="APos' + tuneID + '" class="audioPos"></div>';
    abcPlayer += '          <div id="Dur' + tuneID + '" class="durationP"></div>';
    abcPlayer += '      </button>';
    abcPlayer += '      <input name="playPosition' + tuneID + '" id="playPosition' + tuneID + '" type="range" class="audioControl" min="0" max="500" value="0"';
    abcPlayer += '          oninput="setABCPosition(value/100)" />';
    abcPlayer += '      <div class="speedControl">';
    abcPlayer += '          <input name="flevel" id="RS' + tuneID + '" type="range" min="50" max="120" value="100"';
    abcPlayer += '              onchange="changeABCspeed(ABC' + tuneID + ', pButton' + tuneID + ', value)">';
    abcPlayer += '          <output name="level">100</output>%';
    abcPlayer += '      </div>';
    abcPlayer += '      <div class="loopControl">';
    abcPlayer += '          <p><small>Playing the <i>dots</i>!</small></p>';
    abcPlayer += '      </div>';
    abcPlayer += '      <p class="clear"> </p>';
    abcPlayer += '  </div>';
    abcPlayer += '</form>';

    return (abcPlayer);
}

function playABC(tune, pButton, playPosition, bpm, audioposition, duration) {
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
    if (lastpButton && lastpButton != pButton) {
        lastpButton.className = "";
        lastpButton.className = "playButton";
        setABCPosition(0);
    }
    lastpButton = pButton;
    ABCLocation=audioposition; //initialise global variable
    ABCPosition.Ptr = playPosition;
    ABCdurationP=duration;

    if (pButton.className == "playButton") {
        stopABC(tune);
        startABC(tune, ticks);
        pButton.className = "";
        pButton.className = "stopButton";
        ABCdurationP.innerHTML = ABCduration.toFixed(1);
    } else {
        stopABC(tune);
        audioposition.innerHTML="";
        ABCdurationP.innerHTML ="";
        pButton.className = "";
        pButton.className = "playButton";
    }
}

function changeABCspeed(tune, pButton, bpm) {
    CalculateTuneDuration(tune, bpm);

    // The ABC L: value scales the bpm value!
    var ticks;
    var noteLenStr = getABCheaderValue("L:", tune.value);
    if (!noteLenStr) {
        noteLenStr = "1/8";
    }
    ticks = bpm / (2 * eval(noteLenStr));

    CalculateTuneDuration(tune, bpm);

    if (pButton.className == "stopButton") {
        stopABC(tune);
        pButton.className = "";
        pButton.className = "stopButton";
        setABCPosition(0);
        ABCCurrentTime = 0;
        startABC(tune, ticks);
    } else {
        stopABC(tune);
        pButton.className = "";
        pButton.className = "playButton";
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
    inst.silence();
    inst.play({
        tempo: ticks
    }, tune.value, function() {
        playingNow = 0;
        loopABCTune(tune, ticks);
    });
    setABCPosition(0);
    ABCCurrentTime = 0;
    ABCtimer();
}

function simplePlayABC(tune,ticks){
    inst.silence();
    inst.play(tune.value);
}

function stopABC(tune) {
    clearInterval(IntervalHandle);
    abcStopped = 1;
    inst.silence();
    setABCPosition(0);
}

function loopABCTune(tune, ticks) {
    inst.silence();
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
    ABCLocation.innerHTML=ABCCurrentTime.toFixed(1);

}

function setABCPosition(ticks) {
    // move position of ABC tune via the slider
    ABCPosition.Ptr.value = ticks;
}

function preProcessABC(str) {
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
    return (newABCHeader + newBigABCNotes);
}
