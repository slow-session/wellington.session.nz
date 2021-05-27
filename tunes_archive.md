---
layout: page
title: Tunes Archive
permalink: /tunes_archive/
---
<p>
Play a tune now using the <strong>Play Now</strong> button or use the
link to the Tune Page for a more traditional view. We add new tunes to the archive reasonably often.
You can check those out in our <a href="/latest/"> Latest Tunes</a> page.
</p>

<script>
window.store = {
    {% assign tunes = site.tunes %}
    {% assign sortedtunes = tunes | sort: 'titleID' %}
    {% assign tuneID = 1 %}
    {% for tune in sortedtunes %}
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
        }{% unless forloop.last %},{% endunless %}
        {% assign tuneID = tuneID | plus: 1 %}
    {% endfor %}
};
</script>

{% include jukebox.html %}

{% include tunes-search.html tuneBook="tunesarchive" searchTerms="Titles, Rhythms, Musicians" %}

{% include tuneModal.html %}

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

}, false);
</script>
