---
layout: page
title: The Northern Fiddler
permalink: /northernfiddler/
---
These tunes have been transcribed as closely as possible from:

 * The Northern Fiddler - Music and Musicians of Donegal and Tyrone:
    * Allen Feldman & Eamonn O'Doherty

This page is very much a "Work in Progress" and tunes will be added from time to time. If you want to help, pick a tune that hasn't been transcribed, write out the ABC and send it to the address at the bottom of the page!

There's a PDF of the book on this site at <a href="/tunebooks/The_Northern_Fiddler.pdf">The Northern Fiddler</a>

<!-- Some boilerplate that's common to a number of pages -->
{% include northernfiddler-filter-variables.html %}

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
            <div class="formChild">
                <select id="musician-box" name="searchMusician"  onChange="wssTools.enableSearchButton()">
                    <option value="">All musicians</option>
                    {% for musician in musicians %}
                    {% if musician != '' %}
                    <option value="{{ musician }}">{{ musician }}</option>
                    {% endif %}
                    {% endfor %}
                </select>
            </div>
        </div>
        <div class="formParent">
            <div class="formChild">
                <span title="Run the filter with the default settings to see the whole list">
                    <input class="filterButton filterDisabled" id="submitSearch" type="submit" name="submit" value="Select" onclick="buildGrid.formSearch('northernfiddler', [searchTitle.value, searchRhythm.value, searchMusician.value])" disabled>
                </span>
            </div>
            <div class="formChild">   
                <span title="Reset to default">  
                    <input class="filterButton" id="formReset" type="button" name="reset" value="Reset" onclick="buildGrid.formReset('northernfiddler', ['title-box', 'rhythm-box', 'musician-box'])">
                </span>
            </div>
        </div>     
        <p></p>
        Displaying <span id="tunesCount"></span> tunes
    </fieldset>
</form>

<script>
    window.store = {
      {% assign tuneID = 1 %}
      {% assign tunes =  site.northernfiddler | sort: 'page' %}
      {% for tune in tunes %}
        "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "mp3_source": "{{ tune.mp3_source | xml_escape }}",
        "page": "{{ tune.page | xml_escape }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        },
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
    
    buildGrid.displayGrid("northernfiddler", "", window.store);
});
</script>
