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
//var Previoustimeline=null;
//var Previousplayhead=null;
var PreviouspButton = null;
//var playheadRadius=5; // diam. of playhead = 10
var audioSlider = null;
var AudioPosition;
var DurationP;

function createAudioPlayer() {
    var pagePlayer = '';
    pagePlayer += '<!-- declare an Audio Player for this page-->';
    pagePlayer += '<audio id="OneAudioPlayer" loop onloadstart="loadStart()" oncanplaythrough="loadFinish()">';
    pagePlayer += '    <source id="mp3Source" type="audio/mp3"></source>';
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
    mp3player += '    <div class="row" style="width: 100%; min-width: 350px;">';
    // Col 1
    mp3player += '      <div class="small-1 columns">';
    mp3player += '        <button id="pButton' + tuneID + '" class="playButton"';
    mp3player += '            onclick="playAudio(\'' + trID + '\', audioplayer' + tuneID + ', pButton' + tuneID + ',  playPosition' + tuneID + ', \'' + mp3url + '\', APos' + tuneID + ', Dur' + tuneID + ',  RS' + tuneID + ')">';
    mp3player += '            <div id="APos' + tuneID + '" class="audioPosMP3"></div>';
    mp3player += '            <div id="Dur' + tuneID + '" class="durationP"></div>';
    mp3player += '        </button>';
    mp3player += '      </div>';
    // Col 2
    mp3player += '      <div class="small-6 columns">';
    mp3player += '        <input name="playPosition' + tuneID + '" id="playPosition' + tuneID + '" type="range" class="audioControl slider" min="0" max="400" value="0"';
    mp3player += '            oninput="adjustAudioPosition(audioplayer' + tuneID + ', value/400)"';
    mp3player += '            onchange="setAudioPosition(audioplayer' + tuneID + ', value/400, B1' + tuneID + ', B2' + tuneID + ')"/>';
    mp3player += '        <div class="loopControl">';
    mp3player += '            <span title="Play tune, select loop starting point, then select loop end point">';
    mp3player += '               <input type="button" class="loopButton"id="B1' + tuneID + '" value=" Loop Start "';
    mp3player += '                  onclick="SetPlayRange(audioplayer' + tuneID + ',0,B1' + tuneID + ', B2' + tuneID + ')" />';
    mp3player += '               <input type="button" class="loopButton" id="B2' + tuneID + '" value=" Loop End "';
    mp3player += '                  onclick="SetPlayRange(audioplayer' + tuneID + ',1,B1' + tuneID + ', B2' + tuneID + ')" />';
    mp3player += '               <input type="button" class="loopButton" value=" Reset "';
    mp3player += '                  onclick="SetPlayRange(audioplayer' + tuneID + ',2,B1' + tuneID + ', B2' + tuneID + ')" />';
    mp3player += '            </span>';
    mp3player += '        </div>';
    mp3player += '        <p class="audio"> </p>';
    mp3player += '      </div>';
    // Col 3
    mp3player += '      <div class="small-5 columns">';
    mp3player += '        <div id="speedControl' + tuneID + '" class="speedControl">';
    mp3player += '          <span title="Adjust playback speed with slider">';
    mp3player += '            <input name="flevel" id="RS' + tuneID + '" class="slider" type="range" min="50" max="120" value="100"';
    mp3player += '               onchange="setPlaySpeed(audioplayer' + tuneID + ', value/100)" />';
    mp3player += '            <p class="audio">Speed - <strong><output name="level">100</output>%</strong></p>';
    mp3player += '          </span>';
    mp3player += '        </div>';
    mp3player += '      </div>';

    mp3player += '    </div>';
    mp3player += '  </div>';
    mp3player += '</form>';

    return (mp3player);
}

