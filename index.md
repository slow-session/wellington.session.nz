---
layout: page
title: Wellington Irish Sessions
---
Two sessions happen on Tuesday nights starting at 7:30 pm at the <a href="/dragon/">Welsh Dragon Bar</a>, 10/12 Cambridge Terrace, Wellington 6011, New Zealand. Players of traditional Irish music are welcome. The evening is split into two parts with a slow session early on for those who are relatively new to Irish session music and a regular session for experienced players who are familiar with playing this music at a high standard.

But first a public service announcement:

<div class="licenceUsed">
<h2>Charlie Montgomery</h2>
<p>
Charlie Montgomery is a traditional fiddle player from Co Fermanagh who has lived in Auckland, New Zealand for over 60 years. He has been an inspiration for many years to people in New Zealand who have had the privilege of hearing him play. Charlie has also composed many tunes and you can find them on <a href="/charlie_montgomery/">this page</a> as well as him playing some old favourites.
</p>
<p>
We'd like to thank Charlie very much for giving us the privilege of being able to post these recordings. We hope you'll enjoy listening and learning these tunes from his playing.
</p>
</div>

<a href="/slowsession/">Slow Session</a> - {{ site.slowsession_time }}
------------

The slow session is an opportunity for players who are starting out with Irish traditional music and want an opportunity to play tunes that they're learning or have already learnt with others in a supportive environment. We don't teach tunes directly in this session but it's a great chance to practice playing with others. There's some scope for accompaniment but the focus is on the melody instruments. See our <a href="/slowsession/">Slow Session</a> page for more information.

{% assign tuneID = 100 %}
{% assign sortedtunes = site.tunes | sort: 'slowtuneoftheweek' | reverse %}
{% assign tune = sortedtunes.first %}
{% if tune.slowtuneoftheweek %}
<fieldset class="fieldset-auto-width">
<legend>Slow tune of the week:</legend>
<div class="row">
    <div class="small-5 columns">
        <span title="Go to Tunepage">
            <a href="{{ tune.url }}">{{ tune.title }}</a>
        </span>
    </div>
    <div class="small-3 columns">
        <input class="filterButton" type="button" onclick="changeTune({{ tuneID }});" value="Play Now" />
    </div>
    <div class="small-3 columns">
        {{ tune.key }} {{ tune.rhythm }}
    </div>
</div>
</fieldset>

<div class="row"></div>

<script>
tuneOfTheWeek = {
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

<br />

<a href="/regularsession/">Regular Session</a> - {{ site.session_time }}
--------------

The regular session is a different beast from the slow session that happens earlier in the evening. We want this to be an excellent Irish session with a very strong focus on the traditional melody instruments playing traditional tunes. This means that accompaniment from rhythm instruments will be limited so that the melody can shine. See our <a href="/regularsession/">Regular Session</a> page for more information.

{% assign sortedtunes = site.tunes | sort: 'regtuneoftheweek' | reverse %}
{% assign tuneID = tuneID | plus: 1 %}
{% assign tune = sortedtunes.first %}
{% if tune.regtuneoftheweek %}
<fieldset class="fieldset-auto-width">
<legend>Regular tune of the week:</legend>
<div class="row">
    <div class="small-5 columns">
        <span title="Go to Tunepage">
            <a href="{{ tune.url }}">{{ tune.title }}</a>
        </span>
    </div>
    <div class="small-3 columns">
        <input class="filterButton" type="button" onclick="changeTune({{ tuneID }});" value="Play Now" />
    </div>
    <div class="small-3 columns">
        {{ tune.key }} {{ tune.rhythm }}
    </div>
</div>
</fieldset>

<div class="row"></div>

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

// Add slow tune of the week into the window.store
$.extend(window.store, tuneOfTheWeek);
</script>

{% endif %}

<br />

<a href="/tunes_archive/">Tunes Archive</a>
------------

Many of the tunes that get played at the sessions, including those we've been learning in the slow session, are in our <a href="/tunes_archive/">Tunes Archive</a> page. We add new tunes reasonably often - you can check those out in our <a href="/latest/"><button class="filterButton" style="display: inline;"> Latest Tunes</button></a> page.


<a href="/nz_sessions">Other NZ Sessions</a>
--------------

There are a number of Irish Music sessions around New Zealand but the number of musicians is relatively small. <a href="https://www.youtube.com/watch?v=9B3_of9CY24">It’s a long, long way from Clare to here</a>. See our <a href="/nz_sessions">NZ Sessions</a> page for more information.

{% include tuneModal.html%}

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
});
</script>
