/*
 * Audio controls for the browser audio player
 * Developed as part of websites for http://session.nz and http://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/session.nz/blob/master/js/audio_controls.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */

function setPlaySpeed(speed,x) {
    x.playbackRate = speed;
}

var BeginLoopTime = 0;
var EndLoopTime = 0;
var PreviousAudio = null;
var PreviousButton1 = null;
var PreviousButton2 = null;

function SetPlayRange(audio,BeginEnd,button1,button2) {
    if(audio.readyState == 0) return;
    if(PreviousAudio != audio) {
        BeginLoopTime = 0;
        EndLoopTime = 0;
        if(PreviousButton1 != null) {
            var zero=0;
            PreviousButton1.value = zero.toFixed(1);
            PreviousButton2.value = PreviousAudio.duration.toFixed(1);
            // Consider deregistering the function here
        }    

        PreviousAudio = audio;
        PreviousButton1 = button1;
        PreviousButton2 = button2;
    }

    if (EndLoopTime == 0) {
        EndLoopTime=audio.duration-.25; // sampling rate is ~ every 250 ms (overshoot the end)
    }
    if(BeginEnd == 0) {
        BeginLoopTime = audio.currentTime;
        button1.value = BeginLoopTime.toFixed(1);
        button2.value = EndLoopTime.toFixed(1);
        audio.addEventListener("timeupdate", function() {
        if (audio.currentTime >= EndLoopTime) {
            audio.currentTime = BeginLoopTime;
            }}, false);
        return;
     }
     if(BeginEnd == 1) {
        EndLoopTime = audio.currentTime;
        button1.value = BeginLoopTime.toFixed(1);
        button2.value = EndLoopTime.toFixed(1);
        audio.addEventListener("timeupdate", function() {
            if (audio.currentTime >= EndLoopTime) {
                audio.currentTime = BeginLoopTime;
            }}, false);
        return;
    }
    if(BeginEnd == 2 ) {
        BeginLoopTime = 0;
        EndLoopTime = audio.duration - .25;
        button1.value = BeginLoopTime.toFixed(1);
        button2.value = EndLoopTime.toFixed(1);
        audio.addEventListener("timeupdate", function() {
            if (audio.currentTime >= EndLoopTime) {
                audio.currentTime = BeginLoopTime;
            }}, false);
        return;
    }
}

