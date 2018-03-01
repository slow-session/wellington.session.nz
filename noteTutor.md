---
layout: page
title: Note Tutor
permalink: /noteTutor/
---

Generate a set of notes for ear training. Notes will be in the normal tune range for the fiddle.

<!-- Group the input and controls for ABC-->
<fieldset style="display: inline-block; vertical-align: middle;">
    <legend>Edit the ABC here:</legend>

<!-- Read the modified ABC and play if requested -->
<textarea name='abc' id="abc" rows="13" cols="80" style="background-color: #ebebeb" spellcheck="false">
X: 1
T: Test Notes
R: reel
M: 4/4
L: 1/8
K: C
</textarea>

<!-- Area to store unrolled ABC -->
<textarea id="ABCprocessed" style="display:none;"></textarea>

<!-- Controls for ABC player -->
<div id="ABCplayer"></div>

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
    // Allow sharps, naturals and flats
    var Accidentals = ['^', '', '_'];
    // Notes on the fiddle in first position
    var Pitches = ['b', 'a', 'g', 'f', 'e',
                'd', 'C', 'B', 'A',
                'G', 'F', 'E', 'D',
                'C', 'B,','A,', 'G,'];
    abc.value += '|';

    // generate 16 bars worth of notes
    var i = 0;
    var accidental;
    while (i < 16) {
        var rand=Math.random();
        if(rand > .9) {
            accidental = "^";
        } else if (rand < .1) {
            accidental = "_";
        } else {
            accidental = "";
    }
        //var accidental = Accidentals[Math.floor(Math.random()*Accidentals.length)];
        var pitch = Pitches[Math.floor(Math.random()*Pitches.length)];
        // Ignore the high b sharp and low G flat
        if ((accidental == '^' && pitch == 'b') || (accidental == '_' && pitch == 'G,')) {
            continue;
        }
        // add test note and a rest to abc
        abc.value += accidental + pitch + '8| z8 | z8 |'
        i++
        if (i % 4 == 0) {
            abc.value += '\n';
        }
    }

	// Create the ABC player
	ABCplayer.innerHTML = createABCplayer('processed', 'abcplayer_tunepage', '{{ site.defaultABCplayer }}');

	// Get ready to play the initial ABC
	ABCprocessed.value = preProcessABC(abc.value);

	// Display the ABC in the textbox as dots
	abc_editor = new window.ABCJS.Editor("abc", { paper_id: "paper0", midi_id:"midi", warnings_id:"warnings", indicate_changed: "true" });
});

</script>
