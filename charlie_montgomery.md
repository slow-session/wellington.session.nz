---
layout: page
title: Charlie Montgomery
permalink: /charlie_montgomery/
---
<div class="row small-up-1 medium-up-2 large-up-2">
<div class="small-4 columns">
<img class="charliepic" alt="Charlie Montgomery" src="/images/charliemontgomery.jpg">
</div>
<div class="small-8 columns">
<p>
Charlie Montgomery is a traditional fiddle player from Co Fermanagh who has lived in Auckland, New Zealand for over 60 years. He has been an inspiration for many years to people in New Zealand who have had the privilege of hearing him play. Charlie has also composed many tunes and you can find them on this page as well as him playing some old favourites.
</p>
<p>
We'd like to thank Charlie very much for giving us the privilege of being able to post these recordings. We hope you'll enjoy listening and learning these tunes from his playing.
</p>
</div>
</div>

<hr style="margin-top:10px;margin-bottom:10px;" />

<p>Go to the Tune Page by selecting the link in the first column or play a tune now using the <strong>Play Now</strong> button.</p>

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
    Displaying <span id="tunesCount"></span> tunes
    <p></p>
    Charlie's compositions tagged with <strong>*</strong>
</fieldset>


<div class="row rowTuneTable">
  <div class="small-11 columns tunesTable" id="tunesTable"></div>
  <div class="small-1 columns tableSlider" id="tableSlider"></div>
</div>

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

{% include tuneModal.html%}

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
</script>
