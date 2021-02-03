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

<form id="obrien" method="get">
    <fieldset>
        <legend>Select from the Tunes Archive:</legend>    
        <div class="formParent">
            <div class="formChild">
                <input type="text" id="title-box" name="title" placeholder='Search'
                value='' onkeydown="wssTools.enableButton()">
            </div>
            <div class="formChild">
                <select id="rhythm-box" name="rhythm"  onChange="wssTools.enableButton()">
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
        </div>     
        <p></p>
        Displaying <span id="tunesCount"></span> tunes
    </fieldset>
</form>

<script>
    window.store = {
      {% assign tuneID = 3000 %}
      {% assign tunes =  site.obrientunes | sort: 'title' %}
      {% for tune in tunes %}
        {% assign tuneID = tuneID | plus: 1 %}
        "{{ tuneID }}": {
        "title": "{{ tune.title | xml_escape }}",
        "tuneID": "{{ tuneID }}",
        "key": "{{ tune.key | xml_escape }}",
        "rhythm": "{{ tune.rhythm | xml_escape }}",
        "url": "{{ tune.url | xml_escape }}",
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
</script>

{% include tunesObrienGrid.html%}

<script>
document.addEventListener("DOMContentLoaded", function (event) {

});
</script>
