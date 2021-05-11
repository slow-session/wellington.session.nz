---
layout: page
title: Build a Set
permalink: /build_a_set/
---

Find the tunes you want, and then use the "Select" button on each to choose them
in the order you want to play them in a set. When you've done that you'll be able
to view and play back the set.

You can also look at some sets that have been played in Wellington on our
<a href = '/historic_sets/'>Historic Sets</a>
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

<!-- Chosen tunes -->
<div class="setParentOuter">
    <div id="setTuneTitles" class="setChoice"></div>
    <div class="setParentInner">
        <div class="setChildInner">
            <span title="Clear the music notation to start a new set">
                <input value='Start New Set' type='button' class="filterButton" onclick='buildSetGrid.newSet()' />
            </span>
        </div>
        <div class="setChildInner">
            <input value='View Set' type='button' class="filterButton" onclick='viewModal()' />
        </div>
    </div>
</div>

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
