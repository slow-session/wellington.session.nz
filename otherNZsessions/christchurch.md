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

Sessions are currently...

 - every second Wednesday in A Rolling Stone  - 579 Colombo St, Christchurch at 8pm
 - every second Monday in Vesuvios - 4 Papanui Rd, Merivale, Christchurch at 7pm
 - every Friday in Finnegans Irish Pub - Springs Rd 7604 Prebbleton (about 20K outside Christchurch) at 8pm

Call Lorcan on 021-021565173 for more details.

You'll find more information on our <a href="https://www.facebook.com/groups/2002032703369140/">Facebook page</a>

You can find some of the tunes we're playing below. We hope to add more as time goes on.

Session Tunes
---------

<div style="overflow-x:auto;">
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
</div>
<br />
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
</div>

<br />

The session at Prebbleton tells us that they have a somewhat different list of tunes.

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
{% assign sortedtunes = site.tunes | sort: 'title' %}
  {% for tune in sortedtunes %}
    {% if tune.location contains 'Prebbleton' %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
    {% endif %}
  {% endfor %}
</tbody>
</table>
</div>

<br />

Other tunes
-----------

There's a large list of tunes including tunes played in other New Zealand sessions in the
<a href="/tunes_archive/">Tunes Archive</a> page.  Feel free to poke around.


<script>
document.addEventListener("DOMContentLoaded", function (event) {
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
