---
layout: page
title: Auckland Folk Festival slow session
permalink: /aff/
---
<div id="audioPlayer"></div>
<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

During the Auckland Folk Festival 2019 we'll be running a Irish tune slow session. We'll be playing Irish tunes that are commonly played in pub sessions at a relaxed pace.

This page contains a sample of tunes that are frequently played at the Wellington slow session. We probably won't play all of the tunes and may well play some tunes that aren't on the list, but we wanted to provide suggestions so we're sure to have some tunes in common.

The Audio Player provides tools for learning tunes by ear.  Sections of the tune can be played in a loop using the loop control buttons below the position slider. The slider on the right controls the speed of playback allowing you to slow the tune down without altering the pitch. You can also click on the tune name to see the musical notation.

Please come along and join Andy and Ted for some relaxed session play.

Slow Session Tunes
---------

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
{% assign tunes = site.tunes | where: 'tags', 'slow-favourite' %}
{% assign sortedtunes = tunes | sort: 'rhythm' %}
  {% assign tuneid = 200 %}
  {% for tune in sortedtunes %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
  {% endfor %}
</tbody>
</table>
</div>

Background
----------

Andy Linton and Ted Cizadlo started a slow session in Wellington just after the 2015 Wellington Folk Festival. We started the session because we were aware of a number of folks in the Wellington area who enjoyed Irish music, and would like to play in a session, but either didn't know enough tunes, or were new to the scene and needed a more relaxed environment to get started.  Once started we noticed that some folks were using the session as an "on ramp" to fast session playing, while others simply enjoyed playing tunes at a relaxed pace.

We believe the best way to learn tunes for session play is to learn them by ear. The usual way to learn tunes by ear is for someone to play the tune slowly, playing parts of the tune over and over as you play along.  We developed a website to help people learn the tunes, <a href="{{ site.mp3_host }}">{{ site.mp3_host }}</a>, that provides tools for learning tunes by ear from MP3 recordings of session tunes.  Sheet music is also provided for the tunes for folks who prefer to learn by reading music (just click the Tune Name link).

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
