export function renderFollowUnfollow(token, url, container) {
    // create a modal for the follow/unfollow 
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

    // contains the username input and follow button
    const followBox = document.createElement("div");
    followBox.className = "follow-box";
    modalContent.appendChild(followBox);

    const followInput = document.createElement("input");
    followInput.type = "text";
    followInput.className = "follow-input";
    followInput.placeholder = "Username";
    followBox.appendChild(followInput);

    const followBtn = document.createElement("button");
    followBtn.className = "follow-btn";
    followBtn.innerText = "Follow";
    followBtn.onclick = () => followAttempt(token, url, followInput.value);
    followBox.appendChild(followBtn);

    // contains the username input and unfollow button
    const unfollowBox = document.createElement("div");
    unfollowBox.className = "unfollow-box";
    modalContent.appendChild(unfollowBox);

    const unfollowInput = document.createElement("input");
    unfollowInput.type = "text";
    unfollowInput.className = "follow-input";
    unfollowInput.placeholder = "Username";
    unfollowBox.appendChild(unfollowInput);

    const unfollowBtn = document.createElement("button");
    unfollowBtn.className = "follow-btn";
    unfollowBtn.innerText = "Unfollow";
    unfollowBtn.onclick = () => unfollowAttempt(token, url, unfollowInput.value);
    unfollowBox.appendChild(unfollowBtn);
}

// makes api call to follow a user
async function followAttempt(token, url, user) {
    const response = await fetch(url + `/user/follow?username=${user}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }
    })
    .then(response => {
        if (response.ok) { // if status code is 200
            return response.json();
        } else { // if status code is not 200 
            return Promise.reject(response.json());
        }
    })
    .then(json => {
        console.log(json);
        alert(`Followed ${user}`);
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

// makes api call to unfollow a user
async function unfollowAttempt(token, url, user) {
    const response = await fetch(url + `/user/unfollow?username=${user}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        }
    })
    .then(response => {
        if (response.ok) { // if status code is 200
            return response.json();
        } else { // if status code is not 200 
            return Promise.reject(response.json());
        }
    })
    .then(json => {
        console.log(json);
        alert(`Unfollowed ${user}`);
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