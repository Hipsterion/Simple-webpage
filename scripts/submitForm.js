let personsList = [];
function onLoad(){
    if(localStorage.getItem('persons') !== null) {
        personsList = JSON.parse(localStorage.getItem('persons'));
        refreshTable();
    
    }
}

function handleSubmit() {
    validateForm();
    if(formIsValid())
    {
        let firstName = getInputValue('firstNameSection');
        let lastName = getInputValue('lastNameSection');
        let age = getInputValue('ageSection');
        let gender = getInputValue('genderSection')
        let employed = getInputValue('employmentSection')
        let study = getInputValue('studiesSection');
        addPerson(firstName, lastName, age, gender, employed, study);
        refreshTable(firstName, lastName, age, gender, employed, study);
        clearForm();
    }
}

function validateForm() {
    validateFormSection('firstNameSection');
    validateFormSection('lastNameSection');
    validateFormSection('ageSection');
    validateFormSection('genderSection');
}

function validateFormSection(sectionId) {
    let section = document.getElementById(`${sectionId}`);
    let inputFields = document.querySelectorAll(`#${sectionId} .inputField`);
    let errorField = document.querySelector(`#${sectionId} .errorField`);
    inputFields.forEach(inputField => {
        errorField.innerHTML = '';
        if (!inputField.checkValidity()) 
            errorField.innerHTML = inputField.validationMessage; 
    })
}

function formIsValid() {
    return document.querySelector("#personForm").checkValidity();
}

function getInputValue(sectionId) {
    let inputFields = document.querySelectorAll(`#${sectionId} .inputField`)
    if(inputFields[0].type == "radio")
        {
            for(i = 0; i < inputFields.length; i++)
                if( inputFields[i].checked)
                    return inputFields[i].value;
        }
    else if(inputFields[0].type == "checkbox") {
        if(inputFields[0].checked) return true;
        return false;
    }
    return inputFields[0].value;
}

function addPerson(...values) {
    personsList.push({ 'firstName': values[0], 'lastName': values[1], 'age': values[2], 'gender': values[3], 'employed': values[4], 'study': values[5]});
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem("persons", JSON.stringify(personsList));
}

function refreshTable() {
    var table = document.getElementById('personsTable');
    var rowCount = table.rows.length;
    for (var x=rowCount-1; x>0; x--) 
        table.deleteRow(x);
    for(var j=0; j<personsList.length;j++){
        insertRowInTable(table, j);
    }
    //mergeRows();
}

function insertRowInTable(table, j) {
    var newRow = table.insertRow();
    var rowIndex = j;
    let cells = [];
    for (var i = 0; i < table.rows[0].cells.length; i++)
        cells[i] = newRow.insertCell(i);
    person = personsList[j];
    cells[0].innerHTML = person['firstName'];
    cells[1].innerHTML = person['lastName'];
    cells[2].innerHTML = person['age'];
    cells[3].innerHTML = person['gender'];
    cells[4].innerHTML = person['employed'];
    cells[5].innerHTML = person['study'];
    insertButtonInRow(table, cells);
}

function insertButtonInRow(table, cells) {
    var rowIndex = table.rows.length - 2;
    cells[cells.length - 1].innerHTML = `<div class="fakeButton" onclick="deletePerson(${rowIndex})">Delete</div><div></div><div class="fakeButton" onclick="handleEdit(${rowIndex})">Edit</div>`;
}

function deletePerson(rowIndex){
    if(document.querySelector("#cancelButton").hidden == false) 
        alert("You are already in a process. Cancel it and try again");
    else {
        personsList.splice(rowIndex, 1);
        updateLocalStorage();
        refreshTable();
        alert("Delete was successful")
    }
}

