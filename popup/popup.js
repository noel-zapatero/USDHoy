const LS = chrome.storage.local;

var dolares;
var checkedUSD = [];

async function getUSD() {
	const response = await fetch("https://dolarapi.com/v1/dolares")
	dolares = await response.json();
	reemplazarAcentos();
	// console.log(dolares);

	createList();
	listenCheckboxes();
	updateView();
	checkLocalStorage();
}

function reemplazarAcentos(){
	for(i=0;i < dolares.length; i++){
		dolares[i].nombre = dolares[i].nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	}
}

function createList(){
	let menu = document.getElementById("menu");
	for (i = 0; i < dolares.length; ++i) {
		let label= document.createElement("label");
		let description = document.createTextNode(dolares[i].nombre);
		let checkbox = document.createElement("input");

		checkbox.type = "checkbox";
		checkbox.classList.add("checkMenu")

		label.appendChild(checkbox);
		label.appendChild(description);

		let li = document.createElement("li");
		li.appendChild(label);

		menu.appendChild(li);
	}
}

function listenCheckboxes(){
	let checks = document.getElementsByClassName("checkMenu");
	for(i=0; i < checks.length; i++){
		checks[i].addEventListener('change', (event) => {
			const elem = event.currentTarget;
			const label = elem.parentNode.textContent;
			if (elem.checked) {
				checkedUSD.push(label);
			}else{
				checkedUSD.splice(checkedUSD.indexOf(label), 1);
			}

			updateView();
		})
	}
}

async function checkLocalStorage(){
	await LS.get(["dolarHoyArg"], function(items){
		if(items.dolarHoyArg != undefined && items.dolarHoyArg != ''){
			checkedUSD = JSON.parse(items.dolarHoyArg);
			markLS();
			updateView();
		}
	});
}

function markLS(){
	let checks = document.getElementsByClassName("checkMenu");
	for(i=0; i < checks.length; i++){
		if(checkedUSD.includes(checks[i].parentNode.textContent)){
			checks[i].checked = true;
		}
	}
}

async function updateView(){
	if(checkedUSD.length > 0){
		let view = document.getElementById("view");
		view.innerHTML = '';
		for(i=0; i < checkedUSD.length; i++){
			let li = document.createElement('li')
			let usd = dolares.find(d => d.nombre == checkedUSD[i]);
			li.innerHTML += `<div><details><summary><h3>Dolar ${usd.nombre}</h3></summary><b>Compra:</b> $<span id="${usd.casa}Compra"></span><span style="margin: 0px 5px"><b>|</b></span><b>Venta:</b> $<span id="${usd.casa}Venta"></span></details></div>`

			view.appendChild(li);
			
			document.getElementById(usd.casa + 'Compra').innerHTML = usd.compra;
			document.getElementById(usd.casa + 'Venta').innerHTML = usd.venta;
		}

		await LS.set({'dolarHoyArg': JSON.stringify(checkedUSD)})
	}
}

getUSD();