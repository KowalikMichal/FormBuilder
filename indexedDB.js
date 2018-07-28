let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
let open;

function openConectionDB(){
	open = indexedDB.open("FormBuilder", 1);
	open.onupgradeneeded = function() {
		let db = open.result;
		let store = db.createObjectStore("Form", {keyPath: "id"});
		let index = store.createIndex("Index", 'HTML');
	}
	open.onsuccess = ()=>{
		console.log('open indexedDB');
		read();
	};
}

function read(){
	console.log('read()');
	let getForm = open.result.transaction("Form", "readwrite").objectStore("Form").get(1);
	getForm.onsuccess = () => {
		if (getForm.result == undefined) return;
		let div = getForm.result.HTML;
		document.querySelector('.container').insertAdjacentHTML('beforeend', div);
	}
}

function saveToindexedDB(form){
	let db = open.result;
	let tx = db.transaction("Form", "readwrite");
	let store = tx.objectStore("Form");
	let index = store.index("Index");
	//add data
	store.put({id: 1, 'HTML': form.innerHTML});
}
