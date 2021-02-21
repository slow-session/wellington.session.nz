---
layout: page
title: Wellington Slow Session
permalink: /slowsession/
---

{% include slowsession/details.html %}

If you're new to session playing or want to know more about our slow session, please check out our <a href="/intro-to-slowsession/">Introduction to Wellington Slow Session</a> page.

<script src="/js/buildGrid.js"></script>

## Current Focus Tunes

We have a number of tunes we're currently focusing on. We'll play
these at some point during the slow session each week. The list will change regularly.

<script>
window.currentFocusTunes =  {
    {% assign focustunecount = 4 %}
        {% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
    {% assign tune_count = 0 %}
    {% assign tuneID = 100 %}
    {% for tune in sortedtunes %}
    {% if tune_count < 4 %}

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
        }
        {% endif %}

    {% assign tune_count = tune_count | plus: 1 %}
    {% assign tuneID = tuneID | plus: 1 %}
    {% if tune_count < focustunecount %},{% else %}{% break %}{% endif %}
{% endfor %}
};
</script>

{% include focustunes.html divID="gridCurrentFocusTunes" storeName="window.currentFocusTunes" %}

## Previous Focus Tunes

Here are the tunes we've focussed on over the last few years.

<script>
window.currentTunes = {
{% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
{% assign tuneID = 1 %}
{% for tune in sortedtunes %}
    {% if tune.slowtuneoftheweek %}
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

{% include tuneModal.html%}

## Latest Tunes

We add new tunes to the main Tunes Archive reasonably often.
You can check those out in our <a href="/latest/">Latest Tunes</a> page.

<script>
document.addEventListener("DOMContentLoaded", function (event) {
    pageAudioPlayer.innerHTML = audioPlayer.createAudioPlayer();
});
</script>
