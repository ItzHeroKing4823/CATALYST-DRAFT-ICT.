function makeTownshipOptions() {
    let options = '<option value="">Not listed / not in Yangon</option>';

    TOWNSHIP_NAMES.forEach((name) => {
        options = options + `<option value="${name}">${name}</option>`;
    });
    return options;
}

function makeModalsHtml() {
    return '' +
    '<dialog id="signinModal" class="auth-modal" aria-labelledby="signInTitle">' +
        '<div class="auth-art auth-art-signin">' +
            '<span class="auth-art-tag">CATALYST Yangon</span>' +
            '<h3>Welcome back to your health portal</h3>' +
            '<p>Appointments, hospitals and trusted health facts in one place.</p>' +
        '</div>' +
        '<form id="signInForm" class="auth-form">' +
            '<button type="button" class="auth-close" aria-label="Close">&times;</button>' +
            '<h2 id="signInTitle">Sign in</h2>' +
            '<p class="auth-sub">Enter your email and password to open your account.</p>' +
            '<label class="auth-label" for="signInEmail">Email address</label>' +
            '<input class="auth-input" type="email" id="signInEmail" autofocus placeholder="you@example.com" autocomplete="email" required>' +
            '<label class="auth-label" for="signInPassword">Password</label>' +
            '<input class="auth-input" type="password" id="signInPassword" placeholder="Your password" autocomplete="current-password" required>' +
            '<label class="auth-check"><input type="checkbox" id="signInShow"> Show password</label>' +
            '<button type="submit" class="auth-submit">Sign In</button>' +
            '<div id="signInMessage" class="auth-message" role="status" hidden></div>' +
            '<p class="auth-switch">New to CATALYST? <a href="#" class="signup-link">Create an account</a></p>' +
        '</form>' +
    '</dialog>' +

    '<dialog id="signupModal" class="auth-modal" aria-labelledby="signUpTitle">' +
        '<div class="auth-art auth-art-signup">' +
            '<span class="auth-art-tag">Join CATALYST</span>' +
            '<h3>Your health information in one place</h3>' +
            '<p>Create a free account and keep your details ready when you need them.</p>' +
        '</div>' +
        '<form id="signUpForm" class="auth-form">' +
            '<button type="button" class="auth-close" aria-label="Close">&times;</button>' +
            '<h2 id="signUpTitle">Create account</h2>' +
            '<p class="auth-sub">It only takes a minute.</p>' +
            '<label class="auth-label" for="signUpName">Full name</label>' +
            '<input class="auth-input" type="text" id="signUpName" autofocus placeholder="Your full name" autocomplete="name" required>' +
            '<label class="auth-label" for="signUpEmail">Email address</label>' +
            '<input class="auth-input" type="email" id="signUpEmail" placeholder="you@example.com" autocomplete="email" required>' +
            '<label class="auth-label" for="signUpTownship">Yangon township (optional)</label>' +
            '<select class="auth-input" id="signUpTownship">' + makeTownshipOptions() + '</select>' +
            '<label class="auth-label" for="signUpPassword">Password (at least 8 characters)</label>' +
            '<input class="auth-input" type="password" id="signUpPassword" minlength="8" autocomplete="new-password" required>' +
            '<label class="auth-label" for="signUpConfirm">Confirm password</label>' +
            '<input class="auth-input" type="password" id="signUpConfirm" minlength="8" autocomplete="new-password" required>' +
            '<label class="auth-check"><input type="checkbox" id="signUpShow"> Show passwords</label>' +
            '<button type="submit" class="auth-submit">Sign Up</button>' +
            '<div id="signUpMessage" class="auth-message" role="status" hidden></div>' +
            '<p class="auth-switch">Already have an account? <a href="#" class="signin-link">Sign in</a></p>' +
            '<p class="auth-note">School project: accounts are saved only in this browser. Do not use a real password. <a href="privacy-policy.html">Privacy Policy</a></p>' +
        '</form>' +
    '</dialog>';
}

function showAuthMessage(id, text, isError) {
    let box = document.getElementById(id);

    box.textContent = text;
    if (isError) {
        box.className = "auth-message error";
    } else {
        box.className = "auth-message success";
    }
    box.hidden = false;
}

function resetModal(dialog) {
    dialog.querySelector("form").reset();
    dialog.querySelector(".auth-message").hidden = true;
    dialog.querySelector(".auth-submit").disabled = false;

    let fields = dialog.querySelectorAll("input[type=text], input[type=password]");
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].id.indexOf("Password") != -1 || fields[i].id.indexOf("Confirm") != -1) {
            fields[i].type = "password";
        }
    }
}

function openAuthModal(which) {
    let signIn = document.getElementById("signinModal");
    let signUp = document.getElementById("signupModal");

    if (signIn == null) {
        return;
    }

    closeMenu();

    let toOpen = signIn;
    let toClose = signUp;
    if (which == "signup") {
        toOpen = signUp;
        toClose = signIn;
    }

    if (toClose.open) {
        toClose.close();
    }
    if (!toOpen.open) {
        toOpen.showModal();
    }
}

