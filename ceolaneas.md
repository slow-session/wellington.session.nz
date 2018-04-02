---
layout: page
title: Ceol Aneas slow sessions
permalink: /ceolaneas/
---
<div id="audioPlayer"></div>

<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

During Ceol Aneas 2017 in Nelson we'll be running a couple of slow sessions at
the Accents YHA Hostel where many of us are staying. They'll be in the kitchen:

 * Sat 3 June from 4 - 6pm
 * Sun 4 June from 3 - 5pm

We'll be playing tunes at a slow pace. Please come along and join Andy and Ted
for some relaxed session play.

* TOC
{:toc}

Slow Session Tunes
---------
Here are some ideas for the tunes we might play at a very relaxed speed during
the Slow Sessions. We probably won't play all of the tunes, and we might not play
them in these sets and may well play some tunes that aren't on the list, but we
wanted to provide suggestions so we have some tunes in common.

<table style="width:100%" id="ca-set" class="tablesorter">
<thead>
    <tr>
    <th style="width:20%;">Set Name&#x25B2;&#x25BC;</th>
    <th style="width:9%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:26%;">Titles</th>
    <th style="width:45%;">Audio Player</th>
    </tr>
</thead>
<tbody>
{% assign sets = site.sets | where: 'tags', 'ca-set' %}
{% assign setid = 200 %}
{% for set in sets %}
{% assign setid = setid | plus: 1 %}
<tr>
{% include setrow.html setId=setid %}
</tr>
{% endfor %}
</tbody>
</table>
<br />
<table style="width:100%" id="ca" class="tablesorter">
<thead>
    <tr>
    <th style="width:20%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:55%;">Audio Player</th>
    </tr>
</thead>
<tbody>
{% assign tunes = site.tunes | where: 'tags', 'ca' %}
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
to help people learn the tunes. That website
(<a href="http://wellington.session.nz">http://wellington.session.nz</a>)
is designed to provide all of the tools necessary to learn tunes by ear from MP3
recordings of session tunes.  Sheet music is also provided for the tunes for
folks who prefer to learn by reading music (just click the Tune Name link).

We created this website for the slow sessions at Ceol Aneas in Nelson.  If you
want to look at the tunes before the slow sessions, please check out this site and
have a listen and a play.

Other tunes
-----------

Check out the <a href="http://wellington.session.nz">Wellington Session</a> page
to see what we're playing there.

There's also a large list of tunes including tunes played in other New Zealand sessions in the
<a href="{{ site.mp3_host }}/archive/">NZ Archive</a> page.  Feel free to poke around.


<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#focustunes").tablesorter({
        headers: {
            4: {
                sorter: false
            }
        }
    });

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
