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
        insertTableRow(firstName, lastName, age, gender, employed, study);
        mergeRows();
        clearForm();
    }
}

function insertTableRow(...values) {
    var table = document.getElementById('personsTable');
    var newRow = table.insertRow();
    var rowIndex = table.rows.length - 1;
    newRow.setAttribute("id", `row${rowIndex}`);
    let cells = [];
    for (i = 0; i < table.rows[0].cells.length; i++)
        cells[i] = newRow.insertCell(i);
    values.forEach((value, index) => cells[index].innerHTML = value);
    insertButtonInRow(table, cells);
}

function insertButtonInRow(table, cells) {
    var rowIndex = table.rows.length - 1;
    cells[cells.length - 1].innerHTML = `<div class="clearButton" onclick="clearRow('row${rowIndex}')">Delete</div>`;
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

function formIsValid() {
    return document.querySelector("#personForm").checkValidity();
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

function clearRow(id){
    var row = document.getElementById(id);
    row.parentNode.removeChild(row);
    
}

function clearForm() {
    document.getElementById('personForm').reset();
}

function mergeRows() {
    const previousRow = {};
  const colsChanged = {};
  let leftMerged = false;
  let dark = false;

  Array.from(document.querySelectorAll('tbody tr')).forEach((tr, rowIdx) => {
    Array.from(tr.children).forEach((td, colIdx) => {
      if (rowIdx > 0 && (colIdx === 0 || leftMerged) && previousRow[colIdx].text === td.innerText) {
        previousRow[colIdx].elem.setAttribute('rowspan', ++previousRow[colIdx].span);
        colsChanged[colIdx] = false;
        td.remove();
        if (colIdx === 0) {
          leftMerged = true;
        }
      } else {
        previousRow[colIdx] = { span: 1, text: td.innerText, elem: td, dark };
        colsChanged[colIdx] = true;
      }
    });
    const rowChanged = Object.values(colsChanged).every(Boolean);
    dark = rowChanged && rowIdx > 0 ? !dark : dark;
    if (dark) {
      tr.classList.add('dark');
    }
    leftMerged = false;
  });
}