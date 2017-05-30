---
layout: page
---
<div id="audioPlayer"></div>

<fieldset>
<p>No session on June 6 - we're off to see <a href="https://www.facebook.com/events/1853262881607242/?acontext=%7B%22ref%22%3A%222%22%2C%22ref_dashboard_filter%22%3A%22upcoming%22%2C%22action_history%22%3A%22[%7B%5C%22surface%5C%22%3A%5C%22dashboard%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22main_list%5C%22%2C%5C%22extra_data%5C%22%3A[]%7D]%22%7D">Kevin Crawford, Colin Farrell and Patrick Doocey</a> at Meow.
</p>
<p>
And we'll be at the Sprig and Fern, Thorndon during June:
</p>
<ul>
 <li><a href="https://www.facebook.com/events/1680406618922453/?acontext=%7B%22ref%22%3A%222%22%2C%22ref_dashboard_filter%22%3A%22upcoming%22%2C%22action_history%22%3A%22[%7B%5C%22surface%5C%22%3A%5C%22dashboard%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22main_list%5C%22%2C%5C%22extra_data%5C%22%3A[]%7D]%22%7D">13 June</a></li>
 <li><a href="https://www.facebook.com/events/1912990012318807/?acontext=%7B%22ref%22%3A%222%22%2C%22ref_dashboard_filter%22%3A%22upcoming%22%2C%22action_history%22%3A%22%5B%7B%5C%22surface%5C%22%3A%5C%22dashboard%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22main_list%5C%22%2C%5C%22extra_data%5C%22%3A%5B%5D%7D%5D%22%7D">20 June</a></li>
<li><a href="https://www.facebook.com/events/180352249155454/?acontext=%7B%22ref%22%3A%222%22%2C%22ref_dashboard_filter%22%3A%22upcoming%22%2C%22action_history%22%3A%22%5B%7B%5C%22surface%5C%22%3A%5C%22dashboard%5C%22%2C%5C%22mechanism%5C%22%3A%5C%22main_list%5C%22%2C%5C%22extra_data%5C%22%3A%5B%5D%7D%5D%22%7D">27 June</a></li>
</ul></fieldset>


The Wellington Session happens on Tuesday nights from 7:30 p.m. at the
<a href="/venue/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand.
All players of traditional Irish music are welcome. The session starts slowly, as we work
through new tunes and tunes we are just learning:

* TOC
{:toc}

If you are relatively new to playing this music, come along right at the start.

The pace usually picks up as the evening progresses, so if you are already fluent in tunes,
come along after 8:30. Of course, we'd be happy to have experienced players playing **slowly**
earlier on as well!

We add new tunes reasonably often - you can check those out in our <a href="/latest/">Latest Tunes</a> page.

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
{% assign tunes = site.tunes | where: 'tags', 'tuneoftheweek' | where: 'tags', 'slowsession' %}
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
---------


Here are some of the tunes we'll be playing at a relaxed speed during the first hour.

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
<br />
<table style="width:100%" id="focustunes" class="tablesorter">
<thead>
    <tr>
    <th style="width:20%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:55%;">Audio Player</th>
    </tr>
</thead>
<tbody>
{% assign tunes = site.tunes | where: 'tags', 'focustune' | where: 'tags', 'slowsession' %}
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

Other Tunes
-----------

You can see a list of some of the tunes that get played at the session including those we've been
learning in the slow part of the session in our <a href="/current_tunes/">Tunes</a> page.

There's also a large list of tunes including tunes played in other New Zealand sessions in the
<a href="{{ site.mp3_host }}/archive/">NZ Archive</a> page.  Feel free to poke around.


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
