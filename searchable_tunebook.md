---
layout: page
permalink: /tunebooks/searchable
---
Searchable Tunebook
-------------------


**Please be patient! It takes a while to generate all the dots!**

<fieldset>
    <legend>Select from the Tunes Archive</legend>
    
    <form id="search-query"  method="get">
        <br />
       <span title="Select the Tunes Archive for tunes by title or by type such as 'reel', 'jig', 'polka'. You can also look for 'tags' such as 'Slow Session, 'Beginner'">        
        Title:
        <input type="text" id="title-box" name="title" value=''>
        &emsp; 
        Rhythm:
        <select id="rhythm-box" name="rhythm">
            <option value="">Any</option>
            <option value="reel">Reel</option>
            <option value="jig">Jig</option>
            <option value="slip jig">Slip Jig</option>
            <option value="polka">Polka</option>
            <option value="hornpipe">Hornpipe</option>
            <option value="slide">Slide</option>
            <option value="waltz">Waltz</option>
            <option value="barndance">Barndance</option>
            <option value="planxty">Planxty</option>
        </select>
        &emsp;
        Tags:
        <select id="tags-box" name="tags">
            <option value="">All Tunes</option>
            <option value="slowsession">Slow Session</option>
            <option value="beginner">Beginner</option>
        </select>
        </span>
        &emsp;
        <span title="Run the filter with the default settings to see the whole list">
        <input class="button" id="submit" type="submit" name="submit" value="Select">
        </span>
        
    </form>
</fieldset>

<br />

{::nomarkdown}
<img alt="Think before you print" src="/images/think-before-you-print.gif" border=0></img>
{:/}

<br />
<p><span title="When you're happy with your selection you can print your tunebook using this button. Please think of the trees!">
<input class="button" type="button" onclick="printDiv('tunebook')" value="Print this Tunebook" />
</span>
&#x2190; Click here to print a tunebook of the tunes you have selected.
</p>

<br />
<br />
 
<div id="tunebook"></div>


<script>
  window.store = {
      {% assign tuneCount = 1 %}
      {% assign tunes =  site.tunes | sort: 'title' %} 
      {% for tune in tunes %}
          "{{ tuneCount }}": {
          "title": "{{ tune.title | xml_escape }}",
          "key": "{{ tune.key | xml_escape }}",
          "rhythm": "{{ tune.rhythm | xml_escape }}",
          "tags": "{{ tune.tags | array_to_sentence_string }}",
          "abc": {{ tune.abc | jsonify }}
      }{% unless forloop.last %},{% endunless %}
      {% assign tuneCount = tuneCount | plus: 1 %}
    {% endfor %}};
</script>
  
<script type="text/javascript" src="{{ site.mp3_host }}/js/abcjs_plugin_3.0-min.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/lunr.min.js"></script>
<script type="text/javascript" src="{{ site.mp3_host }}/js/searchable_tunebook.js"></script>

<script type="text/javascript"> 
   ABCJS.plugin.show_midi = false;
   ABCJS.plugin.hide_abc = true;
   ABCJS.plugin.auto_render_threshold = {{tuneCount}};
   
   function printDiv(divName) {
        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
   }
   
</script>


