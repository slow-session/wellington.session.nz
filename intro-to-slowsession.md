---
layout: page
title: Introduction to Wellington Slow Session
permalink: /intro-to-slowsession/
---

{% include session-details.html %}

The slow session is an opportunity for players who are starting out with Irish
traditional music and want an opportunity to play tunes that they're learning
or have already learnt with others in a supportive environment.

We don't teach tunes in this session but it's a great chance to practice
playing with others. The focus is on melody instruments, but there is some scope for accompaniment. Learning by ear, and playing tunes from memory is strongly encouraged. Please read the <a href="/learn_by_ear/"> Learn by Ear</a> page. 

See our <a href="/slowguidelines/">Guidelines for the Slow Session</a> if you need more information. In particular, accompanists should read the <a href="/accompaniment">Accompaniment in the Irish Session</a> page.

<script src="/js/buildGrid.js"></script>

## Tunes to get started with

Here are some tunes that are played frequently at the slow session. If you are not sure which tunes to start with, learn some of these tunes. We'll also be happy to take requests if there is a tune you've been working on.

<script>
window.currentTunes = {
{% assign sortedtunes = site.tunes | sort: 'rhythm' %}

{% assign tuneID = 1 %}
{% for tune in sortedtunes %}
    {% if tune.tags contains 'slow-popular' %}

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
        }{% if tune.tags contains 'slow-popular' %},{% else %}{% break %}{% endif %}
        
    {% endif %}

    {% assign tuneID = tuneID | plus: 1 %}
{% endfor %}
};

</script>

{% include focustunes.html divID="gridCurrentTunes" storeName="window.currentTunes" %}

{% include tuneModal.html%}

<script>

document.addEventListener("DOMContentLoaded", function (event) {

});
</script>
