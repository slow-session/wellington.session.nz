---
layout: page
title: Wellington Irish Sessions
---
<div id="audioPlayer"></div>

Two sessions happen on Tuesday nights starting at 7:30 pm at the <a href="/dragon/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Players of traditional Irish music are welcome. The evening is split into two parts with a slow session early on for those who are relatively new to Irish session music and a regular session for experienced players who are familiar with playing this music at a high standard.

<a href="/slowsession/">Slow Session</a> - {{ site.slowsession_time }}
------------

The slow session is an opportunity for players who are starting out with Irish traditional music and want an opportunity to play tunes that they're learning or have already learnt with others in a supportive environment. We don't teach tunes directly in this session but it's a great chance to practice playing with others. There's some scope for accompaniment but the focus is on the melody instruments. See our <a href="/slowsession/">Slow Session</a> page for more information.

Our Slow Session Tune of the Week is:

<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

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
{% assign tunes = site.tunes | where: 'tags', 'slowtuneoftheweek' %}
{% assign sortedtunes = tunes | sort: 'title' %}
  {% assign tuneid = 100 %}
  {% for tune in sortedtunes %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
  {% endfor %}
</tbody>
</table>
</div>
<br />

<a href="/regularsession/">Regular Session</a> - {{ site.session_time }}
--------------

The regular session is a different beast from the slow session that happens earlier in the evening. We want this to be an excellent Irish session with a very strong focus on the traditional melody instruments playing traditional tunes. This means that accompaniment from rhythm instruments will be limited so that the melody can shine. See our <a href="/regularsession/">Regular Session</a> page for more information.

Our Regular Session Tune of the Week is:

<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

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
{% assign tunes = site.tunes | where: 'tags', 'regtuneoftheweek' %}
{% assign sortedtunes = tunes | sort: 'title' %}
  {% assign tuneid = 200 %}
  {% for tune in sortedtunes %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
  {% endfor %}
</tbody>
</table>
</div>
<br />

<a href="/tunes_archive/">Tunes Archive</a>
------------

Many of the tunes that get played at the sessions, including those we've been learning in the slow session, are in our <a href="/tunes_archive/">Tunes Archive</a> page. We add new tunes reasonably often - you can check those out in our <a href="/latest/">Latest Tunes</a> page.


<a href="/nz_sessions">Other NZ Sessions</a>
--------------

There are a number of Irish Music sessions around New Zealand but the number of musicians is relatively small. <a href="https://www.youtube.com/watch?v=9B3_of9CY24">It’s a long, long way from Clare to here</a>. See our <a href="/nz_sessions">NZ Sessions</a> page for more information.

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
});
</script>
