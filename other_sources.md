---
layout: page
title: Other Sources
permalink: /other_sources/
---
Here's some other sources of tunes you might find useful. If you look at nothing
else make sure you check out Charlie Montomery's tunes on this website.

Charlie Montgomery:

 * [Charlie Montomery playing his own compositions and some old favourites](/charlie_montgomery/)

Paddy Fahey tunes:

 * [The Tune Compositions of Paddy Fahey, Maria Holohon, MA Thesis](/tunebooks/other/Paddy_Fahey_Holohan_1995_Tune_.pdf "PDF")
 * [Paddy Fahey tunes compiled by Maria Holohan (just the tunes!)](/tunebooks/other/Paddy_Fahey's_by_Maria_Holohan.pdf "PDF")

Sets of tunes put together by Paddy O'Brien:

 * [O'Brien sets on line](/obrientunes/)
 * [obrien.pdf](/tunebooks/other/obrien.pdf "PDF")

 The Northern Fiddler - Music and Musicians of Donegal and Tyrone:

 * [The Northern Fiddler](/tunebooks/other/The_Northern_Fiddler.pdf) 

Dunedin Fiddle Orchestra:

 * [Details and website ](http://www.kiwifolk.com/dfc/ "WEBSITE")

Sean Manning's Sets (Dunedin):

 * [seansSetBook1704.pdf](/tunebooks/other/seansSetBook1704.pdf "PDF")

Begged Borrowed and Stolen:

 * [bbs.pdf](/tunebooks/other/bbs.pdf "PDF")

Some other tunebooks from early days of ABC i.e. the 1990s:

 * [reavy.pdf](/tunebooks/other/reavy.pdf "PDF")
 * [session1.pdf](/tunebooks/other/session1.pdf "PDF")
 * [session2.pdf](/tunebooks/other/session2.pdf "PDF")

 You can also get copies of the ABC files that were used to generate some of these PDFs:

 * [obrien.abc](/tunebooks/other/obrien.abc "ABC")
 * [seansSetBook1704.abc](/tunebooks/other/seansSetBook1704.abc "ABC")
 * [reavy.abc](/tunebooks/other/reavy.abc "ABC")
 * [session1.abc](/tunebooks/other/session1.abc "ABC")
 * [session2.abc](/tunebooks/other/session2.abc "ABC")

Tunebooks for this site
---------

We've decided to stop producing PDF versions of tunebooks for this site as it was difficult for us to maintain and we felt it led to people printing copies which meant trees were being cut down. You can download a file containing all the ABCs used on this site.

There are a number of tools you can use to read this file and print copies of tunes from it. We've used EasyABC in the past.

<form id="ABCform">
    <input type="button" class="filterButton" value="Show ABC File" onclick="toggle(this);">
</form>

<div class="formParent">
    <div id='abcSource' class="abcSource formChild">
        <div class="row">
            <textarea name='abcText' id="abcText" rows="13" cols="65"
                style="background-color:#ebebeb; font-size:small; max-width:100%"
                spellcheck="false">{{ page.abc | br_to_newline }}</textarea>
        </div>
        <div class="row">
            <span title="Download the ABC you've entered. Don't lose your work!">
        	    <input value='Download ABC File' type='button' class="filterButton"
                onclick='downloadFile("WellingtonIrishSessions.abc", 
                        document.getElementById("abcText").value)' />
            </span>
        </div>
    </div>
</div>

<script>
window.store = {
    {% assign tunes = site.tunes %}
    {% assign sortedtunes = tunes | sort: 'titleID' %}
    {% assign tuneID = 100 %}
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
            "abc": "{{ tune.abc | uri_escape }}"
            }{% unless forloop.last %},{% endunless %}
        {% endfor %}
    };
</script>

<script src="{{ site.js_host }}/js/build_abc_source.js"></script>

<script>
function toggle(button) {
    switch (button.value) {
        case "Show ABC File":
            button.value = "Hide ABC File";
            displayABCsource();      
            document.getElementById('abcSource').style.display= "block" ;
            break;
        case "Hide ABC File":
            button.value = "Show ABC File";
            document.getElementById('abcText').innerHTML = '';
            document.getElementById('abcSource').style.display= "none" ;
            break;
    }
}
</script>



