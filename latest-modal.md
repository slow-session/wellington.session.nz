---
layout: page
title: Latest Tunes
permalink: /latest-modal/
---
<span id="tunes-count"></span> recently added to the <a href="/tunes_archive/">Tunes Archive</a>.

<div class="row rowTuneTable">
  <div class="small-11 columns tuneTable" id="tuneTable"></div>
  <div class="small-1 columns tableSlider" id="tableSlider"></div>
</div>

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

<script>
    window.store = {

        {% assign sortedtunes = site.tunes | sort: 'date' | reverse %}
        {% assign tune_count = 0 %}
        {% assign tuneID = 200 %}
        {% for tune in sortedtunes %}
            {% if tune.tags contains 'cm' %}
                {% continue %}
            {% endif %}
            {% assign tune_count = tune_count | plus: 1 %}
            {% assign tuneID = tuneID | plus: 1 %}
            "{{ tuneID }}": {
                "title": "{{ tune.title | xml_escape }}",
                "tuneID": "{{ tuneID }}",
                "key": "{{ tune.key | xml_escape }}",
                "rhythm": "{{ tune.rhythm | xml_escape }}",
                "url": "{{ tune.url | xml_escape }}",
                "mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
                "mp3_source": "{{ tune.mp3_source | strip_html | xml_escape }}",
                "repeats": "{{ tune.repeats }}",
                "parts": "{{ tune.parts }}",
                "abc": {{ tune.abc | jsonify }}
            }{% if tune_count <= 14 %},{% else %}{% break %}{% endif %}
        {% endfor %}
    };
</script>

<script src="{{ site.js_host }}/js/lunr.min.js"></script>

<script src="{{ site.js_host }}/js/build_table_tunes_archive.js"></script>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    $("#tunes").tablesorter({headers: { 0:{sorter: 'ignoreArticles'}, 1:{sorter: false}, 2:{sorter: false}}});  

    createArchiveSlider('tableSlider');
    document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
});
</script>

<script>
// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

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
