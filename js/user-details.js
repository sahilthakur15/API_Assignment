// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");

// Fetch user details
async function fetchUserDetails() {
    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) throw new Error("User not found");

        let user = await response.json();

        // Generate avatar using DiceBear
        let avatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`;

        // Set user details in the HTML with icons
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

        posts.forEach((post, index) => {
            let postCard = document.createElement("div");
            postCard.classList.add("post");

            let imageUrl = `https://picsum.photos/600/300?random=${index}`;

            postCard.innerHTML = `
                <img src="${imageUrl}" alt="Post Image" class="post-image">
                <h4>${post.title}</h4>
                <p>${post.body}</p>
                <div class="post-footer">
                    <i class="fas fa-heart like-icon"></i>
                    <i class="fas fa-comment comment-icon" data-post-id="${post.id}"></i>
                    <i class="fas fa-share share-icon"></i>
                </div>
            `;

            postsContainer.appendChild(postCard);
        });

        // Attach event listeners for comment icons
        document.querySelectorAll(".comment-icon").forEach(icon => {
            icon.addEventListener("click", function () {
                let postId = this.getAttribute("data-post-id");
                openCommentModal(postId);
            });
        });

    } catch (error) {
        console.error("Error fetching user posts:", error);
        document.getElementById("userPosts").innerHTML = `<p class="error">Posts could not be loaded.</p>`;
    }
}

// Ensure modal is hidden initially
document.addEventListener("DOMContentLoaded", () => {
    let modal = document.getElementById("commentModal");
    modal.style.display = "none";
});

// Open Comment Modal and Fetch Comments
async function openCommentModal(postId) {
    try {
        let modal = document.getElementById("commentModal");
        let modalComments = document.getElementById("modalComments");

        // Ensure modal is hidden before showing
        if (!modal) return;

        modalComments.innerHTML = `<p class="loading">Loading comments...</p>`;
        modal.style.display = "flex"; // Show modal
        modal.classList.add("show");

        let response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!response.ok) throw new Error("Comments not found");

        let comments = await response.json();
        modalComments.innerHTML = ""; // Clear previous comments

        comments.forEach(comment => {
            let commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.innerHTML = `
                <p><strong>${comment.name}</strong>: ${comment.body}</p>
            `;
            modalComments.appendChild(commentElement);
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        document.getElementById("modalComments").innerHTML = `<p class="error">Comments could not be loaded.</p>`;
    }
}

// Close Modal
document.querySelector(".close-btn").addEventListener("click", function () {
    closeModal();
});

// Close modal when clicking outside the modal content
window.addEventListener("click", function (event) {
    let modal = document.getElementById("commentModal");
    if (event.target === modal) {
        closeModal();
    }
});

// Function to close modal
function closeModal() {
    let modal = document.getElementById("commentModal");
    if (modal) {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 200); // Delay to match fade-out effect
    }
}

// Show loading text before data loads
document.getElementById("userDetails").innerHTML = `<p class="loading">Loading user details...</p>`;
document.getElementById("userPosts").innerHTML = `<p class="loading">Loading posts...</p>`;

// Load user details and posts when the page loads
fetchUserDetails();
fetchUserPosts();
