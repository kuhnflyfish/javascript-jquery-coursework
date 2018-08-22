/*
 * Assignment 6 - AJAX and the President
 * Mark Kuhn
 * assignment6.js 
*/

var allData, data, filteredData;
var propertyNames = ['number', 'name', 'date', 'took_office', 'left_office', 'vice_president'];

function timedGetPresidentData() {
    var presidentData = new XMLHttpRequest(), text;
    var url2 = "http://schwartzcomputer.com/ICT4570/Resources/USPresidents.json";
    var timeout = 3000;
    presidentData.timeout = timeout;
    presidentData.ontimeout = function() {
        console.log("Request to "+url2+" timed out after "+timeout+" ms");
    }
    presidentData.open("GET", url2);
    presidentData.onloadend = function() {
        if(presidentData.status === 200) {
            console.log(presidentData);
            text = presidentData.responseText;
            allData = JSON.parse(text);
            data = allData.presidents.president;
            console.log(data);
            handleJSONResponse(data);
        } else {
            console.log("There is an error or the request has timed out")
        }
    };
    presidentData.send();
}

function buildVicePresTable(row) {
    var viceTable = document.createElement('table');
    var len = row.term.length;
    viceTable.setAttribute('class', 'vice-table');
    if(len>0) {
        for(let i=0; i<len; i++) {
            var tr = document.createElement('tr');
            var td = document.createElement('td');
            td.setAttribute('class', 'name');
            td.appendChild(document.createTextNode(row.term[i].vice_president));
            tr.appendChild(td);
            viceTable.appendChild(tr);
        }
        } else {
            tr = document.createElement('tr');
            td = document.createElement('td');
            td.setAttribute('class', 'name');
            td.appendChild(document.createTextNode(row.term.vice_president));
            tr.appendChild(td);
            viceTable.appendChild(tr);
        }
    return viceTable;
}

function buildTableHeader() {
    var properties, tr, th;
    properties = ['Number', 'Name', 'Birthday', 'Took Office', 'Left Office', 'Vice President'];
    tr = document.createElement('tr');
    for(let i=0; i<properties.length; i++){
        th = document.createElement('th');
        th.appendChild(document.createTextNode(properties[i]));
        tr.appendChild(th);        
    }
    return tr;
}

function buildTableBody(row, propertyNames) {
    var tr = document.createElement('tr');
    var len = propertyNames.length;
    for(let i=0; i<len; i++) {
        var td = document.createElement('td');
        td.setAttribute('class', propertyNames[i]);
        if(propertyNames[i] !== 'vice_president') {
            td.appendChild(document.createTextNode(row[propertyNames[i]]));
        } else {
            td.appendChild(buildVicePresTable(row));
        }
        tr.appendChild(td);        
    }
    return tr;
}

function buildTable(data) {
    console.log("buildTable function has been called");
    var table = document.createElement('table');
    var len = data.length;
    table.setAttribute('class', 'president-table');
    table.appendChild(buildTableHeader());
    for(let i=0; i<len; i++) {
        table.appendChild(buildTableBody(data[i], propertyNames));
    }
    console.log(table);
    document.getElementById('president-table').appendChild(table);
}

function handleJSONResponse(data) {
    var nameInput = document.getElementById('name').value;
    var dateInput = document.getElementById('took-office').value;
    if(nameInput !== '' && dateInput !== '') {
        filteredData = data.filter(function(el) {
            return el.name.includes(nameInput) && el.took_office.includes(dateInput);
        });
    }
    if(nameInput !== '') {
        filteredData = data.filter(function(el) {
            return el.name.includes(nameInput);
        });
    }
    if(dateInput !== '') {
        filteredData = data.filter(function(el) {
            return el.took_office.includes(dateInput);
        });
    }
    if(nameInput === '' && dateInput === '') {
        filteredData = data;
        console.log("Both fields are null");
    }
    console.log(filteredData);
    
    var tableClass = document.querySelector('table.president-table');
    if(tableClass) {
        document.getElementById('president-table').removeChild(tableClass);
    }
    buildTable(filteredData);
}

function clearForm() {
    var tableClass = document.querySelector('table.president-table');
    if(tableClass) {
        document.getElementById('president-table').removeChild(tableClass);
    }
    document.getElementById('name').value = '';
    document.getElementById('took-office').value = '';
}

function init() {
    document.getElementById('presidents').onclick = timedGetPresidentData;
    document.getElementById('clear').onclick = clearForm;
}
init();




