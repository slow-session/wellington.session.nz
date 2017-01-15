---
layout: default
title: Edit ABC
permalink: /editABC/
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
<textarea name='abc' id="abc" rows="13" cols="80" style="background-color: #ebebeb" spellcheck="false">
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
<form onsubmit="return false" oninput="level.value = flevel.valueAsNumber">
	<span title="Play the ABC you've entered. You can slow down the playback using the Slider.">      
		<div class="audioplayer">
			<button id="pButton" class="playButton"
				onclick="processedABC.value=preProcessABC(abc.value);playABC(processedABC, pButton, playPosition, RSABC.value), APos">
				<div id="APos" class="audioPos">0.0</div>
			</button>
			<input name="playPosition" id="playPosition" type="range" class="audio_control" min="0" max="400" value="0"
				oninput="setABCPosition(value/100)" />
			<div class="speed_control">
				<input name="flevel" id="RSABC" type="range" min="50" max="120" value="100"
					onchange="changeABCspeed(processedABC, pButton, value)">
				<output name="level">100</output>%
			</div>
		</div>
	</span>
	<p class="clear"></p>
   <!-- Allow the user to save their ABC-->
   <span title="Download the ABC you've entered. Don't lose your work!">      
  		<input value='Download ABC' type='button' onclick='downloadABC(document.getElementById("abc").value)' />
   </span>
</form>
</fieldset>

<!-- Show errors -->
<br />
<div id='warnings'></div>

<script type="text/javascript" src="{{ site.mp3_host }}/js/abcjs_editor_3.0-min.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/musical-ws.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/abc_controls.js"></script>
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
    abc.editor = new ABCJS.Editor("abc", { paper_id: "paper0", midi_id:"midi", warnings_id:"warnings", indicate_changed: "true" });
});
</script>