function togglePasswords(checkbox, ids) {
    let type = "password";
    if (checkbox.checked) {
        type = "text";
    }
    for (let i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).type = type;
    }
}

function isGoodEmail(email) {
    return email.includes("@") && email.includes(".") && email.indexOf("@") > 0 && !email.includes(" ");
}

function signIn(event) {
    event.preventDefault();

    const email = document.getElementById("signInEmail").value.trim().toLowerCase();
    const password = document.getElementById("signInPassword").value;

    if (!isGoodEmail(email)) {
        showAuthMessage("signInMessage", "Please type a correct email address, for example you@example.com.", true);
        return;
    }
    if (password == "") {
        showAuthMessage("signInMessage", "Please type your password.", true);
        return;
    }

    const users = getUsers();
    const found = users.find((person) => person.email == email);

    if (found == undefined) {
        showAuthMessage("signInMessage", "No account was found for this email. Please sign up first.", true);
        return;
    }
    if (found.password != password) {
        showAuthMessage("signInMessage", "Incorrect password. Please try again.", true);
        return;
    }

    // Save only the details that the pages need (never the password)
    const user = {
        name: found.name,
        email: found.email,
        township: found.township,
        joined: found.joined,
        joinedDate: found.joinedDate
    };
    localStorage.setItem("catalystUser", JSON.stringify(user));
    saveFlash(`You have successfully logged in. Welcome back, ${found.name.split(" ")[0]}!`, "success");

    // Show the success message first, then open the account page
    const firstName = found.name.split(" ")[0];
    showAuthMessage("signInMessage", `\u2714 Login successful! Welcome back, ${firstName}. Opening your account...`, false);
    document.querySelector("#signInForm .auth-submit").disabled = true;
    setTimeout(() => {
        window.location.href = "account.html";
    }, 1500);
}

function signUp(event) {
    event.preventDefault();

    const name = document.getElementById("signUpName").value.trim();
    const email = document.getElementById("signUpEmail").value.trim().toLowerCase();
    const township = document.getElementById("signUpTownship").value;
    const password = document.getElementById("signUpPassword").value;
    const confirmPassword = document.getElementById("signUpConfirm").value;

    if (name.length < 2) {
        showAuthMessage("signUpMessage", "Please type your full name.", true);
        return;
    }
    if (!isGoodEmail(email)) {
        showAuthMessage("signUpMessage", "Please type a correct email address, for example you@example.com.", true);
        return;
    }
    if (password.length < 8) {
        showAuthMessage("signUpMessage", "Your password needs at least 8 characters.", true);
        return;
    }
    if (password != confirmPassword) {
        showAuthMessage("signUpMessage", "The two passwords are not the same. Please try again.", true);
        return;
    }

    const users = getUsers();
    if (users.some((person) => person.email == email)) {
        showAuthMessage("signUpMessage", "This email already has an account. Please sign in.", true);
        return;
    }

    const newUser = {
        name: name,
        email: email,
        township: township,
        password: password,
        joined: new Date().toLocaleDateString(),
        joinedDate: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem("catalystUsers", JSON.stringify(users));

    showAuthMessage("signUpMessage", "\u2714 Account created successfully! Opening the sign in window...", false);
    document.querySelector("#signUpForm .auth-submit").disabled = true;
    setTimeout(() => {
        openAuthModal("signin");
        document.getElementById("signInEmail").value = email;
        showAuthMessage("signInMessage", "Your account is ready. Please sign in with your password.", false);
        document.getElementById("signInPassword").focus();
    }, 1200);
}

function setupAuthModals() {
    document.body.insertAdjacentHTML("beforeend", makeModalsHtml());

    let dialogs = document.getElementsByClassName("auth-modal");
    for (let i = 0; i < dialogs.length; i++) {
        let dialog = dialogs[i];

        dialog.querySelector(".auth-close").addEventListener("click", function () {
            dialog.close();
        });

        dialog.addEventListener("click", function (event) {
            if (event.target == dialog) {
                dialog.close();
            }
        });

        dialog.addEventListener("close", function () {
            resetModal(dialog);
        });
    }

    let signInLinks = document.getElementsByClassName("signin-link");
    for (let i = 0; i < signInLinks.length; i++) {
        signInLinks[i].addEventListener("click", function (event) {
            event.preventDefault();
            openAuthModal("signin");
        });
    }

    let signUpLinks = document.getElementsByClassName("signup-link");
    for (let i = 0; i < signUpLinks.length; i++) {
        signUpLinks[i].addEventListener("click", function (event) {
            event.preventDefault();
            openAuthModal("signup");
        });
    }

    document.getElementById("signInShow").addEventListener("change", function () {
        togglePasswords(this, ["signInPassword"]);
    });
    document.getElementById("signUpShow").addEventListener("change", function () {
        togglePasswords(this, ["signUpPassword", "signUpConfirm"]);
    });

    document.getElementById("signInForm").addEventListener("submit", signIn);
    document.getElementById("signUpForm").addEventListener("submit", signUp);
}

if (getCurrentUser() == null) {
    setupAuthModals();
}
