---
layout: page
title: Latest Tunes
permalink: /latest/
---
<div id="audioPlayer"></div>

These are the last 15 tunes we've added to the archive.

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
        {% if tune_count > 14 %}
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

    // One-liner to resume playback when user interacted with the page
    document.querySelector('button').addEventListener('click', function() {
        context.resume().then(() => {
            console.log('Playback button selected');
        });
    });
});
</script>
