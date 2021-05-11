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



{% include sets-search.html tuneBook="build" searchTerms="Titles, Rhythms" store="store" %}

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


<h3>Scroll &#8593;&#8595; to choose from <span id="tunesCount"></span> tunes</h3>

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
