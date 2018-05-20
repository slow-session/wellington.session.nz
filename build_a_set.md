---
layout: page
title: Build a Set
permalink: /build_a_set/
---
You can put a set of tunes together for practicing the change over between tunes
on this page.

Find the tunes you want, and then use the "Select" button on each to choose them
in the order you want to play them in the set. Now you can use the ABC player to
hear the tunes played one after another.

If you need the printed music you can print only that using "Print this Set"
button and you can use the "Download ABC" button save the ABC to use in tools
like <a href="https://sourceforge.net/projects/easyabc/">EasyABC</a>.

Use the "Reset" button to start a new set.

<!-- Show a header for where the dots will appear -->
<div id="paperHeader"><h2>Musical Notation appears here</h2></div>

<!-- Draw the dots -->
<div class="output">
	<div id="paper0" class="paper"  style="max-width:800px; min-height:200px;display:none;"></div>
</div>

<!-- Area to store ABC -->
<textarea id="ABCraw" style="display:none;"></textarea>

<!-- Area to store unrolled ABC -->
<textarea id="ABCprocessed" style="display:none;"></textarea>

<!-- Area to store filename for download -->
<textarea id="filename" style="display:none;"></textarea>

<!-- Controls for ABC player -->
<div id="ABCplayer" ></div>

<!-- Allow the user to save their ABC-->
<form>
<p>
<span title="Clear the music notation to start a new set">
    <input value='Reset' type='button' class="loopButton" onclick='Reset()' />
</span>
</p>
<p>
<span title="When you're happy with your selection you can print your set using this button.
Please think of the trees!">
   <input class="button" type="button" class="loopButton" onclick="printDiv('paper0')" value="Print this Set" />
</span>
</p>
<p>
<span title="Download the ABC you've entered. Don't lose your work!">      
	 <input value='Download ABC' type='button' class="loopButton" onclick='downloadFile(document.getElementById("filename").value, document.getElementById("ABCraw").value)' />
</span>
</p>
</form>

<div id="audioPlayer"></div>

{% assign tune_rhythms = '' %}
{% assign tune_tags = '' %}
{% assign tune_locations = '' %}

{% for tune in site.tunes %}
    {% assign tune_rhythms = tune_rhythms | append: tune.rhythm %}
    {% for tag in tune.tags %}
        {% assign tune_tags = tune_tags | append: tag | replace: '"', '' | replace: '[', '' | replace: ']', '' | strip %}
        {% unless forloop.last %}{% assign tune_tags = tune_tags | append: ':' %}{% endunless %}
    {% endfor %}
    {% for location in tune.location %}
        {% assign tune_locations = tune_locations | append: location | replace: '"', '' | replace: '[', '' | replace: ']', '' | strip %}
        {% unless forloop.last %}{% assign tune_locations = tune_locations | append: ':' %}{% endunless %}
    {% endfor %}
    {% unless forloop.last %}
        {% assign tune_rhythms = tune_rhythms | append: ':' %}
        {% assign tune_tags = tune_tags | append: ':' %}
        {% assign tune_locations = tune_locations | append: ':' %}
    {% endunless %}
{% endfor %}

{% assign tune_rhythms = tune_rhythms | replace: '::', ':' %}
{% assign rhythms = tune_rhythms | split: ':' | uniq | sort %}

{% assign tune_tags = tune_tags | replace: '::', ':' %}
{% assign tags = tune_tags | split: ':' | uniq | sort %}

{% assign tune_locations = tune_locations | replace: '::', ':' %}
{% assign tune_locations = tune_locations | replace: ' ', ':' %}
{% assign locations = tune_locations | split: ':' | uniq | sort %}

<div id="search_controls">
<fieldset>
    <legend>Select from current Wellington Tunes:</legend>    
    <form id="wellington" method="get">
        <br />
        <span title="Filter the Tunes Archive for tunes by title or by type such as 'reel', 'jig', 'polka'. You can also look for 'tags' such as 'Slow Session, 'Beginner'">        
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
        &emsp;
        <select id="tags-box" name="tags" onChange="enable_button()">
            <option value="">All Tunes</option>
            {% for tag in tags %}
            {% if tag != '' %}
            <option value="{{ tag }}">{{ tag | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
        &emsp;
        <select id="location-box" name="location" onChange="enable_button()">
            <option value="">All Locations</option>
            {% for location in locations %}
            {% if location != '' %}
            <option value="{{ location }}">{{ location | capitalize }}</option>
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
    <div id="tunes-count"></div>
</fieldset>
</div>

<br />
<div id="tunes-table"></div>
<div id="abc-textareas"></div>

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
<script src="{{ site.js_host }}/js/build_table_abc.js"></script>

<script>
$(document).ready(function() {
    $.tablesorter.defaults.sortList = [[0,0]];

    $("#search-results").tablesorter({headers: { 3:{sorter: false}}});  

    ABCplayer.innerHTML = createABCplayer('processed', 'abcplayer_tunepage', '{{ site.defaultABCplayer }}');
});
</script>
