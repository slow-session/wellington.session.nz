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
// ABCString = (?:\[[A-Za-z]:[^\]]*\])|\s+|%[^\n]*|![^\s!:|\[\]]*!|\+[^+|!]*\+|[_<>@^]?"[^"]*"|\[|\]|>+|<+|(?:(?:\^+|_+|=|)[A-Ga-g](?:,+|'+|))|\(\d+(?::\d+){0,2}|\d*\/\d+|\d+\/?|\/+|[xzXZ]|\[?\|:\]?|:?\|:?|::|.
/*
(?:\[[A-Za-z]:[^\]]*\]) matches nothing 
\s+|%[^\n]* matches spaces
![^\s!:|\[\]]*! no matches 
\+[^+|!]*\+ no matches 
[_<>@^]?"[^"]*" matches chords
\[|\] matches [ or ]
[_<>@^]?{[^"]*} matches grace note phrases {...}
:?\|:? matches :| or |:
(?:(?:\^+|_+|=|)[A-Ga-g](?:,+|'+|)) matches letters A-Ga-g in or out of chords and other words
\(\d+(?::\d+){0,2} matches triplet, or quad symbol (3 
\d*\/\d+ matches fractions i.e. 4/4 1/8 etc
\d+\/? matches all single digits
\[\d+|\|\d+ matches first and second endings
\|\||\|\] matches double bars either || or |]
(\|\|)|(\|\])|:\||\|:|\[\d+|\|\d+ matches first and second endings, double bars, and right and left repeats

*/
      var fEnding = /\|1/g, sEnding = /\|2/g, lRepeat = /\|:/g, rRepeat = /:\|/g, dblBar = /\|\|/g, firstBar = /\|/g;
      var fEnding2=/\[1/g,sEnding2 = /\[2/g, dblBar2 = /\|\]/g;
      var match, fBarPos = [], fEndPos = [], sEndPos = [], lRepPos = [], rRepPos = [], dblBarPos = [];
      var firstRepeat = 0, tokenString=[], tokenLocations=[], tokenCount=0,sortedTokens=[], sortedTokenLocations=[];
      var pos=0,endPos=0,i=0;k=0,l=0,m=0; ntokenString=[]
      var bigABCNotes="";
/*
//misses second endings if there is a repeat just before it.
    var pathTokens = /(\|\|)|(\|\])|:\||\|:|\[\d+|\|\d+/g;  
    var ntokens = newABCNotes.match(pathTokens);

      while ((match = firstBar.exec(newABCNotes)) != null) {
          fBarPos.push(match.index);
      }
      sortedTokens[0]="fb";
      if(fBarPos[0]>6) fBarPos[0]=0;
      sortedTokenLocations[0]=fBarPos[0];

        while ((match = pathTokens.exec(newABCNotes)) != null) {
          sortedTokenLocations.push(match.index);
        }
        alert(ntokens);
      for (tokenCount;tokenCount < ntokens.length; tokenCount++) {
        if( /:\||\|:/.test(ntokens[tokenCount])){
            if((ntokens[tokenCount]==":|")||(ntokens[tokenCount]==":]")) {
                sortedTokens[tokenCount+1]="rr";
            } else
            if((ntokens[tokenCount]=="|:")||(ntokens[tokenCount]=="[:")) {
                sortedTokens[tokenCount+1]="lr";
            }
        } else 
        if( /\[\d+|\|\d+/.test(ntokens[tokenCount])){
        alert(tokenCount+" = "+ntokens[tokenCount])
            if((ntokens[tokenCount]=="|1")||(ntokens[tokenCount]=="[1")){
                sortedTokens[tokenCount+1]="fe";
            } else
            if((ntokens[tokenCount]=="|2")||(ntokens[tokenCount]=="[2")){
                sortedTokens[tokenCount+1]="se";
            }
        } else
            if( /(\|\|)|(\|\])/.test(ntokens[tokenCount])){
                sortedTokens[tokenCount+1]="db";
            }
        }
        sortedTokens[++tokenCount]="lb";
        sortedTokens[tokenCount++]=fBarPos[fBarPos.length-1]; // last bar
        //alert(sortedTokens+"\n"+sortedTokenLocations);

*/             

      while ((match = firstBar.exec(newABCNotes)) != null) {
          fBarPos.push(match.index);
      }
      tokenString[tokenCount]="fb";
      if(fBarPos[0]>6) fBarPos[0]=0;
      tokenLocations[tokenCount++]=fBarPos[0]; // first bar
      while (((match = fEnding.exec(newABCNotes))||(match = fEnding2.exec(newABCNotes))) != null) {
        fEndPos.push(match.index);
        tokenString[tokenCount]="fe";
        tokenLocations[tokenCount++]=match.index; // first endings
      }
      while (((match = sEnding.exec(newABCNotes))||(match = sEnding2.exec(newABCNotes))) != null) {
        sEndPos.push(match.index);
        tokenString[tokenCount]="se";
        tokenLocations[tokenCount++]=match.index; // second endings
    }
      while ((match = rRepeat.exec(newABCNotes)) != null) {
        rRepPos.push(match.index);
        tokenString[tokenCount]="rr";
        tokenLocations[tokenCount++]=match.index; // right repeats
      }
      while ((match = lRepeat.exec(newABCNotes)) != null) {
        lRepPos.push(match.index);
        tokenString[tokenCount]="lr";
        tokenLocations[tokenCount++]=match.index; // left repeats
      }
      while (((match = dblBar.exec(newABCNotes))||(match = dblBar2.exec(newABCNotes))) != null) {
        dblBarPos.push(match.index);
        tokenString[tokenCount]="db";
        tokenLocations[tokenCount++]=match.index; // double bars
      }
      tokenString[tokenCount]="lb";
      tokenLocations[tokenCount++]=fBarPos[fBarPos.length-1]; // last bar


      var indices = tokenLocations.map(function(elem, index){return index;});
      indices.sort(function (a,b) {return tokenLocations[a] - tokenLocations[b];});

      for(j=0;j<tokenLocations.length;j++){
          sortedTokens[j]=tokenString[indices[j]];
          sortedTokenLocations[j]=tokenLocations[indices[j]];
      }

      pos=0;
      for(i=0;i<sortedTokens.length;i++){
      if(bigABCNotes.length > 1000) break;//safety check
        if((sortedTokens[i]=="rr")||(sortedTokens[i]=="se")){ //find next repeat or second ending
          bigABCNotes += newABCNotes.substr(pos,sortedTokenLocations[i]-pos); //notes from last location to rr or se
          for(k=i-1;k>=0;k--){ //march backward from there
//alert(sortedTokens+"\n "+sortedTokenLocations+"+\n i= "+i+" k= "+k+"   ---"+sortedTokens[k]+"\n "+bigABCNotes);
              if((sortedTokens[k]=="se")||(sortedTokens[k]=="rr")||
                  (sortedTokens[k]=="fb")||(sortedTokens[k]=="lr")) { // check for likely loop point
                  pos=sortedTokenLocations[k]; // mark loop beginning point
                  for(j=k+1;j<sortedTokens.length;j++){ //walk forward from there
                      if((sortedTokens[j]=="fe")||(sortedTokens[j]=="rr")){ // walk to likely stopping point (first ending or repeat)
                          bigABCNotes += newABCNotes.substr(pos,sortedTokenLocations[j]-pos);
                          pos=sortedTokenLocations[j]; // mark last position encountered
                          i=j+1; //consume tokens from big loop
                          if(sortedTokens[j]=="fe") { //if we got to a first ending we have to skip it...
                              for(l=j;l<sortedTokens.length;l++){ //walk forward from here until the second ending
                                  if(sortedTokens[l]=="se") {
                                      for(m=l;m<sortedTokens.length;m++){ //look for end of second ending
                                          if(sortedTokens[m]=="db"){ //a double bar marks the end of a second ending
                                              bigABCNotes += newABCNotes.substr(sortedTokenLocations[l],
                                                      sortedTokenLocations[m]-sortedTokenLocations[l]); //record second ending
                                              pos=sortedTokenLocations[m]; //mark most forward progress
                                              i=m+1; //consume the tokens from the main loop
                                              break; //quit looking
                                            }    
                                        } //for m
                                        i=l+1; //consume tokens TED: CHECK THIS
                                        break; //quit looking
                                      }
                                      // TED:  BREAK HERE? (probably not)
                                } //for l
                                //break; // TED IS THIS ONE NEEDED?
                             }
                             break;
                         }
                         
                      }//for j
                      break;
              } //if
              //break;
          } //for k   
        } //if
      }// for i
      bigABCNotes += newABCNotes.substr(pos,sortedTokenLocations[sortedTokens.length-1]-pos);

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

