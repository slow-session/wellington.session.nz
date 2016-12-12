---
layout: page
title: Play MP3
permalink: /playMP3/
---
<div class="player">
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
And other formats might work as well.
</p>

<p>
Try it by copying and pasting this URL -> http://www.mandolincafe.net/mp3/hadj.mp3
</p>
  
URL: <input type="text" name="url" class="enter" value="" id="url" style="width: 400px;" >
<input type="button" onclick="getURL()" value="Create Player">
    


</div>
</div>

<script type="text/javascript" src="{{ site.mp3_host }}/js/audio_controls.js"></script>  

<script>
function createMP3player(mp3url) {
    
    var tunesTable = document.getElementById('showPlayer');
    
    var mp3player = '';
    var tuneID = 4000;
    
    // Show title
    mp3player += '<h4>Playing: ' + mp3url + '</h4><br />';
    // build the audio player for each tune  
    mp3player += '<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';        
    mp3player += '<audio id="A' + tuneID + '" title="' + mp3url + '" controls loop preload="none" style="width: 60%;">';
    mp3player += ' <source src="' + mp3url + '" type="audio/mpeg"></audio>';
    // build the slow down slider for each tune
    mp3player += '<span title="Adjust playback speed with slider">';
    mp3player += '<input name="flevel" id="RS' + tuneID + '"';
    mp3player += ' type="range" min="50" max="120" value="100"';
    mp3player += ' onchange="setPlaySpeed(A' + tuneID + ', value/100)" style="width: 30%;vertical-align:25%;">';
    mp3player += '<output name="level" style="vertical-align:25%;">100</output><span style="vertical-align:25%;">%</span>';
    mp3player += '</span>';
    // build the loop mechanism for each tune
    mp3player += '<br /><div style="padding-left: 100px;">'; 
    mp3player += '<span title="Play tune, select loop starting point, then select loop end point">';
    mp3player += '<input type="button" id="B1' + tuneID + '" value="Loop Start" onclick="SetPlayRange(A' + tuneID + ',0,B1' + tuneID + ', B2' + tuneID + ')">';
    mp3player += '<input type="button" id="B2' + tuneID + '" value=" Loop End " onclick="SetPlayRange(A' + tuneID + ',1,B1' + tuneID + ', B2' + tuneID + ')">';
    mp3player += '<input type="button" value="Reset" onclick="SetPlayRange(A' + tuneID + ',2,B1' + tuneID + ',B2' + tuneID + ')">';
    mp3player += '</span></div>';          
    mp3player += '</form>';
    
    mp3player += '<br /><br /><input type="button" onclick="reloadPage()" value="Get New URL">';
    
    showPlayer.innerHTML = mp3player;
    
}

function getURL() {
    var mp3url = document.getElementById("url").value;
    createMP3player(mp3url);
    
}
function reloadPage() {
    window.location.reload(true); 
}
</script>


