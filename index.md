---
layout: page
title: The Wellington Session
---
<div id="audioPlayer"></div>

The Wellington Session happens on Tuesday nights from 7:30 p.m. at the
<a href="/venue/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand.
All players of traditional Irish music are welcome. The session starts slowly, as we work
through new tunes and tunes we are just learning:

* TOC
{:toc}

If you are relatively new to playing this music, come along right at the start. The pace usually picks up as the evening progresses, so if you are already fluent in tunes,
come along after 8:30. Of course, we'd be happy to have experienced players playing **slowly**
earlier on as well!

You can see a list of some of the tunes that get played at the session including those we've been
learning in the slow part of the session in our <a href="/tunes_archive/">Tunes Archive</a> page.

{::nomarkdown}
<img alt="NEW!" src="/images/new.gif" border=0 height="48" width="48"> We add new tunes reasonably often - you can check those out in our <a href="/latest/">Latest Tunes</a> page.
{:/}


Tune of the Week
================

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
==================

Here are some of the tunes we'll be playing at a relaxed speed during the first hour.

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


NZ Sessions
==============

There are a number of Irish Music sessions around New Zealand but the number of musicians is relatively small. It’s a long, long way from Clare to here.

Find out more information in our <a href="/nz_sessions">NZ Sessions</a> page.

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
});
</script>
