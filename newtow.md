---
layout: page
title: New TOW
permalink: /newtow/
---
<div id="audioPlayer"></div>

<div id="textAreas"></div>


Slow session tune of the week
--------

<div style="overflow-x:auto;">
<table style="width:100%" id="slowtuneoftheweek" class="tablesorter">
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
  {% assign tuneid = 100 %}
    {% for tune in sortedtunes %}
    {% if tune.slowtuneoftheweek %}
{% include tablerow.html tuneId=tuneid %}
        {% break %}
    {% endif %}
{% endfor %}
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
  {% assign tuneid = 200 %}
    {% for tune in sortedtunes %}
    {% if tune.slowtuneoftheweek %}
    {% assign tune_count = tune_count | plus: 1 %}
    {% assign tuneid = tuneid | plus: 1 %}
    {% if tune_count == 1 %}
        {% continue %}
    {% endif %}
{% include tablerow.html tuneId=tuneid %}
        {% if tune_count > 8 %}
            {% break %}
        {% endif %}
    {% endif %}
{% endfor %}
</tbody>
</table>
</div>

Regular session tune of the week
--------

<div style="overflow-x:auto;"
<table style="width:100%" id="regtuneoftheweek" class="tablesorter">
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
  {% assign tuneid = 300 %}
    {% for tune in sortedtunes %}
    {% if tune.regtuneoftheweek %}
{% include tablerow.html tuneId=tuneid %}
        {% break %}
    {% endif %}
{% endfor %}
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
  {% assign tuneid = 400 %}
    {% for tune in sortedtunes %}
    {% if tune.regtuneoftheweek %}
    {% assign tune_count = tune_count | plus: 1 %}
    {% assign tuneid = tuneid | plus: 1 %}
    {% if tune_count == 1 %}
        {% continue %}
    {% endif %}
{% include tablerow.html tuneId=tuneid %}
        {% if tune_count > 8 %}
            {% break %}
        {% endif %}
    {% endif %}
{% endfor %}
</tbody>
</table>
</div>


<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#slowtuneoftheweek").tablesorter({headers: { 3:{sorter: false}}});
    $("#oldslowtunesoftheweek").tablesorter({headers: { 3:{sorter: false}}});
    $("#regtuneoftheweek").tablesorter({headers: { 3:{sorter: false}}});
    $("#oldregtunesoftheweek").tablesorter({headers: { 3:{sorter: false}}});

});
</script>