function mergeRows() {
    const table = document.querySelector('table');
    for(var i = 0; i < 6; i++) {
        let headerCell = null;
        for (let row of table.rows) {
            const firstCell = row.cells[i - (table.rows[0].cells.length - row.cells.length)]; 
            if (headerCell === null || firstCell.innerText !== headerCell.innerText) {
                headerCell = firstCell;
            } 
            else {
                if(!headerCell.className.includes("dark")) 
                    headerCell.setAttribute("class", "dark");
                headerCell.rowSpan++;
                firstCell.remove();
            }
        }
    }
}

function clearForm() {
    document.getElementById('personForm').reset();
}

function handleCancel(){
    clearForm();
    toggleOffEditButtons();
}

function toggleOffEditButtons() {
    document.querySelector('#submitButton').hidden = false;
    document.querySelector('#cancelButton').hidden = true;
    document.querySelector('#saveButton').hidden = true;
}

function toggleOnEditButtons() {
    document.querySelector('#submitButton').hidden = true;
    document.querySelector('#cancelButton').hidden = false;
    document.querySelector('#saveButton').hidden = false;
}

function handleEdit(rowIndex) {
    if(document.querySelector("#cancelButton").hidden == false) 
        alert("You are already editing a person. Cancel anytime");
    else{
        document.querySelector(`#firstNameSection .inputField`).value = personsList[rowIndex]['firstName'];
        document.querySelector(`#lastNameSection .inputField`).value = personsList[rowIndex]['lastName'];
        document.querySelector(`#ageSection .inputField`).value = personsList[rowIndex]['age'];
        document.querySelectorAll(`#genderSection .inputField`).forEach(radioButton => {
            if(radioButton.value == personsList[rowIndex]['gender'])
                radioButton.checked = true;
        });
        document.querySelector(`#employmentSection .inputField`).checked = personsList[rowIndex]['employed'];
        document.querySelector(`#studiesSection .inputField`).value = personsList[rowIndex]['study'];
        validateForm();
        document.querySelector('#saveButton').setAttribute("onclick", `handleSave(${rowIndex})`);
        toggleOnEditButtons();   
    }
}

function handleSave(rowIndex) {
    validateForm();
    if(formIsValid())
    {
        let firstName = getInputValue('firstNameSection');
        let lastName = getInputValue('lastNameSection');
        let age = getInputValue('ageSection');
        let gender = getInputValue('genderSection')
        let employed = getInputValue('employmentSection')
        let study = getInputValue('studiesSection');
        personsList[rowIndex]['firstName'] = firstName;
        personsList[rowIndex]['lastName'] = lastName;
        personsList[rowIndex]['age'] = age;
        personsList[rowIndex]['gender'] = gender;
        personsList[rowIndex]['employed'] = employed;
        personsList[rowIndex]['study'] = study;
        updateLocalStorage();
        refreshTable(firstName, lastName, age, gender, employed, study);
        toggleOffEditButtons();
        clearForm();
    }
}

function sortTableByColumn(c) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("personsTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[c];
            y = rows[i + 1].getElementsByTagName("TD")[c];
            if(x.innerHTML.match(/^-{0,1}\d+$/) && y.innerHTML.match(/^-{0,1}\d+$/)){
                if(parseInt(x.innerHTML) > parseInt(y.innerHTML)){
                shouldSwitch = true;
                break; 
                }
            }
            else if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        }
    }
}

function sortTable(){
    let table = document.getElementById('personsTable');
    let rowLength = table.rows[0].cells.length;
    for(var i = rowLength - 1 ; i >= 0 ; i--)
        sortTableByColumn(i);
}

function toggleForm(){
    document.querySelector("#personForm").classList.toggle('closed');
    toggleShowHideButtons();
}

function toggleShowHideButtons(){
    var showButton = document.querySelector("#showButton");
    var hideButton = document.querySelector("#hideButton");
    if(showButton.hidden == true) {
        showButton.hidden = false;
        hideButton.hidden = true;
    }
    else {
        showButton.hidden = true;
        hideButton.hidden = false;
    }
}

function handleColumnSort(columnIndex){
    sortTableByColumn(columnIndex);
}