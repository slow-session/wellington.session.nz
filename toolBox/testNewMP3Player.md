---
layout: page
title: Experimental MP3
permalink: /testNewMP3Player/
---
<div class="player">
<div id="audioPlayer"></div>
<div id="showPlayer">

<p>If you come across audio files on the Internet that aren't on our
site you can use this page to slow down a number of audio and video
formats and play parts of them in a loop.
These seem to work:
</p>

<ul>
<li>.mp3</li>
<li>.mp4</li>
<li>.mov</li>
<li>.m4a</li>
<li>.ogg</li>
<li>.wav</li>

</ul>

<p>
Test page for new mp3 player.
</p>


<input type="button" class="filterButton" onclick="getURL()" value="Create Player">

</div>
</div>
<div id="Hits"></div>
<script src="{{ site.mp3_host }}/js/New_audioplayer.js"></script>
<script src="{{ site.mp3_host }}/js/wNumb.js"></script>

<script>


function createSlider(SliderName){
audioSlider=document.getElementById(SliderName);
  noUiSlider.create(audioSlider, {
      start: [0, 0, 400],
      //tooltips: [wNumb({decimals: 1}), false, wNumb({decimals: 1})],
  		connect: [false, true, true, false],
  		//pips: {mode: 'count', values: 6, density: 6},
      animate: true,
      animationDuration: 700,
      behaviour: 'drag',
      step: 0.25,
      range: {
          'min': 0,
          'max': 100
      }
  });
var slowDownSliderName = RSplayABC;//HACK
  noUiSlider.create(slowDownSliderName, {  
      start: [100],
      tooltips: [wNumb({decimals: 0, suffix: '%'})],
  		pips: {mode: 'count', values: 3, density: 10, format: wNumb({decimals: 0, suffix: '%'})},
      range: {
          'min': 50,
          'max': 120
      }
  });


  slowDownSliderName.noUiSlider.on('set', function(value){
       setPlaySpeed(null, value/100);
  });

  audioSlider.noUiSlider.on('start', function (values, handle) {
    //alert("start");

      var turnAudioBackOn=false; //local flag to handle audio
      if (OneAudioPlayer.paused==false){ // audio is currently playing.
          OneAudioPlayer.pause(); // first pause the audio
          trunAudioBackOn = true;
      }
  });

  audioSlider.noUiSlider.on('update', function (values, handle) {
    if (handle === 1) {
      var audioPositionScreenLocation = 'APos' + Tune_ID;
      var durationScreenLocation = 'Dur' + Tune_ID;
      New_adjustAudioPosition(audioPositionScreenLocation, durationScreenLocation, values[1]);
      //New_setAudioPosition(Tune_ID, values[1]);
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
    } else if (handle === 2) {
          BeginLoopTime = values[0];
          EndLoopTime = values[2];
          OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
    } else if (handle === 1) {
          New_setAudioPosition(audioPositionScreenLocation, values[1]);
    }
    if (trunAudioBackOn){ // audio was  playing when they fiddled with the sliders
        OneAudioPlayer.play(); // then turn it back on
        trunAudioBackOn = false; // and reset the flag
    }

    //PreviousAudioID = audioID;

  });


}


function getURL() {
    var mp3url = "../mp3/air-tune-the.mp3";
    audioPlayer.innerHTML = createAudioPlayer();
    showPlayer.innerHTML = '<h4>Playing ' + mp3url + '</h4>';
    OneAudioPlayer.duration=100; //HACK
    showPlayer.innerHTML += createMP3player_experimental('playABC', mp3url, 'mp3player_tunepage');
    OneAudioPlayer.src = mp3url;
    createSlider('playPositionplayABC');


}
function reloadPage() {
    window.location.reload(true);
}

</script>
