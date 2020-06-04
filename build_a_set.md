---
layout: page
title: Build a Set
permalink: /build_a_set/
---

Find the tunes you want, and then use the "Select" button on each to choose them
in the order you want to play them in the set. When you've done that you'll be able
to view the set.

<script>
    window.store = {
      {% assign tuneID = 0 %}
      {% assign tunes =  site.tunes | sort: 'titleID' %}
      {% for tune in tunes %}
          {% assign tuneID = tuneID | plus: 1 %}
          "{{ tuneID }}": {
              "title": "{{ tune.title | xml_escape }}",
              "tuneID": "{{ tuneID }}",
              "key": "{{ tune.key | xml_escape }}",
              "rhythm": "{{ tune.rhythm | xml_escape }}",
              "url": "{{ tune.url | xml_escape }}",
              "mp3": "",
              "abc": {{ tune.abc | jsonify }}
          }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
</script>

<!-- Some boilerplate that's common to a number of pages -->

{% include tunes-filter-variables.html %}

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
        </div>
        <div class="formParent">
        <div class="formChild">
            <span title="Run the filter with the default settings to see the whole list">
            <input class="filterButton filterDisabled" id="submit_button" type="submit" name="submit" value="Select" disabled>
            </span>
        </div>
        <div class="formChild">      
            <div class="tooltip filterButton"><em>Help</em>
                <span class="tooltiptext">Run the filter with the default settings to see the whole list</span>
            </div>
        </div>
        </div>
    </form>
    <p></p>
    Scroll &#8593;&#8595; to choose from <span id="tunesCount"></span> tunes
</fieldset>

<div class="row"></div>

<fieldset id="modalControls" style="display:block;">
<legend>Selected Tunes</legend>
<div id="setTuneTitles" class="setChoice"></div>
<form>
<div class="formParent">
    <div class="formChild">
        <input value='View Set' type='button' class="filterButton" onclick='viewModal()' />
    </div>
    <div class="formChild">
        <span title="Clear the music notation to start a new set">
            <input value='RESET' type='button' class="filterButton" onclick='Reset()' />
        </span>
    </div>
</div>
</form>
</fieldset>

{% include buildSetGrid.html %}

{% include setModal.html %}

<!-- Area to store ABC -->

<textarea id="ABCraw" style="display:none;"></textarea>

<!-- Area to store unrolled ABC -->

<textarea id="ABCprocessed" style="display:none;"></textarea>

<script>
$(document).ready(function() {
    ABCplayer.innerHTML = createABCplayer('processed', '{{ site.defaultABCplayer }}');
});
</script>
