let personsList = [];
function onLoad(){
    if(localStorage.getItem('persons') !== null) {
        personsList = JSON.parse(localStorage.getItem('persons'));
        refreshTable(personsList);
    }
    if(localStorage.getItem("identity") == null)
        localStorage.setItem("identity", JSON.stringify(0));
}

function handleSubmit() {
    validateForm();
    if(formIsValid())
    {
        let id = JSON.parse(localStorage.getItem("identity")) + 1;
        let firstName = getInputValue('firstNameSection');
        let lastName = getInputValue('lastNameSection');
        let age = getInputValue('ageSection');
        let gender = getInputValue('genderSection')
        let employed = getInputValue('employmentSection')
        let study = getInputValue('studiesSection');
        addPerson(id, firstName, lastName, age, gender, employed, study);
        refreshTable(personsList);
        //clearForm();
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
    personsList.push({ 'id': values[0], 'firstName': values[1], 'lastName': values[2], 'age': values[3], 'gender': values[4], 'employed': values[5], 'study': values[6]});
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem("persons", JSON.stringify(personsList));
    var identity = JSON.parse(localStorage.getItem("identity"));
    localStorage.setItem("identity", JSON.stringify(identity + 1));
}

function refreshTable(list) {
    var table = document.getElementById('personsTable');
    var rowCount = table.rows.length;
    for (var x=rowCount-1; x>0; x--) 
        table.deleteRow(x);
    for(var j=0; j<list.length;j++){
        insertRowInTable(table, j, list);
    }
    //mergeRows();
}

function insertRowInTable(table, j, list) {
    var newRow = table.insertRow();
    var rowIndex = j;
    let cells = [];
    for (var i = 0; i < table.rows[0].cells.length; i++)
        cells[i] = newRow.insertCell(i);
    person = list[j];
    cells[1].innerHTML = person['id'];
    cells[2].innerHTML = person['firstName'];
    cells[3].innerHTML = person['lastName'];
    cells[4].innerHTML = person['age'];
    cells[5].innerHTML = person['gender'];
    cells[6].innerHTML = person['employed'];
    cells[7].innerHTML = person['study'];
    insertActionButtonsInRow(table, cells);
}

function insertActionButtonsInRow(table, cells) {
    var rowIndex = table.rows.length - 2;
    var personId = table.rows[rowIndex+1].cells[1].innerHTML;
    cells[0].innerHTML = `<input type="checkbox" class="tableCheckBox">`;

    cells[cells.length - 1].innerHTML = `<div class="fakeButton" onclick="deletePerson(${personId})">Delete</div><div></div><div class="fakeButton" onclick="handleEdit(${personId})">Edit</div>`;
}

function deletePerson(id){
    if(document.querySelector("#cancelButton").hidden == false) 
        alert("You are already in a process. Cancel it and try again");
    else {
        if(confirm("Confirm the deletion of the row")) {
            personsList.splice(personsList.findIndex(x => x.id === id), 1);
            updateLocalStorage();
            handleFilter();
            }
    }
}

function findPerson(id){
    personsList.forEach(x => {
        if(x.id === id)
            return x;
    })
    return null;
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

function handleEdit(id) {
    if(document.querySelector("#cancelButton").hidden == false) 
        alert("You are already editing a person. Cancel anytime");
    else{
        var personIndex = personsList.findIndex(x => x.id === id);
        document.querySelector(`#firstNameSection .inputField`).value = personsList[personIndex]['firstName'];
        document.querySelector(`#lastNameSection .inputField`).value = personsList[personIndex]['lastName'];
        document.querySelector(`#ageSection .inputField`).value = personsList[personIndex]['age'];
        document.querySelectorAll(`#genderSection .inputField`).forEach(radioButton => {
            if(radioButton.value == personsList[personIndex]['gender'])
                radioButton.checked = true;
        });
        document.querySelector(`#employmentSection .inputField`).checked = personsList[personIndex]['employed'];
        document.querySelector(`#studiesSection .inputField`).value = personsList[personIndex]['study'];
        validateForm();
        document.querySelector('#saveButton').setAttribute("onclick", `handleSave(${id})`);
        toggleOnEditButtons();   
    }
}

function handleSave(id) {
    validateForm();
    if(formIsValid())
    {
        let firstName = getInputValue('firstNameSection');
        let lastName = getInputValue('lastNameSection');
        let age = getInputValue('ageSection');
        let gender = getInputValue('genderSection')
        let employed = getInputValue('employmentSection')
        let study = getInputValue('studiesSection');
        var personIndex = personsList.findIndex(x => x.id === id);
        personsList[personIndex]['firstName'] = firstName;
        personsList[personIndex]['lastName'] = lastName;
        personsList[personIndex]['age'] = age;
        personsList[personIndex]['gender'] = gender;
        personsList[personIndex]['employed'] = employed;
        personsList[personIndex]['study'] = study;
        updateLocalStorage();
        handleFilter();
        toggleOffEditButtons();
        clearForm();
    }
}

function sortTableByColumn(c, compare) {
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
                if(compare(parseInt(x.innerHTML), parseInt(y.innerHTML))){
                shouldSwitch = true;
                break; 
                }
            }
            else if(compare(x.innerHTML.toLowerCase(), y.innerHTML.toLowerCase())) {
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
    for(var i = rowLength - 1 ; i >= 0 ; i--)0
        sortTableByColumn(i, (x, y) => { return x - y});
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
    var table = document.getElementById("personsTable");
    var columns = table.rows[0].cells;

    if(columns[columnIndex].classList.contains("default")) {
        sortTableByColumn(columnIndex, (x, y) => { return x > y;});
        columns[columnIndex].classList.add("asc");
        columns[columnIndex].classList.remove("default");
    }
    else if(columns[columnIndex].classList.contains("asc")) {
        sortTableByColumn(columnIndex, (x, y) => { return x < y;});
        columns[columnIndex].classList.add("desc");
        columns[columnIndex].classList.remove("asc");
    }
    else {
        refreshTable(personsList);
        columns[columnIndex].classList.add("default");
        columns[columnIndex].classList.remove("desc");
    }
}

function handleFilter() {
    var inputText = document.querySelector("#filterField").value;
    let filteredList = personsList.filter(x => (x.firstName + x.lastName).toLowerCase().includes(inputText.toLowerCase()));
    refreshTable(filteredList);
}