var count = 0;

// make api call to get user feed after log in success
export async function getUserFeed(url, token, container, errorMsg, errorModal, userProfile, p) {
    const response = await fetch(url + `/user/feed?p=${p}`, {
        method: "GET",
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
        count = p;
        renderFeed(token, json, container, url, errorMsg, errorModal, userProfile);
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

const loadPosts = (posts, token, url, container, errorMsg, errorModal, feedPost, userProfile) => {
    for (let i = count; i < count + 10; i++) {
        var element = posts[i]
        const postBox = document.createElement("div");
        postBox.className = "post-box";
        postBox.id = element.id;

        // render post header
        const feedPost = true;
        postBox.appendChild(renderPostHeader(token, element, url, container, errorMsg, errorModal, feedPost, userProfile));

        // render description
        postBox.appendChild(renderPostDescription(element));

        // if there is an image, render it
        if (element.src) {
            postBox.appendChild(renderPostImg(element));
        }
        // render post footer
        postBox.appendChild(renderPostFooter(token, element, url, errorMsg, errorModal, userProfile));

        container.appendChild(postBox);
    }
}

function renderFeed(token, json, container, url, errorMsg, errorModal, userProfile) {
    // if there are no posts for the feed
    if (json.posts.length === 0) {
        const noFeed = document.createElement("div");
        noFeed.className = "no-feed";
        noFeed.innerText = "What a lonely feed ;3 Follow someone!";
        container.appendChild(noFeed);
        return;
    }

    loadPosts(json.posts, token, url, container, errorMsg, errorModal, true, userProfile);
    
    container.addEventListener("scroll", function() {
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            count = count + 10;
            getUserFeed(url, token, container, errorMsg, errorModal, userProfile, count);
        }
    })
}

// returns the header html tag for the post
function renderPostHeader(token, element, url, container, errorMsg, errorModal, feedPost, userProfile) {
    // header contains author and date the post was made
    const header = document.createElement("div"); 
    header.className = "post-header";

    const author = document.createElement("div");
    author.className = "post-author";
    author.innerText = element.meta.author;
    if (feedPost === true) {
        author.onclick = () => getUserProfile(token, url, container, element.meta.author, null, errorMsg, errorModal, userProfile);
    }
    header.appendChild(author);

    const date = document.createElement("div");
    date.className = "post-date";
    const postMade = new Date(element.meta.published * 1000);
    date.innerText = postMade.toLocaleString();
    header.appendChild(date);

    return header;
}

// returns the post description
function renderPostDescription(element) {
    const description = document.createElement("div")
    description.className = "post-description";
    description.innerText = element.meta.description_text;
    return description;
}

// returns the post image
function renderPostImg(element) {
    const img = document.createElement("img");
    img.className = "post-img";
    img.setAttribute("src", `data:image/png;base64, ${element.src}`);
    img.setAttribute("alt", `Image uploaded by ${element.meta.author}`);
    return img;
}

// returns the footer html tag for the post
function renderPostFooter(token, element, url, errorMsg, errorModal, userProfile) {
    // footer contains likes and comments
    const footer = document.createElement("div");
    footer.className = "post-footer";

    // contains how many people liked and commented
    const likeComment = document.createElement("div");
    likeComment.className = "post-like-comment";
    footer.appendChild(likeComment);

    // how many likes
    const likes = document.createElement("div");
    likes.className = "post-likes";
    likes.innerText = element.meta.likes.length + " Likes";
    likeComment.appendChild(likes);

    // how many comments
    const comments = document.createElement("div");
    comments.className = "post-comments";
    comments.innerText = element.comments.length + " Comments";
    likeComment.appendChild(comments);

    // contains all the people that liked the post
    const likeBox = document.createElement("div");
    likeBox.className = "post-info";
    if (element.meta.likes.length === 0) {
        likeBox.innerText = "No one liked this post";
    } else {
        const likedBy = [];
        for (let i = 0; i < element.meta.likes.length; i++) {
            getUserProfile(token, url, likedBy, null, element.meta.likes[i], errorMsg, errorModal, userProfile)
            .then(response => {
                likeBox.innerText = likedBy.join(", ") + " liked this post";
            });
        }
    }
    footer.appendChild(likeBox);

    // contains the like and comment buttons
    const buttons = document.createElement("div");
    buttons.className = "post-buttons";
    footer.appendChild(buttons);

    // the like button
    const likeBtn = document.createElement("button");
    likeBtn.innerText = "Like";
    likeBtn.onclick = () => likeAPost(token, url, element.id, errorMsg, errorModal);
    buttons.appendChild(likeBtn);

    // the comment button
    const commentBtn = document.createElement("button");
    commentBtn.innerText = "Comment";
    buttons.appendChild(commentBtn);

    if (element.comments.length > 0) {
        // contains all the comments
        const commentBox = document.createElement("div");
        footer.appendChild(commentBox);

        // made a box for each comment
        for (let i = 0; i < element.comments.length; i++) {
            const comment = document.createElement("div");
            comment.className = "post-user-comment";

            const commentHeader = document.createElement("div");
            commentHeader.className = "post-like-comment";
            comment.appendChild(commentHeader);

            const commentAuthor = document.createElement("div");
            commentAuthor.className = "post-comment-author";
            commentAuthor.innerText = element.comments[i].author;
            commentHeader.appendChild(commentAuthor);

            const commentTime = document.createElement("div");
            commentTime.className = "post-comment-time";
            const commentMade = new Date(element.comments[i].published * 1000);
            commentTime.innerText = commentMade.toLocaleString();
            commentHeader.appendChild(commentTime);

            const commentText = document.createElement("div");
            commentText.className = "post-info";
            commentText.innerText = element.comments[i].comment;
            comment.appendChild(commentText);

            commentBox.appendChild(comment);
        }
    }
    
    // contains input for user to write comments and post button
    const writeCommentBox = document.createElement("div");
    writeCommentBox.className = "write-comment-box";
    footer.appendChild(writeCommentBox);

    const commentInput = document.createElement("input");
    commentInput.className = "comment-input";
    commentInput.type = "text";
    commentInput.placeholder = "Write a comment...";
    writeCommentBox.appendChild(commentInput);

    const postCommentBtn = document.createElement("button");
    postCommentBtn.className = "post-comment-btn";
    postCommentBtn.innerText = "Post";
    writeCommentBox.appendChild(postCommentBtn);

    // functionality of comment button
    commentBtn.onclick = () => {
        commentInput.focus();
    }

    // functionality of post comment button
    postCommentBtn.onclick = () => writeCommentAttempt(token, url, element.id, commentInput.value);

    return footer;
}

// makes api call to like a post
async function likeAPost(token, url, id, errorMsg, errorModal) {
    // make API call to like a post
    const response = await fetch(url + `/post/like?id=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        }
    })
    .then(response => {
        if (response.ok) { // if status code is 200
            return response.json();
        } else { // if status code is not 200 
            return Promise.reject(response.json());
        }
    })
    .then(responseJson => { 
        alert('You liked a post!');
    })
    .catch(error => { 
        Promise.resolve(error)
        .then(function(e) {
            // display error message in a modal
            errorMsg.innerText = e.message;
            errorModal.style.display = "block";
        });
    });
}

// makes api call to get user information
export async function getUserProfile(token, url, container, username, id, errorMsg, errorModal, userProfile) {
    // check whether it is fetch by username or id
    let fetchUrl = url;
    if (username) {
        fetchUrl += `/user/?username=${username}`;
    } else if (id) {
        fetchUrl += `/user/?id=${id}`;        
    }
    const response = await fetch(fetchUrl, {
        method: "GET",
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
        if (username) { // if its fetch by username, render user profile
            renderUserProfile(json, container, url, token, errorMsg, errorModal, userProfile);
        } else if (id) { // if its fetch by id, render the user who liked a post
            container.push(json.username);
        }
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

// renders the user's profile
function renderUserProfile(json, container, url, token, errorMsg, errorModal, userProfile) {
    // create a modal for the user profile
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

    // display this modal
    modal.style.display = "block";

    // functionality of close btn
    closeBtn.onclick = () => {
        modal.style.display = "none";
    }

    const profile =  document.createElement("h1");
    profile.className = "profile-heading";
    profile.innerText = "Profile";
    modalContent.appendChild(profile);

    // contains information about the user
    const infoBox = document.createElement("div");
    infoBox.className = "profile-info-box";
    modalContent.appendChild(infoBox);

    const username = document.createElement("p");
    username.innerText = "Username: " + json.username;
    infoBox.appendChild(username);

    const email = document.createElement("p");
    email.innerText = "Email: " + json.email;
    infoBox.appendChild(email);

    const name = document.createElement("p");
    name.innerText = "Name: " + json.name;
    infoBox.appendChild(name);

    // contains how many user follows and a button to see a list of user follows
    const followBox = document.createElement("div");
    followBox.className = "follow-box";
    infoBox.appendChild(followBox);

    const following = document.createElement("p");
    following.innerText = "Following: " + json.following.length + " people";
    followBox.appendChild(following);

    const followingList = document.createElement("div");
    followingList.className = "following-list";
    const userFollow = [];
    for (let i = 0; i < json.following.length; i++) {
        getUserProfile(token, url, userFollow, null, json.following[i], errorMsg, errorModal, userProfile)
        .then(response => {
            followingList.innerText = "Following: " + userFollow.join(", ");
            followBox.appendChild(followingList);
        })
    }

    const followed = document.createElement("p");
    followed.innerText = "Followed by: " + json.followed_num + " people";
    infoBox.appendChild(followed);

    const posts = document.createElement("p");
    if (json.posts.length === 0) {
        posts.innerText = "Posts: None!"
        infoBox.appendChild(posts);
        return;
    }
    posts.innerText = "Posts:";
    infoBox.appendChild(posts);

    for (let i = 0; i < json.posts.length; i++) {
        getPost(url, token, modalContent, json.posts[i], errorMsg, errorModal, userProfile);
    }
}

async function getPost(url, token, container, id, errorMsg, errorModal, userProfile) {
    const response = await fetch(url + `/post/?id=${id}`, {
        method: "GET",
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
        renderProfilePost(token, json, url, container, errorMsg, errorModal, userProfile);
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

// renders the user's posts on their profile
function renderProfilePost(token, element, url, container, errorMsg, errorModal, userProfile) {
    const postBox = document.createElement("div");
    postBox.className = "post-box";
    postBox.id = element.id;

    // if this is rendering feed for user's own profile, contain edit and delete buttons
    if (userProfile === true) {
        const editBar = document.createElement("div");
        editBar.className = "edit-bar";
        postBox.appendChild(editBar);

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerText = "Edit";
        editBtn.onclick = () => renderEditPost(token, url, element, container, errorMsg, errorModal);
        editBar.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = () => deletePost(token, url, element.id, errorMsg, errorModal);
        editBar.appendChild(deleteBtn);
    }

    // render post header
    const feedPost = false;
    postBox.appendChild(renderPostHeader(token, element, url, container, errorMsg, errorModal, feedPost));

    // render description
    postBox.appendChild(renderPostDescription(element));

    // if there is an image, render it
    if (element.src) {
        postBox.appendChild(renderPostImg(element));
    }
    // render post footer
    postBox.appendChild(renderPostFooter(token, element, url, errorMsg, errorModal));

    container.appendChild(postBox);
}

// make api call to make a comment
async function writeCommentAttempt(token, url, id, commentBody) {
    const response = await fetch(url + `/post/comment?id=${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
        },
        body: JSON.stringify({ comment: commentBody })
    })
    .then(response => {
        if (response.ok) { // if status code is 200
            return response.json();
        } else { // if status code is not 200 
            return Promise.reject(response.json());
        }
    })
    .then(responseJson => { 
        alert("Made a comment!");
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

// renders the modal to edit a post
function renderEditPost(token, url, element, container, errorMsg, errorModal) {
    // create a modal to edit a post
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

    const description = document.createElement("input");
    description.className = "edit-desc-input";
    description.value = element.meta.description_text;
    modalContent.appendChild(description);

    const update = document.createElement("button");
    update.className = "edit-update-btn";
    update.innerText = "Update";
    update.onclick = () => editPost(token, url, element.id, description.value, element.src, errorMsg, errorModal);
    modalContent.appendChild(update);
}

async function editPost(token, url, id, description, srcImg, errorMsg, errorModal) {
    const response = await fetch(url + `/post/?id=${id}`, {
        method: "PUT",
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
        alert("Updated Post!");
    })
    .catch(error => { 
        Promise.resolve(error)
        .then(function(e) {
            // display error message in a modal
            errorMsg.innerText = e.message;
            errorModal.style.display = "block";
        });
    });
}

// make api call to delete post
async function deletePost(token, url, id, errorMsg, errorModal) {
    const response = await fetch(url + `/post/?id=${id}`, {
        method: "DELETE",
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
    .then(responseJson => { 
        alert("Deleted Post!");
    })
    .catch(error => { 
        Promise.resolve(error)
        .then(function(e) {
            // display error message in a modal
            errorMsg.innerText = e.message;
            errorModal.style.display = "block";
        });
    });
}