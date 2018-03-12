---
layout: page
title: Note Tutor
permalink: /noteTutor/
---
Generate a set of Test Notes for ear training. These notes will be in the normal
session tune range for the fiddle.

<!-- Area to store generated ABC -->
<textarea id="ABCgenerated" style="display:none;"></textarea>

<!-- Controls for ABC player -->
<div id="ABCplayer"></div>

You can look at the dots for the Test Notes and generate a new practice set.

<form>
  <input type="button" value="Show Test Notes" onclick="toggle(this);">
</form>

<!-- Draw the dots -->
<div class="output">
  <div id="paper0" class="paper">
</div>
</div>

<!-- Show errors -->
<br>
<div id="warnings"></div>

<script type="text/javascript" src="{{ site.mp3_host }}/js/abcjs_editor_3.0-min.js"></script>

<script type="text/javascript">
function toggle(button) {
    switch (button.value) {
        case "Generate Test Notes":
            button.value = "Show Test Notes";
            document.getElementById('paper0').innerHTML = "";
            document.getElementById("paper0").style.height = "0px";  
            ABCgenerated.value = generateNotes(16);
            break;
        case "Show Test Notes":
            button.value = "Generate Test Notes";
            // Display the ABC in the textbox as dots
            abc_editor = new window.ABCJS.Editor("ABCgenerated", { paper_id: "paper0", midi_id:"midi", warnings_id:"warnings", indicate_changed: "true" });
            break;
    }
}

function generateNotes(count) {
    // Allow sharps, naturals and flats
    var Accidentals = ['^', '', '_'];
    // Notes on the fiddle in first position
    var Pitches = ['b', 'a', 'g', 'f', 'e',
                'd', 'C', 'B', 'A',
                'G', 'F', 'E', 'D',
                'C', 'B,','A,', 'G,'];

    // generate notes
    var i = 0;
    var accidental;
    var abcGenerated = 'X: 1\nT: Test Notes\nM: 4/4\nL: 1/8\nK: C\n|';

    while (i < count) {
        var rand=Math.random();
        if(rand > .9) {
            accidental = "^";
        } else if (rand < .1) {
            accidental = "_";
        } else {
            accidental = "";
        }
        var pitch = Pitches[Math.floor(Math.random()*Pitches.length)];
        // Ignore the high b sharp and low G flat
        if ((accidental == '^' && pitch == 'b') || (accidental == '_' && pitch == 'G,')) {
            continue;
        }
        // add test note and rests to abc
        abcGenerated += accidental + pitch + '8| z8 | z8 |'
        i++
        if (i % 4 == 0) {
            abcGenerated += '\n';
        }
    }
    return abcGenerated;
}

$(document).ready(function()
{
    // Generate an initial set of test notes
    ABCgenerated.value = generateNotes(16);

    // Create the ABC player
    ABCplayer.innerHTML = createABCplayer('generated', 'abcplayer_tunepage', '{{ site.defaultABCplayer }}');

    // One-liner to resume playback when user interacted with the page
    document.querySelector('button').addEventListener('click', function() {
        context.resume().then(() => {
            console.log('Playback button selected');
          });
      });
});
</script>
