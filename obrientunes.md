---
layout: page
title: Paddy O'Brien Tunes
permalink: /obrientunes/
---
The ABC for these tunes is from the same source that produced this tunebook:
<a href="http://www.ceolas.org/pub/tunes/tunes.pdf/POB.pdf">Tune Sets Arranged by Paddy O'Brien, Co. Tipperary</a>

This collection was one of the very early uses of ABC to capture and transmit Irish trad tunes on the net.

<!-- Some boilerplate that's common to a number of pages -->
{% include obrientunes-filter-variables.html %}

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
                <span title="Run the filter with the default settings to see the whole list">
                    <input class="filterButton filterDisabled" id="submitSearch" type="submit" name="submit" value="Select" onclick="buildGrid.formSearch('obrien', [searchTitle.value, searchRhythm.value])" disabled>
                </span>
            </div>
            <div class="formChild">   
                <span title="Reset to default">  
                    <input class="filterButton" id="formReset" type="button" name="reset" value="Reset" onclick="buildGrid.formReset('obrien', ['title-box', 'rhythm-box'])">
                </span>
            </div>
        </div>     
        <p></p>
        Scroll &#8593;&#8595; to choose from <span id="tunesCount"></span> tunes
    </fieldset>
</form>

<script>
    window.store = {
      {% assign tuneID = 1 %}
      {% assign tunes =  site.obrientunes | sort: 'title' %}
      {% for tune in tunes %}
        "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        }{% unless forloop.last %},{% endunless %}
        {% assign tuneID = tuneID | plus: 1 %}
      {% endfor %}
    };
</script>

<!-- START of Tunes Grid -->
<div class="gridParent">
  <div class="gridChild" id="tunesGrid"></div>
</div>

<script src="{{ site.js_host }}/js/buildGrid.js"></script>
<!-- END of Tunes Grid -->

<script>
buildGrid.initialiseLunrSearch();
    
document.addEventListener("DOMContentLoaded", function (event) {
       
    buildGrid.displayGrid("obrien", "", window.store);
});
</script>
