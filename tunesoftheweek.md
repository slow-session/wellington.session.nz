---
layout: page
title: Tunes of the Week
permalink: /tunesoftheweek/
---
<div id="audioPlayer"></div>

<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

{% assign tuneid = 100 %}

Each week we choose a couple of tunes to learn or bring back to the fore - sometimes we focus on a tune for more than a week!

Slow Session Tune of the Week
-----------

<div style="overflow-x:auto;">
<table style="width:100%" id="slowtuneoftheweek" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">&nbsp;Tune Name&nbsp;</th>
    <th style="width:6%;">&nbsp;Key&nbsp;</th>
    <th style="width:9%;">&nbsp;Rhythm&nbsp;</th>
    <th style="width:60%;">Audio Player</th>
    </tr>
</thead>
<tbody>
  {% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
  {% assign tune = sortedtunes.first %}
  {% if tune.slowtuneoftheweek %}
{% include tablerow.html tuneId=tuneid %}
    {% assign tuneid = tuneid | plus: 1 %}
  {% endif %}
</tbody>
</table>
</div>
<br />

Regular Session Tune of the Week
---------

<div style="overflow-x:auto;">
<table style="width:100%" id="regtuneoftheweek" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">&nbsp;Tune Name&nbsp;</th>
    <th style="width:6%;">&nbsp;Key&nbsp;</th>
    <th style="width:9%;">&nbsp;Rhythm&nbsp;</th>
    <th style="width:60%;">Audio Player</th>
    </tr>
</thead>
<tbody>
  {% assign sortedtunes = site.tunes | sort: 'regtuneoftheweek' | reverse %}
  {% assign tune = sortedtunes.first %}
  {% if tune.regtuneoftheweek %}
{% include tablerow.html tuneId=tuneid %}
    {% assign tuneid = tuneid | plus: 1 %}
  {% endif %}
</tbody>
</table>
</div>
<br />

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

});
</script>
