---
layout: page
title: Exercises
permalink: /learn_by_ear/exercises
---
<div id="audioPlayer"></div>

* TOC
{:toc}

<table style="width:100%" id="focusexercises" class="tablesorter">
<thead>
    <tr>
    <th style="width:75%;">Audio Player</th>
    <th style="width:25%;">Notes</th>
    </tr>
</thead>
<tbody>
{% assign exercises = site.exercises | where: 'tags', 'exercise' %}
{% assign sortedexercises = exercises | sort: 'title' %}
  {% assign exerciseid = 200 %}
  {% for exercise in sortedexercises %}
      {% assign exerciseid = exerciseid | plus: 1 %}
<tr>
{% include exerciserow.html exerciseId=exerciseid %}
</tr>
  {% endfor %}
</tbody>
</table>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
});
