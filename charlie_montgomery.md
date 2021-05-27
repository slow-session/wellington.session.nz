---
layout: page
title: Charlie Montgomery
permalink: /charlie_montgomery/
---
<p>
<img class="featurePicture" alt="Charlie Montgomery" src="/images/charliemontgomery.jpg" width="400" height="268">
Charlie Montgomery is a traditional fiddle player from Co Fermanagh who has lived in Auckland, New Zealand for over 60 years. He has been an inspiration for many years to people in New Zealand who have had the privilege of hearing him play. Charlie has also composed many tunes and you can find them on this page as well as him playing some old favourites.
</p>
<p>
We'd like to thank Charlie very much for giving us the privilege of being able to post these recordings. We hope you'll enjoy listening and learning these tunes from his playing.
</p>

<div class="row"></div>

<hr class="hr-with-margins" />
<p>Go to the Tune Page by selecting the link in the first column or play a tune now using the <strong>Play Now</strong> button.</p>


<script>
    window.store = {
      {% assign tunes = site.tunes %}
      {% assign sortedtunes = tunes | sort: 'titleID' %}
      {% assign tuneID = 1 %}
      {% for tune in sortedtunes %}
        {% if tune.tags contains 'cm' %}
        "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        "mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
        "mp3_source": "{{ tune.mp3_source | strip_html | xml_escape }}",
        "repeats": "{{ tune.repeats }}",
        "parts": "{{ tune.parts }}",
        "abc": {{ tune.abc | jsonify }}
        {% assign tuneID = tuneID | plus: 1 %}
        }{% unless forloop.last %},{% endunless %}
        {% endif %}
      {% endfor %}
    };
</script>

{% assign tuneID = tuneID | minus: 1 %}

{% include jukebox.html %}

{% include tunes-search.html tuneBook="tunesarchive" searchTerms="Titles, Rhythms" %}

{% include tuneModal.html%}

<!-- START of Tunes Grid -->
<div class="gridParent">
  <div class="gridChild" id="tunesGrid"></div>
</div>

<script src="{{ site.js_host }}/js/buildGrid.js"></script>
<!-- END of Tunes Grid -->

<script>
buildGrid.initialiseLunrSearch();
    
document.addEventListener("DOMContentLoaded", function (event) {
    buildGrid.displayGrid("tunesarchive", "", window.store);
});
</script>
