---
layout: page
title: Latest Tunes
permalink: /latest/
---
<div id="audioPlayer"></div>

These are last 10 tunes to we've added.

<div id="textAreas"></div>

<table style="width:100%" id="recenttunes" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:9%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:60%;">Audio Player</th>
    </tr>
</thead>
<tbody>
  {% assign sortedtunes = site.tunes | sort: 'date' | reverse %}
  {% assign tune_count = 0 %}
  {% assign tuneid = 200 %}
    {% for tune in sortedtunes %}
    {% assign tune_count = tune_count | plus: 1 %}
        {% assign tuneid = tuneid | plus: 1 %}
<tr>
{% include tablerow.html tuneId=tuneid %}
</tr>
        {% if tune_count > 9 %}
        {% break %}
        {% endif %}
{% endfor %}
</tbody>
</table>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#recenttunes").tablesorter({headers: { 3:{sorter: false}}});
});
</script>
