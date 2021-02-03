---
layout: page
title: Play Local ABC
permalink: /playLocalABC/
---
You can use this page to play an ABC file you've stored locally.

<textarea id="textAreaABC" style="display:none;"></textarea>

<div class="output">
    <div id="abcPaper" class="abcPaper"></div>
    <div id="abcAudio"></div>
</div>

<div class="player">
<!-- hide the player until we've loaded some dots -->
<div id="pageABCplayer" style="display:none;"></div>
</div>

<input type="file" id="files" class='filterButton' name="files[]" accept="text/vnd.abc,.abc"/>

<output id="fileInfo"></output>

<script>

document.addEventListener("DOMContentLoaded", function (event) {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
});

function handleABCFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Is ABC file valid?
            if ((wssTools.getABCheaderValue("X:", this.result) == '')
                || (wssTools.getABCheaderValue("T:", this.result) == '')
                || (wssTools.getABCheaderValue("K:", this.result) == '')) { fileInfo.innerHTML = "Invalid ABC file";
                return (1);
            }

            audioPlayer.displayABC(this.result);
            
        };
        reader.readAsText(f);
    }
}
</script>
