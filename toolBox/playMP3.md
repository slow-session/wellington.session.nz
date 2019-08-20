---
layout: page
title: Play MP3
permalink: /playMP3/
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
And other formats might work as well.
</p>

<p>
Try it by copying and pasting this URL -> http://www.mandolincafe.net/mp3/hadj.mp3
</p>

URL: <input type="text" name="url" class="enter" value="" id="url" style="width: 400px;" >
<input type="button" class="filterButton" onclick="getURL()" value="Create Player">

</div>
</div>

<script>
function getURL() {

    var mp3url = document.getElementById("url").value;
    audioPlayer.innerHTML = createAudioPlayer();
    showPlayer.innerHTML = '<h4>Playing ' + mp3url + '</h4>';
    //showPlayer.innerHTML += createMP3player('playABC', mp3url, 'mp3player_tunepage');
    showPlayer.innerHTML += createMP3player('playABC', mp3url, 'mp3player_tunepage');
    createSlider('playPositionplayABC','RSplayABC');


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
