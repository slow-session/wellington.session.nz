---
layout: page
title: Current Tunes
permalink: /current_tunes/
---

These are the some of the tunes we play at the Wellington Session. These tunes will get played regularly so if you know these you'll get a chance to play them.

We've learned many of these tunes during the "Slow Session" part of the evening and you can find these by choosing the "Tags:" option,  picking "Slow Session" and pressing "Select".

<div id="audioPlayer"></div>

{% assign tune_rhythms = '' %}
{% assign tune_tags = '' %}

{% for tune in site.tunes %}
    {% assign tune_rhythms = tune_rhythms | append: tune.rhythm %}
    {% for tag in tune.tags %}
        {% assign tune_tags = tune_tags | append: tag | replace: '"', '' | replace: '[', '' | replace: ']', '' | strip %}
        {% unless forloop.last %}{% assign tune_tags = tune_tags | append: ':' %}{% endunless %}
    {% endfor %}
    {% unless forloop.last %}
        {% assign tune_rhythms = tune_rhythms | append: ':' %}
        {% assign tune_tags = tune_tags | append: ':' %}
    {% endunless %}
{% endfor %}

{% assign tune_rhythms = tune_rhythms | replace: '::', ':' %}
{% assign rhythms = tune_rhythms | split: ':' | uniq | sort %}

{% assign tune_tags = tune_tags | replace: '::', ':' %}
{% assign tags = tune_tags | split: ':' | uniq | sort %}

<fieldset>
    <legend>Select from current Wellington Tunes:</legend>    
    <form id="wellington" method="get">
        <br />
        <span title="Filter the Tunes Archive for tunes by title or by type such as 'Reel', 'Jig', 'Polka'. You can also look for 'tags' such as 'Slow Session, 'Beginner'">  

        Title:
        <input type="text" id="title-box" name="title" value='' onkeydown="enable_button()">
        &emsp;
        Rhythm:
        <select id="rhythm-box" name="rhythm"  onChange="enable_button()">
            <option value="">Any</option>
            {% for rhythm in rhythms %}
            {% if rhythm != '' %}
            <option value="{{ rhythm }}">{{ rhythm | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>&emsp;
        Tags:
        <select id="tags-box" name="tags" onChange="enable_button()">
            <option value="">All Tunes</option>
            {% for tag in tags %}
            {% if tag != '' %}
            <option value="{{ tag }}">{{ tag | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
        </span>    
        &emsp;
        <span title="Run the filter with the default settings to see the whole list">
        <input class="filterButton filterDisabled" id="submit_button" type="submit" name="submit" value="Select" disabled>
        </span>      
    </form>
    <p></p>
    <div id="tunes-count"></div>
</fieldset>

<br />
<div id="tunes-table"></div>
<div id="abc-textareas"></div>

<script>
    window.store = {
      {% assign tuneID = 3000 %}
      {% assign tunes =  site.tunes | sort: 'title' %}
      {% for tune in tunes %}
        {% assign tuneID = tuneID | plus: 1 %}
        "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "location": "{{ tune.location | xml_escape }}",
        "tags": "{{ tune.tags | array_to_sentence_string }}",
        "url": "{{ tune.url | xml_escape }}",
        {% if tune.mp3_file %}"mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
        "abc": ""
        {% else %}"mp3": "",
        "abc": {{ tune.abc | jsonify }}{% endif %}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
</script>

<script type="text/javascript" src="{{ site.js_host }}/js/lunr.min.js"></script>
<script type="text/javascript" src="{{ site.js_host }}/js/build_table.js"></script>

<script>
    $(document).ready(function() {
        audioPlayer.innerHTML = createAudioPlayer();

        /* Set initial sort order */
        $.tablesorter.defaults.sortList = [[0,0]];

        $("#search-results").tablesorter({headers: { 3:{sorter: false}}});    
    });
</script>

<script>
    function enable_button() {
        submit_button.disabled = false;
        submit_button.style.opacity=1.0;
        submit_button.style.cursor='pointer';
    }
</script>
