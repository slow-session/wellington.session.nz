---
layout: page
title: Edit ABC
permalink: /editABC/
---

Use this sample as a template to edit or create your own ABC files.
A brief set of instructions is found <a href="/editingABC/">here.</a> If you'd like more information on the ABC format
check out the
<a href="http://abcnotation.com/wiki/abc:standard:v2.2">ABC Notation</a>
guide.

If you want to add a new tune to the archive you can use the
[Create MD File](/createMD/) page to create the metadata needed.

<div class="row">
    <!-- Draw the dots -->
    <div class="output">
        <div id="abcPaper" class="abcPaper"></div>
    </div>

    <!-- Controls for ABC player -->
    <div id="ABCplayer"></div>
</div>
<div class="row">
    <!-- Group the input and controls for ABC-->
    <h3>Load an ABC file:</h3>
    <input type="file" id="files" class='filterButton' name="files[]" accept=".abc" />
    <output id="fileInfo"></output>
    <p />
</div>
<div class="row">
    <h3>Or edit this sample ABC:</h3>
    <!-- Read the modified ABC and play if requested -->
    <textarea name='abc' id="textAreaABC" class="abcText" rows="13" spellcheck="false">
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
    <!-- Show ABC errors -->
    <div id='warnings'></div>
</div>
<div class="row">
    <!-- Allow the user to save their ABC-->
    <h3>Don’t forget to ‘Download ABC’ to save your work:</h3>
    <form>
        <span title="Download the ABC you've entered. Don't lose your work!">
            <input value='Download ABC' type='button' class='filterButton'
                onclick='downloadABCFile(document.getElementById("textAreaABC").value)' />
        </span>
    </form>
    <p />
</div>

<script>
$(document).ready(function () {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
    
    // Display the ABC in the textbox as dots
    let abc_editor = new window.ABCJS.Editor("textAreaABC", { paper_id: "abcPaper", warnings_id:"abcWarnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
    
    // Create the ABC player
    ABCplayer.innerHTML = createABCplayer('textAreaABC', '1', '{{ site.defaultABCplayer }}');  
    createABCSliders("textAreaABC", '1');
 
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
            if ((getABCheaderValue("X:", this.result) == '')
                || (getABCheaderValue("T:", this.result) == '')
                || (getABCheaderValue("K:", this.result) == '')) { fileInfo.innerHTML = "Invalid ABC file";
                return (1);
            }

            // Show the dots
            textAreaABC.value = this.result; 
            
            // Display the ABC in the textbox as dots
            let abc_editor = new window.ABCJS.Editor("textAreaABC", { paper_id: "abcPaper", warnings_id:"abcWarnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
            
            // stop tune currently playing if needed
            var playButton = document.getElementById("playABC1");
            if (typeof playButton !== 'undefined'
                && playButton.className == "stopButton") {
                stopABCplayer();
                playButton.className = "";
                playButton.className = "playButton";
            }
        };
        reader.readAsText(f);
    }
}
</script>
