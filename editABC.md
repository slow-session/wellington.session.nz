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
<textarea id="ABCprocessed" style="display:none;"></textarea>

<!-- Controls for ABC player -->
<div id="ABCplayer"></div>

<!-- Allow the user to save their ABC-->
<form>
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
	// Play the initial ABC
	ABCprocessed.value = preProcessABC(abc.value);
	ABCplayer.innerHTML = createABCplayer('processed');

	// If the ABC changes get ready to play the new tune
	$('#abc').bind('input propertychange', function() {
		ABCprocessed.value = preProcessABC(abc.value);
		ABCplayer.innerHTML = createABCplayer('processed');
	});

	// Display the ABC in the textbox
	abc_editor = new window.ABCJS.Editor("abc", { paper_id: "paper0", midi_id:"midi", warnings_id:"warnings", indicate_changed: "true" });
});
</script>
