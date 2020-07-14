---
layout: page
title: Wellington Irish Sessions
---




## Tunes Archives

Many of the tunes that get played at our sessions, including those we've been learning in our slow session, are in our <a href="/tunes_archive/"><button class="filterButton">Tunes Archive</button></a> page. We add new tunes reasonably often - you can check those out in our <a href="/latest/"><button class="filterButton">Latest Tunes</button></a> page.

Charlie Montgomery is a traditional fiddle player from Co Fermanagh who has lived in Auckland, New Zealand for over 60 years. He has been an inspiration for many years to people in New Zealand who have had the privilege of hearing him play. We've got a <a href="/charlie_montgomery/"><button class="filterButton" >Charlie Montgomery</button></a> page where you can hear him playing his own compositions as well as some old favourites.

We've also got some tunes from other sources - mostly tunebooks in ABC or PDF format. See our <a href="/other_sources/"><button class="filterButton">Other Sources</button></a> page.

## Sessions

Two sessions happen on Tuesday nights starting at 7:30 pm at the <a href="/dragon/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Players of traditional Irish music are welcome. The evening is split into two parts with a slow session early on for those who are relatively new to Irish session music and a regular session for experienced players who are familiar with playing this music at a high standard.

<div markdown="1" style="margin-left: 10px; margin-right: 10px;">

### Slow Session - {{ site.slowsession_time }}

The slow session is an opportunity for players who are starting out with Irish traditional music and want an opportunity to play tunes that they're learning or have already learnt with others in a supportive environment. We don't teach tunes directly in this session but we have a tune we're focussing on each week and it's a great chance to practice playing with others. 

{% assign legend="Slow tune of the week" %}
{% assign tuneID = 100 %}
{% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
{% assign tune = sortedtunes.first %}
{% if tune.slowtuneoftheweek %}

{% include tuneoftheweek.html %}

There's some scope for accompaniment but the focus is on melody instruments. 

See our <a href="/slowsession/"><button class="filterButton">Slow Session</button></a> page for more information.

<script>
window.store = {
    "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        "mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
        "mp3_source": "{{ tune.mp3_source | strip_html | xml_escape }}",
        "repeats": "{{ tune.repeats }}",
        "parts": "{{ tune.parts }}",
        "abc": {{ tune.abc | jsonify }}
    },
};
</script>

{% endif %}

### Regular Session - {{ site.session_time }}

The regular session is a different beast from the slow session that happens earlier in the evening. We want this to be an excellent Irish session with a very strong focus on the traditional melody instruments playing traditional tunes. This means that accompaniment from rhythm instruments will be limited so that the melody can shine. 

See our <a href="/regularsession/"><button class="filterButton">Regular Session</button></a> page for more information.


### Other NZ Sessions

There are a number of Irish Music sessions around New Zealand but the number of musicians is relatively small. <a href="https://www.youtube.com/watch?v=9B3_of9CY24">It’s a long, long way from Clare to here</a>. 

See our <a href="/nz_sessions"><button class="filterButton">NZ Sessions</button></a> page for more information.
</div>

{% include tuneModal.html%}

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
});
</script>
