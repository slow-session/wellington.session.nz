---
layout: page
title: Test
permalink: /test/
---


<script>

var beginLoopTime = {
    beginValue:undefined,
    get currentValue(){
        return this.beginValue;
    },
    set currentValue(val){
        this.beginValue=val;
    }
};
beginLoopTime.currentValue = 0;
console.log("beginValue = "+ beginLoopTime.beginValue);
beginLoopTime.currentValue=14.2;
console.log("beginValue = "+ beginLoopTime.beginValue);
beginLoopTime.currentValue=17.3;
console.log("beginValue = "+ beginLoopTime.beginValue);
console.log("currentValue = "+ beginLoopTime.currentValue);


var endLoopTime = {
    endValue:undefined,
    get currentValue(){
        return this.endValue;
    },
    set currentValue(val){
        this.endValue=val;
        console.log("setting endValue");
    }
};
endLoopTime.currentValue = 0;
console.log("endValue = "+ endLoopTime.endValue);
endLoopTime.currentValue=34.2;
console.log("endValue = "+ endLoopTime.endValue);
endLoopTime.currentValue=18.3;
console.log("endValue = "+ endLoopTime.endValue);
console.log("currentValue = "+ endLoopTime.currentValue);
</script>
