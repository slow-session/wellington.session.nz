---
layout: default
title: Edit ABC
permalink: /edit_abc/
navigation_weight: 20
---
<!-- Draw the dots -->
<div class="output">
	<div id="paper0" class="paper"></div>
</div>
    
<!-- Group the input and controls for ABC-->
<fieldset style="display: inline-block; vertical-align: middle;">
    <legend>Edit the ABC here:</legend>
    
<!-- Read the modified ABC and play if requested -->
<span title="Use this sample as a template to edit or create your own ABC files. Don't forget to 'Download ABC' to save your work!">      
<textarea name='abc' id="abc" rows="13" cols="50" style="background-color: #ebebeb" spellcheck="false">
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
</span>

<!-- Area to store unrolled ABC -->
<textarea id="processedABC" style="display:none;"></textarea>

<!-- Controls for ABC -->
<form onsubmit="return false" oninput="level.value = Math.round(flevel.valueAsNumber/3.2)">
    <span title="Play the ABC you've entered. You can slow down the playback using the Slider.">      
        <input type="button" value="Play ABC" id="play" onclick="processedABC.value=preProcessABC(abc.value);abcSliderChanged(RSM102.value,processedABC);">
        <input type="button" value="Stop" id="stop" onclick="stopABC(processedABC)">
        <input name="flevel" id="RSM102" type="range" min="160" max="384" value="320"       onchange="processedABC.value=preProcessABC(abc.value);abcSliderChanged(value,processedABC)">
        <output name="level">100</output>%
    </span>
    <br />    
    <!-- Allow the user to save their ABC-->
    <span title="Download the ABC you've entered. Don't lose your work!">      
        <input value='Download ABC' type='button' onclick='downloadABC(document.getElementById("abc").value)' />
    </span>
</form>
</fieldset>

<!-- Show errors -->
<br />
<div id='warnings'></div>
    
<script type="text/javascript" src="/js/abcjs_editor_2.3-min.js"></script>
<script type="text/javascript" src="/js/musical-ws.js"></script>
<script type="text/javascript" src="/js/abc_controls.js"></script> 
<script type='text/javascript'>

function downloadABC(text) {
    var pom = document.createElement('a');
    pom.setAttribute(
        'href',
        'data:application/download;charset=utf-8,' + encodeURIComponent(text)
    );
    pom.setAttribute('download', "edited.abc");

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

$(document).ready(function() 
{
    abc_editor = new window.ABCJS.Editor("abc", { paper_id: "paper0", midi_id:"midi", warnings_id:"warnings", indicate_changed: "true" });
});
</script>


