---
layout: page
title: Wellington Slow Session
permalink: /slowsession/
---
We meet on Tuesday nights from {{ site.slowsession_time }} at the <a href="/dragon/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Players who want to play traditional Irish music at a relaxed pace are welcome.

The slow session is an opportunity for players who are starting out with Irish traditional music and want an opportunity to play tunes that they're learning or have already learnt with others in a supportive environment. We don't teach tunes directly in this session but it's a great chance to practice playing with others. There's some scope for accompaniment but the focus is on the melody instruments.

See our <a href="/slowguidelines/">Guidelines for the Slow Session</a> if you need more information, and try out the options for learning tunes on our <img alt="NEW!" src="/images/new2.gif"  height="48" width="48"> <button class="filterButton" onclick="window.location.href = '/tunes_archive/';">Tunes Archive</button> page.

Tune of the Week
----------------

We pick one tune for homework each week, and we'll play it sometime during the first hour.

<div id="audioPlayer"></div>
<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

{% assign tuneid = 100 %}

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

Recent slow session tunes of the week
--------

These are the tunes we've been learning over the last couple of months.

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
<br />

Slow session favourites
---------

We've got a number of tunes that we know well at the Slow Session. We don't play all of these every week but if you're at our session and want to play some of these tunes with us, there's a good chance someone else will know them.

You can find these tunes by going to our <a href="/tunes_archive/">Tunes Archive</a> page and
by choosing the "All Tunes" option,  picking "Slow-favourite" and pressing "Select"

<a href="/tunes_archive/"><button class="filterButton">Go to Tunes Archive</button></a>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#oldslowtunesoftheweek").tablesorter({headers: { 3:{sorter: false}}});
});
</script>
