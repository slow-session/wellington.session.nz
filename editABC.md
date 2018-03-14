---
layout: page
title: Edit ABC
permalink: /editABC/
---

Use this sample as a template to edit or create your own ABC files. Don't
forget to 'Download ABC' to save your work!

Check out this <a href="http://abcnotation.com/wiki/abc:standard:v2.1">ABC Notation</a>
guide if you need more information on the format.

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

<!-- Area to store filename for download -->
<textarea id="filename" style="display:none;"></textarea>

<!-- Controls for ABC player -->
<div id="ABCplayer"></div>

<!-- Allow the user to save their ABC-->
<form>
   <span title="Download the ABC you've entered. Don't lose your work!">      
  		<input value='Download ABC' type='button' onclick='downloadFile(document.getElementById("filename").value, document.getElementById("abc").value)' />
   </span>
</form>
</fieldset>


<!-- Draw the dots -->
<div class="output">
	<div id="paper0" class="paper"></div>
</div>

<!-- Show errors -->
<br />
<div id='warnings'></div>

<script type="text/javascript" src="{{ site.mp3_host }}/js/abcjs_editor_3.0-min.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/musical-ws.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/abc_controls.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/webpage_tools.js"></script>

<script type='text/javascript'>
$(document).ready(function()
{
	// Create the ABC player
	ABCplayer.innerHTML = createABCplayer('processed', 'abcplayer_tunepage', '{{ site.defaultABCplayer }}');

    // In Chrome/Opera/Firefox, an AudioContext must be created or resumed
    // after the document received a user gesture to enable audio playback.
    // See https://goo.gl/7K7WLu and also see /js/audioContext.js
    // This function only sets the necessary event listener if we're running
    // on a Chrome, Opera or Firefox browser
    audioResume('button');

	// Get ready to play the initial ABC
	ABCprocessed.value = preProcessABC(abc.value);

	// Set the filename for downloading
	document.getElementById("filename").innerHTML = slugify(getABCtitle(ABCprocessed.value)) + '.abc';

	// If the ABC changes get ready to play the revised ABC
	$('#abc').bind('input propertychange', function() {
		ABCprocessed.value = preProcessABC(abc.value);

		// Reset the filename for downloading
	    document.getElementById("filename").innerHTML = slugify(getABCtitle(ABCprocessed.value)) + '.abc';
	});

	// Display the ABC in the textbox as dots
	abc_editor = new window.ABCJS.Editor("abc", { paper_id: "paper0", midi_id:"midi", warnings_id:"warnings", indicate_changed: "true" });
});
</script>
