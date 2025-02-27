// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");

// Fetch user details
async function fetchUserDetails() {
    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error("User not found");

        let user = await response.json();
        let avatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`;

        document.getElementById("userAvatar").src = avatarUrl;
        document.getElementById("userDetails").innerHTML = `
            <h3>${user.name}</h3>
            <p><i class="fas fa-envelope"></i> ${user.email}</p>
            <p><i class="fas fa-phone"></i> ${user.phone}</p>
            <p><i class="fas fa-globe"></i> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            <p><i class="fas fa-building"></i> ${user.company.name}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${user.address.city}</p>
        `;
    } catch (error) {
        console.error("Error fetching user details:", error);
        document.getElementById("userDetails").innerHTML = `<p class="error">User details could not be loaded.</p>`;
    }
}

// Fetch user posts
async function fetchUserPosts() {
    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) throw new Error("Posts not found");

        let posts = await response.json();
        let postsContainer = document.getElementById("userPosts");
        postsContainer.innerHTML = "";

        if (posts.length === 0) {
            postsContainer.innerHTML = `<p class="error">No posts available.</p>`;
            return;
        }

        for (let post of posts) {
            // Fetch comments for each post to get the comment count
            let commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
            let comments = await commentsResponse.json();
            let commentCount = comments.length;

            // Add post to DOM with comment count
            addPostToDOM(post, commentCount);
        }
    } catch (error) {
        console.error("Error fetching user posts:", error);
        document.getElementById("userPosts").innerHTML = `<p class="error">Posts could not be loaded.</p>`;
    }
}

// Add a new post function
async function addNewPost() {
    let title = prompt("Enter post title:");
    let body = prompt("Enter post content:");

    if (title && body) {
        try {
            let response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body, userId })
            });

            if (!response.ok) throw new Error("Failed to add post.");

            let newPost = await response.json();
            newPost.id = Date.now(); // Simulate a unique ID (since API doesn’t actually store posts)

            addPostToDOM(newPost, 0); // Add post dynamically with 0 comments initially
            alert("Post added successfully!");
        } catch (error) {
            alert(error.message);
        }
    }
}

// Function to add a post to the DOM
function addPostToDOM(post, commentCount) {
    let postsContainer = document.getElementById("userPosts");

    let postCard = document.createElement("div");
    postCard.classList.add("post");
    postCard.id = `post-${post.id}`;

    let imageUrl = `https://picsum.photos/600/300?random=${post.id}`;

    postCard.innerHTML = `
        <img src="${imageUrl}" alt="Post Image" class="post-image">
        <h4 id="post-title-${post.id}">${post.title}</h4>
        <p id="post-body-${post.id}">${post.body}</p>
        <div class="post-footer">
            <i class="fas fa-heart like-icon"></i>
            <div class="comment-wrapper">
                <i class="fas fa-comment comment-icon" data-post-id="${post.id}"></i>
                <span class="comment-count">${commentCount}</span>
            </div>
            <i class="fas fa-share share-icon"></i>
            <i class="fas fa-pen-to-square edit-icon" onclick="editPost(${post.id})"></i>
            <i class="fas fa-trash delete-icon" onclick="deletePost(${post.id})"></i>
        </div>
    `;

    postsContainer.prepend(postCard);

    document.querySelectorAll(".comment-icon").forEach(icon => {
        icon.addEventListener("click", function () {
            let postId = this.getAttribute("data-post-id");
            openCommentModal(postId);
        });
    });
}

// Edit Post Function
async function editPost(postId) {
    let newTitle = prompt("Edit Post Title:");
    let newBody = prompt("Edit Post Content:");

    if (newTitle && newBody) {
        try {
            let response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, body: newBody })
            });

            if (!response.ok) throw new Error("Failed to update post.");

            document.getElementById(`post-title-${postId}`).innerText = newTitle;
            document.getElementById(`post-body-${postId}`).innerText = newBody;
            alert("Post updated successfully!");
        } catch (error) {
            alert(error.message);
        }
    }
}

// Delete Post Function
async function deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        try {
            let response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, { method: "DELETE" });

            if (!response.ok) throw new Error("Failed to delete post.");

            document.getElementById(`post-${postId}`).remove();
            alert("Post deleted successfully!");
        } catch (error) {
            alert(error.message);
        }
    }
}

// Open Comment Modal
async function openCommentModal(postId) {
    let modal = document.getElementById("commentModal");
    let modalComments = document.getElementById("modalComments");

    if (!modal || !modalComments) return;

    modal.style.display = "flex";
    modal.classList.add("show");
    modalComments.innerHTML = `<p class="loading">Loading comments...</p>`;

    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!response.ok) throw new Error("Comments not found");

        let comments = await response.json();
        modalComments.innerHTML = "";

        comments.forEach(comment => {
            let commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.innerHTML = `<p><strong>${comment.name}</strong>: ${comment.body}</p>`;
            modalComments.appendChild(commentElement);
        });

        // Update comment count in the post footer
        let commentCountElement = document.querySelector(`#post-${postId} .comment-count`);
        if (commentCountElement) {
            commentCountElement.innerText = comments.length;
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        modalComments.innerHTML = `<p class="error">Comments could not be loaded.</p>`;
    }
}

// Close Comment Modal
function closeModal() {
    let modal = document.getElementById("commentModal");
    if (modal) {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 200);
    }
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
    let modal = document.getElementById("commentModal");
    if (event.target === modal) {
        closeModal();
    }
});

// Ensure modal is hidden on page load
document.addEventListener("DOMContentLoaded", () => {
    let modal = document.getElementById("commentModal");
    if (modal) modal.style.display = "none";

    // Add "Add Post" button
    let addPostBtn = document.createElement("button");
    addPostBtn.innerText = "➕ Add New Post";
    addPostBtn.classList.add("add-post-btn");
    addPostBtn.onclick = addNewPost;
    document.getElementById("userPosts").before(addPostBtn);
});

// Load user details and posts
fetchUserDetails();
fetchUserPosts();