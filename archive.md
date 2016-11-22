---
layout: page
title: NZ Archive
permalink: /archive/
navigation_weight: 10
---
We get our tunes from the New Zealand Sessions page at <a href='http://session.nz'>http://session.nz</a>

There are a number of Irish Music sessions around New Zealand but the number of musicians is relatively 
small. It’s a long, long way from Clare to here.

When musicians from different parts of the country get together at events like Ceol Aneas, the various
folk festivals or simply visiting a session in another city, there’s often a mismatch between the tunes
people know.

The NZ Sessions site has a number of tunes from various parts of the country. You can look at them all 
or you can select by area such as Wellington, Dunedin etc.

<button id="myButton">Wellington tunes in the NZ Archive in New Tab</button>

<script>
 $('#myButton').click(function () {
     var redirectWindow = window.open('http://session.nz/?title=&rhythm=&location=Wellington&submit=Filter', '_blank');
     redirectWindow.location;
 });
 </script>