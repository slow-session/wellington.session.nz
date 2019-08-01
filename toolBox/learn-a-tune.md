---
layout: page
title: Learn a tune
permalink: /learn-a-tune/
---
<div>
<p>
Click on tune name to select the tune to learn. You can define up to 9 practice loops. Some are automatically estimated based on tune rhythm. Check a box to select the section. Multiple selected sections are combined. Up/Dn buttons adjust a <b>selected</b> section by 0.25 seconds. Green slider handle is the tune position and the two others mark start and end of loop.
</p>
<div id="debug"></div>
<!-- ***************************************************
Player controls
-->
<div class="row">
  <div class="small-6 medium-8 large-9 columns">
    <div class="player">
      <div id="audioPlayer"></div>
      <div id="showPlayer"></div>
    </div>
  </div>
  <div class="small-6 medium-4 large-3 columns">
    <div  style="float: left;">
      <a href="javascript:void(0);" id="HideShowDots" class="HideShowDotsButton" onclick="HideShowDots()">Hide the Dots</a>
    </div>
  </div>
</div>
<!-- ***************************************************
  loop presets
-->
<div class="row" style="font-size:14px;" min-width="300px">
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
      <textarea name='abcText' id="FAKEabcText" rows="13" cols="65"
                style="background-color:#ebebeb; font-size:small; max-width:100%"
                spellcheck="false">
X: 3
T: The notes are hidden
T: Click the [Show the Dots] button to display the music
T: Playing by ear is the best!
        </textarea>
        <textarea name='abcText' id="abcText" rows="13" cols="65"
                  style="background-color:#ebebeb; font-size:small; max-width:100%"
                  spellcheck="false">
<!-- X: 3
X: 1
T: Tatter Jack Walsh
R: jig
M: 6/8
L: 1/8
K: Dmix
|: fef ded | cAB c2 A | dcA GFG| Add efg |
fef ded | cAB c2 A | dcA GFG | Ad^c d3 :|
|: dfa afd | dfa agf | g2 a ged | ^cde gfg |
afd fed | cAB cde | dcA GFG| Ad^c d3 :|
-->
        </textarea>

      </div>

  <div class="small-4 columns" style="padding-top: 20px;">

<div class="tableSlider">
  <p><b>Select Tune by clicking name</b></p>
  <input type="range" min="0" max="100" value="0" id="tableSlider" style="width: 94%;" oninput="scrollTable(value)">
