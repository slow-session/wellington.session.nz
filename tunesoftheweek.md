---
layout: page
title: Tunes of the Week
permalink: /tunesoftheweek/
---
Each week we choose a couple of tunes to learn or bring back to the fore - sometimes we focus on a tune for more than a week!

Slow Session Tune of the Week
-----------

{% assign legend="Slow tune of the week" %}
{% assign tuneID = 100 %}
{% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
{% assign tune = sortedtunes.first %}
{% if tune.slowtuneoftheweek %}

{% include tuneoftheweek.html %}

<script>
tuneOfTheWeek = {
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
};
</script>
{% endif %}

Regular Session Tune of the Week
---------

{% assign legend="Regular tune of the week" %}
{% assign tuneID = tuneID | plus: 1 %}
{% assign sortedtunes = site.tunes | sort: 'regtuneoftheweek' | reverse %}
{% assign tune = sortedtunes.first %}
{% if tune.regtuneoftheweek %}

{% include tuneoftheweek.html %}

<script>
window.store = {
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
};

// Add slow tune of the week into the window.store
$.extend(window.store, tuneOfTheWeek);
</script>
{% endif %}

{% include tuneModal.html%}

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
});
</script>
