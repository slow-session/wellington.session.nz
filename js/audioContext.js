var usingWebAudio = false;

if (typeof AudioContext !== 'undefined') {
    audioCtx = new AudioContext();
    alert("Chrome");
    usingWebAudio = true;
} else {
    alert('Safari');
    usingWebAudio = false;
}

function audioResume(button) {
    console.log('setting audioResume');
    document.querySelector(button).addEventListener('click', function() {
        audioCtx.resume().then(() => {
            console.log('Playback button selected');
        });
    });
    console.log('audioResume set');
    alert("set listener");
}
