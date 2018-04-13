---
layout: page
title: Wellington Slow Session
permalink: /slowsession/
---
We meet on Tuesday nights from {{ site.slowsession_time }} at the <a href="/venue/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Players who want to play traditional Irish music at a relaxed pace are welcome.

The slow session is an opportunity for players who are starting out with Irish traditional music and want an opportunity to play tunes that they're learning or have already learnt with others in a supportive environment. We don't teach tunes directly in this session but it's a great chance to practice playing with others. There's some scope for accompaniment but the focus is on the melody instruments.

See our <a href="/slowguidelines/">Guidelines for the Slow Session</a> if you need more information.

Tune of the Week
----------------

We pick one tune each week for homework, and we'll play it sometime during the first hour.

<div id="DEBUG"></div>
<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

<table style="width:100%" id="tuneoftheweek" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">&nbsp;Tune Name&nbsp;</th>
    <th style="width:6%;">&nbsp;Key&nbsp;</th>
    <th style="width:9%;">&nbsp;Rhythm&nbsp;</th>
    <th style="width:60%;">Audio Player</th>
    </tr>
</thead>

<tbody>
{% assign tunes = site.tunes | where: 'tags', 'tuneoftheweek' %}
{% assign sortedtunes = tunes | sort: 'title' %}
  {% assign tuneid = 100 %}
  {% for tune in sortedtunes %}
      {% assign tuneid = tuneid | plus: 1 %}
<tr>
{% include tablerow.html tuneId=tuneid %}
</tr>
  {% endfor %}
</tbody>
</table>

Slow Session Tunes
------------------

<table style="width:100%" id="focustunes" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:9%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:60%;">Audio Player</th>
    </tr>
</thead>
<tbody>
{% assign tunes = site.tunes | where: 'tags', 'focustune' %}
{% assign sortedtunes = tunes | sort: 'title' %}
  {% assign tuneid = 200 %}
  {% for tune in sortedtunes %}
      {% assign tuneid = tuneid | plus: 1 %}
<tr>
{% include tablerow.html tuneId=tuneid %}
</tr>
  {% endfor %}
</tbody>
</table>

Slow Session Sets
------------------

<table style="width:100%" id="focussets" class="tablesorter">
<thead>
    <tr>
    <th style="width:20%;">Set Name&#x25B2;&#x25BC;</th>
    <th style="width:9%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:26%;">Titles</th>
    <th style="width:45%;">Audio Player</th>
    </tr>
</thead>
<tbody>

{% assign sets = site.sets | where: 'tags', 'focusset' %}
{% assign setid = 200 %}
{% for set in sets %}
{% assign setid = setid | plus: 1 %}
<tr>
{% include setrow.html setId=setid %}
</tr>
{% endfor %}
</tbody>
</table>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#focustunes").tablesorter({headers: { 4:{sorter: false}}});

    /* turn off sorting on last two columns */
    $("#focussets").tablesorter({
        headers: {
            2: {
                sorter: false
            },  
            3: {
                sorter: false
            }
        }
    });
    // In Chrome/Opera/Firefox, an AudioContext must be created or resumed
    // after the document received a user gesture to enable audio playback.
    // See https://goo.gl/7K7WLu and also see /js/audioContext.js
    // This function only sets the necessary event listener if we're running
    // on a Chrome, Opera or Firefox browser
    audioResume();
});
</script>
