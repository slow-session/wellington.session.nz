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

<form id="northernfiddler" method="get">
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
            <div class="formChild">
                <select id="musician-box" name="musician"  onChange="enable_button()">
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
                    <input class="filterButton filterDisabled" id="submit_button" type="submit" name="submit" value="Select" disabled>
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
        "musician": "{{ tune.musician | xml_escape }}",
        "page": "{{ tune.page | xml_escape }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        },
        {% assign tuneID = tuneID | plus: 1 %}
      {% endfor %}
    };
</script>

{% include tunesNorthernFiddlerGrid.html%}

<script>
$(document).ready(function() {

});
</script>
