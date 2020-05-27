---
layout: page
title: Tunes Archive
permalink: /tunes_archive/
---
<p>
Play a tune now using the <strong>Play Now</strong> button or use the
link to the Tune Page for a more traditional view. We add new tunes to the archive reasonably often.
You can check those out in our <a href="/latest/"><button class="filterButton" style="display: inline;"> Latest Tunes</button></a> page.
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

<fieldset>
    <legend>Select from the Tunes Archive:</legend>
    <form id="wellington" method="get">
        <div class="formParent">
        <div class="formChild">
            <input type="text" id="title-box" name="title" placeholder='Search'
            value='' onkeydown="enable_button()">
        </div>
        <div class="formChild">
            <select id="rhythm-box" name="rhythm"  onChange="enable_button()">
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
            <span title="Run the filter with the default settings to see the whole list">
            <input class="filterButton filterDisabled" id="submit_button" type="submit" name="submit" value="Select" disabled>
            </span>
        </div>
        <div class="formChild">      
            <div class="tooltip filterButton"><em>Help</em>
                <span class="tooltiptext">Run the filter with the default settings to see the whole list</span>
            </div>
        </div>
        </div>
    </form>
    <p></p>
    Scroll &#8593;&#8595; to choose from <span id="tunesCount"></span> tunes
</fieldset>

{% include tunesArchiveGrid.html%}

<div class="row"></div>

{% include tuneModal.html%}

<script>
  $(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
  });
</script>

<script>
// When the user clicks on <div>, open the popup
function helpFunction() {
  var popup = document.getElementById("helpPopup");
  popup.classList.toggle("show");
}
</script>
