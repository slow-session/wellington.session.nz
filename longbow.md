---
layout: page
title: The Long Bow
permalink: /longbow/
---
In his fiddle class at Ceol Aneas 2018, Rob Zielinski suggested practicing
long slow down and up bows every day for 3 months. He suggested 5 minutes each
day and that each bow should take 30 seconds.

You can use this to help with the timing and you can change the values as you see fit.

<br />

<fieldset class="fieldset-auto-width">
<form id="parameters" method="get">
    <p>
      <label>Practice time in minutes:</label>
      <input type="number" id="practice-time" name="practiceTime" value="5" min="2" max="15">
    </p>
    <p>
      <label>Time for each bow in seconds:</label>
      <input type="number" id="bow-time" name="bowTime" value="30" min="10" max="40">
    </p>
    <br />
    <p>
	  <input type="button" class="filterButton" onclick="bowTimer(practiceTime.value, bowTime.value)" value="Start">
      <input type="button" class="filterButton" onclick="location.reload()" value="Reset">
    </p>
</form>
</fieldset>

<br />

<div id="main"></div>

<style>
form  { display: table;      }
p     { display: table-row;  }
label { display: table-cell; }
input { display: table-cell; }

input[type=number] {
  border: solid lightgray;
  text-align: right;
}

.myProgressLR {
  width: 100%;
  height: 30px;
  position: relative;
  background-color: lightgray;
}

.myProgressRL {
  width: 100%;
  height: 30px;
  position: relative;
  background-color: khaki;
}

.myBarLR {
  background-color: lightsteelblue;
  width: 0px;
  height: 30px;
  position: absolute;
}

.myBarRL {
  background-color: silver;
  width: 100%;
  height: 30px;
  position: absolute;
}

.fieldset-auto-width {
    display: inline-block;
}
</style>

<script>
var running = 0;

async function bowTimer(practiceTime, bowTime) {
    var repeats = Math.ceil((practiceTime * 60)/bowTime);
    var repeat;
    if (running == 0) {
        running = 1;
        // Allow time to pick up instrument
        document.getElementById("main").innerHTML = "Get ready.";
        for (repeat=5;repeat>0;repeat--) {
            document.getElementById("main").innerHTML += ".." + repeat;
            await sleep(1000);
        }
        // Set up the timer bars
        for (repeat=1;repeat<=repeats;repeat++) {
            setupDiv(repeat);
        }
        // Draw the timers
        for (repeat=1;repeat<=repeats;repeat++) {
            drawTimer(repeat, bowTime);
            await sleep(1000 * bowTime);
        running = 0;
        }
    } else {
        alert("Already running - use Reset to start again!");
    }
}

function setupDiv (repeat) {
    if (elem = document.getElementById("progress" + repeat)) {
        document.getElementById("main").removeChild(elem);
    }

    var divProgress = document.createElement("div");
    divProgress.id = "progress" + repeat;
    if (repeat % 2) {
        divProgress.setAttribute('class', 'myProgressLR');
    } else {
        divProgress.setAttribute('class', 'myProgressRL');

    }
    document.getElementById("main").appendChild(divProgress);

    if (!document.getElementById("bar" + repeat)) {
        var divBar = document.createElement("div");
        divBar.id = "bar" + repeat;
        if (repeat % 2) {
            divBar.setAttribute('class', 'myBarLR');
            divBar.innerHTML = "Down";
        } else {
            divBar.setAttribute('class', 'myBarRL');
            divBar.innerHTML = "Up";
        }   
        document.getElementById("progress" + repeat).appendChild(divBar);
    }
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
            if (repeat % 2) {
                elem.style.width = width + '%';
            } else {
                elem.style.width = (100 - width) + '%';
            }
        }
    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
</script>
