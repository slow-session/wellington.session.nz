/*
 * Controls for the abc  player
 *
 * Version: 2.1
 * Date: 25 Nov 2020
 *
 * Developed as part of websites for https://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/wellington.session.nz/blob/master/js/abcplayer.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */

var abcStopped = 0;
var abcCurrentTime = 0;
var intervalHandle;
var currentABCslider = null;
var bpmReset = 0;

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
            <button id="playABC${tuneID}" class="playButton" onclick="playABC(${textArea}, playABC${tuneID}, '100')"></button>
        </div>
        <!-- Nested row in second column -->
        <div class="audioChildOuter">
            <div class="abcParentInner">
                <!-- Col 2 -->
                <div class="audioChildInner">
                    <div id="audioSliderABC${tuneID}" class="abcAudioControl"></div>
                </div>
                <!-- Col 3 -->
                <div class="audioChildInner">
                    <span title="Adjust playback speed with slider">
                        <div id="speedSliderABC${tuneID}" class="abcSpeedControl"></div>
                        <p class="mp3SpeedLabel"><strong>Playback Speed</strong></p>
                    </span>
                </div>
            </div>
        </div>
    </div>
</form>`;

  return abcPlayer;
}

function makeInstrument(timbre) {
  /*
   * Some old iPads break badly running more recent Javascript
   * We abstract this out into a separate function so that when it fails
   * the rest of the code continues on working - Arghh!
   */
  var tempInstrument = new Instrument(timbre);
  return tempInstrument;
}

/*
 * Play an ABC tune when the button gets pushed
 */
function playABC(textArea, playButton, bpm) {
  /*
   * Stop any current player
   */
  stopABCplayer();

  if (playButton.className == "playButton") {
    /*
     * Our simple ABC player doesn't handle repeats well.
     * This function unrolls the ABC so that things play better.
     */
    var tuneABC = preProcessABC(textArea.value);

    // speed was reset before play started
    if (bpmReset) {
      bpm = bpmReset;
    }
    // calculate tune length
    setTuneDuration(tuneABC, bpm);

    let ticks = calculateTicks(tuneABC, bpm);
    startABCplayer(tuneABC, ticks);
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
  stopABCplayer();

  // save the speed
  bpmReset = bpm;

  // if there's an active player, restart it at the new speed
  if (playButton.className == "stopButton") {
    /*
     * Our simple ABC player doesn't handle repeats well.
     * This function unrolls the ABC so that things play better.
     */
    var tuneABC = preProcessABC(textArea.value);

    // Change the speed of playback
    setTuneDuration(tuneABC, bpm);

    let ticks = calculateTicks(tuneABC, bpm);
    startABCplayer(tuneABC, ticks);
  }
}

function setTuneDuration(tuneABC, bpm) {
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

  let tuneDuration = (bars * eval(meterStr) * 16 * eval(noteLenStr) * 60) / bpm;

  currentABCslider.noUiSlider.updateOptions({
    range: {
      min: 0,
      max: tuneDuration,
    },
  });
}

function calculateTicks(tuneABC, bpm) {
  // The ABC L: value scales the ticks value!
  let noteLenStr = getABCheaderValue("L:", tuneABC);
  if (!noteLenStr) {
    noteLenStr = "1/8";
  }

  return bpm / (2 * eval(noteLenStr));
}

function getABCheaderValue(key, tuneABC) {
  // Extract the value of one of the ABC keywords e.g. T: Out on the Ocean
  var regex = new RegExp(key);
  var lines = tuneABC.split("\n");
  var ABCvalue = "";
  var i;

  for (i = 0; i < lines.length; i += 1) {
    if (lines[i].match(regex)) {
      ABCvalue = lines[i].replace(regex, "");
      ABCvalue = ABCvalue.replace(/^\s+|\s+$/g, "");
      break;
    }
  }
  return ABCvalue;
}

function startABCplayer(tuneABC, ticks) {
  abcStopped = 0;
  instrument.silence();
  instrument.play(
    {
      tempo: ticks,
    },
    tuneABC,
    function () {
      loopABCplayer(tuneABC, ticks);
    }
  );
  abcCurrentTime = 0;
  currentABCslider.noUiSlider.set(0);
  intervalHandle = setInterval(nudgeABCSlider, 300);
}

function stopABCplayer() {
  clearInterval(intervalHandle);
  abcStopped = 1;
  instrument.silence();
}

function loopABCplayer(tuneABC, ticks) {
  instrument.silence();
  clearInterval(intervalHandle);

  if (abcStopped == 0) {
    startABCplayer(tuneABC, ticks);
  }
}

function nudgeABCSlider() {
  abcCurrentTime += 0.3;

  currentABCslider.noUiSlider.set(abcCurrentTime);
}

function createABCSliders(textArea, tuneID) {
  let audioSlider = document.getElementById(`audioSliderABC${tuneID}`);
  let speedSlider = document.getElementById(`speedSliderABC${tuneID}`);
  let playButton = document.getElementById(`playABC${tuneID}`);
  let tuneABC = document.getElementById(textArea);

  currentABCslider = audioSlider;

  noUiSlider.create(audioSlider, {
    start: [0],
    tooltips: [
      wNumb({
        decimals: 1,
      }),
    ],
    range: {
      min: [0],
      max: [100],
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

  speedSlider.noUiSlider.on("change", function (value) {
    changeABCspeed(tuneABC, playButton, value);
  });
}

function preProcessABC(tuneABC) {
  /*
   * Our simple ABC player doesn't handle repeats well.
   * This function unrolls the ABC so that things play better.
   */
  var lines = tuneABC.split("\n");
  var abcHeader = [""];
  var abcNotes = [""];
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
        abcHeader[tuneIndex] = "";
        abcNotes[tuneIndex] = "";
        if (lines[j].startsWith("X:")) {
          continue;
        }
      }
      // put the header lines back in place
      abcHeader[tuneIndex] += lines[j] + "\n";
      //
      if (lines[j].startsWith("K:")) {
        endOfHeaderFound = true;
      }
    } else if (blankRegex.test(lines[j])) {
      // Skip blank and comment lines.
      continue;
    } else {
      // Notes to parse
      abcNotes[tuneIndex] += lines[j];
    }
  }
  for (i = 0; i < abcHeader.length; ++i) {
    processedABC += abcHeader[i] + unRollABC(abcNotes[i]) + "\n";
  }
  return processedABC;
}

function unRollABC(abcNotes) {
  /*
     * Regular expression used to parse ABC - https://regex101.com/ was very helpful in decoding
     *
                
     ABCString = (?:\[[A-Za-z]:[^\]]*\])|\s+|%[^\n]*|![^\s!:|\[\]]*!|\+[^+|!]*\+|[_<>@^]?"[^"]*"|\[|\]|>+|<+|(?:(?:\^+|_+|=|)[A-Ga-g](?:,+|'+|))|\(\d+(?::\d+){0,2}|\d*\/\d+|\d+\/?|\/+|[xzXZ]|\[?\|:\]?|:?\|:?|::|.
                
     (?:\[[A-Za-z]:[^\]]*\]) matches nothing
     \s+|%[^\n]* matches spaces
     [^\s!:|\[\]]*! no matches
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
  var match,
    fBarPos = [],
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

  while ((match = firstBar.exec(abcNotes)) != null) {
    fBarPos.push(match.index);
  }
  tokenString[tokenCount] = "fb";
  if (fBarPos[0] > 6) {
    fBarPos[0] = 0;
  }
  // first bar
  tokenLocations[tokenCount++] = fBarPos[0];
  while (
    ((match = fEnding.exec(abcNotes)) || (match = fEnding2.exec(abcNotes))) !=
    null
  ) {
    fEndPos.push(match.index);
    tokenString[tokenCount] = "fe";
    // first endings
    tokenLocations[tokenCount++] = match.index;
  }
  while (
    ((match = sEnding.exec(abcNotes)) || (match = sEnding2.exec(abcNotes))) !=
    null
  ) {
    sEndPos.push(match.index);
    tokenString[tokenCount] = "se";
    // second endings
    tokenLocations[tokenCount++] = match.index;
  }
  while ((match = rRepeat.exec(abcNotes)) != null) {
    rRepPos.push(match.index);
    tokenString[tokenCount] = "rr";
    // right repeats
    tokenLocations[tokenCount++] = match.index;
  }
  while ((match = lRepeat.exec(abcNotes)) != null) {
    lRepPos.push(match.index);
    tokenString[tokenCount] = "lr";
    // left repeats
    tokenLocations[tokenCount++] = match.index;
  }
  while (
    ((match = dblBar.exec(abcNotes)) || (match = dblBar2.exec(abcNotes))) !=
    null
  ) {
    dblBarPos.push(match.index);
    tokenString[tokenCount] = "db";
    // double bars
    tokenLocations[tokenCount++] = match.index;
  }
  tokenString[tokenCount] = "lb";
  // last bar
  tokenLocations[tokenCount++] = fBarPos[fBarPos.length - 1];

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
    // safety check - is 1000 enough? ASJL 2020/11/23
    if (expandedABC.length > 1000) {
      break;
    }
    // find next repeat or second ending
    if (sortedTokens[i] == "rr" || sortedTokens[i] == "se") {
      //notes from last location to rr or se
      expandedABC += abcNotes.substr(pos, sortedTokenLocations[i] - pos);
      // march backward from there
      for (k = i - 1; k >= 0; k--) {
        // check for likely loop point
        if (
          sortedTokens[k] == "se" ||
          sortedTokens[k] == "rr" ||
          sortedTokens[k] == "fb" ||
          sortedTokens[k] == "lr"
        ) {
          // mark loop beginning point
          pos = sortedTokenLocations[k];
          // walk forward from there
          for (j = k + 1; j < sortedTokens.length; j++) {
            // walk to likely stopping point (first ending or repeat)
            if (sortedTokens[j] == "fe" || sortedTokens[j] == "rr") {
              expandedABC += abcNotes.substr(
                pos,
                sortedTokenLocations[j] - pos
              );
              // mark last position encountered
              pos = sortedTokenLocations[j];
              // consume tokens from big loop
              i = j + 1;
              // if we got to a first ending we have to skip it..
              if (sortedTokens[j] == "fe") {
                // walk forward from here until the second ending
                for (l = j; l < sortedTokens.length; l++) {
                  if (sortedTokens[l] == "se") {
                    // look for end of second ending
                    for (m = l; m < sortedTokens.length; m++) {
                      // a double bar marks the end of a second ending
                      if (sortedTokens[m] == "db") {
                        // record second ending
                        expandedABC += abcNotes.substr(
                          sortedTokenLocations[l],
                          sortedTokenLocations[m] - sortedTokenLocations[l]
                        );
                        //mark most forward progress
                        pos = sortedTokenLocations[m];
                        // consume the tokens from the main loop
                        i = m + 1;
                        // quit looking
                        break;
                      }
                    } // END of for m loop
                    // consume tokens TED: CHECK THIS
                    i = l + 1;
                    // quit looking
                    break;
                  }
                } // END of for l loop
              } // END of first ending we have to skip it
              break;
            }
          } // END of for j loop
          break;
        } // END of check for likely loop point
      } // END of for k loop
    } // END of check for likely loop point
  } // END of for i loop

  expandedABC += abcNotes.substr(
    pos,
    sortedTokenLocations[sortedTokens.length - 1] - pos
  );

  /*
   * Clean up the ABC repeat markers - we don't need them now!
   */
  expandedABC = expandedABC.replace(/:\|/g, "|");
  expandedABC = expandedABC.replace(/\|:/g, "|");
  expandedABC = expandedABC.replace(/::/g, "|");
  expandedABC = expandedABC.replace(/\|+/g, "|");
  expandedABC = expandedABC.replace(/:$/, "|");
  expandedABC = expandedABC.replace(/:"$/, "|");

  return expandedABC;
}
