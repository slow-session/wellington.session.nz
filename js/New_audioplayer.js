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
var Tune_ID = null; // necessary??
//var Previoustimeline=null;
//var Previousplayhead=null;
var PreviouspButton = null;
//var playheadRadius=5; // diam. of playhead = 10
var CurrentAudioSlider = null;
var turnAudioBackOn = false;
var AudioPosition;
var DurationP;
var origins = null;
var AudioSpeed=0;

function createSlider(SliderName, speedSlider){
//alert(SliderName+", "+speedSlider);
var audioSlider=document.getElementById(SliderName);
//origins = audioSlider.getElementsByClassName('noUi-origin');

  noUiSlider.create(audioSlider, {
      start: [0, 0, 100],
      //tooltips: [wNumb({decimals: 1}), wNumb({decimals: 1}), wNumb({decimals: 1})],
  		connect: [false, true, true, false],
  		//pips: {mode: 'count', values: 6, density: 6},
      //animate: true,
      //animationDuration: 400,
      behaviour: 'drag',
      step: 0.25,
      range: {
          'min': 0,
          'max': 100
      }
  });
var RSsliderName=document.getElementById(speedSlider);
  noUiSlider.create(RSsliderName, {
      start: [100],
      //tooltips: [wNumb({decimals: 0, suffix: '%'})],
  		//pips: {mode: 'count', values: 3, density: 10, format: wNumb({decimals: 0, suffix: '%'})},
      range: {
          'min': 50,
          'max': 120
      }
  });

/*
  audioSlider.noUiSlider.on('start', function (values, handle) {
    //alert("start");

      if (OneAudioPlayer.paused==false){ // audio is currently playing.
          OneAudioPlayer.pause(); // first pause the audio
          turnAudioBackOn = true;
      }
  });
*/

  audioSlider.noUiSlider.on('update', function (values, handle) {
    //alert("Play");
    if (handle === 1) {
      var audioPositionScreenLocation = 'APos' + Tune_ID;
      var durationScreenLocation = 'Dur' + Tune_ID;
      //New_adjustAudioPosition(audioPositionScreenLocation, durationScreenLocation, values[1]);
      //New_setAudioPosition(Tune_ID, values[1]);
      //this.target.setAttribute('data-value' + handle, values[handle]);
    }
  });

  audioSlider.noUiSlider.on('change', function (values, handle) {
    var audioPositionScreenLocation = 'APos' + Tune_ID;
    var durationScreenLocation = 'Dur' + Tune_ID;
    //alert(audioPositionScreenLocation+", "+durationScreenLocation);
    if (handle === 0) {
          BeginLoopTime = values[0];
          EndLoopTime = values[2];
          OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
          adjust_segment_controls(values,handle);
    } else if (handle === 2) {
          BeginLoopTime = values[0];
          EndLoopTime = values[2];
          OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
          adjust_segment_controls(values,handle);
    } else if (handle === 1) {
          New_setAudioPosition(audioPositionScreenLocation, values[1]);
          //alert("audioslider change");
    }

    //PreviousAudioID = audioID;

  });
  RSsliderName.noUiSlider.on('update', function(value){
    //alert("RS");
       //AudioSpeed.innerHTML = "Speed - "+Number(value).toFixed(0)+" %";
       setPlaySpeed(value/100);
       AudioSpeed.innerHTML = "Speed - "+Number(value).toFixed(0)+" %";
  });
//How to disable handles on audioslider.
//origins[2].setAttribute('disabled', true);
}

function createAudioPlayer() {
    var pagePlayer = '';
    pagePlayer += '<!-- declare an Audio Player for this page-->';
    pagePlayer += '<audio id="OneAudioPlayer" loop onloadstart="loadStart()" oncanplaythrough="loadFinish()">';
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
    mp3player += '               onchange="setPlaySpeed(value/100)" />';
    mp3player += '            <p class="audio">Speed - <strong><output name="level">100</output>%</strong></p>';
    mp3player += '          </span>';
    mp3player += '        </div>';
    mp3player += '      </div>';

    mp3player += '    </div>';
    mp3player += '  </div>';
    mp3player += '</form>';

    return (mp3player);
}

