import API from "./api.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";

// import functions in from different files
import { loginForm } from "./login.js";
import { registerAccBtn } from "./signUp.js";
import { getUserFeed, getUserProfile } from "./feed.js";
import { renderFollowUnfollow } from "./follow.js";
import { renderSettings } from "./setting.js";

// This url may need to change depending on what port your backend is running
// on.
// const api = new API('http://localhost:5000');

// Example usage of makeAPIRequest method.
// api.makeAPIRequest('dummy/user')
//     .then(r => console.log(r));

const url = "http://localhost:5000";

// handle error messages 
const errorModal = document.getElementById("error-modal");
const errorMsg = document.getElementById("error-msg");
const errorClose = document.getElementById("error-close");
errorClose.onclick = () => {
    errorModal.style.display = "none";
}
///////////////////////////////////////////////////////////

// main container tag 
const main = document.getElementById("main-container");

main.appendChild(loginForm());

const lineDiv = document.createElement("div");
lineDiv.id = "line-divider";
main.appendChild(lineDiv);

registerAccBtn(url, main, errorModal, errorMsg);
///////////////////////////////////////////////////////////

// get the login form
const logForm = document.forms.login_form;

// event listener for when login form is submitted
logForm.addEventListener("submit", (event) => {
    event.preventDefault();
    loginAttempt(url, logForm.elements.username.value, logForm.elements.password.value);
})

// handles api call when user attempts to login
async function loginAttempt(url, user, pass) {
    // make API call to authenticate user that's trying to log in
    const response = await fetch(url + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: user, password: pass })
    })
    .then(response => {
        if (response.ok) { // if status code is 200
            return response.json();
        } else { // if status code is not 200 
            return Promise.reject(response.json());
        }
    })
    .then(responseJson => { // render user feed
        while (main.hasChildNodes()) {
            main.removeChild(main.firstChild);
        }
        const userProfile = false;
        getUserFeed(url, responseJson.token, main, errorMsg, errorModal, userProfile, 0);
        console.log(responseJson.token);
        const headerText = document.getElementById("header-text");
        headerText.innerText = "Feed :3";
        main.id = "feed-container";
        myProfile(responseJson.token, url, main, logForm.elements.username.value, errorMsg, errorModal);
        makeAPost(responseJson.token);
        followUnfollow(responseJson.token, url, main, errorMsg, errorModal)
        accSettings(responseJson.token);
    })
    .catch(error => { // alert user of error while logging in
        Promise.resolve(error)
        .then(function(e) {
            // display error message in a modal
            errorMsg.innerText = e.message;
            errorModal.style.display = "block";
        });
    });
}
///////////////////////////////////////////////////////////

const header = document.getElementById("header");
const headerBtns = document.createElement("div");
headerBtns.className = "header-btns";
header.appendChild(headerBtns);

// button to display logged in user's public profile
function myProfile(token, url, container, username, errorMsg, errorModal) {
    const myProfileBtn = document.createElement("button");
    myProfileBtn.className = "my-profile-btn";
    myProfileBtn.innerText = "My Profile";
    myProfileBtn.onclick = () => {
        const userProfile = true;
        getUserProfile(token, url, container, username, null, errorMsg, errorModal, userProfile);
    }
    headerBtns.appendChild(myProfileBtn);
}

// button to make a post
function makeAPost(token) {
    const makePostBtn = document.createElement("button");
    makePostBtn.className = "make-post-btn";
    makePostBtn.innerText = "Make Post";
    makePostBtn.onclick = () => renderMakePost(token, main);
    headerBtns.appendChild(makePostBtn);
}

// renders a modal for user to make a post
function renderMakePost(token, container) {
    // create a modal for user to make a post
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

    const form = document.createElement("form");
    form.id = "make-post-form";
    form.name = "make_post_form";
    modalContent.appendChild(form);

    const input = document.createElement("input");
    input.type = "text";
    input.className = "make-post-input";
    input.name = "make-post-input";
    input.placeholder = "What is on your mind..."
    form.appendChild(input);

    const img = document.createElement("input");
    img.type = "text";
    img.className = "make-post-input";
    img.name = "make-post-img";
    img.placeholder = "Image Base64 code";
    form.appendChild(img);

    const postBtn = document.createElement("input");
    postBtn.id = 'post-submit-btn';
    postBtn.type = "submit";
    postBtn.value = "Post";
    form.appendChild(postBtn);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        makePostAttempt(token, url, input.value, img.value);
    })
}

// make api call to make a post
async function makePostAttempt(token, url, description, srcImg) {
    const response = await fetch(url + "/post/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify({ description_text: description, src: srcImg })
    })
    .then(response => {
        if (response.ok) { // if status code is 200
            return response.json();
        } else { // if status code is not 200 
            return Promise.reject(response.json());
        }
    })
    .then(responseJson => { 
        alert("Made a post!");
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

// button to follow/unfollow 
function followUnfollow(token, url, container, errorMsg, errorModal) {
    const followUnfollowBtn = document.createElement("button");
    followUnfollowBtn.className = "follow-unfollow-btn";
    followUnfollowBtn.innerText = "Follow/Unfollow";
    followUnfollowBtn.onclick = () => renderFollowUnfollow(token, url, main);
    headerBtns.appendChild(followUnfollowBtn);
}

// button to display user settings, to change user email, password or name
function accSettings(token) {
    const settingsBtn = document.createElement("button");
    settingsBtn.className = "settings-btn";
    settingsBtn.innerText = "Settings";
    settingsBtn.onclick = () => renderSettings(token, url, main, errorMsg, errorModal);
    headerBtns.appendChild(settingsBtn);
}

window.onscroll = function() {
    if ((main.scrollY + main.innerHeight) >= document.body.scrollHeight) {
        console.log("here");
    }
}
