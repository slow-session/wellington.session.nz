---
layout: page
title: Jukebox
permalink: /jukebox/
---
<script>
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.store = {
    {% assign tunes = site.tunes %}
    {% assign sortedtunes = tunes | sort: 'titleID' %}
    {% assign tuneID = 1 %}
    {% for tune in sortedtunes %}
    {% assign tuneID = tuneID | plus: 1 %}
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
        {% endfor %}
    };
</script>

{% include tuneModal.html%}

Pick a random tune from the archive:

<div>
    <input class="filterButton" type="button" onclick="audioPlayer.selectTune(store, getRandomInt(1, {{ tuneID }}));" value="Play Now">
</div>

<script>
document.addEventListener("DOMContentLoaded", function (event) {
    pageAudioPlayer.innerHTML = audioPlayer.createAudioPlayer();
});
</script>
