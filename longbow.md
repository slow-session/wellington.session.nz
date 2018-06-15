---
layout: page
title: The Long Bow
permalink: /longbow/
---
In his fiddle class at Ceol Aneas 2018, Rob Zielinski suggested that practicing
long slow up and down bows every day for 3 months. He suggested 5 minutes each
day and that each bow should take 30 seconds.

You can use this to help with the timing and you can change the values as you see fit.

<fieldset class="fieldset-auto-width">
<form id="parameters" method="get">
      <label>Practice time in minutes:</label><br />
      <input type="number" id="practice-time" name="practiceTime" value="5"><br />
      <br />
      <label>Time for each bow in seconds:</label><br />
      <input type="number" id="bow-time" name="bowTime" value="30"><br />
      <br />
	  <input type="button" class="filterButton" onclick="bowTimer(practiceTime.value, bowTime.value)" value="Start">
      <input type="button" class="filterButton" onclick="location.reload()" value="Reset">
</form>
</fieldset>
<br />
<div id="main"></div>


<style>
.myProgress {
  width: 100%;
  height: 30px;
  position: relative;
  background-color: #ddd;
}

.myBar {
  background-color: lightsteelblue;
  width: 0px;
  height: 30px;
  position: absolute;
}

.fieldset-auto-width {
    display: inline-block;
}
</style>

<script>
async function bowTimer(practiceTime, bowTime) {
    var repeats = Math.ceil((practiceTime * 60)/bowTime);
    var repeat;

    for (repeat=1;repeat<=repeats;repeat++) {
        appendDiv(repeat, bowTime);
        drawTimer(repeat, bowTime);
        await sleep(1000 * bowTime);
    }
}

function appendDiv (repeat, bowTime) {
    var divProgress = document.createElement("div");
    divProgress.id = "progress" + repeat;
    divProgress.setAttribute('class', 'myProgress');
    document.getElementById("main").appendChild(divProgress);
    var divBar = document.createElement("div");
    divBar.id = "bar" + repeat;
    divBar.setAttribute('class', 'myBar');
    if (repeat % 2) {
        divBar.innerHTML = "Down";
    } else {
        divBar.innerHTML = "Up";
    }   
    document.getElementById("progress" + repeat).appendChild(divBar);
}

function drawTimer(repeat, bowTime) {
    var elem = document.getElementById("bar" + repeat);
    var width = 0;
    elem.scrollIntoView();

    var id = setInterval(frame, 1000);

    function frame() {
        if (width >= 99) {
            clearInterval(id);
        } else {
            width += 100 / bowTime;
            elem.style.width = width + '%';
        }
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
</script>
