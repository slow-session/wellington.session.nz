/*
 * Audio controls for the browser audio player
 *
 * Version: 1.0
 * Date: 7 Dec 2016
 *
 * Developed as part of websites for http://session.nz and http://wellington.session.nz
 * by Ted Cizadlo and Andy Linton
 * Code available at:
 * https://github.com/slow-session/session.nz/blob/master/js/audioID_controls.js
 * Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) Licence.
 */
function SetPlayRange(audioID, ButtonEvent, button1ID, button2ID) {
    // this only works for the currently selected audio player
    if (PreviousAudioID != audioID) { //different player controls selected
        return;
    }
    if (PreviousAudioID != audioID) { //different player controls selected
        return;
        BeginLoopTime = 0;
        EndLoopTime = 0;
        if (PreviousButton1ID != null) {
            PreviousButton1ID.value = "Loop Start";
            PreviousButton2ID.value = " Loop End ";
            // Consider deregistering the function here
        }
        /*
        PreviousButton1ID.value = "Loop Start";
        PreviousButton2ID.value = " Loop End ";
        */

    }
    //if (EndLoopTime == 0) {
        EndLoopTime = OneAudioPlayer.duration - .25; // sampling rate is ~ every 250 ms (overshoot the end)
    //}
    /*
     * Set the start and end of loop markers depending on which button was pressed
     */
    switch (ButtonEvent) {
        // Loop Start button
        case 0:
            BeginLoopTime = OneAudioPlayer.currentTime;
            button1ID.value = BeginLoopTime.toFixed(1);
            button2ID.value = EndLoopTime.toFixed(1);
            break;
            // Loop End button
        case 1:
            EndLoopTime = OneAudioPlayer.currentTime;
            button1ID.value = BeginLoopTime.toFixed(1);
            button2ID.value = EndLoopTime.toFixed(1);
            break;
            // Reset button
        case 2:
            BeginLoopTime = 0;
            EndLoopTime = OneAudioPlayer.duration - .25; // sampling rate is ~ every 250 ms (overshoot the end)
            button1ID.value = BeginLoopTime.toFixed(1);
            button2ID.value = EndLoopTime.toFixed(1);
            break;
    }
    PreviousAudioID = audioID;
    PreviousButton1ID = button1ID;
    PreviousButton2ID = button2ID;

    OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
    return;
}
function setAudioLoops(){
  if (OneAudioPlayer.currentTime >= EndLoopTime) {
      OneAudioPlayer.currentTime = BeginLoopTime;
  }
}

function setPlaySpeed(audioID, speed) {
    OneAudioPlayer.playbackRate = speed;
}
