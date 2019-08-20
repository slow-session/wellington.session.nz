---
layout: page
title: Learn a tune
permalink: /learn_a_tune/
---

<p>
Play a tune now using the <strong>Play</strong> button or use the
<strong>Tune Page</strong> button for a more traditional view.
</p>

<div class="row rowTuneTable">
  <div class="small-11 columns" id="tuneTable">
    <div id="tunes-table"></div>
  </div>
  <div class="small-1 columns tableSlider" id="tableSlider"></div>
</div>

<!-- Trigger/Open The Modal -->

<button id="myBtn"></button>

<!-- The Modal -->

<div id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
        <span class="close">×</span>
        <!-- *** Player controls *** -->
        <div id="tuneTitle"></div>
        <div id="tuneInfo"></div>
        <br />
        <div class="player">
            <div id="audioPlayer"></div>
            <div id="showPlayer"></div>
            <div id="userLoop"></div>
        </div>
        <!-- *** loop presets *** -->
        <form id="loopForm" style="display: none;">
            <input type="button" class="filterButton" value="Show Preset Loops" onclick="toggleLoops(this);">
        </form>
        <div id="loopPresetControls" style="display: none;">.</div>
        <!-- *** rendered ABC and tune selector scrolling table *** -->
        <form id="dotsForm" style="display: none;">
            <input type="button" class="filterButton" value="Show the Dots" onclick="toggleTheDots(this);">
        </form>
        <div class="outputABC">
        <div id="paper0" style="display: none;"></div>
        <div id='abcSource' style="display: none;">
            <textarea name='abcText' id="abcText"></textarea>
        </div>
    </div>
</div>

<div id="debug"></div>

<script>
    window.store = {

      {% assign tunes = site.tunes %}
      {% assign sortedtunes = tunes | sort: 'titleID' %}
      {% assign tuneID = 200 %}
      {% for tune in sortedtunes %}
        {% assign tuneID = tuneID | plus: 1 %}
        "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        "mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
        "repeats": "{{ tune.repeats }}",
        "parts": "{{ tune.parts }}",
        "abc": {{ tune.abc | jsonify }}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
</script>

<script src="{{ site.js_host }}/js/build_table_learn_a_tune.js"></script>

<script src="{{ site.js_host }}/js/audiotools.js"></script>

<script src="{{ site.js_host }}/js/audioplayer.js"></script>

<script>
  $(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    createArchiveSlider('tableSlider');
    document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
  });
</script>

<script>
// When the user clicks on <div>, open the popup
function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    if (OneAudioPlayer.paused == false) { // audio is currently playing.
        OneAudioPlayer.pause();
    }
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
      if (OneAudioPlayer.paused == false) { // audio is currently playing.
          OneAudioPlayer.pause();
      }
      modal.style.display = "none";
  }
}
</script>
