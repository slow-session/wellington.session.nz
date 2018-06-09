---
layout: page
title: Create Set MD File
permalink: /createSetMD/
---
Fill in the details for the set title, rhythm, location and your name. Then find the tunes you want, and then use the "Select" button on each to choose them in the order you want to play them in the set.

<!-- Some boilerplate that's common to a number of pages -->
{% include filter-variables.html %}

<!-- Places to store hidden data we need on the page -->
<textarea id="filename" style="display:none;"></textarea>
<textarea id="setTunes" style="display:none;">[</textarea>

<!-- Create the input boxes for the set details -->
<div class="row">
<div class="small-4 columns">
<fieldset style="display: inline-block; vertical-align: middle;">
  <legend>Enter the set MD file details:</legend>
  <div class="container">
  <form id="createSetMD" method="get">
      <label>Title: <sup>*</sup></label><br />
      <input type="text" id="title-box" name="title" value=""><br />

	  <label>Rhythm:<sup>*</sup></label><br />
      <select id="rhythm-box" name="rhythm">
          <option value="">All Rhythms</option>
          {% for rhythm in rhythms %}
          {% if rhythm != '' %}
          <option value="{{ rhythm }}">{{ rhythm | capitalize }}</option>
          {% endif %}
          {% endfor %}
      </select>
      <br />

      <label>Location:<sup>*</sup></label><br />
      <select id="location-box" name="location" onChange="enable_button()">
          <option value="">All Locations</option>
          {% for location in locations %}
          {% if location != '' %}
          <option value="{{ location }}">{{ location | capitalize }}</option>
          {% endif %}
          {% endfor %}
      </select>
      <br />

	  <input type="hidden" id="date-box" name="date" value="">
	  <input type="hidden" id="tags-box" name="tags" value="">
	  <input type="hidden" id="tunes-box" name="tunes" value="">

	  <label>Author:<sup>*</sup></label><br />
	  <input type="text" id="author-box" name="author" value=""><br />

	  <input type="hidden" id="source-box" name="source" value="Wellington"><br>

	  Tunes:
	  <fieldset>
	  <div id="setTitles"></div>
	  </fieldset>

	  <br />
	  <input type="button" class="button" onclick="showForm('setMD', 'createSetMD')" value="Build the MD file">
</form>
</div>
</fieldset>
</div>
<div class="small-4 columns">
<fieldset style="display: inline-block; vertical-align: middle;">
<legend>Check the set MD file details:</legend>
<div class="container">
<textarea id="setMD" rows="11" cols="50" style="background-color: #ebebeb" spellcheck="false"></textarea>
<!-- Allow the user to save their MD-->
<form>
   <span title="Download the MD data you've entered. Don't lose your work!">      
  		<input value='Download MD file' type='button' class="button"         onclick='downloadFile(document.getElementById("filename").value, document.getElementById("setMD").value)' />
   </span>
</form>
</div>
</fieldset>
</div>
<div class="small-4 columns">
</div>
</div>

<!-- Reset button -->
<br />
Use the "Reset Tunes" button to start a new set.
<form>
<p>
<input value='Reset Tunes' type='button' class="loopButton" onclick='Reset()' />
</p>
</form>

<!-- Create the search area -->
<div id="search_controls">
<fieldset>
    <legend>Filter from Tunes Archive:</legend>
	Note: Filtering will reset the page - you will remove already selected tunes.
    <form id="wellington" method="get">
        <br />
        <span title="Filter the Tunes Archive for tunes by title or by type such as 'reel', 'jig', 'polka'. You can also look for 'tags' such as 'Slow Session, 'Beginner'">        
		<input type="text" id="title-box" name="title" placeholder='Search'
            value='' onkeydown="enable_button()">
        &emsp;
        <select id="tune-rhythm-box" name="tune-rhythm"  onChange="enable_button()">
            <option value="">All Rhythms</option>
            {% for rhythm in rhythms %}
            {% if rhythm != '' %}
            <option value="{{ rhythm }}">{{ rhythm | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
        &emsp;
        <select id="tune-tags-box" name="tune-tags" onChange="enable_button()">
            <option value="">All Tunes</option>
            {% for tag in tags %}
            {% if tag != '' %}
            <option value="{{ tag }}">{{ tag | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
        &emsp;
        <select id="tune-location-box" name="tune-location" onChange="enable_button()">
            <option value="">All Locations</option>
            {% for location in locations %}
            {% if location != '' %}
            <option value="{{ location }}">{{ location | capitalize }}</option>
            {% endif %}
            {% endfor %}
        </select>
        </span>    
        &emsp;
        <span title="Run the filter with the default settings to see the whole list">
        <input class="filterButton filterDisabled" id="submit_button" type="submit" name="submit" value="Filter" disabled>
        </span>      
    </form>
    <p></p>
    <div id="tunes-count"></div>
</fieldset>
</div>

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
			  "mdFile": "{{ tune.titleID | xml_escape }}",
              "tuneID": "{{ tuneID }}",
              "key": "{{ tune.key | xml_escape }}",
              "mode": "{{ tune.mode | xml_escape }}",
              "rhythm": "{{ tune.rhythm | xml_escape }}",
              "location": "{{ tune.location | xml_escape }}",
              "tags": "{{ tune.tags | array_to_sentence_string }}",
              "url": "{{ tune.url | xml_escape }}",
          }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };
</script>

<script src="{{ site.js_host }}/js/webpage_tools.js"></script>
<script src="{{ site.js_host }}/js/lunr.min.js"></script>
<script src="{{ site.js_host }}/js/build_table_md.js"></script>


<script>
$(document).ready(function() {
    $.tablesorter.defaults.sortList = [[0,0]];

    $("#search-results").tablesorter({headers: { 3:{sorter: false}}});  
});
</script>