function createMP3player_experimental(tuneID, mp3url, playerClass) {
    var mp3player = '';
    var trID = 'tr' + tuneID;
    Tune_ID = tuneID;  //global tuneID
    // build the MP3 player for each tune
    mp3player += '<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
    mp3player += '    <div id="audioplayer' + tuneID + '" class="' + playerClass + '">';
    mp3player += '    <div class="row" style="width: 100%; min-width: 350px;">';
    // Col 1
    mp3player += '      <div class="small-1 columns">';
    mp3player += '        <button id="pButton' + tuneID + '" class="playButton"';
    mp3player += '            onclick="New_playAudio(\'' + trID + '\', audioplayer' + tuneID + ', pButton' + tuneID + ',  playPosition' + tuneID + ', \'' + mp3url + '\', APos' + tuneID + ', Dur' + tuneID + ',  RSS' + tuneID + ')">';
    mp3player += '            <div id="APos' + tuneID + '" class="audioPosMP3"></div>';
    mp3player += '            <div id="Dur' + tuneID + '" class="durationP"></div>';
    mp3player += '        </button>';
    mp3player += '      </div>';
    // Col 2
    mp3player += '      <div class="small-6 columns">';
    mp3player += '        <div class="audio">';
/*
    mp3player += '        <input name="playPosition' + tuneID + '" id="playPosition' + tuneID + '" type="range" class="audioControl slider" min="0" max="400" value="0"';
    mp3player += '            oninput="adjustAudioPosition(audioplayer' + tuneID + ', value/400)"';
    mp3player += '            onchange="setAudioPosition(audioplayer' + tuneID + ', value/400, B1' + tuneID + ', B2' + tuneID + ')"/>';
*/
    mp3player += '            <span title="Play tune, select loop starting point, then select loop end point">';
    mp3player += '               <div id="playPosition' + tuneID + '" class="new_audioControl"></div>'
    mp3player += '            </span>';
    mp3player += '        </div>';
    mp3player += '        <p class="audio"> </p>';
    mp3player += '      </div>';
    // Col 3
    mp3player += '      <div class="small-5 columns">';
    mp3player += '        <div id="speedControl' + tuneID + '" class="new_speedControl">';
    mp3player += '          <span title="Adjust playback speed with slider">';
    mp3player += '               <div id="RS' + tuneID + '"></div>'
/*
    mp3player += '            <input name="flevel" id="RS' + tuneID + '" class="slider" type="range" min="50" max="120" value="100"';
    mp3player += '               onchange="setPlaySpeed(audioplayer' + tuneID + ', value/100)" />';
*/
    mp3player += '            <p id="RSS' + tuneID + '" class="audio">Speed - 100%</strong></p>';
    mp3player += '          </span>';
    mp3player += '        </div>';
    mp3player += '      </div>';

    mp3player += '    </div>';
    mp3player += '  </div>';
    mp3player += '</form>';
    //createSliders("playPosition" + tuneID, "RS" + tuneID);
    return (mp3player);
}

