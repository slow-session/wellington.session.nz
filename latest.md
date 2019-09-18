---
layout: page
title: Latest Tunes
permalink: /latest/
---
These are the last <span id="tunesCount"></span> tunes we’ve added to the <a href="/tunes_archive/">Tunes Archive</a>.

<div class="row rowTuneTable">
  <div class="small-11 columns tunesTable" id="tunesTable"></div>
  <div class="small-1 columns tableSlider" id="tableSlider"></div>
</div>

<script>
window.store = {
    {% assign sortedtunes = site.tunes | sort: 'date' | reverse %}
    {% assign tune_count = 0 %}
    {% assign tuneID = 200 %}
    {% for tune in sortedtunes %}
        {% if tune.tags contains 'cm' %}
            {% continue %}
        {% endif %}
        {% assign tune_count = tune_count | plus: 1 %}
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
        }{% if tune_count <= 14 %},{% else %}{% break %}{% endif %}
    {% endfor %}
};
</script>

<script src="{{ site.js_host }}/js/lunr.min.js"></script>

<script src="{{ site.js_host }}/js/build_table_tunes_archive.js"></script>

{% include tuneModal.html%}

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    $("#tunes").tablesorter({headers: { 0:{sorter: 'ignoreArticles'}, 1:{sorter: false}, 2:{sorter: false}}});  

    createArchiveSlider('tableSlider');
    document.getElementById("tunes").addEventListener("scroll", scroll_indicator);
});
</script>
