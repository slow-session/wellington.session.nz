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

var BeginLoopTime = 0;
var EndLoopTime = 0;
var PreviousTrID = null;
var PreviousAudioID = null;
var PreviousButton1ID = null;
var PreviousButton2ID = null;
var Tune_ID = null;
var PreviouspButton = null;
var CurrentAudioSlider = null;
var turnAudioBackOn = false;
var origins = null;
var sliderArray1 = [];
var sliderArray2 = [];

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
    Tune_ID = tuneID; //global tuneID
    // build the MP3 player for each tune

    mp3player += '<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
    mp3player += '    <div id="audioplayer' + tuneID + '" class="' + playerClass + '">';
    mp3player += '    <div class="row">';
    // Col 1
    mp3player += '      <div class="small-2 columns">';
    mp3player += '        <button id="pButton' + tuneID + '" class="playButton"';
    mp3player += '            onclick="playAudio(\'' + trID + '\', audioplayer' + tuneID + ', pButton' + tuneID + ',  playPosition' + tuneID + ', RS'+tuneID + ', \'' + mp3url + '\')">';
    mp3player += '        </button>';
    mp3player += '      </div>';
    // Col 2
    mp3player += '      <div class="small-10 columns">';
    mp3player += '        <div class="row small-up-1 medium-up-2 large-up-2">';
    mp3player += '          <div class="small-6 columns">';
    mp3player += '            <div class="audioLabel">';
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
    mp3player += '            <p class="audioLabel"> </p>';
    mp3player += '          </div>';
    // Col 3
    mp3player += '          <div class="small-5 columns end">';
    mp3player += '            <div id="speedControl' + tuneID + '" class="mp3SpeedControl">';
    mp3player += '              <span title="Adjust playback speed with slider">';
    mp3player += '                <div id="RS' + tuneID + '"></div>'
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

var sliderArray1 = [];
var sliderArray2 = [];

function Create_archive_sliders() {
    //console.log(sliderArray1.length);
    for (var i = 0; i < sliderArray1.length; i++) {
        //console.log(sliderArray1[i]);
        createSlider(sliderArray1[i], sliderArray2[i]);
    }
}

function createSlider(SliderName, speedSlider) {
    var audioSlider = document.getElementById(SliderName);
    //console.log(SliderName + ', ' + speedSlider);

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
    var RSsliderName = document.getElementById(speedSlider);
    noUiSlider.create(RSsliderName, {
        start: [100],
        tooltips: [wNumb({decimals: 0, postfix: ' %'})],
        range: {
            'min': 50,
            'max': 120
        }
    });

    audioSlider.noUiSlider.on('update', function(values, handle) {
        if (handle === 1) {
            var audioPositionScreenLocation = 'APos' + Tune_ID;
            var durationScreenLocation = 'Dur' + Tune_ID;
        }
    });

    audioSlider.noUiSlider.on('change', function(values, handle) {
        var audioPositionScreenLocation = 'APos' + Tune_ID;
        var durationScreenLocation = 'Dur' + Tune_ID;
        //alert(audioPositionScreenLocation+", "+durationScreenLocation);
        if (handle === 0) {
            BeginLoopTime = values[0];
            EndLoopTime = values[2];
            OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
            adjust_segment_controls(values, handle);
        } else if (handle === 2) {
            BeginLoopTime = values[0];
            EndLoopTime = values[2];
            OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
            adjust_segment_controls(values, handle);
        } else if (handle === 1) {
            setAudioPosition(audioPositionScreenLocation, values[1]);
        }

    });
    RSsliderName.noUiSlider.on('change', function(value) {
        setPlaySpeed(value / 100);
    });
    //How to disable handles on audioslider.
    RSsliderName.noUiSlider.on('start', function(value) {
        if (OneAudioPlayer.paused == false) { // audio is currently playing.
            OneAudioPlayer.pause(); // first pause the audio
            turnAudioBackOn = true;
        }
    });
    RSsliderName.noUiSlider.on('end', function(value) {
        if (turnAudioBackOn) { // audio is currently playing.
            OneAudioPlayer.play(); // first pause the audio
            turnAudioBackOn = false;
        }
    });
    audioSlider.noUiSlider.on('start', function(value) {
        if (OneAudioPlayer.paused == false) { // audio is currently playing.
            OneAudioPlayer.pause(); // first pause the audio
            turnAudioBackOn = true;
        }
    });
    audioSlider.noUiSlider.on('end', function(value) {
        if (turnAudioBackOn) { // audio is currently playing.
            OneAudioPlayer.play(); // first pause the audio
            turnAudioBackOn = false;
        }
    });
}

function delay_load_update() {
    OneAudioPlayer.ondurationchange = function() {
        CurrentAudioSlider.noUiSlider.updateOptions({
            range: {
                'min': 0,
                'max': Number(OneAudioPlayer.duration)
            }
        });
        CurrentAudioSlider.noUiSlider.setHandle(2, Number(OneAudioPlayer.duration));
    };
}

function playAudio(trID, audioplayer, pButton, positionSlider, speedSlider, audioSource) {
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
            }
            PreviousAudioID = audioplayer;
            Previoustimeline = positionSlider;
            PreviouspButton = pButton;
            PreviousTrID = trID;
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

        var promise = OneAudioPlayer.play();
        if (promise) {
            promise.catch(function(error) {
                console.error(error);
            });
        }
        pButton.className = "";
        pButton.className = "pauseButton";

        OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
    } else {
        OneAudioPlayer.pause();
        pButton.className = "";
        pButton.className = "playButton";
        if (document.getElementById(trID)) {
            document.getElementById(trID).style.backgroundColor = '';
        }
        positionUpdate(); // this puts the slider exactly where it should be.
    }
    delay_load_update();
    OneAudioPlayer.playbackRate = speedSlider.noUiSlider.get()/100;
}

function loadFinish() {
    if (OneAudioPlayer.currentTime > 0) {
        return;
    } else if (AudioPosition != null) {
        if (EndLoopTime == 0) {
            EndLoopTime = OneAudioPlayer.duration;
        } //initialise if needed
    }

}

function setAudioPosition(audioPositionScreenLocation, value) {
    OneAudioPlayer.currentTime = Number(value);
    positionUpdate();
    OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
}

function positionUpdate() {
    var duration = OneAudioPlayer.duration;
    if (OneAudioPlayer.currentTime >= (duration - .25)) {
        OneAudioPlayer.currentTime = BeginLoopTime;
    }
    CurrentAudioSlider.noUiSlider.setHandle(1, OneAudioPlayer.currentTime);
}

function setAudioLoops() {
    if ((OneAudioPlayer.currentTime >= (OneAudioPlayer.duration - .25)) ||
        (OneAudioPlayer.currentTime >= EndLoopTime)) {
        OneAudioPlayer.currentTime = BeginLoopTime;

    }
}

function setPlaySpeed(speed) {
    OneAudioPlayer.playbackRate = speed;
}
