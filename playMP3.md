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

<script type="text/javascript" src="{{ site.mp3_host }}/js/audioplayer.js"></script>

<script>
function createMP3player(mp3url) {

    var tunesTable = document.getElementById('showPlayer');

    var mp3player = '';
    var tuneID = 4000;

    // Show title

    mp3player += '<h4>Playing: ' + mp3url + '</h4><br />';
    // build the audio player for each tune  

    mp3player += '   <form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">';
    mp3player += '      <!-- declare an Audio Player for this page-->';
    mp3player += '      <audio id="OneAudioPlayer" loop>';
    mp3player += '         <source id="mp3Source" type="audio/mp3"></source>';
    mp3player += '         Your browser does not support the audio format.';
    mp3player += '      </audio>';
    mp3player += '      <div id="audioplayer' + tuneID + '" class="audioplayer">';
    mp3player += '         <button id="pButton' + tuneID + '" class="playButton"';
    mp3player += '            onclick="playAudio(audioplayer' + tuneID + ', pButton' + tuneID + ',  playPosition' + tuneID + ', \'' + mp3url + '\', APos' + tuneID + ')">';
    mp3player += '            <div id="APos' + tuneID + '" class="audioPos">0.0</div>';
    mp3player += '         </button>';
    mp3player += '         <input name="playPosition' + tuneID + '" id="playPosition' + tuneID + '" type="range" class="audio_control" min="0" max="400" value="0"';
    mp3player += '            oninput="setAudioPosition(value/100)" />';
    mp3player += '         <div id="speed_control' + tuneID + '" class="speed_control">';
    mp3player += '            <span title="Adjust playback speed with slider">';
    mp3player += '               <input name="flevel" id="RS' + tuneID + '" type="range" min="50" max="120" value="100"';
    mp3player += '                  onchange="setPlaySpeed(audioplayer' + tuneID + ', value/100)" />';
    mp3player += '               <output name="level">100</output>%';
    mp3player += '            </span>';
    mp3player += '         </div>';
    mp3player += '         <div class="loop_control">';
    mp3player += '            <span title="Play tune, select loop starting point, then select loop end point">';
    mp3player += '               <input type="button" id="B1' + tuneID + '" value="Loop Start"';
    mp3player += '                  onclick="SetPlayRange(audioplayer' + tuneID + ',0,B1' + tuneID + ', B2' + tuneID + ')" />';
    mp3player += '               <input type="button" id="B2' + tuneID + '" value=" Loop End "';
    mp3player += '                  onclick="SetPlayRange(audioplayer' + tuneID + ',1,B1' + tuneID + ', B2' + tuneID + ')" />';
    mp3player += '               <input type="button" value="Reset"';
    mp3player += '                  onclick="SetPlayRange(audioplayer' + tuneID + ',2,B1' + tuneID + ', B2' + tuneID + ')" />';
    mp3player += '            </span>';
    mp3player += '         </div>';
    mp3player += '      </div>';
    mp3player += '   </form>';
    mp3player += '<p class="clear"> </p><input type="button" onclick="reloadPage()" value="Get New URL">';

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
