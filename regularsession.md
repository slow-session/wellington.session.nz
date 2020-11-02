---
layout: page
title: Wellington Irish Session
permalink: /regularsession/
---

We meet on Tuesday nights from {{ site.session_time }} at the <a href="/dragon/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Experienced players of traditional Irish music are welcome. If you’re new in town or just visiting, we’d love to have you join us to play or just listen!

We believe that Irish traditional music played in a session can be a fantastic musical and social experience. We think that when there’s a very strong focus on traditional melody instruments playing traditional tunes we set the scene for great sessions.

Getting a great session humming requires some attention to certain ground rules. See our <a href="/regularguidelines/">Guidelines for the Wellington Irish Session</a> if you need more information.

Many of the tunes that get played at the session are in the <a href="/tunes_archive/">Tunes Archive</a> page but other tunes that are firmly in the traditional mould are very welcome.

<script src="/js/build_grid_focustunes.js"></script>

## Current Focus Tune

We often pick a tune to focus on, and we'll play it sometime during the evening.

<script>
window.currentFocusTunes =  {
    {% assign focustunecount = 1 %}
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
window.currentTunes = {
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

{% include focustunes.html divID="gridCurrentTunes" storeName="window.currentTunes" %}

Latest Tunes
------------

We add new tunes to the archive reasonably often. You can check those out in our <a href="/latest/">Latest Tunes</a> page.

{% include tuneModal.html%}

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
});
</script>
