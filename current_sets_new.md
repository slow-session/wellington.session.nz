---
layout: page
title: Current Sets
permalink: /current_sets_new/
---

These are the some of the sets we play at the Wellington Slow Session. These sets will get played regularly so if you know these you'll get a chance to play them.

If you don't find the set you're looking for you can put tunes together and try them out using our <button class="filterButton" onclick="window.location.href = '/build_a_set/';">Build a Set</button>
page.

{% assign tune_rhythms = '' %}
{% for tune in site.tunes %}
{% assign tune_rhythms = tune_rhythms | append: tune.rhythm %}
{% unless forloop.last %}
{% assign tune_rhythms = tune_rhythms | append: ':' %}
{% endunless %}
{% endfor %}
{% assign tune_rhythms = tune_rhythms | replace: '::', ':' %}
{% assign rhythms = tune_rhythms | split: ':' | uniq | sort %}

<fieldset>
    <legend>Select from current Wellington Sets:</legend>    
    <form id="wellington" method="get">
        <br />
        <span title="Filter the Sets Archive for sets by title or by type such as 'reel', 'jig', 'polka'.">        
        <input type="text" id="title-box" name="title" placeholder='Search' value='' onkeydown="enable_button()">
        &emsp;
        <select id="rhythm-box" name="rhythm"  onChange="enable_button()">
            <option value="">Any Rhythm</option>
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
    </form>
    <p></p>
    Displaying <span id="tunesCount"></span> sets
</fieldset>

<div class="row"></div>

<div class="row rowTuneTable">
  <div class="small-11 columns tunesTable" id="tunesTable"></div>
  <div class="small-1 columns tableSlider" id="tableSlider"></div>
</div>

{% assign tuneID = 200 %}
{% assign setID = 200 %}
{% for set in site.sets %}
    {% for setTune in set.tunes %}
        {% assign setTunes = setTunes | append: setTune | append: ' ' %}
    {% endfor %}
{% endfor %}
{% assign setTunes = setTunes | split: ' ' | uniq | sort %}

<script>
window.store = {
{% for setTune in setTunes %}
{% assign siteTunes = site.tunes | where: 'titleID', setTune %}
{% for tune in siteTunes %}
"{{ tuneID }}": {
    "title": "{{ tune.title | xml_escape }}",
    "tuneID": "{{ tune.titleID }}",
    "key": "{{ tune.key | xml_escape }}",
    "rhythm": "{{ tune.rhythm | xml_escape }}",
    "url": "{{ tune.url | append: '.html' | xml_escape }}",
    "mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
    "mp3_source": "{{ tune.mp3_source | strip_html | xml_escape }}",
    "repeats": "{{ tune.repeats }}",
    "parts": "{{ tune.parts }}",
    "abc": {{ tune.abc | jsonify }}
},
{% assign tuneID = tuneID | plus: 1 %}
{% endfor %}
{% endfor %}
};

window.setStore = {
{% for set in site.sets %}
    {% assign tuneList = set.tunes | split: ", " %}
"{{ setID }}": {
    "title": "{{ set.title | xml_escape }}",
    "setID": "{{ setID }}",
    "rhythm": "{{ set.rhythm | xml_escape }}",
    "location": "{{ set.location | xml_escape }}",
    "url": "{{ set.url | uri_escape }}",
    "setTunes": {{ tuneList | join: ", " }},
    "tuneIDs": "",
    },
{% assign setID = setID | plus: 1 %}
{% endfor %}
};
</script>

<script src="{{ site.js_host }}/js/lunr.min.js"></script>
<script src="{{ site.js_host }}/js/build_table_current_sets_new.js"></script>

{% include tuneModal.html%}

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* Set initial sort order */
    $.tablesorter.defaults.sortList = [[0,0]];

    $("#tunes").tablesorter({headers: {0: {sorter: 'ignoreArticles'}, 2: {sorter: false}, 3: {sorter: false}}});

    createArchiveSlider('tableSlider');
    document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
});
</script>
