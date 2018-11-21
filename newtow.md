---
layout: page
title: New TOW
permalink: /newtow/
---
<div id="audioPlayer"></div>

<div id="textAreas"></div>

{% assign tuneid = 100 %}

Slow session tune of the week
--------

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

Recent slow session tunes of the week
--------

<div style="overflow-x:auto;">
<table style="width:100%" id="oldslowtunesoftheweek" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:9%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:60%;">Audio Player</th>
    </tr>
</thead>
<tbody>
  {% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
  {% assign tune_count = 0 %}
  {% for tune in sortedtunes %}
    {% if tune.slowtuneoftheweek %}
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

Regular session tune of the week
--------

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

Recent regular session tunes of the week
--------

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

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#oldslowtunesoftheweek").tablesorter({headers: { 3:{sorter: false}}});
    $("#oldregtunesoftheweek").tablesorter({headers: { 3:{sorter: false}}});

});
</script>
