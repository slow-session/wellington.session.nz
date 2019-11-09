---
layout: page
title: Play Local ABC
permalink: /playLocalABC/
---
You can use this page to play an ABC file you've stored locally.

<fieldset>
<input type="file" id="files" name="files[]" accept=".abc"/>
</fieldset>

<div class="row"></div>
<br />

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
            abc.value = this.result;
            // Display the ABC in the textbox as dots
            abc_editor = new window.ABCJS.Editor("abc", { paper_id: "paper0", warnings_id:"warnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });

            ABCprocessed.value = preProcessABC(this.result);            
            if (showPlayer.innerHTML.includes("playABC")) {
                // already loaded a tune which might be playing
                stopABC("ABCprocessed");
            }
            showPlayer.innerHTML = createABCplayer('processed', 'abcplayer_tunepage', '{{ site.defaultABCplayer }}');
        };
        reader.readAsText(f);
    }
}

// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    var showPlayer = document.getElementById('showPlayer');

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}
</script>
