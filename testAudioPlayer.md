---
layout: page
title: Test custom audio player
permalink: /testAudioPlayer/
---
<div class="player">
<div id="showPlayer">
    
<p>Testing custom audio player:
</p>

<p>
Playing -> http://www.mandolincafe.net/mp3/hadj.mp3
</p>

<audio id="Player_ID">
  <source src="http://www.mandolincafe.net/mp3/hadj.mp3" type="audio/mpeg"/>
</audio>

<div id="audioplayer" style="border: 1px solid black">
  <button id="pButton" class="play" onclick="playAudio(Player_ID)"></button>
    <div id="timeline">
        <div id="playhead"></div>
  </div>
  <div id="volume_control">
    <label id="rngVolume_label" for="rngVolume">Volume:</label>
    <input type="range" onchange="setVolume(this.value,Player_ID)" id="rngVolume" min="0" max="1" step="0.01" value="1">
  </div>
</div>

</div>
</div>







<script type="text/javascript" src="{{ site.mp3_host }}/js/audio_controls.js"></script>  

<script>
function playAudio(audioplayer) {
  if (audioplayer.paused) {
    audioplayer.play();
    pButton.className = "";
    pButton.className = "pause";
  } else {
    audioplayer.pause();
    pButton.className = "";
    pButton.className = "play";
  }
}
function setVolume(volume,audioplayer) {
   audioplayer.volume = volume;
}

var duration; // Duration of audio clip
var pButton = document.getElementById('pButton'); // play button

var playhead = document.getElementById('playhead'); // playhead

var timeline = document.getElementById('timeline'); // timeline
// timeline width adjusted for playhead
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;


Player_ID.addEventListener("timeupdate", timeUpdate, false);

function timeUpdate() {
    var playPercent = timelineWidth * (Player_ID.currentTime / duration);
    playhead.style.marginLeft = playPercent + "px";
    if (Player_ID.currentTime >= duration-.25) {
        Player_ID.currentTime=0;
    }
}


// Gets audio file duration
Player_ID.addEventListener("canplaythrough", function () {
    duration = Player_ID.duration;
}, false);

//Makes timeline clickable
timeline.addEventListener("click", function (event) {
	moveplayhead(event);
	Player_ID.currentTime = duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(e) {
	return (e.pageX - timeline.offsetLeft) / timelineWidth;
}


// Makes playhead draggable 
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that mouse is moved on mouseUp only when the playhead is released 
var onplayhead = false;
// mouseDown EventListener
function mouseDown() {
    onplayhead = true;
    window.addEventListener('mousemove', moveplayhead, true);
    Player_ID.removeEventListener('timeupdate', timeUpdate, false);
}
// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(e) {
    if (onplayhead == true) {
        moveplayhead(e);
        window.removeEventListener('mousemove', moveplayhead, true);
        // change current time
        Player_ID.currentTime = duration * clickPercent(e);
        Player_ID.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
}
// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(e) {
    var newMargLeft = e.pageX - timeline.offsetLeft;
    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
    }
}






function reloadPage() {
    window.location.reload(true); 
}
</script>


