---
layout: page
title: Christchurch sessions
permalink: /christchurch/
---
<div id="audioPlayer"></div>

<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

Blah Blah at time and date....

* TOC
{:toc}

Slow Session Tunes
---------

<table style="width:100%" id="sets" class="tablesorter">
<thead>
    <tr>
    <th style="width:20%;">Set Name&#x25B2;&#x25BC;</th>
    <th style="width:9%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:26%;">Titles</th>
    <th style="width:45%;">Audio Player</th>
    </tr>
</thead>
<tbody>
{% assign setid = 200 %}
{% for set in site.sets %}
{% if set.location contains 'Christchurch' %}
{% assign setid = setid | plus: 1 %}
{% include setrow.html setId=setid %}
{% endif %}
{% endfor %}
</tbody>
</table>
<br />
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
{% assign sortedtunes = site.tunes | sort: 'title' %}
  {% assign tuneid = 200 %}
  {% for tune in sortedtunes %}
    {% if tune.location contains 'Christchurch' %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
    {% endif %}
  {% endfor %}
</tbody>
</table>

Background
----------

More blah...

Other tunes
-----------

There's a large list of tunes including tunes played in other New Zealand sessions in the
<a href="/tunes_archive/">Tunes Archive</a> page.  Feel free to poke around.


<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* turn off sorting on last column */
    $("#sets").tablesorter({
        headers: {
            4: {
                sorter: false
            }
        }
    });

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
