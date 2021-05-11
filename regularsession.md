---
layout: page
title: Wellington Irish Session
permalink: /regularsession/
---

We meet on Tuesday nights from {{ site.session_time }} at the <a href="/dragon/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Experienced players of traditional Irish music are welcome. If you’re new in town or just visiting, we’d love to have you join us to play or just listen!

We believe that Irish traditional music played in a session can be a fantastic musical and social experience. We think that when there’s a very strong focus on traditional melody instruments playing traditional tunes we set the scene for great sessions.

Getting a great session humming requires some attention to certain ground rules. See our <a href="/regularguidelines/">Guidelines for the Wellington Irish Session</a> if you need more information.

Many of the tunes that get played at the session are in the <a href="/tunes_archive/">Tunes Archive</a> page but other tunes that are firmly in the traditional mould are very welcome.

<script src="/js/buildGrid.js"></script>

## Current Focus Tunes

We often pick some tunes to focus on, and we'll probably play them sometime during the evening.

<script>
window.currentFocusTunes =  {
    {% assign focustunecount = 4 %}
    {% assign sortedtunes = site.tunes | sort: 'regtuneoftheweek' | reverse %}
    {% assign tune_count = 0 %}
    {% assign tuneID = 1 %}
    {% for tune in sortedtunes %}
    {% if tune_count < focustunecount %}
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
    },
    {% endif %}
    {% assign tune_count = tune_count | plus: 1 %}
    {% assign tuneID = tuneID | plus: 1 %}
    {% endfor %}
};
</script>

{% include focustunes.html divID="gridCurrentFocusTunes" storeName="window.currentFocusTunes" %}

## Previous Focus Tunes

Here are the tunes we've focussed on recently.

<script>
window.store = {
    {% assign sortedtunes = site.tunes | sort: 'regtuneoftheweek' | reverse %}
    {% assign tuneID = 1 %}
    {% for tune in sortedtunes %}
    {% if tune.regtuneoftheweek %}
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
        },
    {% endif %}
    {% assign tuneID = tuneID | plus: 1 %}
    {% endfor %}
};

</script>

{% include tunes-search.html tuneBook="tunesarchive" searchTerms="Titles, Rhythms, Musicians" %}

{% include tuneModal.html%}

<!-- START of Tunes Grid -->
<div class="gridParent">
  <div class="gridChild" id="tunesGrid"></div>
</div>

## Latest Tunes

We add new tunes to the main Tunes Archive reasonably often.
You can check those out in our <a href="/latest/">Latest Tunes</a> page.

<script>
buildGrid.initialiseLunrSearch();

document.addEventListener("DOMContentLoaded", function (event) {
        buildGrid.displayGrid("tunesarchive", "", window.store);

});
</script>
