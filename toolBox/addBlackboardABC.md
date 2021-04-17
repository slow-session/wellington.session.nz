---
layout: page
title: Add Blackboard ABC
permalink: /addBlackboardABC/
---
Check the output to make sure it's OK and hand tweak the w: lines in the ABC if you need to.

<div class="row">
    <h3>Load an ABC file:</h3>
    <input type="file" id="files" class='filterButton' name="files[]" accept=".abc" />
    <output id="fileInfo"></output>
    <p />
</div>
<div class="row">
    <h3>Or paste your ABC here:</h3>
    <!-- Read the modified ABC and play if requested -->
    <textarea name='abc' id="textAreaABC" class="abcText" rows="13" spellcheck="false">
    </textarea>
    <!-- Show ABC errors -->
    <div id='warnings'></div>
</div>
<div class="row">
    <!-- Draw the dots -->
    <div class="output">
        <div id="abcPaper" class="abcPaper"></div>
        <div id="abcAudio"></div>
    </div>

    <!-- Controls for ABC player -->
    <div id="pageABCplayer"></div>
</div>
<!-- Group the input and controls for ABC-->
<div class="row">
<!-- Add the Blackboard ABC-->
    <h3>Add the Blackboard ABC:</h3>
    <form>
        <input value='Add Blackboard ABC' type='button' class='filterButton'
            onclick='addBlackboardABC(document.getElementById("textAreaABC").value)' />
    </form>
    <p />
</div>
<div class="row">
    <textarea name='abc' id="textAreaABCplus" class="abcText" rows="13" spellcheck="false"></textarea>
</div>
<div class="row">
    <!-- Allow the user to save their ABC-->
    <h3>Don’t forget to ‘Download ABC’ to save your work:</h3>
    <form>
        <span title="Download the ABC you've entered. Don't lose your work!">
            <input value='Download ABC' type='button' class='filterButton'
                onclick='wssTools.downloadABCFile(document.getElementById("textAreaABCplus").value)' />
        </span>
    </form>
    <p />
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
                audioPlayer.stopABCplayer();
                audioPlayer.displayABC(this.result);
            } else {
                fileInfo.innerHTML = '<h2>Invalid ABC file - missing "X:", "T:", "K:" fields</h2>';
                abcPaper.innerHTML = '';
                abcPaper.style.paddingBottom = "0px";
                abcPaper.style.overflow = "auto";
                abcAudio.innerHTML = '';
            }
        };
        reader.readAsText(f);
    }
}
function addBlackboardABC(abcText) {
    // strip out I: and V: lines
    abcText = abcText.match(/^(?![IV]:).+$/gm).join('\n');
    
    // add the header to the output textarea
    textAreaABCplus.value = getHeader(abcText) + '\n';;
    
    // process the notes
    let notes = getNotes(abcText);
    let lines = notes.split(/[\r\n]+/).map(line => line.trim());
    lines.forEach (addTextToLine);
    
    // Display the ABC in the textbox as dots
    let abcEditor = new window.ABCJS.Editor("textAreaABCplus", {
        paper_id: "abcPaper", 
        warnings_id:"abcWarnings", 
        render_options: {responsive: 'resize'}, 
        indicate_changed: "true", 
        synth: { el: "#abcAudio", options: {
                displayLoop: true,
                displayRestart: true,
                displayPlay: true,
                displayProgress: true,
                displayWarp: true
            }
        }
    });
}

function addTextToLine(value) {
    // copy an ABC line to the line we're going to add
    let wLine = value;

    // if there's already a w: line we'll discard it
    if (wLine.match(/w:/)) {
        return;
    }

    // strip out the note lengths
    wLine = wLine.replace(/\d+/g, '');
    // strip out the grace notes
    wLine = wLine.replace(/{[A-Ga-g]}/g, '');
    // strip out the chords
    wLine = wLine.replace(/".*?"/g, '');
    wLine = wLine.replace(/!.*?!/g, '');
    // strip the accidentals and other meta chars
    wLine = wLine.replace(/[\^=_\/\,~:(%]/g, '');

    // split the line into single tokens
    wLine = wLine.split('').join(' ');
    // remove double spaces
    wLine = wLine.replace(/\s\s+/g, ' ');

    // fix double stops
    wLine = wLine.replace(/\[ ([A-Za-z]) ([A-Za-z]) \]/g, '$1$2');

    // uppercase the higher octave notes
    wLine = wLine.replace(/[a-g]/g, "$&'").toUpperCase();
    
    // add the notes to the output textarea
    textAreaABCplus.value += value + '\nw: ' + wLine + '\n';
}

const KEY_LINE_PATTERN = /^\s*K:/;

/** 
 * Extract the header from an ABC tune string, matching lines up to 
 * and including key specification.  Gracefully assume presence of X and T
 * fields.
 * http://abcnotation.com/wiki/abc:standard:v2.1#tune_header_definition
 */
function getHeader(tuneABC) {
    const lines = tuneABC.split(/[\r\n]+/).map(line => line.trim());
    const keyIdx = lines.findIndex(line => line.match(KEY_LINE_PATTERN));
    if (keyIdx < 0) {
        return '';
    } else {
        return lines.splice(0, keyIdx + 1).join('\n').trim();
    }
}

/** Extract the notes from an ABC tune string, by removing the header. */
function getNotes(tuneABC) {
    const lines = tuneABC.split(/[\r\n]+/).map(line => line.trim());
    const keyIdx = lines.findIndex(line => line.match(KEY_LINE_PATTERN));
    return lines.splice(keyIdx + 1, lines.length).join('\n').trim();
}
</script>
