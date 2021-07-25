function setDisplay(id, value) {
    document.getElementById(id).style.display = value;
}

function getValue(id) {
    return document.getElementsByName(id)[0].value;
}

document.state = 0;

function goToLogin() {
    document.state = 2;
    updateState();
}

function doLogin() {
    console.log(getValue("email"));
    console.log(getValue("password"));
}

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
}
