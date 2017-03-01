---
layout: default
---

<script type="text/javascript" src="{{ site.js_host }}/js/audioplayer.js"></script>
<script type="text/javascript" src="{{ site.js_host }}/js/musical-ws.js"></script>
<script type="text/javascript" src="{{ site.js_host }}/js/abc_controls.js"></script>

<div id="audioPlayer"></div>

Recent Tunes
------------

These are tunes that have been added to the archive recently.

<div id="abc-textareas"></div>

<table style="width:100%" id="recenttunes" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:4%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:65%;">Audio Player</th>
    </tr>
</thead>
<tbody>
  {% assign sortedtunes = site.tunes | sort: 'title' %}
  {% assign count = 200 %}
  {% capture tendaysago %}{{ 'now' | date: '%s' | minus : 864000 }}{% endcapture %}
    {% for tune in sortedtunes %}
        {% capture posttime %}{{tune.date | date: '%s'}}{% endcapture %}
        {% if posttime > tendaysago %}
        {% assign count = count | plus: 1 %}
<tr>
{% include tablerow.html counter=count %}
</tr>
      {% endif %}
{% endfor %}
</tbody>
</table>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    // turn off sorting on last column
    $("#recenttunes").tablesorter({headers: { 3:{sorter: false}}});
});
</script>
