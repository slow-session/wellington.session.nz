---
layout: page
title: The Long Bow
permalink: /longbow/
---
In his fiddle class at Ceol Aneas 2018, Rob Zielinski suggested that practicing
long slow up and down bows every day for 3 months. He suggested 5 minutes each
day and that each bow should take 30 seconds.

You can use this to help with the timing and you can change the values as you see fit.

<fieldset>
<form id="parameters" method="get">
      <label>Practice time in minutes:</label><br />
      <input type="number" id="practice-time" name="practiceTime" value="5"><br />
      <br />
      <label>Time for each bow in seconds:</label><br />
      <input type="number" id="bow-time" name="bowTime" value="30"><br />
      <br />
	  <input type="button" class="filterButton" onclick="draw_repeat(practiceTime.value, bowTime.value)" value="Start">
</form>
</fieldset>
<br />

<canvas id="myCanvas" width="700" height="220"></canvas>

<script>
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.font = "14px Arial";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function draw_timer_bar(repeat, bowTime) {
    var second;
    ctx.fillStyle = "lightsteelblue";
    for (second = 0; second < bowTime; second++) {
        ctx.fillRect(70 + 10 * second, 20 * repeat, 9, 18);
        await sleep(1000);
    }
}

async function draw_repeat(practiceTime, bowTime) {
    var repeats = Math.ceil((practiceTime * 60)/bowTime)
    var repeat;
    for (repeat = 0; repeat < repeats; repeat++) {
        ctx.fillStyle = "black";
        ctx.fillText("Repeat " + (repeat + 1), 0, 20 * (repeat + 1) - 4);
        draw_timer_bar(repeat, bowTime);
        await sleep(1000 * bowTime);
    }
}
</script>
