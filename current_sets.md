---
layout: page
title: Current Sets
permalink: /current_sets/
---

These are the some of the sets we play at the Wellington Slow Session. These sets will get played regularly so if you know these you'll get a chance to play them.

If you don't find the set you're looking for you can put tunes together and try them out using our <a href="/build_a_set/">Build a Set</a> page.

<div id="audioPlayer"></div>


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
    <div id="sets-count"></div>
</fieldset>

<br />
<div id="sets-table"></div>
<div id="abc-textareas"></div>

<script>
    window.store = {
      {% assign setID = 100 %}
      {% for set in site.sets %}
          "{{ setID }}": {
              "title": "{{ set.title | xml_escape }}",
              "setID": "{{ setID }}",
              "rhythm": "{{ set.rhythm | xml_escape }}",
              "location": "{{ set.location | xml_escape }}",
              "url": "{{ set.url | absolute_url }}",
              "instrument": "{{ site.defaultABCplayer }}",
              "setTunes": "{{ set.tunes | xml_escape }}",
              "setTitles": "{% for setTune in set.tunes %}{% assign siteTunes = site.tunes | where: 'titleID', setTune %}{% for tune in siteTunes %}{{ tune.title | xml_escape }}{% endfor %}{% unless forloop.last %}, {% endunless %}{% endfor %}",
              "setURLs": "{% for setTune in set.tunes %}{% assign setTuneURL = setTune | replace: 'md', 'html' | prepend: '/tunes/' %}{% assign siteTunes = site.tunes | where: 'titleID', setTune %}{% for tune in siteTunes %}<a href=\"{{ setTuneURL | absolute_url | uri_escape }}\">{{ tune.title | escape }} ({{ tune.key}})</a>{% endfor %}{% unless forloop.last %}, {% endunless %}{% endfor %}",
              "tuneSources": "{% for setTune in set.tunes %}{% assign setTuneMP3 = setTune | replace: 'md', 'mp3' | prepend: '/mp3/' %}{% assign siteTunes = site.tunes | where: 'titleID', setTune %}{% for tune in siteTunes %}{% if tune.mp3_file %}{{ tune.mp3_file | prepend: site.mp3_host }}{% else %}{{ tune.abc | uri_escape }}{% endif %}{% endfor %}{% unless forloop.last %}, {% endunless %}{% endfor %}",
          },
          {% assign setID = setID | plus: 1 %}
      {% endfor %}
    };

</script>

<script src="{{ site.js_host }}/js/lunr.min.js"></script>
<script src="{{ site.js_host }}/js/build_sets.js"></script>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* Set initial sort order */
    $.tablesorter.defaults.sortList = [[0,0]];

    $("#search-results").tablesorter({
        headers: {
            2: {
                sorter: false
            },  
            3: {
                sorter: false
            }
        }
    });
    // In Chrome/Opera/Firefox, an AudioContext must be created or resumed
    // after the document received a user gesture to enable audio playback.
    // See https://goo.gl/7K7WLu and also see /js/audioContext.js
    // This function only sets the necessary event listener if we're running
    // on a Chrome, Opera or Firefox browser
    audioResume();
});
</script>

<script>
    function enable_button() {
        submit_button.disabled = false;
        submit_button.style.opacity=1.0;
        submit_button.style.cursor='pointer';
    }
</script>
