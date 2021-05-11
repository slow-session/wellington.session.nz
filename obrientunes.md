---
layout: page
title: Paddy O'Brien Tunes
permalink: /obrientunes/
---
The ABC for these tunes is from the same source that produced this tunebook:
<a href="http://www.ceolas.org/pub/tunes/tunes.pdf/POB.pdf">Tune Sets Arranged by Paddy O'Brien, Co. Tipperary</a>

This collection was one of the very early uses of ABC to capture and transmit Irish trad tunes on the net.


<script>
    window.store = {
      {% assign tuneID = 1 %}
      {% assign tunes =  site.obrientunes | sort: 'title' %}
      {% for tune in tunes %}
        "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        }{% unless forloop.last %},{% endunless %}
        {% assign tuneID = tuneID | plus: 1 %}
      {% endfor %}
    };
</script>


<!-- Some boilerplate that's common to a number of pages -->
{% include tunes-search.html tuneBook="obrien" searchTerms="Titles, Rhythms" %}

<!-- START of Tunes Grid -->
<div class="gridParent">
  <div class="gridChild" id="tunesGrid"></div>
</div>

<script src="{{ site.js_host }}/js/buildGrid.js"></script>
<!-- END of Tunes Grid -->

<script>
buildGrid.initialiseLunrSearch();
    
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("page loaded");
    buildGrid.displayGrid("obrien", "", window.store);
});
</script>
