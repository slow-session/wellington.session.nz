---
layout: page
title: Build a Set
permalink: /build_a_set/
---

Use this tool to compile sets for practice or if you need music for a ceili.

Find the tunes you want, and then use the "Select" button on each to choose them
in the order you want to play them in the set. When you've done that you'll be able
to view the set.

You can also look at some sets that have been played in Wellington in recent times on our
<button class="filterButton" onclick="window.location.href = '/historic_sets/';">Historic Sets</button>
page.

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
<form>
    <fieldset>
        <legend>Select from the Tunes Archive:</legend>
        <div class="formParent">
        <div class="formChild">
            <input type="text" id="title-box" name="searchTitle" placeholder='Search'
            value='' onkeydown="wssTools.enableSearchButton()">
        </div>
        <div class="formChild">
            <select id="rhythm-box" name="searchRhythm"  onChange="wssTools.enableSearchButton()">
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
                    <input class="filterButton filterDisabled" id="submitSearch" type="button" name="submit" value="Select" onclick="buildSetGrid.formSearch('build', [searchTitle.value, searchRhythm.value], window.store)" disabled>
                </span>
            </div>
            <div class="formChild">   
                <span title="Reset to default">  
                    <input class="filterButton" id="formReset" type="button" name="reset" value="Reset" onclick="buildSetGrid.formReset('build', ['title-box', 'rhythm-box'], window.store)">
                </span>
            </div>
        </div>
        <p></p>
        Scroll &#8593;&#8595; to choose from <span id="tunesCount"></span> tunes
    </fieldset>
</form>

<div class="row"></div>

<form>
    <fieldset>
        <legend>Selected Tunes</legend>
        <div id="setTuneTitles" class="setChoice"></div>
        <div class="formParent">
            <div class="formChild">
                <input value='View Set' type='button' class="filterButton" onclick='viewModal()' />
            </div>
            <div class="formChild">
                <span title="Clear the music notation to start a new set">
                    <input value='Start New Set' type='button' class="filterButton" onclick='buildSetGrid.newSet()' />
                </span>
            </div>
        </div>
    </fieldset>
</form>

<div class="row"></div>

<!-- Build a Set Grid -->
<div class="gridParent">
  <div class="gridChild" id="tunesGrid"></div>
</div>

<script src="{{ site.js_host }}/js/buildSetGrid.js"></script>

{% include setModal.html %}

<!-- Area to store ABC -->

<textarea id="textAreaABC" class="abcSource"></textarea>

<script>
buildSetGrid.initialiseLunrSearch(window.store);

document.addEventListener("DOMContentLoaded", function (event) {
    buildSetGrid.displaySetGrid("build", "", window.store);
});
</script>
