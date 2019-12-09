---
layout: page
title: Build a Set
permalink: /build_a_set/
---
Find the tunes you want, and then use the "Select" button on each to choose them
in the order you want to play them in the set. Now you can use the ABC player to
hear the tunes played one after another.

<!-- Some boilerplate that's common to a number of pages -->
{% include tunes-filter-variables.html %}

<div id="search_controls">
<fieldset>
    <legend>Select from the Tunes Archive:</legend>    
    <form id="wellington" method="get">
    <div class="formParent">
    <div class="formChild">
		<input type="text" id="title-box" name="title" placeholder='Search'
            value='' onkeydown="enable_button()">
    </div>
    <div class="formChild">
        <select id="rhythm-box" name="rhythm"  onChange="enable_button()">
            <option value="">All Rhythms</option>
            {% for rhythm in rhythms %}
            {% if rhythm != '' %}
            <option value="{{ rhythm }}">{{ rhythm | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
    </div>
    <div class="formChild">
        <select id="tags-box" name="tags" onChange="enable_button()">
            <option value="">All Tunes</option>
            {% for tag in tags %}
            {% if tag != '' %}
            <option value="{{ tag }}">{{ tag | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
    </div>
    <div class="formChild">
        <select id="location-box" name="location" onChange="enable_button()">
        <option value="">All Locations</option>
            {% for location in locations %}
            {% if location != '' %}
                <option value="{{ location }}">{{ location | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
    </div>
    </div>
    <div class="formParent">
    <div class="formChild">
        <span title="Run the filter with the default settings to see the whole list">
        <input class="filterButton filterDisabled" id="submit_button" type="submit" name="submit" value="Select" disabled>
        </span>  
    </div>
    </div>
    </form>
    <p></p>
    Displaying <span id="tunesCount"></span> tunes
</fieldset>
</div>

<div class="row"></div>


<!-- Show a header for where the dots will appear -->
<div id="paperHeader"><h1>Musical Notation will appear here</h1></div>
<!-- Draw the dots -->
<div class="output" id='output' style="max-width: 650px;">
    <div id="paper0" class="paper"></div>
  </div>

<!-- Controls for ABC player -->
<div id="ABCplayer" ></div>

<!-- Allow the user to save their ABC-->
<form>
<div class="row" style="max-width:650px">
    <div class="small-6 columns">
        <span title="Clear the music notation to start a new set">
            <input value='RESET' type='button' class="loopButton" onclick='Reset()' />
        </span>
    </div>
    <div class="small-3 columns">
        <span title="When you're happy with your selection you can print your set using this button.
Please think of the trees!">
            <input class="button" type="button" class="loopButton" onclick="printDiv('paper0')" value="Print this Set" />
        </span>
    </div>
    <div class="small-3 columns">
        <span title="Download the ABC you've entered. Don't lose your work!">      
    	   <input value='Download ABC' type='button' class="loopButton" onclick='downloadFile(document.getElementById("filename").value, document.getElementById("ABCraw").value)' />
        </span>
    </div>
</div>
</form>
<br />

<div class="tableParent">
  <div class="tableChild tunesTable" id="tunesTable"></div>
  <div class="tableChild tableSlider" id="tableSlider"></div>
</div>

<div id="abc-textareas"></div>

<!-- Area to store ABC -->
<textarea id="ABCraw" style="display:none;"></textarea>

<!-- Area to store unrolled ABC -->
<textarea id="ABCprocessed" style="display:none;"></textarea>

<!-- Area to store filename for download -->
<textarea id="filename" style="display:none;"></textarea>

<script>
    window.store = {
      {% assign tuneID = 3000 %}
      {% assign tunes =  site.tunes | sort: 'title' %}
      {% for tune in tunes %}
          {% assign tuneID = tuneID | plus: 1 %}
          "{{ tuneID }}": {
              "title": "{{ tune.title | xml_escape }}",
              "tuneID": "{{ tuneID }}",
              "key": "{{ tune.key | xml_escape }}",
              "mode": "{{ tune.mode | xml_escape }}",
              "rhythm": "{{ tune.rhythm | xml_escape }}",
              "location": "{{ tune.location | xml_escape }}",
              "tags": "{{ tune.tags | array_to_sentence_string }}",
              "url": "{{ tune.url | xml_escape }}",
              "mp3": "",
              "abc": {{ tune.abc | jsonify }}
          }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
</script>

<script src="{{ site.js_host }}/js/webpage_tools.js"></script>
<script src="{{ site.js_host }}/js/lunr.min.js"></script>
<script src="{{ site.js_host }}/js/build_table_build_a_set.js"></script>

<script>
$(document).ready(function() {
    $.tablesorter.defaults.sortList = [[2,0], [1,0]];

    $("#tunes").tablesorter({headers: { 0:{sorter: false}, 1:{sorter: 'ignoreArticles'} }});  

    ABCplayer.innerHTML = createABCplayer('processed', '{{ site.defaultABCplayer }}');

    createArchiveSlider('tableSlider');
    document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
});
</script>
