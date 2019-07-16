---
layout: page
title: Play MP3 Learn Tunes
permalink: /playMP3-learn-tunes/
---
<div>
<p>
Try it by copying and pasting this URL -> http://www.mandolincafe.net/mp3/hadj.mp3
</p>

URL: <input type="text" name="url" class="enter" value="../mp3/billowing-waves.mp3" id="url" style="width: 400px;" >
<input type="button" class="filterButton" onclick="getURL()" value="Create Player">


</div>
<div class="player">
<div id="audioPlayer"></div>
<div id="showPlayer"></div>
<div id="ABC"></div>



<div>

<table style="width:35%" id="tunes" style="float: left" class="tablesorter">
<thead>
    <tr>
    <th style="width20%;">Tune Name&#x25B2;&#x25BC;</th>
    <th style="width:6%;">Key<br />&#x25B2;&#x25BC;</th>
    <th style="width:12%;">Rhythm<br />&#x25B2;&#x25BC;</th>
    </tr>
</thead>
<tbody>
{% assign tunes = site.tunes | where: 'tags', 'wellyfest' %}
{% assign sortedtunes = tunes | sort: 'rhythm' %}
  {% assign tuneid = 200 %}
  {% for tune in sortedtunes %}
      {% assign tuneid = tuneid | plus: 1 %}
{% include tablerow-no-player.html tuneId=tuneid %}
  {% endfor %}
</tbody>
</table>
<div id="showLoops"></div>
</div>





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
<script src="{{ site.mp3_host }}/js/New_audioplayer.js"></script>

<script>
function getURL() {
    var mp3url = document.getElementById("url").value;
    audioPlayer.innerHTML = createAudioPlayer();
    showPlayer.innerHTML = '<h4>Playing ' + mp3url + '</h4>';
    showPlayer.innerHTML += createMP3player_experimental('playABC', mp3url, 'mp3player_tunepage');
    createSlider('playPositionplayABC','RSplayABC');
    showLoops.innerHTML = createSegmentTable();
    New_LoadAudio('trplayABC', audioplayerplayABC, pButtonplayABC,  playPositionplayABC, mp3url, APosplayABC, DurplayABC,  RSSplayABC);
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
];


function createSegmentTable(){
  var segmentList='<table style="width:40%" style="float: right"><tr><th>Loop</th><th col width="3">Show</th><th>From</th><th>To</th></tr>';
  for(i=0;i<segments.length;i++){
    segmentList += '<tr><td>'+segments[i].name+'</td>';
    segmentList += '<td>'+'<input type="checkbox" onclick="applySegments()" id='+ "check"+i + '>'+'</td>';
    segmentList += '<td>'+  '<button class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 0)">UP</button><input type="text" onchange="applySegments()" id="check' + i + 'from" size="6" value='+segments[i].start+'><button class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 0)">Dn</button></td>';
    segmentList += '<td>'+  '<button class = "upDownButton" type="button" id= "button' +i + 'up" onclick="Adjust_up('+i+', 2)">UP</button><input type="text" onchange="applySegments()" id="check' + i + 'to" size="6" value='+segments[i].end+'><button class = "upDownButton" type="button" id= "button' +i + 'Dn" onclick="Adjust_down('+i+', 2)">Dn</button></td></tr>';
  }
  segmentList += '</table>';
return segmentList;
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
/*
New_LoadAudio('trplayABC', audioplayerplayABC, pButtonplayABC,  playPositionplayABC, '../mp3/billowing-waves.mp3', APosplayABC, DurplayABC,  RSSplayABC);
*/
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
</script>
