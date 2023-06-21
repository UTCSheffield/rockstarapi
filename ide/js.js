// Consts
var idSet = false;
var id = 1;
// Functions
function gistSubmit() {
	const id = document.getElementById('gistID').value;
	fetch(`/gist/id/${id}`)
	.then((fetchRes) => fetchRes.json())
	.then((response) => multiRockAfterSubmit(response, 'gistMultiSelectDropdown', 'gistDiv'));
}
function historicalSubmit() {
	
}
function ideSubmit() {
    const code = document.getElementById('ideInput').value;
	const encodedCode = encodeURIComponent(code);
	console.log(encodedCode);
	const body = {
		code: encodedCode
	};
	console.log(document.getElementById('rockID').textContent);
	if (document.getElementById('rockID').textContent != 'None!') {
		body.id = id;
		fetch('/compile', {
			method: 'PUT',
			body: new URLSearchParams(body),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			}
		})
			.then((fetchRes) => fetchRes.json())
			.then((response) => genericAfterSubmit(response));
	} else {
		fetch(`/compile/`, {
			method: 'POST',
			body: new URLSearchParams(body),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
			}
		})
			.then((fetchRes) => fetchRes.json())
			.then((response) => genericAfterSubmit(response));
	}
}
function genericAfterSubmit(res) {
    if (res.status == 'success') {
		console.log(res);
		document.getElementById('rockID').textContent = String(res.id);
		document.getElementById('ideInput').textContent = String(decodeURIComponent(res.code));
		document.getElementById('ideLog').textContent = String(JSON.stringify(res.log, null, 4));
		document.getElementById('ideOutput').textContent = String(res.output.join('\n'));
		id = res.id;
	} else {
        document.getElementById('outputField').textContent = String(res.message);
    }
}
function multiRockAfterSubmit(res, dropdownID, parentDiv) {
	const dropdown = document.createElement('select');
	dropdown.id = dropdownID;
	dropdown.onclick = () => {
		const id = document.getElementById(dropdownID).value;
		fetch(`/rock/${id}`)
		.then((fetchRes) => fetchRes.json())
		.then((response) => genericAfterSubmit(response));
	}
	res.rocks.map((val) => {
		const option = document.createElement('option');
		option.value = val.id;
		option.textContent = `ID: ${val.id}`;
		dropdown.appendChild(option);
	})
	document.getElementById(parentDiv).appendChild(dropdown);
}