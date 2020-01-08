---
layout: page
title: Ceol Aneas Banjo / Mandolin Tunes
permalink: /CA-Banjo-Mandolin/
---
<div id="audioPlayer"></div>

<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

Angela Usher, our banjo/mandolin tutor provided 8 tunes for her Ceol Aneas students to look at in advance.

Some students do not learn new tunes quickly and struggle to remember the notes in the bones of a new tune when the teacher would like to be pointing out ornaments or variations.
We offered CA-2019 Tutors an opportunity to send us a simple (mobile phone quality) recording of some of the tunes they would like to teach.

<div style="overflow-x:auto;">
<table style="width:100%" id="tunes" class="tablesorter">
<thead>
    <tr>
    <th style="width:20%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:55%;">Audio Player</th>
    </tr>
</thead>
<tbody>
{% assign tunes = site.tunes | where: 'tags', 'ca-banjo-mandolin-2019' %}
{% assign sortedtunes = tunes | sort: 'title' %}
  {% assign tuneid = 200 %}
  {% for tune in sortedtunes %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
  {% endfor %}
</tbody>
</table>
</div>

Other tunes
-----------

Check out the <a href="/slowsession/">Wellington Slow Session</a> page
to see what we're playing there.

There's also a large list of tunes including tunes played in other New Zealand sessions in the
<a href="/tunes_archive/">Tunes Archive</a> page.  Feel free to poke around.

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last two columns */
    $("#tunes").tablesorter({
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
