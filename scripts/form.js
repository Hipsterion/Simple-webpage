let personsList = [];

$(document).ready(function(){
    if(localStorage.getItem('persons') !== null) {
        personsList = JSON.parse(localStorage.getItem('persons'));
        refreshTable(personsList);
    }
    
    if(localStorage.getItem("identity") == null)
        localStorage.setItem("identity", JSON.stringify(0));
});

function handleSubmit() {
    validateForm();
    if(formIsValid())
    {
        let id = JSON.parse(localStorage.getItem("identity")) + 1;
        let firstName = $("#firstNameSection .inputField").val();
        let lastName = $("#lastNameSection .inputField").val();
        let age = $("#ageSection .inputField").val();
        let gender = $("#genderSection input[name='gender']:checked").val();
        let employed = $("#employmentSection .inputField").is(":checked");
        let study = $("#studiesSection .inputField").val();
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
    let section = $(`${sectionId}`)[0];
    let inputFields = $(`#${sectionId} .inputField`);
    let errorField = $(`#${sectionId} .errorField`);
    inputFields.each(function(index, item){
        errorField.html('');
        if(!item.checkValidity())
            errorField.html(item.validationMessage);
    });
}

function formIsValid() {
    return $("#personForm")[0].checkValidity();
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
    var table = $("#personsTable");
    var rowCount = table.find("tr").length;
    table.find("tbody tr").remove();
    $.each(list, function(index, item) {insertRowInTable(table, item)});
    //mergeRows();
}

function insertRowInTable(table, item) {
    var newRow = table.find("tbody")[0].insertRow(table.find("tbody")[0].rows.length);
    var headRow = table.find("thead tr")[0];
    let cells = [];
    $.each(headRow.cells, function(index, cell) {
        cells[index] = newRow.insertCell(index);
    });
    $(cells[1]).html(item['id']);
    $(cells[2]).html(item['firstName']);
    $(cells[3]).html(item['lastName']);
    $(cells[4]).html(item['age']);
    $(cells[5]).html(item['gender']);
    $(cells[6]).html(`${item['employed']}`);
    $(cells[7]).html(item['study']);
    insertActionButtonsInRow(table, cells);
}

function insertActionButtonsInRow(table, cells) {
    var rowIndex = table.find("tbody")[0].rows.length - 1;
    var personId = $(table.find("tbody")[0].rows[rowIndex].cells[1]).html();
    $(cells[0]).html(`<input type="checkbox" class="tableCheckBox" onclick="handleChangedTableCheckbox(this)">`);
    $(cells[cells.length - 1]).html(`<div class="fakeButton" onclick="handleDeletePerson(${personId})">Delete</div><div></div><div class="fakeButton" onclick="handleEdit(${personId})">Edit</div>`);
}

function deletePerson(id) {
    personsList.splice(personsList.findIndex(x => x.id === id), 1);
}
function handleDeletePerson(id){
    if($("#cancelButton").is(":visible")) 
        alert("You are already in a process. Cancel it and try again");
    else {
        showConfirmationModal('Delete Row', 'Confirm deletion of row', `deletePersonOnAction(${id})`)
    }
}

function deletePersonOnAction(id) {
    deletePerson(id);
    updateLocalStorage();
    refreshFilteredTable();
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
    $('#personForm')[0].reset();
}

function handleCancel(){
    clearForm();
    toggleEditButtons();
}

function toggleEditButtons() {
    $('#submitButton').toggle();
    $('#cancelButton').toggle();
    $('#saveButton').toggle();
}

function handleEdit(id) {
    if($("#cancelButton").is(":visible"))
        alert("You are already editing a person. Cancel anytime");
    else{
        var personIndex = personsList.findIndex(x => x.id === id);
        $(`#firstNameSection .inputField`).val(personsList[personIndex]['firstName']);
        $(`#lastNameSection .inputField`).val(personsList[personIndex]['lastName']);
        $(`#ageSection .inputField`).val(personsList[personIndex]['age']);
        $(`#genderSection .inputField`).each(function(index, item) {
            if(item.value == personsList[personIndex]['gender'])
                item.checked = true;
        });
        $(`#employmentSection .inputField`).prop("checked", personsList[personIndex]['employed']);
        $(`#studiesSection .inputField`).val(personsList[personIndex]['study']);
        validateForm();
        $('#saveButton').attr("onclick", `handleSave(${id})`);
        toggleEditButtons();   
    }
}

function handleSave(id) {
    validateForm();
    if(formIsValid())
    {
        let firstName = $('#firstNameSection .inputField').val();
        let lastName = $('#lastNameSection .inputField').val();
        let age = $('#ageSection .inputField').val();
        let gender = $('#genderSection input[name="gender"]:checked').val();
        let employed = $('#employmentSection .inputField').is(":checked");
        let study = $('#studiesSection .inputField').val();
        var personIndex = personsList.findIndex(x => x.id === id);
        personsList[personIndex]['firstName'] = firstName;
        personsList[personIndex]['lastName'] = lastName;
        personsList[personIndex]['age'] = age;
        personsList[personIndex]['gender'] = gender;
        personsList[personIndex]['employed'] = employed;
        personsList[personIndex]['study'] = study;
        updateLocalStorage();
        refreshFilteredTable();
        toggleEditButtons();
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
    $("#formSection").animate({width:'toggle'},1000);
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
        columns[columnIndeT].classList.remove("desc");
    }
}

function refreshFilteredTable() {
    var inputText = document.querySelector("#filterField").value;
    let filteredList = personsList.filter(x => (x.firstName + x.lastName).toLowerCase().includes(inputText.toLowerCase()));
    refreshTable(filteredList);
}

function isAnyRowSelected() {
    return Array.from(document.getElementsByClassName("tableCheckBox")).filter((item) => item.checked).length != 0;
}

function handleDeleteSelected() {
    if(isAnyRowSelected()) {
        showConfirmationModal('Delete Rows', 'Confirm deletion of rows', `deletePersonsOnAction()`);
    }
    else 
        alert("You haven't selected any row yet");
}

function deletePersonsOnAction() {
    var table = document.getElementById("personsTable");
    for(var index = 1 ; index < table.rows.length; index++){
        if(table.rows[index].cells[0].querySelector(".tableCheckBox").checked){
            deletePerson(Number.parseInt(table.rows[index].cells[1].innerHTML));
        }
    }
    updateLocalStorage();
    refreshFilteredTable();
    Array.from(document.querySelectorAll("#selectHeadCell *")).forEach(item => item.disabled = true);
}

function clearSelectedRows() {
    Array.from(document.getElementsByClassName("tableCheckBox")).forEach(item => item.checked = false);
    Array.from(document.querySelectorAll("#selectHeadCell *")).forEach(item => item.disabled = true);
}

function handleChangedTableCheckbox(checkbox) {
    if(checkbox.checked) {
        Array.from(document.querySelectorAll("#selectHeadCell *")).forEach(item => item.disabled = false);
    } 
    else {
        if(!isAnyRowSelected()) {
            Array.from(document.querySelectorAll("#selectHeadCell *")).forEach(item => item.disabled = true);
        }
    }
}

//after bootstrap

function showConfirmationModal(titleText, bodyText, confirmEffect) {
    var confirmDialog = $('#confirmationModal').first();
    confirmDialog.find('.modal-title').html(titleText);
    confirmDialog.find('.modal-body').html(bodyText);
    confirmDialog.find('.btn-primary').attr('onclick',`${confirmEffect}`);
    confirmDialog.modal('show');
}

