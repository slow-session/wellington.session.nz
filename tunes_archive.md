---
layout: page
title: Tunes Archive
permalink: /tunes_archive/
---
<p>
Play a tune now using the <strong>Play Now</strong> button or use the
link to the Tune Page for a more traditional view. We add new tunes to the archive reasonably often.
You can check those out in our <a href="/latest/"> Latest Tunes</a> page.
</p>

<script>
window.store = {
    {% assign tunes = site.tunes %}
    {% assign sortedtunes = tunes | sort: 'titleID' %}
    {% assign tuneID = 200 %}
    {% for tune in sortedtunes %}
    {% assign tuneID = tuneID | plus: 1 %}
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
            }{% unless forloop.last %},{% endunless %}
        {% endfor %}
    };
</script>

{% include tunes-filter-variables.html %}

<form onsubmit="return false">
    <fieldset>
        <legend>Select from the Tunes Archive:</legend>    
        <div class="formParent">
            <div class="formChild">
                <input type="text" id="title-box" name="searchTitle" placeholder='Search'
                value='' onkeydown="wssTools.enableSearchButton()">
            </div>
            <div class="formChild">
                <select id="rhythm-box" name="searchRhythm"  onChange="wssTools.enableSearchButton()">
                    <option value="">All Rhythms</option>
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
                <input class="filterButton filterDisabled" id="submitSearch" type="submit" name="submit" value="Select" onclick="buildGrid.formSearch('tunesarchive', [searchTitle.value, searchRhythm.value])" disabled>
            </div>
            <div class="formChild">   
                <span title="Reset to default">  
                    <input class="filterButton" id="formReset" type="button" name="reset" value="Reset" onclick="buildGrid.formReset('tunesarchive', ['title-box', 'rhythm-box'])">
                </span>
            </div>
        </div>     
        <p></p>
        Scroll &#8593;&#8595; to choose from <span id="tunesCount"></span> tunes
    </fieldset>
</form>

{% include tuneModal.html%}

<!-- START of Tunes Grid -->
<div class="gridParent">
  <div class="gridChild" id="tunesGrid"></div>
</div>

<script src="{{ site.js_host }}/js/buildGrid.js"></script>
<!-- END of Tunes Grid -->

<script>
buildGrid.initialiseLunrSearch();
    
document.addEventListener("DOMContentLoaded", function (event) {
    buildGrid.displayGrid("tunesarchive", "", window.store);
});
</script>
