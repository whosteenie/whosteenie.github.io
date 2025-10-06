
async function setupForm() {
    try {
        let statesResponse = await fetch("https://csumb.space/api/allStatesAPI.php");

        if (!statesResponse.ok) {
            throw new Error("Response failed");
        }

        let statesData = await statesResponse.json();
        console.log(statesData);

        let statesSelect = document.querySelector("#state");

        for (let s of statesData) {
            let opt = document.createElement("option");
            opt.value = s.usps;
            opt.textContent = s.usps;
            statesSelect.appendChild(opt);
        }

        let countySelect = document.querySelector("#county");
        let countyResponse = await fetch("https://csumb.space/api/countyListAPI.php?state=al");

        if (!countyResponse.ok) {
            throw new Error("Response failed");
        }

        let countyData = await countyResponse.json();
        console.log(countyData)

        for (let c of countyData) {
            let opt = document.createElement("option");
            opt.value = c.county;
            opt.textContent = c.county;
            countySelect.appendChild(opt);
        }
    } catch (apiError) {
        console.error(apiError);
    }
}

setupForm();

let statesSelect = document.querySelector("#state");
statesSelect.addEventListener("change", async function () {
    try {
        let countySelect = document.querySelector("#county");
        let countyResponse = await fetch("https://csumb.space/api/countyListAPI.php?state=" + statesSelect.value);

        if (!countyResponse.ok) {
            throw new Error("Response failed");
        }

        let countyData = await countyResponse.json();
        console.log(countyData)

        while (countySelect.firstChild) {
            countySelect.removeChild(countySelect.lastChild);
        }

        for (let c of countyData) {
            let opt = document.createElement("option");
            opt.value = c.county;
            opt.textContent = c.county;
            countySelect.appendChild(opt);
        }
    } catch (apiError) {
        console.error(apiError);
    }
});

let passwordInput = document.querySelector("#password");
let confirmPasswordInput = document.querySelector("#confirmPassword");
let submitButton = document.querySelector("#submit");
submitButton.addEventListener("click", async function () {
    let submitError = document.querySelector("#submitError");
    submitError.style.color = "red";
    if (!usernameInput.value || usernameInput.value.length < 3) {
        submitError.textContent = "Username must be at least 3 characters!";
        return;
    }

    let user = usernameInput.value;
    let usernameResponse = await fetch("https://csumb.space/api/usernamesAPI.php?username=" + user);
        if (!usernameResponse.ok) {
            throw new Error("Response failed");
        }

        let usernameData = await usernameResponse.json();

    if (!usernameData.available) {
        submitError.textContent = "Username is unavailable...";
        return;
    }

    if (!passwordInput.value || passwordInput.value.length < 6) {
        submitError.textContent = "Password must be at least 6 characters!";
        return;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        submitError.textContent = "Passwords do not match!";
        return;
    }

    submitError.textContent = "Submission successful!";
    submitError.style.color = "green";
});

let usernameInput = document.querySelector("#username");
usernameInput.addEventListener("input", async function () {
    try {
        let userTaken = document.querySelector("#userTaken");
        let user = usernameInput.value;
        if (user == "") {
            userTaken.textContent = "";
            return
        }

        let usernameResponse = await fetch("https://csumb.space/api/usernamesAPI.php?username=" + user);
        if (!usernameResponse.ok) {
            throw new Error("Response failed");
        }

        let usernameData = await usernameResponse.json();
        console.log(usernameData);


        console.log(usernameData.available);

        if (!usernameData.available) {
            userTaken.textContent = "Username is unavailable...";
            userTaken.style.color = "red";
        } else {
            userTaken.textContent = "Username is available!";
            userTaken.style.color = "green";
        }

        if (user.length < 3) {
            userTaken.textContent = "Username must be at least 3 characters!";
            userTaken.style.color = "red";
        }
    } catch (apiError) {
        console.error(apiError);
    }
});


passwordInput.addEventListener("input", function () {
    if (passwordInput.value.length >= 6) {
        let submitError = document.querySelector("#submitError");
        submitError.textContent = "";
    }
});
passwordInput.addEventListener("click", async function () {
    try {
        let passwordResponse = await fetch("https://csumb.space/api/suggestedPassword.php?length=6");
        if (!passwordResponse.ok) {
            throw new Error("Response failed");
        }

        let passwordData = await passwordResponse.json();
        console.log(passwordData);

        let passwordSuggested = document.querySelector("#suggested");
        passwordSuggested.textContent = "Suggested password: " + passwordData.password;
    } catch (apiError) {
        console.error(apiError);
    }
});

let zipInput = document.querySelector("#zipInput");
let zipError = document.querySelector("#zipError");
let city = document.querySelector("#city");
let latitude = document.querySelector("#latitude");
let longitude = document.querySelector("#longitude");

zipInput.addEventListener("input", async function () {
    const zip = zipInput.value;

    if (zip.length == 5) {
        try {
            let response = await fetch("https://csumb.space/api/cityInfoAPI.php?zip=" + zip);
            if (!response.ok) {
                throw new Error("Invalid zip Code");
            }
            let zipData = await response.json();
            console.log(zipData);
            if(!zipData) {
                zipError.textContent = "Zip code not found";
            } else {
                zipError.textContent = "";
            }

            city.textContent = zipData.city || "";
            latitude.textContent = zipData.latitude || "";
            longitude.textContent = zipData.longitude || "";

        } catch (apiError) {
            console.error(apiError);
            city.textContent = "";
            latitude.textContent = "";
            longitude.textContent = "";
        }
    }


});