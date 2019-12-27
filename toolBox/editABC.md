---
layout: page
title: Edit ABC
permalink: /editABC/
---

Use this sample as a template to edit or create your own ABC files.
A brief set of instructions is found <a href="/editingABC/">here.</a> If you'd like more information on the ABC format check out the
<a href="http://abcnotation.com/wiki/abc:standard:v2.1">ABC Notation</a>
guide.

If you want to add a new tune to the archive you can use the
[Create MD File](/createMD/) page to create the metadata needed.

<!-- Area to store unrolled ABC -->
<textarea id="ABCprocessed" style="display:none;"></textarea>

<!-- Area to store filename for download -->
<textarea id="filename" style="display:none;"></textarea>

<div class="row small-up-1 medium-up-2 large-up-2">
    <div class="small-7 columns">
        <!-- Draw the dots -->
        <div class="output">
            <div id="paper0" class="paper"></div>
        </div>

        <!-- Controls for ABC player -->
        <div id="ABCplayer"></div>
    </div>
    <div class="small-5 columns">
        <!-- Group the input and controls for ABC-->
        <h3>Edit this sample ABC:</h3>
        <!-- Read the modified ABC and play if requested -->
        <textarea name='abc' id="abc" rows="13" cols="55"
        style="background-color:#ebebeb; font-size:small; max-width:100%;"
        spellcheck="false">
X: 1
T: Kilglass Lakes
R: jig
C: John McEvoy
S: John McEvoy @ Ceol Aneas 2016
M: 6/8
L: 1/8
K: Dmaj
|:DED DFA|BAF d2e|faf ede|fdB AFE|
DED DFA|BAF d2e|faf ede|1 fdd d3 :|2 fdd d2 e ||
|:faa fbb|afe ~f3|faf dBA| (3Bcd B AFE|
DED DFA|BAF d2e|faf ede|1 fdd d2 e :|2 fdd d2 D ||
        </textarea>
        <!-- Show errors -->
        <div id='warnings'></div>

        <h3>Or load an ABC file:</h3>
        <input type="file" id="files" class='filterButton' name="files[]" accept=".abc"/>
        <output id="fileInfo"></output>
        <br />
        <br />
        <!-- Allow the user to save their ABC-->
        <h3>Don’t forget to ‘Download ABC’ to save your work</h3>
        <form>
            <span title="Download the ABC you've entered. Don't lose your work!">
                <input value='Download ABC' type='button' class='filterButton' onclick='downloadFile(document.getElementById("filename").value, document.getElementById("abc").value)' />
            </span>
        </form>
    </div>
</div>

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
	ABCplayer.innerHTML = createABCplayer('processed', '{{ site.defaultABCplayer }}');

    processABCchange(abc);

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

            // stop tune currently playing
            if (typeof playButtonprocessed !== 'undefined'
                && playButtonprocessed.className == "stopButton") {
                stopABC("ABCprocessed");
                playButtonprocessed.className = "";
                playButtonprocessed.className = "playButton";
            }

            // Load the new dots
            abc.value = this.result;

            processABCchange(abc);
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
