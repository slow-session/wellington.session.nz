---
layout: page
title: Wellyfest slow session
permalink: /wellyfest/
---
<div id="audioPlayer"></div>
<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

During <a href="http://wellingtonfolkfestival.org.nz/">Wellyfest</a> at Brookfield 2017 we'll be running a slow session Saturday afternoon in the Nelson Lounge from 12:30 to 2:30.

We'll be playing tunes at a slow pace. Please come along and join Andy and Ted
for some relaxed session play.

* TOC
{:toc}

Tunes we'll learn
---------

This is our first Slow Session Workshop at Wellyfest so we don't know who will turn up.
We reckon some of those who'll come will be new to playing this music and so we want to
spend some time at the start on how we learn this music.

We believe the best way to learn tunes for session play is to learn them by ear.
The usual way to learn tunes by ear is for someone to play the tune slowly,
playing parts of the tune over and over as you play along. With that in mind
we'll spend some time at the start on some or all of these tunes
and if everybody knows these we'll tackle some others!

<div style="overflow-x:auto;">
<table style="width:100%" id="tunestolearn" class="tablesorter">
<thead>
    <tr>
    <th style="width:20%;">&nbsp;Tune Name&nbsp;</th>
    <th style="width:6%;">&nbsp;Key&nbsp;</th>
    <th style="width:6%;">&nbsp;Rhythm&nbsp;</th>
    <th style="width:55%;">Audio Player</th>
    </tr>
</thead>

<tbody>
{% assign tunes = site.tunes | where: 'tags', 'wellyfest-learn' | where: 'rhythm', 'reel' %}
{% assign sortedtunes = tunes | sort: 'title' %}
{% assign tuneid = 100 %}
{% for tune in sortedtunes %}
    {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
{% endfor %}
{% assign tunes = site.tunes | where: 'tags', 'wellyfest-learn' | where: 'rhythm', 'jig' %}
{% assign sortedtunes = tunes | sort: 'title' %}
{% for tune in sortedtunes %}
    {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
{% endfor %}
</tbody>
</table>
</div>

Slow Session Tunes
---------

Here are some ideas for the tunes we might play at a very relaxed speed during
the Slow Sessions. We probably won't play all of the tunes and may well play
some tunes that aren't on the list, but we wanted to provide suggestions so we
have some tunes in common.

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
{% assign tunes = site.tunes | where: 'tags', 'wellyfest' %}
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

Andy Linton and Ted Cizadlo started a slow session in Wellington just after the
2015 Wellington Folk Festival. We started the session because we were aware
of a number of folks in the Wellington area who enjoyed Irish music, and would like to play
in a session, but either didn't know enough tunes, or were new to the scene and
needed a more relaxed environment to get started.  Once started we noticed that
some folks were using the session as an "on ramp" to fast session playing, while
others simply enjoyed playing tunes at a relaxed pace.

We believe the best way to learn tunes for session play is to learn them by ear.
The usual way to learn tunes by ear is for someone to play the tune slowly,
playing parts of the tune over and over as you play along.  We developed a website
to help people learn the tunes, <a href="{{ site.mp3_host }}">{{ site.mp3_host }}</a>,
that provides tools for learning tunes by ear from MP3
recordings of session tunes.  Sheet music is also provided for the tunes for
folks who prefer to learn by reading music (just click the Tune Name link).

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
