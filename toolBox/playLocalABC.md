---
layout: page
title: Play Local ABC
permalink: /playLocalABC/
---
You can use this page to play an ABC file you've stored locally.

<input type="file" id="files" class='filterButton' name="files[]" accept=".abc"/>

<output id="fileInfo"></output>

<textarea id="abc" style="display:none;"></textarea>
<!-- Area to store unrolled ABC -->
<textarea id="ABCprocessed" style="display:none;"></textarea>
<div class="output" style="max-width: 650px;">
    <div id="paper0" class="paper"></div>
</div>

<div class="player">
<div id="showPlayer"></div>
</div>

<script>
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Is ABC file valid?
            if ((getABCheaderValue("X:", this.result) == '')
                || (getABCheaderValue("T:", this.result) == '')
                || (getABCheaderValue("K:", this.result) == '')) { fileInfo.innerHTML = "Invalid ABC file";
                return (1);
            }

            // Show the dots
            abc.value = this.result;
            // Display the ABC in the textbox as dots
            abc_editor = new window.ABCJS.Editor("abc", { paper_id: "paper0", warnings_id:"warnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });

            // set up player
            ABCprocessed.value = preProcessABC(this.result);

            // stop tune currently playing
            if (typeof playButtonprocessed !== 'undefined'
                && playButtonprocessed.className == "stopButton") {
                stopABC("ABCprocessed");
                playButtonprocessed.className = "";
                playButtonprocessed.className = "playButton";
            }   
            showPlayer.innerHTML = createABCplayer('processed', '{{ site.defaultABCplayer }}');
        };
        reader.readAsText(f);
    }
}

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    var fileInfo = document.getElementById('fileInfo');
    var showPlayer = document.getElementById('showPlayer');

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}
</script>
