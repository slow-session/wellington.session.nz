---
layout: page
title: Play Local Audio
permalink: /playLocalAudio/
---
Play local MP3 files

<fieldset>
<input type="file" id="files" name="files[]"  accept="audio/mp3"/>
</fieldset>

<div class="row"></div>
<output id="fileInfo"></output>

<div class="player">
<div id="audioPlayer"></div>
<div id="showPlayer">

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
            audioPlayer.innerHTML = '';
            showPlayer.innerHTML = '';
            continue;
        }       
        var reader = new FileReader();
        reader.onload = function(e) {
            //showPlayer.src = this.result;
            showPlayer.innerHTML = createMP3player('playABC', this.result, 'mp3player_tunepage');
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


</div>
</div>
