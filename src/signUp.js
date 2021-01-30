// renders the register account button and the register form
export function registerAccBtn(url, container, errorModal, errorMsg) {
    const btn = document.createElement("button");
    btn.id = "signup-btn";
    btn.innerText = "Register New Account";
    container.appendChild(btn);
    
    // create a modal for the register form
    const modal = document.createElement("div");
    modal.className = "modal";
    container.appendChild(modal);

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modal.appendChild(modalContent);

    // close button for modal
    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.innerText = "X";
    modalContent.appendChild(closeBtn);

    // functionality of sign up btn
    btn.onclick = () => {
        modal.style.display = "block";
    }

    // functionality of close btn
    closeBtn.onclick = () => {
        modal.style.display = "none";
    }

    // make a registeration form
    const form = document.createElement("form");
    form.id = "signup-form";
    form.name = "signup_form";
    modalContent.appendChild(form);

    // user input fields
    const username = document.createElement("input");
    username.type = "text";
    username.placeholder = "Username";
    form.appendChild(username);

    const email = document.createElement("input");
    email.type = "text";
    email.placeholder = "Email";
    form.appendChild(email);

    const name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Name";
    form.appendChild(name);

    const password = document.createElement("input");
    password.type = "password";
    password.placeholder = "Password";
    form.appendChild(password);

    const passwordConfirm = document.createElement("input");
    passwordConfirm.type = "password";
    passwordConfirm.placeholder = "Confirm password";
    form.appendChild(passwordConfirm);

    const signupBtn = document.createElement("input");
    signupBtn.id = "signup-btn";
    signupBtn.type = "submit";
    signupBtn.value = "Sign Up";
    form.appendChild(signupBtn);

    // event listener for when sign up form is submitted
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (password.value !== passwordConfirm.value) {
            errorMsg.innerText = "Password does not match, please re-enter your password.";
            errorModal.style.display = "block";
        } else {
            signUpAttempt(url, username.value, email.value, name.value, password.value, errorModal, errorMsg);
        }
    })
}

// handles api calls when user attempts to sign up
async function signUpAttempt(url, user, email, name, pass, errorModal, errorMsg) {
    // make API call to sign up user
    const response = await fetch(url + "/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: user, password: pass, email: email, name: name })
    })
    .then(response => {
        if (response.ok) { // if status code is 200
            return response.json();
        } else { // if status code is not 200 
            return Promise.reject(response.json());
        }
    })
    .then(responseJson => { 
        alert("Sign Up Success!");
    })
    .catch(error => { // alert user of error while signing up
        Promise.resolve(error)
        .then(function(e) {
            // display error message in a modal
            errorMsg.innerText = e.message;
            errorModal.style.display = "block";
        });
    });
}
