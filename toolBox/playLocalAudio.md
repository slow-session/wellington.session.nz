---
layout: page
title: Play Local Audio
permalink: /playLocalAudio/
---
Use this to play local MP3 files.

<input type="file" id="files" name="files[]"  accept="audio/mp3"/>
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
            showPlayer.innerHTML = '';
            fileInfo.innerHTML = '<h2>Playing ' + f.name + '</h2>';
        } else {
            audioPlayer.innerHTML = '';
            showPlayer.innerHTML = '';
            fileInfo.innerHTML = '<h2>' + f.name + ' is not a supported audio file</h2>';
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

<style>
.example {
  padding: 10px;
  border: 1px solid #ccc;
}
#drop_zone {
  border: 2px dashed #bbb;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  padding: 25px;
  text-align: center;
  font: 20pt bold 'Vollkorn';
  color: #bbb;
}
.thumb {
  height: 75px;
  border: 1px solid #000;
  margin: 10px 5px 0 0;
}
#progress_bar {
  margin: 10px 0;
  padding: 3px;
  border: 1px solid #000;
  font-size: 14px;
  clear: both;
  opacity: 0;
  -o-transition: opacity 1s linear;
  -moz-transition: opacity 1s linear;
  -webkit-transition: opacity 1s linear;
  -ms-transition: opacity 1s linear;
}
#progress_bar.loading {
  opacity: 1.0;
}
#progress_bar .percent {
  background-color: #99ccff;
  height: auto;
  width: 0;
}
#byte_content {
  margin: 5px 0;
  max-height: 100px;
  overflow-y: auto;
  overflow-x: hidden;
}
#byte_range {
  margin-top: 5px;
}
</style>
