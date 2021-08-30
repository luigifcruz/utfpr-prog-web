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

document.state = 0;

function goToLogin() {
    document.state = 2;
    updateState();
};

function goToSignup() {
    document.state = 3;
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

    fetch("signin", {
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
            localStorage.setItem("loginAdmin", data["adm"]);
            document.state = 1;
            updateState();
        })
        .catch(error => {
            setDisplay("error-msg-login", "block");
            setContent("error-msg-login", error)
            console.log(error);
        });
};

function doSignup() {
    const email = getValue("email-signup");
    const password = getValue("password-signup");
    const adm = document.querySelector('#admin').checked;;

    if (email.length < 3 || password.length < 3) {
        setDisplay("error-msg-signup", "block");
        setContent("error-msg-signup", "Error: <b>Email</b> and <b>password</b> must be at least 3 characters in length.")
        return;
    }

    fetch("signup", {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                adm,
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
            localStorage.setItem("loginAdmin", data["adm"]);
            document.state = 1;
            updateState();
        })
        .catch(error => {
            setDisplay("error-msg-signup", "block");
            setContent("error-msg-signup", error)
            console.log(error);
        });
};

function doPost() {
    const title = getValue("post-title");
    const abstract = getValue("post-abstract");
    const url = getValue("post-url");

    if (title.length < 3 || abstract.length < 3 || url.length < 3) {
        setDisplay("error-msg-post", "block");
        setContent("error-msg-post", "Error: Post fields must be at least 3 characters in length.")
        return;
    }

    fetch("/post/new", {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-access-token": localStorage.getItem('loginToken')
            },
            method: 'POST',
            body: JSON.stringify({
                title,
                abstract,
                url,
            })
        })
        .then(response => {
            if (!response.ok) {
                throw Error("Please check your credentials try again.");
            }
            return response.json();
        })
        .then(data => {
            setDisplay("error-msg-post", "block");
            setContent("error-msg-post", "Posted!")
        })
        .catch(error => {
            setDisplay("error-msg-post", "block");
            setContent("error-msg-post", error)
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

    fetch("/post/search?term=" + searchTerm, {
            headers: { "x-access-token": localStorage.getItem('loginToken') },
        })
        .then(response => {
            if (!response.ok) {
                throw Error("There was an error with the current search term. Please try again.");
            }
            return response.json();
        })
        .then(jsonData => {
            const carrousel = document.getElementById('carrousel');

            if (jsonData.length == 0) {
                carrousel.replaceChildren();
                throw Error("Search didn't return any result.");
            }

            carrousel.replaceChildren();
            jsonData.forEach(entry => {
                console.log(entry);
                carrousel.appendChild(createPaperElement(entry.title, entry.url, entry.abstract));
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
    const adminToken = localStorage.getItem('loginAdmin');

    switch (document.state) {
        case 0: // Landing:
            setDisplay("landing-page-card", "flex");
            setDisplay("landing-page-news", "flex");
            setDisplay("login-btn", "block");
            setDisplay("signup-btn", "block");
            setDisplay("login", "none");
            setDisplay("signup", "none");
            setDisplay("search", "none");
            setDisplay("post", "none");
            break;
        case 1: // Search
            setDisplay("landing-page-card", "none");
            setDisplay("landing-page-news", "none");
            setDisplay("login-btn", "none");
            setDisplay("signup-btn", "none");
            setDisplay("login", "none");
            setDisplay("signup", "none");
            setDisplay("search", "block");
            if (adminToken === "true") {
                setDisplay("post", "block");
            } else {
                setDisplay("post", "none");
            }
            break;
        case 2: // Login
            setDisplay("landing-page-card", "none");
            setDisplay("landing-page-news", "none");
            setDisplay("login-btn", "none");
            setDisplay("signup-btn", "none");
            setDisplay("login", "block");
            setDisplay("signup", "none");
            setDisplay("search", "none");
            setDisplay("post", "none");
            break;
        case 3: // Signup
            setDisplay("landing-page-card", "none");
            setDisplay("landing-page-news", "none");
            setDisplay("login-btn", "none");
            setDisplay("signup-btn", "none");
            setDisplay("login", "none");
            setDisplay("signup", "block");
            setDisplay("search", "none");
            setDisplay("post", "none");
            break;
        default:
            break;
    }
};
