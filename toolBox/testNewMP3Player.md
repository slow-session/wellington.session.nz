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


<style>
.noUi-handle {
  border: 1px solid #D9D9D9;
  border-radius: 3px;
  background: #455;
  cursor: default;
  box-shadow: inset 0 0 1px #FFF, inset 0 1px 7px #EBEBEB, 0 3px 6px -3px #BBB;
}
</style>
<script>
/*
//<audio id="audio" preload="none" src="../mp3/air-tune-the.mp3"></audio>
  // Show loading animation.
  var playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Automatic playback started!
      // Show playing UI.
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
    });
  }
*/
</script>


<script>

function getURL() {
    var mp3url = "../mp3/banshee.mp3";
    audioPlayer.innerHTML = createAudioPlayer();
    showPlayer.innerHTML = '<h4>Playing ' + mp3url + '</h4>';
    showPlayer.innerHTML += createMP3player_experimental('playABC', mp3url, 'mp3player_tunepage');
    OneAudioPlayer.src = mp3url;
    createSlider('playPositionplayABC', 'RSplayABC');
    //OneAudioPlayer.pause();

}
function reloadPage() {
    window.location.reload(true);
}

</script>
<style>
.h-1-color {background: #455;}
.h-2-color {background: #1A1;}
.h-3-color {background: #455;}
</style>
