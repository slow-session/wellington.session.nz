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


function createABCplayer(textArea, tuneID, timbre) {
    /*
     * Generate the HTML needed to play ABC tunes
     */
    instrument = makeInstrument(timbre);

    var abcPlayer = `
<form onsubmit="return false" oninput="level.value=flevel.valueAsNumber">
    <div class="audioParentOuter" id="ABC${tuneID}">
        <!-- Col 1 -->
        <div class="playpauseButton">
            <button id="playABC${tuneID}" class="playButton" onclick="playABC(${textArea}, playABC${tuneID}, positionABC${tuneID}, speedSliderABC${tuneID}.value)"></button>
        </div>
        <!-- Nested row in second column -->
        <div class="audioChildOuter">
            <div class="abcParentInner">
                <!-- Col 2 -->
                <div class="audioChildInner">
                    <input name="positionABC${tuneID}" id="positionABC${tuneID}" type="range" class="abcAudioControl slider" min="0" max="500" value="0" oninput="setABCPosition(value/100)" />
                    <p class="audioLabel">Playing the <i>dots</i>!</p>
                </div>
                <!-- Col 3 -->
                <div class="audioChildInner">
                    <span title="Adjust playback speed with slider">
                        <input name="flevel" id="speedSliderABC${tuneID}" class="abcSpeedControl slider" type="range" min="50" max="120" value="100" onchange="changeABCspeed(${textArea}, playABC${tuneID}, value)">
                        <p class="audioLabel">Speed - <strong><output name="level">100</output>%</strong></p>
                    </span>
                </div>
            </div>
        </div>
    </div>
</form>`;

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

/*
 * Play an ABC tune when the button gets pushed
 */
function playABC(textArea, playButton, playPosition, bpm) {
    /*
     * Stop any current player
     */
    stopABC();        
    
    /* If we have multiple ABC tunes on a page and we start a second one,
     * close the previous one cleanly
     *
     * Do we still have multiple ABC players on a page ??
     *
     */
    if (lastplayButton && lastplayButton != playButton) {
        lastplayButton.className = "";
        lastplayButton.className = "playButton";
        setABCPosition(0);
    }
    lastplayButton = playButton;
    ABCPosition.Ptr = playPosition;

    if (playButton.className == "playButton") {
        /*
         * Our simple ABC player doesn't handle repeats well.
         * This function unrolls the ABC so that things play better.
         */
        let tuneABC = preProcessABC(textArea.value);

        // calculate tune length
        ABCduration = calculateTuneDuration(tuneABC, bpm);

        let ticks = calculateTicks(tuneABC, bpm);
        
        startABC(tuneABC, ticks);
        playButton.className = "";
        playButton.className = "stopButton";
    } else {
        playButton.className = "";
        playButton.className = "playButton";
    }
}

function changeABCspeed(textArea, playButton, bpm) {
    /*
     * stop any current player
     */
    stopABC();
    
    // if there's an active player, restart it at the new speed
    if (playButton.className == "stopButton") {
        /*
         * Our simple ABC player doesn't handle repeats well.
         * This function unrolls the ABC so that things play better.
         */
        let tuneABC = preProcessABC(textArea.value);

        // Change the speed of playback
        ABCduration = calculateTuneDuration(tuneABC, bpm);

        let ticks = calculateTicks(tuneABC, bpm);

        startABC(tuneABC, ticks);
    } 
}

function calculateTuneDuration(tuneABC, bpm) {
    // calculate number of bars
    var bars;
    bars = tuneABC.split("|").length;
    bars = Math.round(bars / 8) * 8;

    // Get the meter from the ABC
    var meterStr = getABCheaderValue("M:", tuneABC);
    if (meterStr == "C") {
        meterStr = "4/4";
    }
    if (meterStr == "C|") {
        meterStr = "2/2";
    }
    var noteLenStr = getABCheaderValue("L:", tuneABC);
    if (!noteLenStr) {
        noteLenStr = "1/8";
    }

    // calculate the length of the tune
    return (bars * eval(meterStr) * 16 * eval(noteLenStr) * 60 / bpm);
}

function calculateTicks(tuneABC, bpm) {
    // The ABC L: value scales the ticks value!
    var noteLenStr = getABCheaderValue("L:", tuneABC);
    if (!noteLenStr) {
        noteLenStr = "1/8";
    }

    return (bpm / (2 * eval(noteLenStr)));
}

function getABCheaderValue(key, tuneABC) {
    // Extract the value of one of the ABC keywords e.g. T: Out on the Ocean
    var regex = new RegExp(key);
    var lines = tuneABC.split("\n");
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

function startABC(tuneABC, ticks) {
    playingNow = 1;
    abcStopped = 0;
    instrument.silence();
    instrument.play({
        tempo: ticks
    }, tuneABC, function () {
        playingNow = 0;
        loopABCTune(tuneABC, ticks);
    });
    setABCPosition(0);
    ABCCurrentTime = 0;

    IntervalHandle = setInterval(nudgeABCSlider, 100);
}

function stopABC() {
    clearInterval(IntervalHandle);
    abcStopped = 1;
    instrument.silence();
    setABCPosition(0);
}

function loopABCTune(tuneABC, ticks) {
    instrument.silence();
    clearInterval(IntervalHandle);
    if ((playingNow == 0) && (abcStopped == 0)) {
        startABC(tuneABC, ticks);
        setABCPosition(0);
        ABCCurrentTime = 0;
    }
}

function nudgeABCSlider() {
    ABCCurrentTime += 0.1;
    let floatTime = (ABCCurrentTime / ABCduration) * 500;
    ABCPosition.Ptr.value = floatTime;
}

function setABCPosition(ticks) {
    // move position of ABC tune via the slider
    ABCPosition.Ptr.value = ticks;
}

function preProcessABC(tuneABC) {
    /*
     * Our simple ABC player doesn't handle repeats well.
     * This function unrolls the ABC so that things play better.
     */
    var lines = tuneABC.split('\n');
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
    var tokenString = [],
        tokenLocations = [],
        tokenCount = 0,
        sortedTokens = [],
        sortedTokenLocations = [];
    var pos = 0,
        i = 0,
        k = 0,
        l = 0,
        m = 0;
    var expandedABC = "";

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


    var indices = tokenLocations.map(function (elem, index) {
        return index;
    });
    indices.sort(function (a, b) {
        return tokenLocations[a] - tokenLocations[b];
    });

    for (j = 0; j < tokenLocations.length; j++) {
        sortedTokens[j] = tokenString[indices[j]];
        sortedTokenLocations[j] = tokenLocations[indices[j]];
    }
    pos = 0;
    for (i = 0; i < sortedTokens.length; i++) {
        if (expandedABC.length > 1000) {
            break; //safety check
        }
        if ((sortedTokens[i] == "rr") || (sortedTokens[i] == "se")) { //find next repeat or second ending
            expandedABC += ABCNotes.substr(pos, sortedTokenLocations[i] - pos); //notes from last location to rr or se
            for (k = i - 1; k >= 0; k--) { //march backward from there
                // check for likely loop point
                if ((sortedTokens[k] == "se") || (sortedTokens[k] == "rr") || (sortedTokens[k] == "fb") || (sortedTokens[k] == "lr")) {
                    pos = sortedTokenLocations[k]; // mark loop beginning point
                    for (j = k + 1; j < sortedTokens.length; j++) { //walk forward from there
                        if ((sortedTokens[j] == "fe") || (sortedTokens[j] == "rr")) { // walk to likely stopping point (first ending or repeat)
                            expandedABC += ABCNotes.substr(pos, sortedTokenLocations[j] - pos);
                            pos = sortedTokenLocations[j]; // mark last position encountered
                            i = j + 1; //consume tokens from big loop
                            if (sortedTokens[j] == "fe") { //if we got to a first ending we have to skip it...
                                for (l = j; l < sortedTokens.length; l++) { //walk forward from here until the second ending
                                    if (sortedTokens[l] == "se") {
                                        for (m = l; m < sortedTokens.length; m++) { //look for end of second ending
                                            if (sortedTokens[m] == "db") { //a double bar marks the end of a second ending
                                                expandedABC += ABCNotes.substr(sortedTokenLocations[l],
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

    expandedABC += ABCNotes.substr(pos, sortedTokenLocations[sortedTokens.length - 1] - pos);

    /*
     * Clean up the ABC repeat markers - we don't need them now!
     */
    expandedABC = expandedABC.replace(/:\|/g, "|");
    expandedABC = expandedABC.replace(/\|:/g, "|");
    expandedABC = expandedABC.replace(/::/g, "|");
    expandedABC = expandedABC.replace(/\|+/g, "|");
    expandedABC = expandedABC.replace(/:$/, "|");
    expandedABC = expandedABC.replace(/:"$/, "|");
    
    //console.log(expandedABC);
    return (expandedABC);
}