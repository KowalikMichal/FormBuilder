"use strict";
document.addEventListener("DOMContentLoaded", evt => {
	readyFuntion();
});

function readyFuntion(){
	openConectionDB();
	document.querySelector('#addMain').addEventListener('click', addMain);
	document.addEventListener('click',e => {
	 	if (e.target.tagName.toLocaleLowerCase() == 'input') e.target.classList.add('visited');
	 	if(e.target.classList.contains('addSubInput')) addSubInput(e);
	 	if(e.target.classList.contains('delete')) Delete(e);
	 });
	document.body.addEventListener('DOMSubtreeModified',() => saveForm());
}

function addMain(){
	const PossibleTypes = ['Text', 'Number', 'Yes/No'];
	let options = PossibleTypes.map((value) => (`<option value="${value}">${value}</option>`)).toString();
	document.querySelector('.container').insertAdjacentHTML('beforeend', addTypes(options, null));
}

function validate(e){
	let complete;
	let form = e.target.closest('div[class="form"]');
		form.querySelectorAll('input').forEach(element =>{(element.value) ? element.classList.remove('wrong'):element.classList.add('wrong');});
		form.querySelectorAll('select').forEach(element => {(element.value == 'Please select type') ? element.classList.add('wrong'):element.classList.remove('wrong');});
	complete = (form.querySelectorAll('.wrong').length > 0) ? false:true;
	return complete;
}

function showModal(){
	var modal = document.querySelector('#ModalError');
	var span = document.querySelector(".close");
		span.onclick = () => {modal.style.display = "none";}
    modal.style.display = "block";
    window.onclick = (e) => {if(e.target == modal) modal.style.display = "none";} 
}

function addSubInput(e){
	if (!validate(e)) return showModal();
	const PossibleTypes = ['Text', 'Number', 'Yes/No'];
	let options = PossibleTypes.map((value) => (`<option value="${value}">${value}</option>`)).toString();
	let type = e.target.closest('div[class="form"]').querySelector('select[name="type"]').selectedOptions[0].value;

	e.target.closest('div[class="Question"]').insertAdjacentHTML('beforeend', addTypes(options, type));
}

function Delete(e){
	e.target.closest('div[class="Question"]').remove();
}

function condition(type){
	if (!type) return '';
	let options = {'Text': ['Equals'], 'Number': ['Equals', 'Greater than', 'Less than'], 'Yes/No': ['Equals']};
	let optionsType = options[type].map(value => (`<option value="${value}">${value}</option>`)).toString();
	let inputOrSelect = (type == 'Yes/No') ? `<select class="right selectBool"><option selected disabled>Please select type</option><option value="Yes">Yes</option><option value="No">No</opton></select>`:`<input type="${type.toLowerCase()}" class="right" required>`;
	let additionalRow = `
		<div class="row">
			<label class="">Codnition</label>
			<select class="">
				<option selected disabled>Please select type</option>
				${optionsType}
			</select>
			${inputOrSelect}
		</div>
	`
	return additionalRow;
}

function addTypes(option, type){
	let newForm = `
		<div class="Question">
			<div class="form">
				${condition(type)}
				<div class="row">
					<label class="">Question</label>
					<input type="text" class="right" required>
				</div>
				<div class="row">
					<label class="">Type</label>
					<select class="right" name="type">
					<option selected disabled>Please select type</option>
					${option}
					</select>
				</div>
				<div class="rowButton">
					<button type="button" class="button addSubInput">Add Sub-Input</button>
					<button type="button" class="button delete">Delete</button>
				</div>
			</div>
		</div>`;
	return newForm;
}

function saveForm(){
	console.log('save...');
	let save = document.querySelector('.container').cloneNode(true);
		save.querySelectorAll('input').forEach(element => element.value = '');
		save.querySelectorAll('select').forEach(element => element.selected  = 'Please select type');
		save.querySelectorAll('.visited').forEach(element => element.classList.remove('visited'));
		save.querySelectorAll('.wrong').forEach(element => element.classList.remove('wrong'));
	saveToindexedDB(save);
}