function delay_load_upadate(){
OneAudioPlayer.ondurationchange = function() {
    CurrentAudioSlider.noUiSlider.updateOptions({range: {'min': 0, 'max': Number(OneAudioPlayer.duration)}});
    CurrentAudioSlider.noUiSlider.setHandle(2,Number(OneAudioPlayer.duration));
    DurationP.innerHTML = OneAudioPlayer.duration.toFixed(1);
};
  //audioSliderHandles[1].removeAttribute('disabled'); // re-enable

}
function New_playAudio(trID, audioplayer, pButton, positionSlider, audioSource, audioposition, duration, audioSpeed) {
//alert(trID+", "+ audioplayer+", "+ pButton+", "+ positionSlider+", "+ audioSource+", "+ audioposition+", "+ duration+", "+ audioSpeed);
        if (pButton.className == "playButton") {
        if (PreviousAudioID != audioplayer) { //only load if necessary
            OneAudioPlayer.src = audioSource;
            if (PreviousAudioID != null) { //reset previous audio player
                //audioSlider.noUiSlider.values[1] = 0;
                if (PreviouspButton != null) PreviouspButton.className = "playButton";
                OneAudioPlayer.removeEventListener("timeupdate", New_positionUpdate);
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
            //OneAudioPlayer.src = audioSource;
            PreviousAudioID = audioplayer;
            Previoustimeline = positionSlider;
            //Previousplayhead=playhead;
            PreviouspButton = pButton;
            AudioPosition = audioposition;
            DurationP = duration;
            PreviousTrID = trID;
            AudioSpeed = audioSpeed;
            // modify slider
            positionSlider.noUiSlider.updateOptions({
                tooltips: [wNumb({decimals: 1}), wNumb({decimals: 1}), wNumb({decimals: 1})],
                //range: {'min': 0, 'max': Number(OneAudioPlayer.duration)},
                //pips: {mode: 'count', values: 6, density: 6},
            });
            if (document.getElementById(trID)) {
                document.getElementById(trID).style.backgroundColor = 'khaki';
            }
        }
        CurrentAudioSlider = positionSlider;

        var promise = OneAudioPlayer.play();
        if (promise) {
          promise.catch(function(error) { console.error(error); });
        }
        pButton.className = "";
        pButton.className = "pauseButton";

          OneAudioPlayer.addEventListener("timeupdate", New_positionUpdate);
    } else {
        OneAudioPlayer.pause();
        pButton.className = "";
        pButton.className = "playButton";
        if (document.getElementById(trID)) {
            document.getElementById(trID).style.backgroundColor = '';
        }
        New_positionUpdate(); // this puts the slider exactly where it should be.
    }
    delay_load_upadate();
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
        var promise = OneAudioPlayer.play();
        if(promise){
          promise.catch(function(error) { console.error(error); });
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
    }
}

function loadStart() {
    if (AudioPosition) {
        AudioPosition.innerHTML = "Load";
    }
}

function loadFinish() {
    if(OneAudioPlayer.currentTime>0){
      return;
    } else if (AudioPosition != null){
      AudioPosition.innerHTML = "0.0";
      DurationP.innerHTML = OneAudioPlayer.duration.toFixed(1);
      if(EndLoopTime==0){ EndLoopTime=OneAudioPlayer.duration; } //initialise if needed
    }

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
function New_setAudioPosition(audioPositionScreenLocation, value){
  //if (PreviousAudioID != audioplayer) return;
  //alert(value);
  OneAudioPlayer.currentTime = Number(value);
  New_positionUpdate();
  OneAudioPlayer.addEventListener("timeupdate", New_positionUpdate);

  //audioPositionScreenLocation.innerHTML = OneAudioPlayer.currentTime.toFixed(1);
}

function New_adjustAudioPosition(audioPositionScreenLocation, durationScreenLocation, value) {
    //if (PreviousAudioID != audioplayer) return;
    //OneAudioPlayer.removeEventListener("timeupdate", positionUpdate);
    document.getElementById(audioPositionScreenLocation).innerHTML = Number(value).toFixed(1);
    //document.getElementById(durationScreenLocation).innerHTML = OneAudioPlayer.duration.toFixed(1);
}

function adjustAudioPosition(audioplayer, value) {
    if (PreviousAudioID != audioplayer) return;
    var sliderVal = value * OneAudioPlayer.duration;
    OneAudioPlayer.removeEventListener("timeupdate", positionUpdate);
    AudioPosition.innerHTML = sliderVal.toFixed(1);
    DurationP.innerHTML = OneAudioPlayer.duration.toFixed(1);
}

function New_positionUpdate() {
    var duration = OneAudioPlayer.duration;
    if (OneAudioPlayer.currentTime >= (duration - .25)) {
        OneAudioPlayer.currentTime = BeginLoopTime;
    }
    CurrentAudioSlider.noUiSlider.setHandle(1,OneAudioPlayer.currentTime);
    AudioPosition.innerHTML = OneAudioPlayer.currentTime.toFixed(1);
}
function positionUpdate() {
    var duration = OneAudioPlayer.duration;
    audioSlider.value = (OneAudioPlayer.currentTime / duration) * 400;
    if (OneAudioPlayer.currentTime >= (duration - .25)) {
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
//var hits=0;
function setAudioLoops() {
   //document.getElementById("debug").innerHTML=hits++ +" Begin: "+BeginLoopTime+" End: "+EndLoopTime;

    if ((OneAudioPlayer.currentTime >= (OneAudioPlayer.duration-.25))||(OneAudioPlayer.currentTime >= EndLoopTime)) {
        OneAudioPlayer.currentTime = BeginLoopTime;

    }
}

function setPlaySpeed(speed) {
    //alert(speed);
    OneAudioPlayer.playbackRate = speed;
}
