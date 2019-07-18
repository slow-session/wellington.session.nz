---
layout: page
title: Learn a tune
permalink: /learn-a-tune/
---
<div>
<p>
This page is under development.<br>
Prototype of tune learning page.  There are up to 9 loops, some of which are automatically calculated based on tune rhythm. We assume 2 repetitions of the tune. We are guessing at the number of parts based on the ABCs. Check a box to select the section. Multiple selected sections are combined. Up/Dn buttons adjust the <b>selected</b> sections by 0.25 seconds. Your suggestions are welcome.

</p>
</div>
<!-- ***************************************************
Player controls
-->
<div class="row">
  <div class="small-10 large-9 columns">
    <div class="player">
      <div id="audioPlayer"></div>
      <div id="showPlayer"></div>
    </div>
  </div>
  <div class="small-2 large-3 columns end"></div>
</div>
<!-- ***************************************************
  loop presets
-->
<div class="row" style="font-size:14px;">
  <div class="small-4 columns" id="segments0">.</div>
  <div class="small-4 columns" id="segments1">.</div>
  <div class="small-4 columns" id="segments2">.</div>
</div>
<!-- ***************************************************
  rendered ABC and tune selector scrolling table
-->
<div class="row">
  <div class="small-8 columns">  
      <div class="output">
        <div id="paper0" class="paper"></div>
      </div>
  </div>

      <div id='abcSource' style="display: none;">
        <textarea name='abcText' id="abcText" rows="13" cols="65"
                  style="background-color:#ebebeb; font-size:small; max-width:100%"
                  spellcheck="false">
