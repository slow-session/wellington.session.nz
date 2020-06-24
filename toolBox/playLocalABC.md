---
layout: page
title: Play Local ABC
permalink: /playLocalABC/
---
You can use this page to play an ABC file you've stored locally.


<textarea id="abc" style="display:none;"></textarea>
<!-- Area to store unrolled ABC -->
<textarea id="ABCprocessed" style="display:none;"></textarea>
<div class="output" style="max-width: 650px;">
    <div id="paper0" class="paper"></div>
</div>

<div class="player">
<div id="showPlayer" style="display:none;"></div>
</div>

<input type="file" id="files" class='filterButton' name="files[]" accept=".abc"/>

<output id="fileInfo"></output>

<script>
$(document).ready(function()
{
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }

	// Create the ABC player
	showPlayer.innerHTML = createABCplayer('processed', '{{ site.defaultABCplayer }}');

	// If the ABC changes get ready to play the revised ABC
	$('#abc').change(function() {
        processABCchange(abc);
	});
});

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

            // Show the player
            document.getElementById("showPlayer").style.display = 'block';

            // unroll the ABC for better playing
            ABCprocessed.value = preProcessABC(this.result);

            // stop tune currently playing if needed
            var playButton = document.getElementById("playABCprocessed");
            if (typeof playButton !== 'undefined'
                && playButton.className == "stopButton") {
                stopABC("ABCprocessed");
                playButton.className = "";
                playButton.className = "playButton";
            }
            
        };
        reader.readAsText(f);
    }
}

function processABCchange(abc) {
    // Unroll the ABC to make repeats work properly
    ABCprocessed.value = preProcessABC(abc.value);

    // Reset the filename for downloading
    document.getElementById("filename").innerHTML = slugify(getABCtitle(abc.value)) + '.abc';

    // Display the ABC in the textbox as dots
    abc_editor = new window.ABCJS.Editor("abc", { paper_id: "paper0", warnings_id:"warnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
}
</script>
