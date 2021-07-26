function setDisplay(id, value) {
    document.getElementById(id).style.display = value;
};

function setContent(id, value) {
    document.getElementById(id).innerHTML = value;
};

function getValue(id) {
    return document.getElementsByName(id)[0].value;
};

function toArray(obj) {
    if (obj instanceof Array) {
        return obj;
    } else {
        return [obj];
    }
}

function createPaperElement(title, url, abstract) {
    const element = document.createElement("div");
    element.className = "element";
    element.id = url;

    const titleElement = document.createElement("a");
    titleElement.href = url;
    titleElement.innerHTML = title;
    element.appendChild(titleElement);

    const abstractElement = document.createElement("p");
    abstractElement.innerHTML = abstract;
    element.appendChild(abstractElement)

    return element;
}

// Source: https://davidwalsh.name/convert-xml-json
// Changes XML to JSON
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};



document.state = 0;

function goToLogin() {
    document.state = 2;
    updateState();
};

function doLogin() {
    const email = getValue("email");
    const password = getValue("password");

    if (email.length < 3 || password.length < 3) {
        setDisplay("error-msg-login", "block");
        setContent("error-msg-login", "Error: <b>Email</b> and <b>password</b> must be at least 3 characters in length.")
        return;
    }

    fetch("https://reqres.in/api/login", {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            })
        })
        .then(response => {
            if (!response.ok) {
                throw Error("Please check your credentials try again.");
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("loginToken", data["token"]);
            document.state = 1;
            updateState();
        })
        .catch(error => {
            setDisplay("error-msg-login", "block");
            setContent("error-msg-login", error)
            console.log(error);
        });
};

function doSearch() {
    const searchTerm = getValue("search-term");

    if (searchTerm.length < 3) {
        setDisplay("error-msg-search", "block");
        setContent("error-msg-search", "Error: Search term must be at least 3 characters in length.")
        return;
    }
    setDisplay("error-msg-search", "none");

    fetch("https://export.arxiv.org/api/query?search_query=all:" + searchTerm + "&start=0&max_results=15")
        .then(response => {
            if (!response.ok) {
                throw Error("There was an error with the current search term. Please try again.");
            }
            return response.text();
        })
        .then(textData => {
            const parser = new DOMParser();
            const domData = parser.parseFromString(textData, "application/xml");
            const jsonData = xmlToJson(domData);
            const carrousel = document.getElementById('carrousel');

            if (!jsonData["feed"].hasOwnProperty('entry')) {
                carrousel.replaceChildren();
                throw Error("Search didn't return any result.");
            }

            let entries = toArray(jsonData["feed"]["entry"]);

            carrousel.replaceChildren();
            entries.forEach(entry => {
                console.log(entry);
                const title = entry["title"]["#text"];
                const url = entry["id"]["#text"];
                const abstract = entry["summary"]["#text"];
                carrousel.appendChild(createPaperElement(title, url, abstract));
            });
        })
        .catch(error => {
            setDisplay("error-msg-search", "block");
            setContent("error-msg-search", error)
            console.log(error);
        });
};

document.addEventListener("DOMContentLoaded", function() {
    const loginToken = localStorage.getItem('loginToken');

    if (loginToken !== null) {
        document.state = 1;
    }

    updateState();
});

function updateState() {
    console.log("[DEBUG] Update state: " + document.state);

    switch (document.state) {
        case 0: // Landing:
            setDisplay("landing-page-card", "flex");
            setDisplay("landing-page-news", "flex");
            setDisplay("login-btn", "block");
            setDisplay("login", "none");
            setDisplay("search", "none");
            break;
        case 1: // Search
            setDisplay("landing-page-card", "none");
            setDisplay("landing-page-news", "none");
            setDisplay("login-btn", "none");
            setDisplay("login", "none");
            setDisplay("search", "block");
            break;
        case 2: // Login
            setDisplay("landing-page-card", "none");
            setDisplay("landing-page-news", "none");
            setDisplay("login-btn", "none");
            setDisplay("login", "block");
            setDisplay("search", "none");
        default:
            break;
    }
};
