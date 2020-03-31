var db = firebase.database();

$("#btnSub").on("click", function(event){
    event.preventDefault();
    console.log("Button clicked");
    trainName = document.getElementById("trainName").value;
    trainDest = document.getElementById("trainDest").value;
    trainFirst = document.getElementById("trainFirst").value;
    trainFreq = document.getElementById("trainFreq").value;
    var checkTime = validateFirst(trainFirst);
    var checkFreq = validateFreq(trainFreq);
    console.log("Time check: " + checkTime);
    console.log("Freq check: " + checkFreq);
    if(checkTime && checkFreq){
        db.ref().push({
            trainName: trainName,
            trainDest: trainDest,
            trainFirst: trainFirst,
            trainFreq: trainFreq
        }).then(function(){
            document.getElementById("addTrain").reset();
            console.log("Form reset.");
            $("#tableBody").empty();
            popTable();
        });
    }
    else{
        console.log("Time invalid!")
    }
});

function popTable(){
    db.ref().on("child_added",function(snapshot){
        var tName = snapshot.val().trainName;
        var tDest = snapshot.val().trainDest;
        var tFreq = snapshot.val().trainFreq;
        var tFirst = snapshot.val().trainFirst;
        var newRow = $("<tr>");
        $("#tableBody").append(newRow);
        var name = $("<td>").text(tName);
        $(newRow).append(name);
        var destination = $("<td>").text(tDest);
        $(newRow).append(destination);
        var freq = $("<td>").text(tFreq);
        $(newRow).append(freq);
        calcTime(newRow,tFirst,tFreq);
    });
}

function validateFirst(time){
    var test;
    for(i=0;i<time.length;i++){
        console.log(time[i]);
        if(parseInt(time[i])>=0){
            test = true;
        }
        if(time[2]===":"){
            continue;
        }
        else{
            test = false;
        }
    }
    return test;
}

function validateFreq(freq){
    if(parseInt(freq)>0){
        return true;
    }
    else{return false;}
}

function calcTime(row,tFirst,tFreq){
    var first = moment(tFirst, "hh:mm");
    var minAway = tFreq - (moment().diff(moment(first), "minutes") % tFreq);
    console.log("First time converted: " + first);
    var nextArrival = moment().add(minAway, "minutes").format("LT");
    console.log("Minutes away: " + minAway);
    console.log("Next arrival: " + nextArrival);
    var minAway = $("<td>").text(minAway);
    var nextDisp = $("<td>").text(nextArrival);
    $(row).append(nextDisp);
    $(row).append(minAway);
}

console.log("Current time: " + moment().format("HH:mm"));

document.addEventListener("load",popTable());