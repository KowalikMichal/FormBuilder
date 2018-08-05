// "use strict";
var form = {};
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
var event;
function addMain(e){
	const PossibleTypes = ['Text', 'Number', 'Yes/No'];
	let options = PossibleTypes.map((value) => (`<option value="${value}">${value}</option>`)).toString();
	document.querySelector('.container').insertAdjacentHTML('beforeend', addTypes(options, null));
}
//dataset.index
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


function testRead(){
	save = JSON.parse(localStorage.getItem('test'));

	var tree = iterate(save.Question0);
	var savedHtml;
	function iterate(element){
		console.log(element.Question , element.Type, element.CodnitionType, element.CodnitionValue);
		if (element.hasOwnProperty('children')){
			for (var j=0; j < element.children.length; j++){
				iterate(element.children[j]);
			}
		}
	}


}


Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};


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
	let type = e.target.closest('div[class="form"]').querySelector('select[name="Type"]').selectedOptions[0].value;
	event = e;
	e.target.closest('div[class="Question"]').insertAdjacentHTML('beforeend', addTypes(options, type));
}

function Delete(e){
	e.target.closest('div[class="Question"]').remove();
}

function condition(type){
	if (!type) return '';
	let options = {'Text': ['Equals'], 'Number': ['Equals', 'Greater than', 'Less than'], 'Yes/No': ['Equals']};
	let optionsType = options[type].map(value => (`<option value="${value}">${value}</option>`)).toString();
	let inputOrSelect = (type == 'Yes/No') ? `<select class="right selectBool" name="CodnitionValue"><option selected disabled>Please select type</option><option value="Yes">Yes</option><option value="No">No</opton></select>`:`<input type="${type.toLowerCase()}" class="right" required name="CodnitionValue">`;
	let additionalRow = `
		<div class="row">
			<label class="">Codnition</label>
			<select class="" name="Codnition">
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
					<input type="text" class="right" name="Question" required>
				</div>
				<div class="row">
					<label class="">Type</label>
					<select class="right" name="Type">
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
		// save.querySelectorAll('input').forEach(element => {console.log(element.value)});
		// save.querySelectorAll('select').forEach(element => element.selected  = 'Please select type');
		// save.querySelectorAll('.visited').forEach(element => element.classList.remove('visited'));
		// save.querySelectorAll('.wrong').forEach(element => element.classList.remove('wrong'));
	saveToindexedDB(save);
}
