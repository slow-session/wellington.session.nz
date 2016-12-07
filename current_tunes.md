---
layout: page
title: Current Tunes
permalink: /current_tunes/
navigation_weight: 5
---

These are the tunes we've been learning at the Slow Session since October 2015. These tunes will get played regularly so if you know these you'll get a chance to play them.


<fieldset>
    <legend>Select from current Wellington Tunes:</legend>    
    <form id="wellington" method="get">
        <br />
        <span title="Filter the Tunes Archive for tunes by title or by type such as 'reel', 'jig', 'polka'. You can also look for 'tags' such as 'Slow Session, 'Beginner'">        
        Title:
        <input type="text" id="title-box" name="title" value='' onkeypress="enable_button()">
        &emsp; 
        Rhythm:
        <select id="rhythm-box" name="rhythm"  onChange="enable_button()">
            <option value="">Any</option>
            <option value="reel">Reel</option>
            <option value="jig">Jig</option>
            <option value="slip jig">Slip Jig</option>
            <option value="polka">Polka</option>
            <option value="hornpipe">Hornpipe</option>
            <option value="slide">Slide</option>
            <option value="waltz">Waltz</option>
            <option value="barndance">Barndance</option>
            <option value="planxty">Planxty</option>
            <option value="mazurka">Mazurka</option>
        </select>&emsp;
        Tags:
        <select id="tags-box" name="tags" onChange="enable_button()">
            <option value="">All Tunes</option>
            <option value="slowsession">Slow Session</option>
            <option value="beginner">Beginner</option>
        </select>
        </span>
        <input type='hidden' id='tags-box' name='tags' value=''>      
        &emsp;
        <span title="Run the filter with the default settings to see the whole list">
        <input class="filter_button filter_disabled" id="submit_button" type="submit" name="submit" value="Select" disabled>
        </span>      
    </form>
</fieldset>

<br />

<div id="tunes-table"></div>
<div id="abc-textareas"></div>

<script>
    window.store = {
      {% assign tuneID = 3000 %}
      {% assign tunes =  site.tunes | sort: 'title' %} 
      {% for tune in tunes %}
          {% if tune.location contains "Wellington" %}
              {% assign tuneID = tuneID | plus: 1 %}
              "{{ tuneID }}": {
                  "title": "{{ tune.title | xml_escape }}",
                  "tuneID": "{{ tuneID }}", 
                  "key": "{{ tune.key | xml_escape }}",
                  "mode": "{{ tune.mode | xml_escape }}",
                  "rhythm": "{{ tune.rhythm | xml_escape }}",
                  "tags": "{{ tune.tags | array_to_sentence_string }}",
                  "url": "{{ tune.url | xml_escape }}",
                  {% if tune.mp3_file %}"mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
                  "abc": ""
                  {% else %}"mp3": "",
                  "abc": {{ tune.abc | jsonify }}{% endif %}
              }{% unless forloop.last %},{% endunless %}
          {% endif %}
      {% endfor %}};
</script>

<script type="text/javascript" src="/js/audio_controls.js"></script>
<script type="text/javascript" src="/js/musical-ws.js"></script>
<script type="text/javascript" src="/js/abc_controls.js"></script>
<script type="text/javascript" src="/js/lunr.min.js"></script>
<script type="text/javascript" src="/js/search.js"></script>

<script>
$(document).ready(function() { 
    // Set initial sort order
    $.tablesorter.defaults.sortList = [[0,0]]; 
        
    $("#search-results").tablesorter({headers: { 3:{sorter: false}, 4: {sorter: false}}});    
});
</script>
<script>
function enable_button(){
submit_button.disabled = false;
submit_button.style.opacity=1.0;
submit_button.style.cursor='pointer';
}
</script>