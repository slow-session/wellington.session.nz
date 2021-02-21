---
layout: page
title: Historic Sets
permalink: /historic_sets/
---

These are sets we sometimes play at the Wellington Slow Session.

If you want to compile your own, you can put tunes together and try them out using our <button class="filterButton" onclick="window.location.href = '/build_a_set/';">Build a Set</button>
page.

{% include tunes-filter-variables.html %}

<form id="wellington" method="get">
    <fieldset>
        <legend>Select from historical Wellington Sets:</legend>    
        <div class="formParent">
            <div class="formChild">           
                <input type="text" id="title-box" name="title" placeholder='Search' value='' onkeydown="wssTools.enableSearchButton()">
            </div>
            <div class="formChild">
                <select id="rhythm-box" name="rhythm"  onChange="wssTools.enableSearchButton()">
                    <option value="">Any Rhythm</option>
                    {% for rhythm in rhythms %}
                    {% if rhythm != '' %}
                    <option value="{{ rhythm }}">{{ rhythm | capitalize }}</option>
                    {% endif %}
                    {% endfor %}
                </select>    
            </div>
        </div>
        <div class="formParent">
            <div class="formChild">
                <span title="Run the filter with the default settings to see the whole list">
                    <input class="filterButton filterDisabled" id="submitSearch" type="submit" name="submit" value="Select" disabled>
                </span>
            </div>
        </div>     
        <p></p>
        Scroll &#8593;&#8595; to choose from <span id="tunesCount"></span> sets
    </fieldset>
</form>

<div class="row"></div>

{% assign tuneID = 1 %}
{% assign setID = 1 %}
{% for set in site.sets %}
    {% for setTune in set.tunes %}
        {% assign setTunes = setTunes | append: setTune | append: ' ' %}
    {% endfor %}
{% endfor %}
{% assign setTunes = setTunes | split: ' ' | uniq | sort %}

<script>
window.store = {
{% for setTune in setTunes %}
{% assign siteTunes = site.tunes | where: 'titleID', setTune %}
{% for tune in siteTunes %}
"{{ tuneID }}": {
    "title": "{{ tune.title | xml_escape }}",
    "tuneID": "{{ tune.titleID }}",
    "key": "{{ tune.key | xml_escape }}",
    "rhythm": "{{ tune.rhythm | xml_escape }}",
    "url": "{{ tune.url | xml_escape }}",
    "mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
    "mp3_source": "{{ tune.mp3_source | strip_html | xml_escape }}",
    "repeats": "{{ tune.repeats }}",
    "parts": "{{ tune.parts }}",
    "abc": {{ tune.abc | jsonify }}
},
{% assign tuneID = tuneID | plus: 1 %}
{% endfor %}
{% endfor %}
};

window.setStore = {
{% assign sets = site.sets %}
{% assign sortedsets = sets | sort: 'url' %}
{% for set in sortedsets %}
    {% assign tuneList = set.tunes | split: ", " %}
"{{ setID }}": {
    "title": "{{ set.title | xml_escape }}",
    "setID": "{{ setID }}",
    "rhythm": "{{ set.rhythm | xml_escape }}",
    "location": "{{ set.location | xml_escape }}",
    "url": "{{ set.url | uri_escape }}",
    "setTunes": {{ tuneList | join: ", " }},
    "tuneIDs": "",
    },
{% assign setID = setID | plus: 1 %}
{% endfor %}
};
</script>

{% include tunesSetsGrid.html %}

{% include tuneModal.html %}

<script>
document.addEventListener("DOMContentLoaded", function (event) {
    pageAudioPlayer.innerHTML = audioPlayer.createAudioPlayer();
});
</script>
