---
layout: page
title: Charlie Montgomery
permalink: /charlie_montgomery/
---
<p>
<img class="featurePicture" alt="Charlie Montgomery" src="/images/charliemontgomery.jpg">
Charlie Montgomery is a traditional fiddle player from Co Fermanagh who has lived in Auckland, New Zealand for over 60 years. He has been an inspiration for many years to people in New Zealand who have had the privilege of hearing him play. Charlie has also composed many tunes and you can find them on this page as well as him playing some old favourites.
</p>
<p>
We'd like to thank Charlie very much for giving us the privilege of being able to post these recordings. We hope you'll enjoy listening and learning these tunes from his playing.
</p>

<div class="row"></div>

<hr style="margin-top: 1rem; margin-bottom: 1rem;" />
<p>Go to the Tune Page by selecting the link in the first column or play a tune now using the <strong>Play Now</strong> button.</p>

<div class="row"></div>

{% include tunes-filter-variables.html %}

<form id="wellington" method="get">
    <fieldset>
        <legend>Select from the Tunes Archive:</legend>    
    
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
        <p></p>
        Charlie's compositions tagged with <strong>*</strong>    
        <p></p>
        Scroll &#8593;&#8595; to choose from <span id="tunesCount"></span> tunes
    </fieldset>
</form>

<div class="row"></div>

<script>
    window.store = {

      {% assign tunes = site.tunes %}
      {% assign sortedtunes = tunes | sort: 'titleID' %}
      {% assign tuneID = 200 %}
      {% for tune in sortedtunes %}
        {% if tune.tags contains 'cm' %}
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
        {% endif %}
      {% endfor %}
    };
</script>

{% include tunesArchiveGrid.html%}

{% include tuneModal.html%}

<script>
  $(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();
  });
</script>
