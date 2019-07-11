---
layout: page
title: Tunes Archive
permalink: /tunes_archive/
---
Many of the tunes listed here get played at the Wellington Session. There are
also a number of tunes from other parts of the country. You can look at them all
or you can select by area such as Hamilton, Wellington, Arrowtown, Dunedin etc.
**We're happy to add tunes from other parts of NZ.**


{::nomarkdown}
<p>
<img alt="NEW!" src="/images/new.gif"  height="48" width="48"> We add new tunes reasonably often - you can check those out in our
<button class="filterButton" onclick="window.location.href = '/latest/';">Latest Tunes</button>
page.
</p>
{:/}

We've got a number of tunes that we know well at the Slow Session. We don't play all of these every week but if you're at our session and want to play some of these tunes with us, there's a good chance someone else will know them. You can find these tunes by choosing the "All Tunes" option,  picking "Slow-favourite" and pressing "Select"

<div id="audioPlayer"></div>

<!-- Some boilerplate that's common to a number of pages -->
{% include tunes-filter-variables.html %}

<fieldset>
    <legend>Select from the Tunes Archive:</legend>    
    <form id="wellington" method="get">
        <br />
        <span title="Filter the Tunes Archive for tunes by title or by type such as 'Reel', 'Jig', 'Polka'. You can also look for 'tags' such as 'Slowsession, 'Beginner'">  

        <input type="text" id="title-box" name="title" placeholder='Search'
            value='' onkeydown="enable_button()">
        &emsp;
        <select id="rhythm-box" name="rhythm"  onChange="enable_button()">
            <option value="">All Rhythms</option>
            {% for rhythm in rhythms %}
            {% if rhythm != '' %}
            <option value="{{ rhythm }}">{{ rhythm | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
        &emsp;
        <select id="tags-box" name="tags" onChange="enable_button()">
            <option value="">All Tunes</option>
            {% for tag in tags %}
            {% if tag != '' %}
            <option value="{{ tag }}">{{ tag | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
        &emsp;
        <select id="location-box" name="location" onChange="enable_button()">
            <option value="">All Locations</option>
            {% for location in locations %}
            {% if location != '' %}
            <option value="{{ location | downcase }}">{{ location | capitalize }}</option>
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
        "instrument": "{{ site.defaultABCplayer }}",
        {% if tune.mp3_file %}"mp3": "{{ site.mp3_host | append: tune.mp3_file | xml_escape }}",
        "abc": ""
        {% else %}"mp3": "",
        "abc": {{ tune.abc | jsonify }}{% endif %}
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
</script>

<script src="{{ site.js_host }}/js/lunr.min.js"></script>
<script>var sliderArray1 = [];</script>
<script>var sliderArray2 = [];</script>
<script src="{{ site.js_host }}/js/build_table_tunes_archive.js"></script>
<script src="{{ site.js_host }}/js/webpage_tools.js"></script>

<script>
$(document).ready(function() {
    audioPlayer.innerHTML = createAudioPlayer();

    /* Set initial sort order */
    $.tablesorter.defaults.sortList = [[0,0]];

    $("#search-results").tablesorter({headers: { 0:{sorter: 'ignoreArticles'}, 3:{sorter: false}}});  
    Create_archive_sliders();

});
function Create_archive_sliders(){
  //alert(sliderArray1.length);
  for(var i=0;i<sliderArray1.length;i++){
    //alert(sliderArray[i]);
    createSlider(sliderArray1[i],sliderArray2[i]);
  }
}

</script>
