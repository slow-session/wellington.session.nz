---
layout: page
title: Tommie Potts Videos
permalink: /pottstunes/
---
In September 2020, Ronan Brown uploaded a set of 12 videos of an interview with Tommie Potts to YouTube.

The notes from the <a href="https://www.youtube.com/playlist?list=PL2YNuHhQ69tdlJ_laLyGe5G-CDdk2u5Rp">YouTube playlist</a> say:

<div class="showTextInfo">
<p>
Although chopped into chunks, the full playlist is best watched straight through to get what happened that day.
</p>
<p>
Filmed by Mícheál Ó Súilleabháin, as research for his PhD, this video very nearly didn't happen – Tommie Potts rang up Peter O'Loughlin saying that he was being pestered by this lad wanting to interview him for his thesis, and that he really wasn't inclined; Peter persuaded Tommie to acquiesce and here we are, many decades later, with some wonderful footage, not only of Tommie playing, but also of him talking, explaining, and answering questions from Mícheál.  That said, the questions are just the slightest bit designed and tailored to back up Mícheál's theories as to why Tommie played as he did.  Either way, how lucky are we that this was filmed and still exists...!
</p>
</div>

We've added audio of versions of the recordings (with some clean up of the audio) in the same order to our archive so that you can easily listen to them with options to select small parts of the audio in a loop and to slow things down so you can hear what's going on more easily. We hope you find it interesting/useful.


<script>
    window.store = {
      {% assign tuneID = 3000 %}
      {% assign tunes =  site.pottstunes %}
      {% for tune in tunes %}
        {% assign tuneID = tuneID | plus: 1 %}
        "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "track": "{{ tune.track | xml_escape }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
</script>

{% include tunesPottsGrid.html %}

<script>
$(document).ready(function() {
    console.log("Ready");
});
</script>
