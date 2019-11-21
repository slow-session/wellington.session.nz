---
layout: page
title: Oscillator demo
permalink: /oscillator/
---
<h3>Click on the screen</h3>

See <a href="https://stackoverflow.com/questions/55937201/how-to-fix-sound-multiple-oscillators-playing-at-the-same-time-with-javascript-w">https://stackoverflow.com/questions/55937201/how-to-fix-sound-multiple-oscillators-playing-at-the-same-time-with-javascript-w</a> for more info

<script>
let audioContext;
let gainNode;
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
let oscillators = [];

window.addEventListener(touchEvent, makeSound);

function makeSound(){
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);

    //createOsc(43.653528929125486);
    //createOsc(220);
    //createOsc(164.81377845643496);
    createOsc(262);
    createOsc(330);
    createOsc(392);

    const currentTime = audioContext.currentTime;
    oscillators.forEach(function(oscillator){
        oscillator.start(currentTime);
        oscillator.stop(currentTime + 2);
    });
}

function createOsc(freq){
    const oscillator = audioContext.createOscillator();

    oscillator.frequency.value = freq;
    oscillator.connect(gainNode);
    oscillators.push(oscillator);

    gainNode.gain.value = 1 / oscillators.length;
}
</script>
