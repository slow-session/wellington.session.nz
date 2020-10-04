---
layout: page
title: Play Local Audio
permalink: /playLocalAudio/
---
You can use this page to slow down a number of audio and video formats and play parts of them in a loop. These types of file should work fine:

<div class="showTextInfo">
.mp3, .m4a, .ogg, .wav
</div>

You can use tools like <a href="https://www.mediahuman.com/youtube-to-mp3-converter/">YouTube to MP3 Converter</a> to extract the audio from YouTube and Facebook videos and store MP3 files locally.

<span title="Supported file types: .mp3, .m4a, .ogg, .wav">
<input type="file" id="files" class='filterButton' name="files[]"  accept="audio/x-m4a, audio/mpeg, audio/ogg, audio/wav"/>
</span>

<output id="fileInfo"></output>

<div class="player">
<div id="audioPlayer"></div>
<div id="showPlayer"></div>
</div>

<script>
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}
</script>
