---
layout: page
title: Test ABC
permalink: /testABC/
---

Use this sample as a template to edit or create your own ABC files.
A brief set of instructions is found <a href="/editingABC/">here.</a> If you'd like more information on the ABC format check out the
<a href="http://abcnotation.com/wiki/abc:standard:v2.1">ABC Notation</a>
guide.

If you want to add a new tune to the archive you can use the
[Create MD File](/createMD/) page to create the metadata needed.

<!-- Area to store unrolled ABC -->
<textarea id="ABCprocessed" style="display:block;"></textarea>

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
        <br />
        <h3><b>Edit the ABC here:</b></h3>
        <!-- Read the modified ABC and play if requested -->
        <textarea name='abc' id="abc" rows="13" cols="55"
        style="background-color:#ebebeb; font-size:small; max-width:100%;"
        spellcheck="false">
X: 1
T: My Darling Asleep
R: jig
M: 6/8
L: 1/8
K: Dmaj
|:fdd cAA|BGG A2G|FAA def|gfg eaa|
fdd cAA|BGG A2G|FAA def|gec d3:|
FAA Add|FAA BGG|FAA def|gfg eaa|
fdd cAA|BGG A2G|FAA def|gec d3:|

X: 2
T: Saddle The Pony
R: jig
M: 6/8
L: 1/8
K: Gmaj
GBA G2 B | def gdB | GBA G2 B | AFD AFD |
GBA G2 B | def gfg | ege dBA | BAF G2 :|
efe edB | def gfg | ege edB | dBA ABd |
efe edB | def gfg | e/f/ge dBA | BAF G2 :|
        </textarea>
        <!-- Show errors -->
        <div id='warnings'></div>

        <!-- Allow the user to save their ABC-->
        <h3>Don’t forget to ‘Download ABC’ to save your work</h3>
        <form>
            <span title="Download the ABC you've entered. Don't lose your work!">
                <input value='Download ABC' type='button' class='filterButton' onclick='downloadFile(document.getElementById("filename").value, document.getElementById("abc").value)' />
            </span>
        </form>
    </div>
</div>


<script src="{{ site.js_host }}/js/webpage_tools.js"></script>

<script>
$(document).ready(function()
{
	// Create the ABC player
	ABCplayer.innerHTML = createABCplayer('processed', 'abcplayer_tunepage', '{{ site.defaultABCplayer }}');

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
    abc_editor = new window.ABCJS.Editor("abc", { paper_id: "paper0", warnings_id:"warnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
});
</script>
