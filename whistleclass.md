---
layout: page
title: Whistle Class
permalink: /whistleclass/
---
<div id="audioPlayer"></div>
<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

Blah blah here about the Classes

These are just copies of the versions we have on the current site. I'll replace the MP3s and ABCs on these pages with your versions and I still need to add the last tune and I'll grab your recording of The Mad Piper.

<div style="overflow-x:auto;">
<table style="width:100%" id="tunes" class="tablesorter">
<thead>
    <tr>
    <th style="width:20%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:55%;">Audio Player</th>
    </tr>
</thead>
<tbody>
{% assign tunes = site.tunes | where: 'tags', 'whistle-class' %}
{% assign sortedtunes = tunes | sort: 'rhythm' %}
  {% assign tuneid = 200 %}
  {% for tune in sortedtunes %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
  {% endfor %}
</tbody>
</table>
</div>


<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#tunes").tablesorter({
        headers: {
            4: {
                sorter: false
            }
        }
    });
});
</script>
