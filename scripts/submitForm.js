// function AddData(){
//     let firstName = document.getElementsByName('firstName')[0].value;
//     console.log(firstName);
    // let lastName = document.getElementsByName('lastName')[0].value;
    // let age = document.getElementsByName('age')[0].value;
    // let genders = document.getElementsByName('gender');
    // for(i = 0; i < genders.length; i++)
    //     if( genders[i].checked)
    //         var gender_value = genders[i].value;
    // let employment = document.getElementsByName('employment')[0];
    // let employed = 'no';
    // if(employment.checked)
    //     employed = 'yes';

    // let errorMessage = '';
    // if(firstName === '') errorMessage += 'First name cannot be empty\n';
    // else if (!(/^[a-zA-Z]/.test(firstName))) errorMessage += 'First name must contain only letters\n'
    // if(lastName === '') errorMessage += 'Last name cannot be empty\n';
    // else if (!(/^[a-zA-Z]/.test(lastName))) errorMessage += 'Last name must contain only letters\n'
    // if(age === '') errorMessage += 'Age cannot be empty\n';
    
    // else if (age < 0) console.log(document.getElementsByName('age')[0].validationMessage);
    // //else if (age < 0) errorMessage += 'Age should be a positive number\n'
    // if(gender_value == undefined) errorMessage += 'You must choose a gender\n'
    
    // if(errorMessage !== '')
    //     alert(errorMessage);
    // else {
    //     let study = document.getElementsByName('study')[0].value;
    //     var table = document.getElementById('personsTable');
    //     var newRow = table.insertRow();
    //     let cells = [];
    //     for(i = 0; i < table.rows[0].cells.length; i++)
    //         cells[i] = newRow.insertCell(i);
    //     let values = [firstName, lastName, age, gender_value, employed, study];
    //     values.forEach((value, index) => cells[index].innerHTML = value);
    //     var rowIndex = table.rows.length-1;
    //     newRow.setAttribute("id", `row${rowIndex}`);
    //     cells[cells.length-1].innerHTML = `<div class="clearButton" onclick="clearRow('row${rowIndex}')">Delete</div>`;
    //     clearForm(firstName, lastName, age, genders);
    // }
//}

function AddData() {
    validateFormSection('firstNameSection');
    validateFormSection('lastNameSection')
    validateFormSection('ageSection');
    validateFormSection('genderSection');
}

function validateFormSection(sectionName) {
    let section = document.getElementById(`${sectionName}`);
    let inputFields = document.querySelectorAll(`#${sectionName} .inputField`);
    let errorField = document.querySelector(`#${sectionName} .errorField`);
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

// function clearInputFields(name) {
//     document.getElementsByName(name).forEach(field => field.value = '')
// }

// function clearRadioButtons(name){
//     document.getElementsByName(name).forEach(radioButton => radioButton.checked = false);
// }

// function clearCheckboxes(name) {
//     document.getElementsByName(name).forEach(checkbox => checkbox.checked = false);
// }