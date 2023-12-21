var dolares;

async function logUSD() {
	const response = await fetch("https://dolarapi.com/v1/dolares")
	dolares = await response.json();
	console.log(dolares);

	getOficial();
	getBlue();
}

function getOficial(){
	let ofi = dolares.find(d => d.casa == 'oficial');
	document.getElementById('oficialCompra').innerHTML = ofi.compra;
	document.getElementById('oficialVenta').innerHTML = ofi.venta;
}

function getBlue(){
	let blue = dolares.find(d => d.casa == 'blue');
	document.getElementById('blueCompra').innerHTML = blue.compra;
	document.getElementById('blueVenta').innerHTML = blue.venta;
}


logUSD();
