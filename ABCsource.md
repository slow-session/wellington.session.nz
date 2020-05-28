---
layout: page
title: ABC Source
permalink: /abc_source/
---
<p>
Use this page to generate all the ABCs used in our tune pages!
</p>

<script>
window.store = {
    {% assign tunes = site.tunes %}
    {% assign sortedtunes = tunes | sort: 'titleID' %}
    {% assign tuneID = 100 %}
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
            "abc": "{{ tune.abc | uri_escape }}"
            }{% unless forloop.last %},{% endunless %}
        {% endfor %}
    };
</script>

<input class="filterButton" type="button" onclick="displayABCsource();" value="Build Now" />

<div>
    <textarea id="abcText" rows="13" cols="65" style="background-color:#ebebeb; font-size:small; max-width:100%" spellcheck="false" readonly></textarea>
</div>

<span title="Download the ABC you've generated. Don't lose your work!">
<input value='Download ABC' type='button' class="filterButton"
    onclick='downloadFile("WellingtonIrishSessions.abc", document.getElementById("abcText").value)' />
</span>

<script src="{{ site.js_host }}/js/build_abc_source.js"></script>

<div class="row"></div>

<script>
  $(document).ready(function() {

  });
</script>

