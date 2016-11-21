/*
 * code needed for midi playback
 */
var playingNow = 0;
var midiStopped = 0;
var mp3Available = 1;
var ABCTuneName="song";
// Select a timbre that sounds like an electric piano.
var inst = new Instrument('string');

function stopMidi(song) {
  midiStopped = 1
  inst.silence();
};

function midiSliderChanged(value, song){
    stopMidi(song);
    setMidiSpeed(value, song);
};

function setMidiSpeed(value, song){
    playingNow = 1;
    midiStopped = 0;
    inst.silence();
    inst.play({ tempo:value },song.value, function(){playingNow = 0;loopMidiTune(value, song);});
};

function loopMidiTune(value, song){
    inst.silence();
    if ((playingNow==0)&&(midiStopped==0)) {
        setMidiSpeed(value, song);
    }
};

function noMP3(audio_id){
    audio_id.hidden="true";
    mp3Available = 0;
    mp3Yes.hidden="true";
    mp3No.display="true";
};

var ABCheader = /^([A-Za-z]):\s*(.*)$/;

function preProcessABC(str){
    var lines = str.split('\n'),j,header,newABCHeader="",newABCNotes="",tempStr="",index = 0, res="";
    var tokens = "";
    for (j = 0; j < lines.length; ++j) {
        header = ABCheader.exec(lines[j]);
        if (header) {
            // put the header lines back in place
            newABCHeader+=lines[j]+"\n"; // consider special case of a keychange header K: in the middle
        } else if (/^\s*(?:%.*)?$/.test(lines[j])) {
            // Skip blank and comment lines.
            continue;
        } else {
            // Parse the notes.
            newABCNotes+=lines[j];
        } 
      }
  
      var fEnding = /\|1/g, sEnding = /\|2/g, lRepeat = /\|:/g, rRepeat = /:\|/g, dblBar = /\|\|/g, firstBar = /\|/g;
      var fEnding2=/\[1/g,sEnding2 = /\[2/g, dblBar2 = /\|\]/g;
      var match, fBarPos = [], fEndPos = [], sEndPos = [], lRepPos = [], rRepPos = [], dblBarPos = [];
      var firstRepeat = 0, offset1 = 0;

      while ((match = firstBar.exec(newABCNotes)) != null) {
          fBarPos.push(match.index);
      }
      while (((match = fEnding.exec(newABCNotes))||(match = fEnding2.exec(newABCNotes))) != null) {
        fEndPos.push(match.index);
      }
      while (((match = sEnding.exec(newABCNotes))||(match = sEnding2.exec(newABCNotes))) != null) {
        sEndPos.push(match.index);
    }
      while ((match = rRepeat.exec(newABCNotes)) != null) {
          rRepPos.push(match.index);
      }
      while ((match = lRepeat.exec(newABCNotes)) != null) {
          lRepPos.push(match.index);
      }
      while (((match = dblBar.exec(newABCNotes))||(match = dblBar2.exec(newABCNotes))) != null) {
          dblBarPos.push(match.index);
      }

      lRepPos.push(0);
      var temp = lRepPos.length;
      if(rRepPos[0] < lRepPos[0]) { //missing beginning left repeat mark
          for(j=0;j<temp;j++){
              lRepPos[j+1] = lRepPos[j]; 
          };
          if(fBarPos[0]<6) { lRepPos[0] = fBarPos[0]; } else lRepPos[0] = 0;
      } // missing first repeat back to first bar unless there is a pickup
/*
* There is a logic problem in the next section.  I'm looping based on repeats, but
* the first occurrence of an ending could be after the position of the repeats, so the
* index is wrong.  A different approach is needed, but very few tunes fall into this case
*/
      var pos=0,endPos=0;
      var bigABCNotes = '';
      for(j=0;j<rRepPos.length;j++) {
      if((fEndPos[j]>0)&&(rRepPos[j]>fEndPos[j])) { //first and second endings, but a repeated portion could precede endings
          bigABCNotes += newABCNotes.substr(pos,sEndPos[j]-pos) + newABCNotes.substr(lRepPos[j],
              fEndPos[j]-lRepPos[j]) + newABCNotes.substr(sEndPos[j],dblBarPos[j]-sEndPos[j]);
          endPos=sEndPos[j]+dblBarPos[j]-sEndPos[j];  
      } else  { //with  no first and second endings
          bigABCNotes += newABCNotes.substr(pos,rRepPos[j]-pos) + newABCNotes.substr(lRepPos[j],
              rRepPos[j]-lRepPos[j]);
          endPos=lRepPos[j]+rRepPos[j]-fBarPos[j];
      }
      pos=lRepPos[j+1];
      }
      if(endPos<fBarPos[fBarPos.length-1]) {
        bigABCNotes+=newABCNotes.substr(endPos,fBarPos[fBarPos.length-1]-endPos); //copy tune beyond repeat portion
      }
      bigABCNotes+="\""; //hack to make sure the newBigABCNotes gets fills when there are not quotes

      var newBigABCNotes="";
      for (j=0;j<bigABCNotes.length;j++){
          if(bigABCNotes[j]=="\"")
          {
              newBigABCNotes = [bigABCNotes.slice(0, j), "\\\"", bigABCNotes.slice(j)].join('');
          }
          newBigABCNotes = newBigABCNotes.substring(0,newBigABCNotes.length-3); //undo hack 
      }
      return (newABCHeader+newBigABCNotes);
};

