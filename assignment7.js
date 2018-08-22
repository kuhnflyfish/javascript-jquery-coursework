/*
 * Mark Kuhn
 * Assignment 7 - Local Storage
 * assignment7.js
*/

var storeFormData = function() {
    
    if(typeof(Storage)!=="undefined") {
        localStorage.candidate1 = document.getElementById('cand1').value;
        localStorage.candidate2 = document.getElementById('cand2').value;
        localStorage.candidate3 = document.getElementById('cand3').value;
        localStorage.votes1 = document.getElementById('votes1').value;
        localStorage.votes2 = document.getElementById('votes2').value;
        localStorage.votes3 = document.getElementById('votes3').value;
    } else {
        console.log("Sorry!  No web storage supported..")
    }
};

var initForm = function() {
    
    var candidate1, candidate2, candidate3, votes1, votes2, votes3;
    if(typeof(Storage)!=="undefined") {
        candidate1 = localStorage.candidate1;
        candidate2 = localStorage.candidate2;
        candidate3 = localStorage.candidate3;
        votes1 = localStorage.votes1;
        votes2 = localStorage.votes2;
        votes3 = localStorage.votes3;
        if(candidate1 && candidate1.length > 0) {
            document.getElementById('cand1').value=candidate1;
        }
        if(candidate2 && candidate2.length > 0) {
            document.getElementById('cand2').value=candidate2;
        }
        if(candidate3 && candidate3.length > 0) {
            document.getElementById('cand3').value=candidate3;
        }
        if(votes1 && votes1.length > 0) {
            document.getElementById('votes1').value=votes1;
        }
        if(votes2 && votes2.length > 0) {
            document.getElementById('votes2').value=votes2;
        }
        if(votes3 && votes3.length > 0) {
            document.getElementById('votes3').value=votes3;
        }
    }
};
document.body.onload = initForm;
    
function calculateResults() {
    
    insertVotes(add(voteArray()), calcPercentages(voteArray(), add(voteArray())));
    storeFormData();
}

function addDateAndButton () {  // Function to initialize form with date and click action
    
    var today = new Date();
    var isodate = toISODate(today);
    document.getElementById('calculate').onclick = calculateResults;
    document.getElementById('date').value = isodate;
}
addDateAndButton();

function lookupID (id) {  // A function to look up an HTML element by id and return the element
    
    var htmlID = document.getElementById(id).value;
    return htmlID;
}

function voteArray () {
    
    var votes1 = parseInt(lookupID('votes1'), 10);
    var votes2 = parseInt(lookupID('votes2'), 10);
    var votes3 = parseInt(lookupID('votes3'), 10);
    var votes = [votes1, votes2, votes3];
    return votes;
}

function add (array) { // A function which takes an Array of numbers as a parameter, and returns the sum
    
    var sum = 0;
    for (var num in array) {
        console.log(array[num]);
        //console.log(typeof array[num]);
        if ( typeof array[num] != 'number' || isNaN( array[num] )) {
            document.getElementById('errors').innerHTML = "You've entered a value that is not a number or left blank";
            throw new Error ("You've entered a value that is not a number or left blank");       
        } else if ( array[num] <= 0) {
            document.getElementById('errors').innerHTML = "Votes must be a positive value";
            throw new Error ('Votes must be a positive value');            
        }
        sum += array[num];
    }
    return sum;
}

function calcPercentages (array, sum) {  // A function which takes an Array of numbers as a parameter, and returns an array of percentages
    
    var percentArray = [];
    var percent = 0;
    for (var num in array) {
        percent = changePercentages(array[num] / sum);
        percentArray.push(percent);
    }
    return percentArray;
}

function changePercentages (num) {  // A function which formats a number into a percentage
    
    var percent2 = (num * 100);
    percent2 = percent2.toFixed(1);
    percent2 += "%";
    return percent2;
}

function insertVotes (sum, percentArray) {  // Place results on the form in the correct locations
    
    document.getElementById('totalvotes').innerHTML = sum;
    for (var num in percentArray) {
        document.getElementById('cand' + num + 'pct').innerHTML = percentArray[num];
    }
}

function toISODate(date) { // yyyy-mm-dd
  
  var yyyy, mm, dd;
  // JavaScript provides no simple way to format a date-only
  yyyy = "" + date.getFullYear();
  mm = date.getMonth() + 1; // Months go from 0 .. 11
  dd = date.getDate();
  // Need leading zeroes to form the yyyy-mm-dd pattern.
  if (mm < 10) {
    mm = "0" + mm; // This converts it to a string
  }
  if (dd < 10) {
    dd = "0" + dd; // This converts it to a string
  }
  return "" + yyyy + "-" + mm + "-" + dd;
}