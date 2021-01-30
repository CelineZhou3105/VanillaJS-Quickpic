export function renderSettings(token, url, container, errorMsg, errorModal) {
    // create a modal for the settings
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

    // display modal
    modal.style.display = "block";

    // functionality of close btn
    closeBtn.onclick = () => {
        modal.style.display = "none";
    }

    const h1 = document.createElement("h1");
    h1.className = "Update Account Details";
    modalContent.appendChild(h1);

    const emailInput = document.createElement("input");
    emailInput.type = "text";
    emailInput.className = "update-email-input";
    emailInput.placeholder = "Update Email";
    modalContent.appendChild(emailInput);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "update-name-input";
    nameInput.placeholder = "Update Name";
    modalContent.appendChild(nameInput);

    const passInput = document.createElement("input");
    passInput.type = "text";
    passInput.className = "update-pass-input";
    passInput.placeholder = "Update Password";
    modalContent.appendChild(passInput);

    const update = document.createElement("button");
    update.className = "update-settings-btn";
    update.innerText = "Update";
    update.onclick = () => changeAccSettings(token, url, emailInput.value, nameInput.value, passInput.value, errorMsg, errorModal);
    modalContent.appendChild(update);
}

// makes api call to follow a user
async function changeAccSettings(token, url, userEmail, userName, pass, errorMsg, errorModal) {
    const response = await fetch(url + "/user/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify({ email: userEmail, name: userName, password: pass })
    })
    .then(response => {
        if (response.ok) { // if status code is 200
            return response.json();
        } else { // if status code is not 200 
            return Promise.reject(response.json());
        }
    })
    .then(json => {
        alert("Updated account details!");
    })
    .catch(error => { 
        Promise.resolve(error)
        .then(function(e) {
            // display error message in a modal
            // errorMsg.innerText = e.message;
            // errorModal.style.display = "block";
            console.log(error);
        });
    });
}