<!-- X: 3
T: The Air Tune
R: reel
M: 4/4
L: 1/8
K: D
|:Af fe f2 ed|(3fga de f2 ed|Be ed fd ed|BA (3Bcd BAFG|
Af fe f2 ed|(3fga de f2 ed|dB Be dB (3Bcd[1FAGE DEFG :|2 FAGE Defg||
|:a2 ga fg ef|ed cd FA DA|Beed fded|BA ~A2 BAFG|
a2 ga fg ef|ed cd FA DA|GBBA BdBA |[1 ef fe de fg :|2 EF FE D3||
-->
        </textarea>

      </div>

  <div class="small-4 columns" style="padding-top: 20px;">
<p><b>
Scroll down and select tune by clicking tune name.
</b></p>
        <table id="tunes" class="tablesorter"  style="display: block; height: 500px; overflow-y: scroll; font-size:14px; border: 1px solid black; border-radius: 10px;">
        <thead>
            <tr>
              <th style="width70%;">Tune Name&#x25B2;&#x25BC;</th>
              <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
              <th style="width:14%;">Rhythm<br />&#x25B2;&#x25BC;</th>
            </tr>
        </thead>
        <tbody>
            {% assign tunes = site.tunes %}
            {% assign sortedtunes = tunes | sort: 'titleID' %}
            {% assign tuneid = 200 %}
            {% for tune in sortedtunes %}
              {% if tune.mp3_file  contains "mp3" %}
                {% assign tuneid = tuneid | plus: 1 %}
                {% include LAT-tablerow-no-player.html tuneId=tuneid %}
              {% endif %}
            {% endfor %}
        </tbody>
      </table>
    </div>
</div>

<!-- <div class="player"> -->
<!-- <div id="audioPlayer"></div> -->
<!-- <div id="showPlayer"></div> -->
<div id="ABC"></div>

<div id="showLoops"></div>


<script src="{{ site.mp3_host }}/js/New_audioplayer.js"></script>

<script>

function changeTune(tuneNumber){

    var abc_text = document.getElementById("abc"+tuneNumber).innerHTML;
    var revised_abc=abc_text.replace("<!--", "");
    abc_text = revised_abc.replace("-->", "");
    document.getElementById("abcText").innerHTML = abc_text;

    var mp3url = document.getElementById("mp3_name"+tuneNumber).innerHTML;
    audioPlayer.innerHTML = createAudioPlayer();
    showPlayer.innerHTML = '<h4>Playing ' + mp3url + '</h4>';
    showPlayer.innerHTML += createMP3player_experimental('playABC', mp3url, 'mp3player_tunepage');

    createSlider('playPositionplayABC','RSplayABC');

    New_LoadAudio('trplayABC', audioplayerplayABC, pButtonplayABC,  playPositionplayABC, mp3url, APosplayABC, DurplayABC,  RSSplayABC);

    abc_editor = new window.ABCJS.Editor('abcText', { paper_id: "paper0", warnings_id:"warnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
    var total_note_count = count_bars_abc(document.getElementById("abcText").innerHTML);

    OneAudioPlayer.ondurationchange = function() {delay_update_segments(tuneNumber,total_note_count)};

}
function delay_update_segments(tuneNumber,total_note_count) {
  update_segments(tuneNumber,total_note_count);
  segmentArray = createSegmentTable();
  segments0.innerHTML = segmentArray[0];
  segments1.innerHTML = segmentArray[1];
  segments2.innerHTML = segmentArray[2];
  CurrentAudioSlider.noUiSlider.updateOptions({range: {'min': 0, 'max': Number(OneAudioPlayer.duration)}});
  CurrentAudioSlider.noUiSlider.setHandle(2,Number(OneAudioPlayer.duration));

}

function update_segments(tuneNumber,total_note_count){

  var seg_full = Number(OneAudioPlayer.duration);
  var  tune_rhythm = document.getElementById("tune_type"+tuneNumber).innerHTML;

  var repeats = document.getElementById("mp3_repeats"+tuneNumber).innerHTML;
  if (repeats < 1) { repeats = 2;} //not defined - default value = 2 possibly use total length?

  parts = document.getElementById("mp3_parts"+tuneNumber).innerHTML;
  //alert(parts);
  if (parts < 1) {

    switch(tune_rhythm) { //attempt to calculate number of parts
    case "reel":
    case "hornpipe":
    case "barndance":
      base_length = 128;
      break;
    case "mazurka":
    case "waltz":
    case "jig":
      base_length = 96;
      break;
    case "slip jig":
      base_length = 72;
      break;
    case "polka":
        base_length = 128;
        break;
    default:
      base_length = 128;
    }
    var divisions = total_note_count/base_length; // see if tune fits a pattern
    var int_divisions = Math.floor(divisions + 0.1);
  }
  if((divisions-int_divisions)< 0.2){ // parts can be calculated
    parts=int_divisions;
  } else {
    parts=2; // parts can't be calculated - assigned to default value=2
  }
  var start1=0.0;
  var start2=0.0;
  var end1=0.0;
  var end2=0.0;
  var each_part = seg_full/repeats/parts;
  var current_segment = 0;
  if((parts*2)<10) {
    for(i=0;i<parts;i++){ // divide parts in half and fill in table;
      start1=each_part*i;
      end1=start1+each_part/2; // half of part
      start2=end1;
      end2=end1+each_part/2; // half of part     
      segments[i*2].start=start1.toFixed(2);
      segments[i*2].end=end1.toFixed(2); // half of part
      segments[i*2].name="Part-"+(i+1)+"a";
      segments[i*2+1].start=start2.toFixed(2);
      segments[i*2+1].end=end2.toFixed(2); // half of part
      segments[i*2+1].name="Part-"+(i+1)+"b";
      current_segment+=2;
    }
  }

  for(i=current_segment;i<9;i++){// fill in rest of table
    segments[i].start=0.0;
    segments[i].end=seg_full.toFixed(2);
    segments[i].name="user-"+(i-current_segment+1);    
  }
/*
  Seg1=seg_full;

  segments = [
  {name: "A1 ",start: 0.0, end: Seg1/8},
  {name: "A2 ",start: Seg1/8, end: Seg1/4},
  {name: "A3 ",start: Seg1/4, end: Seg1/2},
  {name: "A4 ",start: Seg1/2, end: Seg1},
  {name: "B1 ",start: 16.5, end: 24.3},
  {name: "B2 ",start: 24.3, end: 32.3},
  {name: "B3 ",start: 0.0, end: Seg1/2},
  {name: "B4 ",start: Seg1/2, end: Seg1},
  {name: "User",start: 0.0, end: Seg1},
  ];
*/
}


function update_segments_mess(tuneNumber){
/*
var  tune_rhythm = document.getElementById("tune_type"+tuneNumber).innerHTML;

repeats = document.getElementById("mp3_repeats"+tuneNumber);
if (repeats < 1) { repeats = 2;} //not defined - default value = 2 possibly use total length?

parts = document.getElementById("mp3_parts"+tuneNumber);
if (parts < 1) {

  switch(tune_rhythm) {
  case "reel":
  case "hornpipe":
  case "barndance":
    base_length = 128;
    break;
  case "mazurka":
  case "waltz":
  case "jig":
    base_length = 96;
    break;
  case "slip jig":
    base_length = 72;
    break;
  case "polka":
      base_length = 128;
      break;
  default:
    base_length = 128;
  }
}
  bars=count_bars_abc(document.getElementById("abcText").innerHTML);
  divisions = bars/base_length;
  var quotient = Math.floor(bars/base_length);
  var remainder = divisions - quotient ;
  var divisions = 0;
  if (remainder < 0){ remainder *= -1}
  if(remainder < .2) { divisions = math.floor(divisions+.4) } // close enough



  repeats = document.getElementById("mp3_repeats"+tuneNumber);
  if (repeats < 1) { repeats = 2;} //not defined - default value = 2 possibly use total length?
  parts = document.getElementById("mp3_parts"+tuneNumber);
  if (parts < 1) {
    if (divisions ==0 ){
      parts = 2; //not defined - default value = 2
    } else {
      parts = divisions;
    }
  }

  */

    alert(DurationP);
  Once_through=Number(OneAudioPlayer.duration)/2;
  Each_part = Once_through/2;

  alert(OneAudioPlayer.duration);

return;
  for(i=0;i<parts;i++){
    segments[i].start=i;
    segments[i].end=Each_part*(i+1);
  }
  if(parts == 1){
    segment[1].name=""}
}

function reloadPage() {
    window.location.reload(true);
}

let segments = [
{name: "A part",start: 0.6, end: 16.5},
{name: "B part",start: 16.5, end: 32.3},
{name: "A-1",start: 5.0, end: 8.9},
{name: "A-2",start: 8.9, end: 16.5},
{name: "B-1",start: 16.5, end: 24.3},
{name: "B-2",start: 24.3, end: 32.3},
{name: "Full",start: 0.6, end: 32.3},
{name: "User",start: 0.0, end: 69},
{name: "User",start: 0.0, end: 69},
];


function createSegmentTable(){

  var segmentList0='<table><tr><th>&nbspLoop</th><th col width="3">&nbspShow</th><th>From</th><th>To</th></tr><tbody>';
  segmentList1='<table><tr><th>&nbspLoop</th><th col width="3">&nbspShow</th><th>From</th><th>To</th></tr><tbody>';
  segmentList2='<table><tr><th>&nbspLoop</th><th col width="3">&nbspShow</th><th>From</th><th>To</th></tr><tbody>';

  for(i=0;i<segments.length;i++){
    j=Math.floor(i/3);
    switch (j) {
      case 0:
          segmentList0 += '<tr><td>'+segments[i].name+'</td>';
          segmentList0 += '<td>'+'<input type="checkbox" onclick="applySegments()" id='+ "check"+i + '>'+'</td>';
          segmentList0 += '<td>'+  '<button class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 0)">Up</button><input type="text" onchange="applySegments()" id="check' + i + 'from" size="6" value='+segments[i].start+'><button class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 0)">Dn</button></td>';
          segmentList0 += '<td>'+  '<button class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 2)">Up</button><input type="text" onchange="applySegments()" id="check' + i + 'to" size="6" value='+segments[i].end+'><button class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 2)">Dn</button></td></tr>';
        break;
      case 1:
          segmentList1 += '<tr><td>'+segments[i].name+'</td>';
          segmentList1 += '<td>'+'<input type="checkbox" onclick="applySegments()" id='+ "check"+i + '>'+'</td>';
          segmentList1 += '<td>'+  '<button class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 0)">Up</button><input type="text" onchange="applySegments()" id="check' + i + 'from" size="6" value='+segments[i].start+'><button class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 0)">Dn</button></td>';
          segmentList1 += '<td>'+  '<button class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 2)">Up</button><input type="text" onchange="applySegments()" id="check' + i + 'to" size="6" value='+segments[i].end+'><button class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 2)">Dn</button></td></tr>';
        break;
      case 2:
          segmentList2 += '<tr><td>'+segments[i].name+'</td>';
          segmentList2 += '<td>'+'<input type="checkbox" onclick="applySegments()" id='+ "check"+i + '>'+'</td>';
          segmentList2 += '<td>'+  '<button class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 0)">Up</button><input type="text" onchange="applySegments()" id="check' + i + 'from" size="6" value='+segments[i].start+'><button class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 0)">Dn</button></td>';
          segmentList2 += '<td>'+  '<button class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 2)">Up</button><input type="text" onchange="applySegments()" id="check' + i + 'to" size="6" value='+segments[i].end+'><button class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 2)">Dn</button></td></tr>';
        break;
    }

  }
    segmentList0 += '</tbody></table>';
    segmentList1 +='</tbody></table>';
    segmentList2 +='</tbody></table>';
return [segmentList0, segmentList1, segmentList2];
}

function adjust_segment_controls(values, handle){

  var checked_slider = -1;
  var multiple_sliders = 0;
  for(i=0;i<9;i++){
    document.getElementById("check" + i).checked;
    if(document.getElementById("check" + i).checked){
      checked_slider = i;
      multiple_sliders++;
    }
  }
  //alert(checked_slider+", "+multiple_sliders);
  if(multiple_sliders>1){return;} //quit if more than one slider is checked
  //alert(checked_slider+", "+document.getElementById("check" + checked_slider + "from").value +", "+document.getElementById("check" + checked_slider + 'to").value);
  document.getElementById("check" + checked_slider + "from").value = values[0];
  document.getElementById("check" + checked_slider + "to").value = values[2];
}

function applySegments(){
  var text='';
    var fullBeginLoopTime = Number(OneAudioPlayer.duration);
    var fullEndLoopTime = Number(0.0);
    var numCheckedBoxes = 0;
    for(i=0;i<segments.length;i++){

      checkBox = document.getElementById("check"+i);
      fromId= document.getElementById("check"+i+"from");
      toId= document.getElementById("check"+i+"to");

      if (checkBox.checked == true){
          numCheckedBoxes++;
          BeginLoopTime = Number(fromId.value);
          EndLoopTime = Number(toId.value);

          if(fullBeginLoopTime > BeginLoopTime) {
            //alert("A, "+BeginLoopTime+", "+fullBeginLoopTime);
            fullBeginLoopTime = BeginLoopTime;
          }
          if(fullEndLoopTime < EndLoopTime) {
            //alert("B, "+EndLoopTime+", "+fullEndLoopTime);
            fullEndLoopTime = EndLoopTime;
          }
          //alert(i+", "+BeginLoopTime+", "+EndLoopTime+", "+fullBeginLoopTime+", "+fullEndLoopTime);
        }
    }

    if(numCheckedBoxes > 0){ // do nothing unless at least one box is checked
      if (OneAudioPlayer.paused==false){ // audio is currently playing.
          OneAudioPlayer.pause(); // first pause the audio
          turnAudioBackOn = true;
      }
      OneAudioPlayer.currentTime = fullBeginLoopTime;
      OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
      // first reset to ends, then reposition
      CurrentAudioSlider.noUiSlider.setHandle(0,0);
      CurrentAudioSlider.noUiSlider.setHandle(2,OneAudioPlayer.duration);
      CurrentAudioSlider.noUiSlider.setHandle(1,0);
      // then set to positions in row
      CurrentAudioSlider.noUiSlider.setHandle(1,fullBeginLoopTime);
      CurrentAudioSlider.noUiSlider.setHandle(0,fullBeginLoopTime);
      CurrentAudioSlider.noUiSlider.setHandle(2,fullEndLoopTime);
      BeginLoopTime = fullBeginLoopTime;
      EndLoopTime = fullEndLoopTime;
      if (turnAudioBackOn){ // audio was  playing when they fiddled with the checkboxes
          OneAudioPlayer.play(); // then turn it back on
          turnAudioBackOn = false; // and reset the flag
      }
       //alert("checked "+ i + "loops:  "+ fromId.value+" to "+ toId.value);
   }


//alert("checked "+ this.id + "loop:  "+ this.value);
}

function Adjust_up(row, inputBox) {
  var elName = "check"+row;
  if(document.getElementById(elName).checked == false) return;
  if(inputBox == 0){
    elName += "from";
  } else if (inputBox == 2) {
    elName += "to";
  }
  target = checkBox = document.getElementById(elName);
    NumValue=Number(target.value)
  if(NumValue <= (OneAudioPlayer.duration - 0.25)) {
    //alert("up "+target.value);
    target.value = Number(NumValue + 0.25).toFixed(2);
    if((inputBox == 0 ) & (OneAudioPlayer.currentTime < target.value)) {
      OneAudioPlayer.currentTime = target.value;
    }
    CurrentAudioSlider.noUiSlider.setHandle(inputBox,target.value);
    //alert(target.value);
    if(inputBox == 0){
      BeginLoopTime = target.value;
    } else if ( inputBox == 2){
      EndLoopTime = target.value;
    }
  }
}

function Adjust_down(row, inputBox){
  var elName = "check"+row;
  if(document.getElementById(elName).checked == false) return;
  if(inputBox == 0){
    elName += "from";
  } else if (inputBox == 2) {
    elName += "to";
  }
  target = checkBox = document.getElementById(elName);
  NumValue=Number(target.value)
  if(NumValue >= 0.25) {
    //alert("dn "+target.value);
    target.value = Number(NumValue - 0.25).toFixed(2);
    if((inputBox == 2) & (OneAudioPlayer.currentTime > target.value)) {
      OneAudioPlayer.currentTime = target.value;
    }
    CurrentAudioSlider.noUiSlider.setHandle(inputBox,target.value);
    //alert(target.value);
    if(inputBox == 0){
      BeginLoopTime = target.value;
    } else if ( inputBox == 2){
      EndLoopTime = target.value;
    }
  }


}
function New_LoadAudio(trID, audioplayer, pButton, positionSlider, audioSource, audioposition, duration, audioSpeed) {
//alert(trID+", "+ audioplayer+", "+ pButton+", "+ positionSlider+", "+ audioSource+", "+ audioposition+", "+ duration+", "+ audioSpeed);
    if (pButton.className == "playButton") {
        if (PreviousAudioID != audioplayer) { //only load if necessary
            OneAudioPlayer.src = audioSource;
            if (PreviousAudioID != null) { //reset previous audio player
                //audioSlider.noUiSlider.values[1] = 0;
                if (PreviouspButton != null) PreviouspButton.className = "playButton";
                OneAudioPlayer.removeEventListener("timeupdate", New_positionUpdate);
                OneAudioPlayer.removeEventListener("timeupdate", setAudioLoops);
                AudioPosition.innerHTML = "0.0";
                if (PreviousButton1ID != null) {
                    PreviousButton1ID.value = " Loop Start ";
                    PreviousButton2ID.value = " Loop End ";
                }
                if (document.getElementById(PreviousTrID)) {
                    document.getElementById(PreviousTrID).style.backgroundColor = '';
                }
                //alert(audioplayer.id+"::"+PreviousAudioID.id+"\n"+timeline.id+"::"+Previoustimeline.id+"\n"+Eventhandler);
            }
            //OneAudioPlayer.src = audioSource;
            PreviousAudioID = audioplayer;
            Previoustimeline = positionSlider;
            //Previousplayhead=playhead;
            PreviouspButton = pButton;
            AudioPosition = audioposition;
            DurationP = duration;
            PreviousTrID = trID;
            AudioSpeed = audioSpeed;
            // modify slider
            positionSlider.noUiSlider.updateOptions({
                tooltips: [wNumb({decimals: 1}), wNumb({decimals: 1}), wNumb({decimals: 1})],
                //range: {'min': 0, 'max': Number(OneAudioPlayer.duration)},
                //pips: {mode: 'count', values: 6, density: 6},
            });
            if (document.getElementById(trID)) {
                document.getElementById(trID).style.backgroundColor = 'khaki';
            }
        }
        CurrentAudioSlider = positionSlider;
        //OneAudioPlayer.playbackRate = audioSpeed.value / 100;
        OneAudioPlayer.addEventListener("timeupdate", New_positionUpdate);
        delay_load_upadate();
    }
}

function count_bars_abc(str) {
    /*
     * Our simple ABC player doesn't handle repeats well.
     * This function unrolls the ABC so that things play better.
     */
    var lines = str.split('\n'),
        j, header, newABCHeader = "",
        newABCNotes = "",
        tempStr = "",
        index = 0,
        res = "";
    var tokens = "";
    for (j = 0; j < lines.length; ++j) {
        header = ABCheader.exec(lines[j]);
        if (header) {
            // put the header lines back in place
            newABCHeader += lines[j] + "\n"; // consider special case of a keychange header K: in the middle
        } else if (/^\s*(?:%.*)?$/.test(lines[j])) {
            // Skip blank and comment lines.
            continue;
        } else {
            // Parse the notes.
            newABCNotes += lines[j];
        }
    }

    /*
     * Regular expression used to parse ABC - https://regex101.com/ was very helpful in decoding
     *

    ABCString = (?:\[[A-Za-z]:[^\]]*\])|\s+|%[^\n]*|![^\s!:|\[\]]*!|\+[^+|!]*\+|[_<>@^]?"[^"]*"|\[|\]|>+|<+|(?:(?:\^+|_+|=|)[A-Ga-g](?:,+|'+|))|\(\d+(?::\d+){0,2}|\d*\/\d+|\d+\/?|\/+|[xzXZ]|\[?\|:\]?|:?\|:?|::|.

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

    var fEnding = /\|1/g,
        sEnding = /\|2/g,
        lRepeat = /\|:/g,
        rRepeat = /:\|/g,
        dblBar = /\|\|/g,
        firstBar = /\|/g;
    var fEnding2 = /\[1/g,
        sEnding2 = /\[2/g,
        dblBar2 = /\|\]/g;
    var match, fBarPos = [],
        fEndPos = [],
        sEndPos = [],
        lRepPos = [],
        rRepPos = [],
        dblBarPos = [];
    var firstRepeat = 0,
        tokenString = [],
        tokenLocations = [],
        tokenCount = 0,
        sortedTokens = [],
        sortedTokenLocations = [];
    var pos = 0,
        endPos = 0,
        i = 0,
        k = 0,
        l = 0,
        m = 0,
        ntokenString = [];
    var bigABCNotes = "";


    while ((match = firstBar.exec(newABCNotes)) != null) {
        fBarPos.push(match.index);
    }
    tokenString[tokenCount] = "fb";
    if (fBarPos[0] > 6) {
        fBarPos[0] = 0;
    }
    tokenLocations[tokenCount++] = fBarPos[0]; // first bar
    while (((match = fEnding.exec(newABCNotes)) || (match = fEnding2.exec(newABCNotes))) != null) {
        fEndPos.push(match.index);
        tokenString[tokenCount] = "fe";
        tokenLocations[tokenCount++] = match.index; // first endings
    }
    while (((match = sEnding.exec(newABCNotes)) || (match = sEnding2.exec(newABCNotes))) != null) {
        sEndPos.push(match.index);
        tokenString[tokenCount] = "se";
        tokenLocations[tokenCount++] = match.index; // second endings
    }
    while ((match = rRepeat.exec(newABCNotes)) != null) {
        rRepPos.push(match.index);
        tokenString[tokenCount] = "rr";
        tokenLocations[tokenCount++] = match.index; // right repeats
    }
    while ((match = lRepeat.exec(newABCNotes)) != null) {
        lRepPos.push(match.index);
        tokenString[tokenCount] = "lr";
        tokenLocations[tokenCount++] = match.index; // left repeats
    }
    while (((match = dblBar.exec(newABCNotes)) || (match = dblBar2.exec(newABCNotes))) != null) {
        dblBarPos.push(match.index);
        tokenString[tokenCount] = "db";
        tokenLocations[tokenCount++] = match.index; // double bars
    }
    tokenString[tokenCount] = "lb";
    tokenLocations[tokenCount++] = fBarPos[fBarPos.length - 1]; // last bar


    var indices = tokenLocations.map(function(elem, index) {
        return index;
    });
    indices.sort(function(a, b) {
        return tokenLocations[a] - tokenLocations[b];
    });

    for (j = 0; j < tokenLocations.length; j++) {
        sortedTokens[j] = tokenString[indices[j]];
        sortedTokenLocations[j] = tokenLocations[indices[j]];
    }
    pos = 0;
    for (i = 0; i < sortedTokens.length; i++) {
        if (bigABCNotes.length > 1000) {
            break; //safety check
        }
        if ((sortedTokens[i] == "rr") || (sortedTokens[i] == "se")) { //find next repeat or second ending
            bigABCNotes += newABCNotes.substr(pos, sortedTokenLocations[i] - pos); //notes from last location to rr or se
            for (k = i - 1; k >= 0; k--) { //march backward from there
                // check for likely loop point
                if ((sortedTokens[k] == "se") || (sortedTokens[k] == "rr") || (sortedTokens[k] == "fb") || (sortedTokens[k] == "lr")) {
                    pos = sortedTokenLocations[k]; // mark loop beginning point
                    for (j = k + 1; j < sortedTokens.length; j++) { //walk forward from there
                        if ((sortedTokens[j] == "fe") || (sortedTokens[j] == "rr")) { // walk to likely stopping point (first ending or repeat)
                            bigABCNotes += newABCNotes.substr(pos, sortedTokenLocations[j] - pos);
                            pos = sortedTokenLocations[j]; // mark last position encountered
                            i = j + 1; //consume tokens from big loop
                            if (sortedTokens[j] == "fe") { //if we got to a first ending we have to skip it...
                                for (l = j; l < sortedTokens.length; l++) { //walk forward from here until the second ending
                                    if (sortedTokens[l] == "se") {
                                        for (m = l; m < sortedTokens.length; m++) { //look for end of second ending
                                            if (sortedTokens[m] == "db") { //a double bar marks the end of a second ending
                                                bigABCNotes += newABCNotes.substr(sortedTokenLocations[l],
                                                    sortedTokenLocations[m] - sortedTokenLocations[l]); //record second ending
                                                pos = sortedTokenLocations[m]; //mark most forward progress
                                                i = m + 1; //consume the tokens from the main loop
                                                break; //quit looking
                                            }
                                        } //for m
                                        i = l + 1; //consume tokens TED: CHECK THIS
                                        break; //quit looking
                                    }
                                } //for l
                            }
                            break;
                        }
                    } //for j
                    break;
                } //if
            } //for k
        } //if
    } //for i

    bigABCNotes += newABCNotes.substr(pos, sortedTokenLocations[sortedTokens.length - 1] - pos);
    bigABCNotes += "\""; //hack to make sure the newBigABCNotes gets fills when there are not quotes

    var newBigABCNotes = "";
    for (j = 0; j < bigABCNotes.length; j++) {
        if (bigABCNotes[j] == "\"") {
            newBigABCNotes = [bigABCNotes.slice(0, j), "\\\"", bigABCNotes.slice(j)].join('');
        }
        newBigABCNotes = newBigABCNotes.substring(0, newBigABCNotes.length - 3); //undo hack
    }
    tempABCNotes = newBigABCNotes.toLowerCase();
    tempABCNotes = tempABCNotes.replace(/(?=[(])/g, 'z');

    var count = (tempABCNotes.match(/a/g) || []).length;
        count += (tempABCNotes.match(/b/g) || []).length;
        count += (tempABCNotes.match(/c/g) || []).length;
        count += (tempABCNotes.match(/d/g) || []).length;
        count += (tempABCNotes.match(/e/g) || []).length;
        count += (tempABCNotes.match(/f/g) || []).length;
        count += (tempABCNotes.match(/g/g) || []).length;
        count += (tempABCNotes.match(/2/g) || []).length; // note already counted so +1
        count += (tempABCNotes.match(/3/g) || []).length*2; // note + 2
        count += (tempABCNotes.match(/4/g) || []).length*3; // note + 3
        count -= (tempABCNotes.match(/z/g) || []).length*3; //remove triplets (confusing, but correct)
/*  count is the total number of beats,
    A 16 bar A part reel = 128 beats,
    A 16 bar A part jig = 96 beats,
    for a normal AA BB reel, count should be ~256.
    For a normal AA BB jig, ~192.
    if count ~ 384 it is probably an AA BB CC reel
    if count ~ 288 it is probably an AA BB CC jig
    For normally structured tunes (e.g. AA BB) using various values of count,
    and tune type (jig/reel) we can guess at the structure.
    We know the tune duration, but not the number of repeats of the tune
    on the recording.  If we knew that we could approximate the timing loops.
    We could guess most tunes have 2 full repeats...
    We should add one or two values to the tune.md files:
        number of times tune is repeated (needed)
        and number of parts e.g. 2 if A and B parts, 3 if A B C, etc,
        perhaps it could be in the form of AABB, AABBCC, ABCDE, etc.
    If a 2 part (A&B) reel is repeated 3 times
    duration (found when mp3 file is read) / 3 = time for 1 full loop;
    From 0 to (duration / 3) / 2 = A part.
    From (duration / 3) / 2 to (duration / 3) = B part, etc.
*/
    return (count);
}

  $(document).ready(function() {
    var mp3url = "../mp3/air-tune-the.mp3";
    audioPlayer.innerHTML = createAudioPlayer();
    showPlayer.innerHTML = '<h4>Playing ' + mp3url + '</h4>';
    showPlayer.innerHTML += createMP3player_experimental('playABC', mp3url, 'mp3player_tunepage');
    createSlider('playPositionplayABC','RSplayABC');
    var segmentArray = createSegmentTable();
    segments0.innerHTML = segmentArray[0];
    segments1.innerHTML = segmentArray[1];
    segments2.innerHTML = segmentArray[2];
    New_LoadAudio('trplayABC', audioplayerplayABC, pButtonplayABC,  playPositionplayABC, mp3url, APosplayABC, DurplayABC,  RSSplayABC);
    abc_editor = new window.ABCJS.Editor('abcText', { paper_id: "paper0", warnings_id:"warnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
  });
</script>
<style>
.upDownButton {
  background-color: #1c2e20;
  border: none;
  color: white;
  padding: 3px;
  align: center;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
}
</style>