</div>
        <table id="tunes" class="tuneSelect"  style="display: block; height: 500px; overflow-y: scroll; font-size:14px; border: 2px solid LightGrey; border-radius: 10px;" onscroll="scroll_indicator()">
        <thead>
            <tr>
              <th style="width70%;">Tune Name</th>
              <th style="width:6%;">Key</th>
              <th style="width:14%;">Rhythm</th>
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
  if (parts < 1) { // parts is not in md file

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

    if((divisions-int_divisions)< 0.2){ // parts can be calculated
      parts=int_divisions;
    } else {
      parts=2; // parts can't be calculated - assigned to default value=2
    }
  }  
  var start1=0.0;
  var start2=0.0;
  var end1=0.0;
  var end2=0.0;
  var each_part = seg_full/repeats/parts;
  var current_segment = 0;
  var part_names = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  if((parts*2)<10) {
    for(i=0;i<parts;i++){ // divide parts in half and fill in table;
      start1=each_part*i;
      end1=start1+each_part/2; // half of part
      start2=end1;
      end2=end1+each_part/2; // half of part     
      segments[i*2].start=start1.toFixed(2);
      segments[i*2].end=end1.toFixed(2); // half of part
      segments[i*2].name="Part-"+(part_names[i])+"1";
      segments[i*2+1].start=start2.toFixed(2);
      segments[i*2+1].end=end2.toFixed(2); // half of part
      segments[i*2+1].name="Part-"+(part_names[i])+"2";
      current_segment+=2;
    }
  } else if(parts <10){
    for(i=0;i<parts;i++){ // single division per part
      start1=each_part*i
      end1=start1+each_part;       
      segments[i].start=start1.toFixed(2);
      segments[i].end=end1.toFixed(2);
      segments[i].name="Part-"+(part_names[i]);
      current_segment+=1;
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

function reloadPage() {
    window.location.reload(true);
}

let segments = [
{name: "Part-A1",start: 0.0, end: 7.5},
{name: "Part-A2",start: 7.5, end: 15.0},
{name: "Part-B1",start: 15.0, end: 22.6},
{name: "Part-B2",start: 22.6, end: 30.1},
{name: "user-1",start: 0, end: 60.29},
{name: "user-2",start: 0, end: 60.29},
{name: "user-3",start: 0, end: 60.29},
{name: "user-4",start: 0, end: 60.29},
{name: "user-5",start: 0, end: 60.29},
];
function MoveFromSlider(){
  CurrentAudioSlider.noUiSlider.setHandle(0,OneAudioPlayer.currentTime);
  BeginLoopTime = OneAudioPlayer.currentTime;
  //OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
  //alert(BeginLoopTime);
}
function MoveToSlider(){
  CurrentAudioSlider.noUiSlider.setHandle(2,OneAudioPlayer.currentTime);
  EndLoopTime = OneAudioPlayer.currentTime;
  OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
}
function createSegmentTable(){

  var segmentList0='<table><tr><th>&nbspLoop</th><th col width="3">&nbspShow</th><th><a href="javascript:void(0);" onclick="MoveFromSlider()"><span title="Click to mark loop beginning">From</a></th><th><a href="javascript:void(0);" onclick="MoveToSlider()"><span title="Click to mark loop end">To</a></th></tr><tbody>';
  var segmentList1='<table><tr><th>&nbspLoop</th><th col width="3">&nbspShow</th><th><a href="javascript:void(0);" onclick="MoveFromSlider()"><span title="Click to mark loop beginning">From</a></th><th><a href="javascript:void(0);" onclick="MoveToSlider()"><span title="Click to mark loop end">To</a></th></tr><tbody>';
  var segmentList2='<table><tr><th>&nbspLoop</th><th col width="3">&nbspShow</th><th><a href="javascript:void(0);" onclick="MoveFromSlider()"><span title="Click to mark loop beginning">From</a></th><th><a href="javascript:void(0);" onclick="MoveToSlider()"><span title="Click to mark loop end">To</a></th></tr><tbody>';

  for(i=0;i<segments.length;i++){
    j=Math.floor(i/3);
    switch (j) {
      case 0:
          segmentList0 += '<tr><td>'+segments[i].name+'</td>';
          segmentList0 += '<td>'+'<input class="loopClass" type="checkbox" onclick="applySegments()" id='+ "check"+i + '>'+'</td>';
          segmentList0 += '<td>'+  '<a href="javascript:void(0);" class = "upDownButton" id= "button' +i + 'up" onclick="Adjust_up('+i+', 0)"><span title=" + 1/4 second">Up</a><input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'from" size="4" style= "height: 18px;" value='+segments[i].start+'><a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 0)"><span title=" - 1/4 second">Dn</a></td>';
          segmentList0 += '<td>'+  '<a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 2)"><span title=" + 1/4 second">Up</a><input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'to" size="4" style= "height: 18px;" value='+segments[i].end+'><a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 2)"><span title=" - 1/4 second">Dn</a></td></tr>';
        break;
      case 1:
          segmentList1 += '<tr><td>'+segments[i].name+'</td>';
          segmentList1 += '<td>'+'<input class="loopClass" type="checkbox" onclick="applySegments()" id='+ "check"+i + '>'+'</td>';
          segmentList1 += '<td>'+  '<a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 0)"><span title=" + 1/4 second">Up</a><input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'from" size="4" style= "height: 18px;" value='+segments[i].start+'><a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 0)"><span title=" - 1/4 second">Dn</a></td>';
          segmentList1 += '<td>'+  '<a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 2)"><span title=" + 1/4 second">Up</a><input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'to" size="4" style= "height: 18px;" value='+segments[i].end+'><a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 2)"><span title=" - 1/4 second">Dn</a></td></tr>';
        break;
      case 2:
          segmentList2 += '<tr><td>'+segments[i].name+'</td>';
          segmentList2 += '<td>'+'<input class="loopClass" type="checkbox" onclick="applySegments()" id='+ "check"+i + '>'+'</td>';
          segmentList2 += '<td>'+  '<a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 0)"><span title=" + 1/4 second">Up</a><input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'from" size="4" style= "height: 18px;" value='+segments[i].start+'><a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 0)"><span title=" - 1/4 second">Dn</a></td>';
          segmentList2 += '<td>'+  '<a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 2)"><span title=" + 1/4 second">Up</a><input class="loopClass" type="text" onchange="applySegments()" id="check' + i + 'to" size="4" style= "height: 18px;" value='+segments[i].end+'><a href="javascript:void(0);" class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 2)"><span title=" - 1/4 second">Dn</a></td></tr>';
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
  if((multiple_sliders>1)||(multiple_sliders==0)) {return;} //quit if more than one slider is checked

  document.getElementById("check" + checked_slider + "from").value = values[0];
  document.getElementById("check" + checked_slider + "to").value = values[2];
}

function applySegments(){
  var text='';
    var fullBeginLoopTime = parseFloat(OneAudioPlayer.duration);
    var fullEndLoopTime = 0.0;
    var numCheckedBoxes = 0.0;
    var tempBeginLoopTime=0.0;
    var tempEndLoopTime = 0.0;
    for(i=0;i<segments.length;i++){

      checkBox = document.getElementById("check"+i);
      fromId= document.getElementById("check"+i+"from");
      toId= document.getElementById("check"+i+"to");

      if (checkBox.checked == true){
          numCheckedBoxes++;
          tempBeginLoopTime = parseFloat(fromId.value);
          tempEndLoopTime = parseFloat(toId.value);
//alert("Is "+fullBeginLoopTime+" greater than "+tempBeginLoopTime);
          if(fullBeginLoopTime > tempBeginLoopTime) {
            //alert("A, "+BeginLoopTime+", "+fullBeginLoopTime);
            fullBeginLoopTime = tempBeginLoopTime;
          }
//alert("Is "+fullEndLoopTime+" less than "+tempEndLoopTime);          
          if(fullEndLoopTime < tempEndLoopTime) {
            //alert("B, "+tempEndLoopTime+", "+fullEndLoopTime);
            fullEndLoopTime = tempEndLoopTime;
          }
          //alert(i+", "+BeginLoopTime+", "+EndLoopTime+", "+fullBeginLoopTime+", "+fullEndLoopTime);
        }
    }
//alert(fullBeginLoopTime+", "+fullEndLoopTime);
    if(numCheckedBoxes > 0){ // do nothing unless at least one box is checked
      /*if (OneAudioPlayer.paused==false){ // audio is currently playing.
          OneAudioPlayer.pause(); // first pause the audio
          turnAudioBackOn = true;
      }*/
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
      OneAudioPlayer.addEventListener("timeupdate", setAudioLoops);
      if (turnAudioBackOn){ // audio was  playing when they fiddled with the checkboxes
          var promise = OneAudioPlayer.play(); // then turn it back on
          if (promise) {
            promise.catch(function(error) { console.error(error); });
          }
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
    var mp3url = "../mp3/tatter-jack-walsh.mp3";
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

  function scroll_indicator() {
    var elmnt = document.getElementById("tunes");
    var tuneScroll = elmnt.scrollTop;
    var height = elmnt.scrollHeight - elmnt.clientHeight;
    var scrolled = (tuneScroll / height) * 100;
    document.getElementById("tableSlider").value = scrolled;
  }  
  function scrollTable(value) {
    var elmnt = document.getElementById("tunes");
    //var tuneScroll = elmnt.scrollTop;
    var height = elmnt.scrollHeight - elmnt.clientHeight
    elmnt.scrollTop=(height*value/100);
  }

  function HideShowDots(){
        if(document.getElementById("HideShowDots").innerHTML=="Hide the Dots"){
          abc_editor = new window.ABCJS.Editor('FAKEabcText', { paper_id: "paper0", warnings_id:"warnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
          document.getElementById("HideShowDots").innerHTML="Show the Dots";
        } else{
          abc_editor = new window.ABCJS.Editor('abcText', { paper_id: "paper0", warnings_id:"warnings", render_options: {responsive: 'resize'}, indicate_changed: "true" });
          document.getElementById("HideShowDots").innerHTML="Hide the Dots";
        }
  }
</script>
<style>
.upDownButton {
  background-color: #1c2e20;
  border: 1px solid white;
  color: white;
  padding: 1px;
  align: center;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
}
.loopClass {
  font-size: 14px;
  border-radius: 2px;
  width: 45px;
}
.tableSlider {
  width: 94%;
  padding: 0 3%;
}
.tuneSelect {
  width: 90%;
}
a {
  color: #f0f0f0;
}
.HideShowDotsButton {
  -moz-box-shadow:inset 0px 1px 0px 0px #caefab;
	-webkit-box-shadow:inset 0px 1px 0px 0px #caefab;
	box-shadow:inset 0px 1px 0px 0px #caefab;
	background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #61cc04), color-stop(1, #55ab0f));
	background:-moz-linear-gradient(top, #61cc04 5%, #55ab0f 100%);
	background:-webkit-linear-gradient(top, #61cc04 5%, #55ab0f 100%);
	background:-o-linear-gradient(top, #61cc04 5%, #55ab0f 100%);
	background:-ms-linear-gradient(top, #61cc04 5%, #55ab0f 100%);
	background:linear-gradient(to bottom, #61cc04 5%, #55ab0f 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#61cc04', endColorstr='#55ab0f',GradientType=0);
	background-color:#61cc04;
	-moz-border-radius:6px;
	-webkit-border-radius:6px;
	border-radius:6px;
	border:1px solid #268a16;
	display:inline-block;
	cursor:pointer;
	color:#306108;
	font-family:Arial;
	font-size:16px;
	font-weight:bold;
	padding:7px 33px;
	text-decoration:none;
	text-shadow:0px 1px 0px #aade7c;
}
.HideShowDotsButton:hover {
  background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #55ab0f), color-stop(1, #61cc04));
	background:-moz-linear-gradient(top, #55ab0f 5%, #61cc04 100%);
	background:-webkit-linear-gradient(top, #55ab0f 5%, #61cc04 100%);
	background:-o-linear-gradient(top, #55ab0f 5%, #61cc04 100%);
	background:-ms-linear-gradient(top, #55ab0f 5%, #61cc04 100%);
	background:linear-gradient(to bottom, #55ab0f 5%, #61cc04 100%);
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#55ab0f', endColorstr='#61cc04',GradientType=0);
	background-color:#55ab0f;
}
.HideShowDotsButton:active {
	position:relative;
	top:1px;
}
</style>