function playAudio(trID, audioplayer, pButton, positionSlider, audioSource, audioposition, duration, audioSpeed) {
    if (pButton.className == "playButton") {
        if (PreviousAudioID != audioplayer) { //only load if necessary
            if (PreviousAudioID != null) { //reset previous audio player
                audioSlider.value = 0;
                if (PreviouspButton != null) PreviouspButton.className = "playButton";
                OneAudioPlayer.removeEventListener("timeupdate", positionUpdate);
                OneAudioPlayer.removeEventListener("timeupdate", setAudioLoops);
                AudioPosition.innerHTML = "0.0";
                if (PreviousButton1ID != null) {
                    PreviousButton1ID.value = " Loop Start ";
                    PreviousButton2ID.value = " Loop End ";
                }
                if (document.getElementById(PreviousTrID)) {
                    document.getElementById(PreviousTrID).style.backgroundColor = '';
                }
                //alert(audioplayer.id+"::"+PreviousAudioID.id+"\n"+timeline.id+"::"+Previoustimeline.id+"\n"+Eventhandler);
            }
            OneAudioPlayer.src = audioSource;
            PreviousAudioID = audioplayer;
            Previoustimeline = positionSlider;
            //Previousplayhead=playhead;
            PreviouspButton = pButton;
            AudioPosition = audioposition;
            DurationP = duration;
            PreviousTrID = trID;
            if (document.getElementById(trID)) {
                document.getElementById(trID).style.backgroundColor = 'khaki';
            }
        }

        audioSlider = positionSlider;
        OneAudioPlayer.playbackRate = audioSpeed.value / 100;
        OneAudioPlayer.play();
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
    }
}

function loadStart() {
    if (AudioPosition) {
        AudioPosition.innerHTML = "Load";
    }
}

function loadFinish() {
    AudioPosition.innerHTML = "0.0";
    DurationP.innerHTML = OneAudioPlayer.duration.toFixed(1);
}

function setAudioPosition(audioplayer, value, button1ID, button2ID) {
    if (PreviousAudioID != audioplayer) return;
    var sliderVal = value * OneAudioPlayer.duration;
    OneAudioPlayer.addEventListener("timeupdate", positionUpdate);
    OneAudioPlayer.currentTime = sliderVal;
    positionUpdate();
    AudioPosition.innerHTML = OneAudioPlayer.currentTime.toFixed(1);
    if (EndLoopTime == 0) return; // if loops haven't been set don't nudge them
    if (sliderVal > EndLoopTime) { //nudging loop
        EndLoopTime = sliderVal;
        button2ID.value = EndLoopTime.toFixed(1);
    }
    if (sliderVal < BeginLoopTime) {
        BeginLoopTime = sliderVal;
        button1ID.value = BeginLoopTime.toFixed(1);
    }
}

function adjustAudioPosition(audioplayer, value) {
    if (PreviousAudioID != audioplayer) return;
    var sliderVal = value * OneAudioPlayer.duration;
    OneAudioPlayer.removeEventListener("timeupdate", positionUpdate);
    AudioPosition.innerHTML = sliderVal.toFixed(1);
    DurationP.innerHTML = OneAudioPlayer.duration.toFixed(1);
}

function positionUpdate() {
    var duration = OneAudioPlayer.duration;
    audioSlider.value = (OneAudioPlayer.currentTime / duration) * 400;
    if (OneAudioPlayer.currentTime >= duration - .25) {
        OneAudioPlayer.currentTime = 0;
    }
    AudioPosition.innerHTML = OneAudioPlayer.currentTime.toFixed(1);
}

function SetPlayRange(audioID, ButtonEvent, button1ID, button2ID) {
    // this only works for the currently selected audio player
    if (PreviousAudioID != audioID) { //different player controls selected
        return;
    }
    EndLoopTime = OneAudioPlayer.duration - .25; // sampling rate is ~ every 250 ms (overshoot the end)
    /*
     * Set the start and end of loop markers depending on which button was pressed
     */
    switch (ButtonEvent) {
        // Loop Start button
        case 0:
            BeginLoopTime = OneAudioPlayer.currentTime;
            button1ID.value = BeginLoopTime.toFixed(1);
            button2ID.value = EndLoopTime.toFixed(1);
            break;
            // Loop End button
        case 1:
            EndLoopTime = OneAudioPlayer.currentTime;
            button1ID.value = BeginLoopTime.toFixed(1);
            button2ID.value = EndLoopTime.toFixed(1);
            break;
            // Reset button
        case 2:
            BeginLoopTime = 0;
            EndLoopTime = OneAudioPlayer.duration - .25; // sampling rate is ~ every 250 ms (overshoot the end)
            button1ID.value = BeginLoopTime.toFixed(1);
            button2ID.value = EndLoopTime.toFixed(1);
            break;
    }
    PreviousAudioID = audioID;
    PreviousButton1ID = button1ID;
    PreviousButton2ID = button2ID;

    OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
    return;
}

function setAudioLoops() {
    if (OneAudioPlayer.currentTime >= EndLoopTime) {
        OneAudioPlayer.currentTime = BeginLoopTime;
    }
}

function setPlaySpeed(audioID, speed) {
    OneAudioPlayer.playbackRate = speed;
}
