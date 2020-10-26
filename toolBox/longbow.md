---
layout: page
title: The Long Bow
permalink: /longbow/
---
In his fiddle class at Ceol Aneas 2018, Rob Zielinski suggested practicing
long slow down and up bows every day for 3 months. He suggested 5 minutes each
day and that each bow should take 30 seconds. You can use this to help with the
timing and you can change the values as you see fit.

<form id="parameters" method="get">
    <fieldset>
        <legend>Set the timings:</legend>
        <div class="formParent">
            <div class="formChild">
                <label>Practice time in minutes: </label>
            </div>
            <div class="formChild">
                <input type="number" id="practice-time" name="practiceTime" value="5" min="2" max="15">
            </div>
        </div>
        <div class="formParent">
            <div class="formChild">
            <label>Time for each bow in seconds: </label>
            </div>
            <div class="formChild">
                <input type="number" id="bow-time" name="bowTime" value="30" min="10" max="40">
            </div>
        </div>
        <div class="formParent">
            <div class="formChild">
                <input type="button" class="filterButton" onclick="bowTimer(practiceTime.value, bowTime.value)" value="Start">
                <input type="button" class="filterButton" onclick="location.reload()" value="Reset">
            </div>
        </div>
    </fieldset>
</form>

<div class="row"></div>

<div id="longBowTimers" class="longBowTimers">
<div id="longBowTimersHeader"></div>
<div id="longBowTimersBody"></div>
</div>

<script>
var running = 0;

async function bowTimer(practiceTime, bowTime) {
    var repeats = Math.ceil((practiceTime * 60)/bowTime);
    var repeat;
    if (running == 0) {
        running = 1;

        document.getElementById('longBowTimers').style.display = "block";
        // Set up the timer bars
        for (repeat=1;repeat<=repeats;repeat++) {
            setupDiv(repeat);
        }
        // Allow time to pick up instrument
        document.getElementById("longBowTimersHeader").innerHTML = "Get ready.";
        // Countdown to start 
        for (repeat=5;repeat>0;repeat--) {
            document.getElementById("longBowTimersHeader").innerHTML += ".." + repeat;
            await sleep(1000);
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
        document.getElementById("longBowTimersBody").removeChild(elem);
    }

    var divProgress = document.createElement("div");
    divProgress.id = "progress" + repeat;
    if (repeat % 2) {
        divProgress.setAttribute('class', 'longBowProgressLR');
    } else {
        divProgress.setAttribute('class', 'longBowProgressRL');
    }
    document.getElementById("longBowTimersBody").appendChild(divProgress);

    if (!document.getElementById("bar" + repeat)) {
        var divBar = document.createElement("div");
        divBar.id = "bar" + repeat;
        if (repeat % 2) {
            divBar.setAttribute('class', 'longBowBarLR');
            divBar.innerHTML = "Down";
        } else {
            divBar.setAttribute('class', 'longBowBarRL');
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
            if (width < 99) {
                elem.style.borderRight = '4px solid black';
            } else {
                elem.style.borderRight = 'unset';
            }
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
