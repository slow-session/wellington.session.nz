try {
    var audioCtx = new AudioContext();
    console.log('AudioContext supported');
    //alert("Chrome");
}
catch(err) {
    console.log('AudioContext not supported');
    //alert("Not Chrome - " + err);
}

function audioResume(button) {
    try {
        if (typeof audioCtx !== 'undefined') {
            console.log('setting audioResume()');
            document.querySelector(button).addEventListener('click', function() {
                audioCtx.resume().then(() => {
                    console.log('Playback button selected');
                });
            });
            console.log('audioResume() set');
        }
    }
    catch(err) {
        console.log('audioResume() - ' + err);
        alert('audioResume() - ' + err);
    }
}
