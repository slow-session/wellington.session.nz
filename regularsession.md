---
layout: page
title: Wellington Irish Session
permalink: /regularsession/
---
We meet on Tuesday nights from {{ site.session_time }} at the <a href="/dragon/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Experienced players of traditional Irish music are welcome. If you’re new in town or just visiting, we’d love to have you join us to play or just listen!

Many of the tunes that get played at the session are in the <a href="/tunes_archive/">Tunes Archive</a> page but other tunes that are firmly in the traditional mould are very welcome.

We believe that Irish traditional music played in a session can be a fantastic musical and social experience. We think that when there’s a very strong focus on traditional melody instruments playing traditional tunes we set the scene for great sessions.

Getting a great session humming requires some attention to certain ground rules. See our <a href="/regularguidelines/">Guidelines for the Wellington Irish Session</a> if you need more information.

Regular session tune of the week
--------

We often pick a tune for homework, and we'll play it sometime during the evening.

<div id="audioPlayer"></div>
<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

{% assign tuneid = 100 %}

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

Recent regular session tunes of the week
--------

These are the tunes we've been learning over the last couple of months.

<div style="overflow-x:auto;">
<table style="width:100%" id="oldregtunesoftheweek" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:9%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:60%;">Audio Player</th>
    </tr>
</thead>
<tbody>
  {% assign sortedtunes = site.tunes | sort: 'regtuneoftheweek' | reverse %}
  {% assign tune_count = 0 %}
  {% for tune in sortedtunes %}
    {% if tune.regtuneoftheweek %}
      {% if tune_count > 0 %}
{% include tablerow.html tuneId=tuneid %}
        {% assign tuneid = tuneid | plus: 1 %}
        {% if tune_count == 8 %}
          {% break %}
        {% endif %}
      {% endif %}
      {% assign tune_count = tune_count | plus: 1 %}
    {% endif %}
  {% endfor %}
</tbody>
</table>
</div>
<br />

Latest Tunes
------------

We add new tunes to the archive reasonably often - you can check those out in our <a href="/latest/"><button class="filterButton" style="display: inline;"> Latest Tunes</button></a> page.

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#oldregtunesoftheweek").tablesorter({headers: { 3:{sorter: false}}});

});
</script>
