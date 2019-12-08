---
layout: page
title: Play Local Audio
permalink: /playLocalAudio/
---
You can use this page to slow down a number of audio and video formats and play parts of them in a loop. These types of file should work fine:

    .mp3, .m4a, .ogg, .wav

And other formats might work as well.

You can use tools like <a href="https://www.mediahuman.com/youtube-to-mp3-converter/">YouTube to MP3 Converter</a> to extract the audio from YouTube and Facebook videos and store MP3 files locally.


<input type="file" id="files" class='filterButton' name="files[]"  accept="audio/x-m4a, audio/mpeg, audio/ogg, audio/wav"/>

<output id="fileInfo"></output>

<div class="player">
<div id="audioPlayer"></div>
<div id="showPlayer"></div>
</div>

<script>
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.
    var fileInfo = document.getElementById('fileInfo');
    var audioPlayer = document.getElementById('audioPlayer');
    var showPlayer = document.getElementById('showPlayer');
    audioPlayer.innerHTML = createAudioPlayer();

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        if (f.type.indexOf('audio') == 0) {
            fileInfo.innerHTML = '<h2>' + f.name + '<h2>';
            showPlayer.innerHTML = '';
        } else {
            fileInfo.innerHTML = f.name + ' - unsupported file type';
            audioPlayer.innerHTML = '';
            showPlayer.innerHTML = '';
            continue;
        }       
        var reader = new FileReader();
        reader.onload = function(e) {
            //showPlayer.src = this.result;
            showPlayer.innerHTML = createMP3player('playABC', this.result);
            createSliders('playABC');
        };
        reader.readAsDataURL(f);
    }
}

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}
</script>
