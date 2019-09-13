---
layout: page
title: Charlie Montgomery
permalink: /cugeenben/
---

<div class="row">
<img alt="Charlie Montgomery" src="/images/charliemontgomery.jpg" style="border:1px solid black;display:inline;float:left;margin:10px;vertical-align:middle;">
<p>Charlie Montgomery is a traditional fiddle player from Co Fermanagh who now lives in Auckland, New Zealand. He has been an inspiration for many years to people in New Zealand who have had the privilege of hearing him play. Charlie has also composed many tunes and you can find them on this page as well as him playing some old favourites.
</p>
<p>
We'd like to thank Charlie very much for giving us the privilege of being able to post these recordings and we hope you'll enjoy listening and learning these tunes from his playing.
</p>
</div>

Go to the Tune Page by selecting the link in the first column or play a tune now using the <strong>Play Now</strong> button.

{% include tunes-filter-variables.html %}

<fieldset>
    <legend>Select from the Tunes Archive:</legend>    
    <form id="wellington" method="get">
        <br />
        <span title="Filter the Tunes Archive for tunes by title or by type such as 'Reel', 'Jig', 'Polka'.">  
        <input type="text" id="title-box" name="title" placeholder='Search'
            value='' onkeydown="enable_button()">
        &emsp;
        <select id="rhythm-box" name="rhythm"  onChange="enable_button()">
            <option value="">All Rhythms</option>
            {% for rhythm in rhythms %}
            {% if rhythm != '' %}
            <option value="{{ rhythm }}">{{ rhythm | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
        </span>    
        &emsp;
        <span title="Run the filter with the default settings to see the whole list">
        <input class="filterButton filterDisabled" id="submit_button" type="submit" name="submit" value="Select" disabled>
        </span>      
        <div class="popup filterButton" onclick="helpFunction()">
        Help
            <span class="popuptext" id="helpPopup">
                Run the filter with the default settings to see the whole list
            </span>
        </div>
    </form>
    <p></p>
    <div id="tunes-count"></div>
</fieldset>

<div class="row rowTuneTable">
  <div class="small-11 columns tuneTable" id="tuneTable"></div>
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
        {% if tune.tags contains 'cm' %}
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
        }{% unless forloop.last %},{% endunless %}
        {% endif %}
      {% endfor %}
    };
</script>

<script src="{{ site.js_host }}/js/lunr.min.js"></script>
<script src="{{ site.js_host }}/js/build_table_tunes_archive.js"></script>


<script>
  $(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* Set initial sort order */
    $.tablesorter.defaults.sortList = [[0,0]];

    $("#tunes").tablesorter({headers: { 0:{sorter: 'ignoreArticles'}, 1:{sorter: false}, 2:{sorter: false}}});  

    createArchiveSlider('tableSlider');
    document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
  });
</script>

<script>
// When the user clicks on <div>, open the popup
function helpFunction() {
  var popup = document.getElementById("helpPopup");
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
