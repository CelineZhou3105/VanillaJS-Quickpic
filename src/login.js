// renders the login form page
export function loginForm() {
    const container = document.createElement("div");
    container.id = "login-container";

    // create login form
    const form = document.createElement("form");
    form.name = "login_form";
    form.id = "login-form"
    container.appendChild(form);

    // user input fields
    const username = document.createElement("input");
    username.type = "text";
    username.name = "username";
    username.placeholder = "Username";
    form.appendChild(username);

    const password = document.createElement("input");
    password.type = "password";
    password.name = "password";
    password.placeholder = "Password";
    form.appendChild(password);

    const loginBtn = document.createElement("input");
    loginBtn.id = 'login-btn';
    loginBtn.type = "submit";
    loginBtn.value = "Login";
    form.appendChild(loginBtn);
    
    return container;
}