---
layout: page
title: Victoria University Folk Club Tunes
permalink: /vicfolk/
header: yes
header_sm: images/vicfolk-small.jpg
header_med: images/vicfolk-med.jpg
header_large: images/vicfolk-large.jpg
header_xl: images/vicfolk-xl.jpg
---
<div id="audioPlayer"></div>

<div id="abc-textareas"></div>
<script>
var textAreas = document.getElementById("abc-textareas");
</script>

You'll find more information about our activities
on the <a href="https://www.facebook.com/VicFolkMusic/">VicFolk Facebook page</a>

Current tunes
-------------

These are the some of the tunes we play. These tunes will get played regularly
so if you know these you'll get a chance to play them.

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
    {% if tune.tags contains 'vicfolk' %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow.html tuneId=tuneid %}
    {% endif %}
  {% endfor %}
</tbody>
</table>
</div>

Current Sets
------------

These are the some of the sets we play at VicFolk Ceilis. These sets will get played regularly so if you know these you'll get a chance to play them.

If you don't find the set you're looking for you can put tunes together and try them out using the <a href="/build_a_set/">Build a Set</a> page.

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
{% if set.tags contains 'vicfolk' %}
{% assign setid = setid | plus: 1 %}
{% include setrow.html setId=setid %}
{% endif %}
{% endfor %}
</tbody>
</table>
</div>

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
