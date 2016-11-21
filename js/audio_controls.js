function setPlaySpeed(speed,x) {
    //alert("Speed = "+speed+", x= "+x + " "+document.getElementById(x).id);
    x.playbackRate = speed;
}

var BeginLoopTime = 0;
var EndLoopTime = 0;
var PreviousAudio=null;
var PreviousB1=null;
var PreviousB2=null;
function SetPlayRange(audio,BE,button1,button2) {
    if(audio.readyState == 0) return;
    if(PreviousAudio != audio) {
        BeginLoopTime = 0;
        EndLoopTime = 0;
        if(PreviousB1 != null) {
            var zero=0;
            PreviousB1.value = zero.toFixed(1);
            PreviousB2.value = PreviousAudio.duration.toFixed(1);
            // Consider deregistering the function here
        }    

        PreviousAudio = audio;
        PreviousB1 = button1;
        PreviousB2 = button2;
    }

    if (EndLoopTime == 0) {
        EndLoopTime=audio.duration-.25; // sampling rate is ~ every 250 ms (overshoot the end)
    }
    if(BE == 0) {
        BeginLoopTime = audio.currentTime;
        button1.value = BeginLoopTime.toFixed(1);
        button2.value = EndLoopTime.toFixed(1);
        audio.addEventListener("timeupdate", function() {
        if (audio.currentTime >= EndLoopTime) {
            audio.currentTime = BeginLoopTime;
            }}, false);
        return;
     }
     if(BE == 1) {
        EndLoopTime = audio.currentTime;
        button1.value = BeginLoopTime.toFixed(1);
        button2.value = EndLoopTime.toFixed(1);
        audio.addEventListener("timeupdate", function() {
            if (audio.currentTime >= EndLoopTime) {
                audio.currentTime = BeginLoopTime;
            }}, false);
        return;
    }
    if(BE == 2 ) {
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

