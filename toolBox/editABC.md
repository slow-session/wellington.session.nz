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

You can also use the editABC Web App at <a href="https://editabc.session.nz">editabc.session.nz</a>

If you want to add a new tune to the archive you can use the
[Create MD File](/createMD/) page to create the metadata needed.

<div class="row">
    <!-- Draw the dots -->
    <div id="abcPaper" class="abcPaper"></div>
    <div id="abcAudio"></div>
    <!-- Show ABC errors -->
    <div id='abcWarnings'></div>
</div>
<!-- Group the input and controls for ABC-->
<div class="row">
    <h3>Load an ABC file:</h3>
    <input type="file" id="files" class='filterButton' name="files[]" accept="text/vnd.abc,.abc" />
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
</div>
<div class="row">
    <!-- Allow the user to save their ABC-->
    <h3>Don’t forget to ‘Download ABC’ to save your work:</h3>
    <span title="Download the ABC you've entered. Don't lose your work!">
        <button class='filterButton' 
        onclick='wssTools.downloadABCFile(document.getElementById("textAreaABC").value)'>Download ABC</button>
    </span>
</div>

<script>

document.addEventListener("DOMContentLoaded", function (event) {
    // Check for the various File API support.
    var fileInfo = document.getElementById('fileInfo');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('files').addEventListener('change', handleABCFileSelect, false);
    } else {
        fileInfo.innerHTML = 'The File APIs are not fully supported in this browser.';
    }
    audioPlayer.displayABC(textAreaABC.value);
});

function handleABCFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // the ABC file should have "X:", "T:", "K:" fields to be valid
            if (this.result.match(/[XTK]:/g).length >= 3) {
                // Show the dots
                fileInfo.innerHTML = '';
                textAreaABC.value = this.result + "\n";
                audioPlayer.stopABCplayer();
                audioPlayer.displayABC(textAreaABC.value);
            } else {
                fileInfo.innerHTML = '<h2>Invalid ABC file - missing "X:", "T:", "K:" fields</h2>';
            }
        };
        reader.readAsText(f);
    }
}
</script>
