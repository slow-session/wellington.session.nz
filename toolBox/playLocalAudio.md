---
layout: page
title: Play Local Audio
permalink: /playLocalAudio/
---
You can use this page to slow down a number of audio and video formats and play parts of them in a loop. These types of file should work fine:

<div class="showTextInfo">
.mp3, .m4a, .ogg, .wav
</div>

And other formats might work as well.

You can use tools like <a href="https://www.mediahuman.com/youtube-to-mp3-converter/">YouTube to MP3 Converter</a> to extract the audio from YouTube and Facebook videos and store MP3 files locally.

<input type="file" id="files" class='filterButton' name="files[]"  accept="audio/x-m4a, audio/mpeg, audio/ogg, audio/wav"/>

<output id="fileInfo"></output>

{% include audioPlayerControls.html %}

<script>
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('files').addEventListener('change', handleAudioFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function handleAudioFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let files = evt.target.files; // FileList object.
    let fileInfo = document.getElementById('fileInfo');
    let pageMP3player = document.getElementById('pageMP3player');

    // files is a FileList of File objects. List some properties.
    for (let i = 0, f; f = files[i]; i++) {      
        let reader = new FileReader();
        reader.onload = function(e) {
            if (this.result.includes('audio')) {
                fileInfo.innerHTML = `<h2>${f.name}<h2>`;
                // last parameter is null as we've no preset loop info in a window.store structure
                audioPlayer.displayMP3player(pageMP3player, '1', this.result, null);
            } else {
                fileInfo.innerHTML = `<h2>${f.name} - unsupported file type`;
                pageMP3player.innerHTML = '';
            }       
        };
        reader.readAsDataURL(f);
    }
}
</script>
