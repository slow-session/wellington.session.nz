---
layout: default
---

<script type="text/javascript" src="{{ site.mp3_host }}/js/audio_controls.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/musical-ws.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/abc_controls.js"></script>

The Wellington Session happens on Tuesday nights from 7:30 p.m. at the 
<a href="/venue/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand.
All players of traditional Irish music are welcome. The session starts slowly, as we work 
through beginner and recently learnt tunes:
    
* TOC
{:toc}
    
If you are relatively new to playing this music, come along right at the start.

The pace usually picks up as the evening progresses, so if you are already fluent in tunes, 
come along after 8:30. Of course, we'd be happy to have experienced players playing **slowly** 
earlier on as well!

<p style="text-align:left">
<a target="_blank" title="follow us on facebook" href="http://www.facebook.com/groups/WellingtonSession/"><img alt="follow us on facebook" src="/images/badgefacebook.png"></a>
Find out more about us and upcoming sessions.
</p>

Beginner's tunes
----------------

If you are starting to learn Irish music, have a go at learning these tunes. Come down to the 
slow session at 7:30 on Tuesday evenings at the Welsh Dragon to try them out. We'll play them 
slowly so you can join in.

<div id="abc-textareas"></div>

<table style="width:100%" id="beginner" class="tablesorter">
<thead><tr>
    <th style="width:25%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:4%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:40%;">Audio Control</th>
    <th style="width:25%;">Speed Adjustment</th>
    </tr>
</thead>
<tbody>
  {% assign sortedtunes = site.tunes | sort: 'title' %}
  {% assign count = 100 %}
  {% for tune in sortedtunes %}
      {% if tune.tags contains 'beginner' and tune.tags contains 'slowsession'%}
          {% assign count = count | plus: 1 %}
<tr>
{% include tablerow.html counter=count speed=80 %}
</tr>
      {% endif %}
{% endfor %}
</tbody>
</table>

New tunes
---------

We pick one or two new tunes each week for homework and we play these at a moderate pace around 8:00 after the beginner part of the session. Here are the last eight tunes we've worked on:

<table style="width:100%" id="newtunes" class="tablesorter">
<thead>
    <tr>
    <th style="width:25%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:4%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    <th style="width:40%;">Audio Control</th>
    <th style="width:25%;">Speed Adjustment</th>
    </tr>
</thead>
<tbody>
  {% assign sortedtunes = site.tunes | sort: 'date' | reverse %}
  {% assign tune_count = 0 %
  {% assign count = 200 %}
  {% for tune in sortedtunes %}
      {% if tune.tags contains 'slowsession' %}
          {% if tune.tags contains 'beginner' %}
              {% continue %}
          {% endif %}
          {% assign count = count | plus: 1 %}
<tr>
{% include tablerow.html  counter=count speed=90 %}
</tr>
          {% assign tune_count = tune_count | plus: 1 %}
      {% endif %}
      {% if tune_count == 8 %}
      {% break %}
      {% endif %}
  {% endfor %}
</tbody>
</table>

<br />
<p class="rss-subscribe">If you're familiar with using an RSS feed you can subscribe to new tune announcements <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS <img src="images/feed-icon-28x28.png" alt=""></a></p>

Other Tunes
-----------

You can see a list of some of the tunes that get played at the session including those we've been
learning at the slow part of the session in our <a href="/current_tunes/">Current Tunes</a> page.

There's also a comprehensive list of tunes including some that we haven't started yet in the 
<a href="http://session.nz/archive/">NZ Archive</a> page.  Feel free to poke around.


<script>
$(document).ready(function() { 
    // turn off sorting on last two columns
    $("#beginner").tablesorter({headers: { 3:{sorter: false}, 4: {sorter: false}}});
    $("#newtunes").tablesorter({headers: { 3:{sorter: false}, 4: {sorter: false}}});
}); 
</script>
