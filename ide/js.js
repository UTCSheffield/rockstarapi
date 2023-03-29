//TODO: Write this file, move JS from html file to here & link it
var idSet = false;
var id = 0;
function submit() {
    const code = document.getElementById("inputField").value
    const encodedCode = encodeURIComponent(code)
    console.log(encodedCode)
    const body = {
        code: encodedCode,
    }
    var res;
    if (idSet && id !=0) {
        body.id = id
        fetch('/compile', {
            method: "PUT",
            body: new URLSearchParams(body),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then((fetchRes) => fetchRes.json())
        .then((response) => afterFetchFlow(response))
    } else {
        fetch(`/compile/`, {
            method: "POST",
            body: new URLSearchParams(body),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        }).then((fetchRes) => fetchRes.json())
        .then((response) =>  afterFetchFlow(response))
        idSet = true
    }
}

function afterFetchFlow(res) {
    
    if(res.status == "success"){
        document.getElementById("idField").textContent = String(res.id)
        document.getElementById("inputField").textContent = String(res.code)
        document.getElementById("logField").textContent = String(JSON.stringify(res.log, null, 4))
        document.getElementById("outputField").textContent = String(res.output.join("\n"))
    }   
    
    /*var output;
    res.output.forEach((val) => {
        if (typeof(output) == "undefined") {
            output = val
        } else {
            output = `${output}\n${val}`
        }
    })*/
}