---
layout: page
title: Wellington Irish Session
permalink: /regularsession-new/
---
We meet on Tuesday nights from {{ site.session_time }} at the <a href="/dragon/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Experienced players of traditional Irish music are welcome. If you’re new in town or just visiting, we’d love to have you join us to play or just listen!

Many of the tunes that get played at the session are in the <a href="/tunes_archive/">Tunes Archive</a> page but other tunes that are firmly in the traditional mould are very welcome.

We believe that Irish traditional music played in a session can be a fantastic musical and social experience. We think that when there’s a very strong focus on traditional melody instruments playing traditional tunes we set the scene for great sessions.

Getting a great session humming requires some attention to certain ground rules. See our <a href="/regularguidelines/">Guidelines for the Wellington Irish Session</a> if you need more information.

Regular session tune of the week
--------

We often pick a tune for homework, and we'll play it sometime during the evening.

{% assign tuneID = 100 %}
{% assign sortedtunes = site.tunes | sort: 'regtuneoftheweek' | reverse %}
{% assign tune = sortedtunes.first %}
{% if tune.regtuneoftheweek %}
<fieldset>
<legend>Regular tune of the week:</legend>
<div class="row">
    <div class="small-5 columns">
        <span title="Go to Tunepage">
            <a href="{{ tune.url }}">{{ tune.title }}</a>
        </span>
    </div>
    <div class="small-3 columns">
        <input class="filterButton" type="button" onclick="changeTune({{ tuneID }});" value="Play Now" />
    </div>
    <div class="small-3 columns">
        {{ tune.key }} {{ tune.rhythm }}
    </div>
</div>
</fieldset>

<div class="row"></div>

<script>
tuneOfTheWeek = {
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
    },
};
</script>
{% endif %}

<br />

Recent regular session tunes of the week
--------

These are the <span id="tunesCount"></span> tunes we've been learning over the last couple of months.

<div class="row rowTuneTable">
  <div class="small-12 columns tunesTable" id="tunesTable"></div>
</div>

<script>
window.store = {
{% assign sortedtunes = site.tunes | sort: 'regtuneoftheweek' | reverse %}
{% assign tune_count = 0 %}
{% assign tuneID = 200 %}
{% for tune in sortedtunes %}
    {% if tune_count > 0 %}
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
        }{% if tune_count <= 9 %},{% else %}{% break %}{% endif %}
    {% endif %}
    {% assign tune_count = tune_count | plus: 1 %}
    {% assign tuneID = tuneID | plus: 1 %}
{% endfor %}
};

// Add tune of the week into the window.store
$.extend(window.store, tuneOfTheWeek);
</script>

<br />

Latest Tunes
------------

We add new tunes to the archive reasonably often - you can check those out in our <a href="/latest/"><button class="filterButton" style="display: inline;"> Latest Tunes</button></a> page.
These are the <span id="tunesCount"></span> tunes we've been learning over the last couple of months.

<script src="{{ site.js_host }}/js/lunr.min.js"></script>

<script src="{{ site.js_host }}/js/build_table_tunes_archive.js"></script>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    $("#tunes").tablesorter({headers: { 0:{sorter: 'ignoreArticles'}, 1:{sorter: false}, 2:{sorter: false}}});
});
</script>

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
