// "use strict";
var form = {};
document.addEventListener("DOMContentLoaded", evt => {
	readyFuntion();
	AddProto();
});

function AddProto(){
	Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue){
			this.splice(i, 1);
			i--;
		}
	}
	return this;
	};
}

function readyFuntion(){
	openConectionDB();
	document.querySelector('#addMain').addEventListener('click', () => document.querySelector('.container').insertAdjacentHTML('beforeend',addForm()));
	document.addEventListener('click',e => {
		if (e.target.tagName.toLocaleLowerCase() == 'input') e.target.classList.add('visited');
		if(e.target.classList.contains('addSubInput')) addSubInput(e);
		if(e.target.classList.contains('delete')) Delete(e);
	 });
	document.body.addEventListener('DOMSubtreeModified',() => saveForm());
}

function validate(e){
	let complete;
	let form = e.target.closest('div[class="form"]');
		form.querySelectorAll('input').forEach(element =>{(element.value) ? element.classList.remove('wrong'):element.classList.add('wrong');});
		form.querySelectorAll('select').forEach(element => {(element.value == 'Please select type') ? element.classList.add('wrong'):element.classList.remove('wrong');});
	complete = (form.querySelectorAll('.wrong').length > 0) ? false:true;
	return complete;
}


var save = {};

function testSave(){
	document.querySelectorAll('.container > .Question').forEach((QuestionMain, index)=>{
		save[`Question${index}`] = tree(QuestionMain);
	})

	function tree(node){
		if (node.hasChildNodes()){
			if (node.classList.contains('Question')) {
				console.log(node);
				var children = [];
				for (var j = 0; j < node.childNodes.length; j++) {
					var childrenValue = tree(node.childNodes[j]);
					if(typeof childrenValue !== undefined){
						children.push(childrenValue);
					}
				}
				var CodnitionType = node.querySelector('.form').querySelector('select[name="Codnition"]');
				if (CodnitionType !== null) CodnitionType = CodnitionType.value;
				var CodnitionValue = node.querySelector('.form').querySelector('[name="CodnitionValue"]');
				if (CodnitionValue !== null) CodnitionValue = CodnitionValue.value;
				return {
					Question: node.querySelector('input[name="Question').value,
					Type: node.querySelector('select[name="Type"]').selectedOptions[0].value,
					CodnitionType,
					CodnitionValue,
					children: children.clean(''),
				}
			}
		}
		return '';
	}
}

	var savedHtml;
	var items = {};
function testRead(){
	save = JSON.parse(localStorage.getItem('test'));

	var tree = iterate(save.Question0);
	function iterate(element){
		console.log(element.Question , element.Type, element.CodnitionType, element.CodnitionValue);
		console.log(addFormTest(element.CodnitionType));
		if (element.hasOwnProperty('children')){
			for (var j=0; j < element.children.length; j++){
				iterate(element.children[j]);
			}
		}
	}


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
	const ParentType = e.target.closest('div[class="Question"]').querySelector('[name="Type"]').value
	e.target.closest('div[class="Question"]').insertAdjacentHTML('beforeend', addForm(ParentType));
}

function Delete(e){
	e.target.closest('div[class="Question"]').remove();
}

function saveForm(){
	console.log('save...');
	let save = document.querySelector('.container').cloneNode(true);
		// save.querySelectorAll('input').forEach(element => {console.log(element.value)});
		// save.querySelectorAll('select').forEach(element => element.selected  = 'Please select type');
		// save.querySelectorAll('.visited').forEach(element => element.classList.remove('visited'));
		// save.querySelectorAll('.wrong').forEach(element => element.classList.remove('wrong'));
	saveToindexedDB(save);
}

function addForm(parentType = null){
	console.log(parentType)
	const PossibleTypes = ['Text', 'Number', 'Yes/No'];
	let rowCodntionAndValue = (element) => {
		if (!element) return '';
		let ConditionValue = (element == 'Yes/No') ? `<select class="right selectBool" name="CodnitionValue"><option selected disabled>Please select type</option><option value="Yes">Yes</option><option value="No">No</opton></select>`:`<input type="${element.toLowerCase()}" class="right" required name="CodnitionValue">`;
		let options = {'Text': ['Equals'], 'Number': ['Equals', 'Greater than', 'Less than'], 'Yes/No': ['Equals']};
		let ConditionSelect = options[element].map(value => (`<option value="${value}">${value}</option>`)).join('');
		return (`
		<div class="row">
			<label class="">Codnition</label>
			<select class="" name="Codnition">
				<option selected disabled>Please select type</option>
				${ConditionSelect}
			</select>
			${ConditionValue}
		</div>
		`);
	}
	return (`
		<div class="Question">
			<div class="form">
			${rowCodntionAndValue(parentType)}
			<div class="row">
				<label class="">Question</label>
				<input type="text" class="right" name="Question" required>
			</div>
			<div class="row">
				<label class="">Type</label>
				<select class="right" name="Type">
				<option selected disabled>Please select type</option>
				${PossibleTypes.map((value) => (`<option value="${value}">${value}</option>`)).join('')}
				</select>
			</div>
			<div class="rowButton">
				<button type="button" class="button addSubInput">Add Sub-Input</button>
				<button type="button" class="button delete">Delete</button>
			</div>
			</div>
		</div>
	`);
}
