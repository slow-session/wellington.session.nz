// In Chrome/Opera/Firefox, an AudioContext must be created or resumed
// after the document received a user gesture to enable audio playback.
// See https://goo.gl/7K7WLu

try {
    //alert("Chrome/Opera/Firefox");
    var audioCtx = new AudioContext();
    console.log('AudioContext supported');
} catch (err) {
    //alert("Safari - " + err);
    console.log('AudioContext not supported');
}

// This function only sets the event listener if we're running on a Chrome, Opera
// or Firefox browser
function audioResume() {
    try {
        if (typeof audioCtx !== 'undefined') {
            console.log('setting audioResume()');
            document.addEventListener('click', function() {
                audioCtx.resume().then(() => {
                    console.log('Playback button selected');
                });
            });
            console.log('audioResume() set');
        }
    } catch (err) {
        console.log('audioResume() - ' + err);
        //alert('audioResume() - ' + err);
    }
}
