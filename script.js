// Fetch users from API
async function fetchUsers() {
    try {
        let response = await fetch("https://jsonplaceholder.typicode.com/users");
        let users = await response.json(); 
        displayUsers(users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Display users in the grid
function displayUsers(users) {
    const userGrid = document.getElementById("userGrid");
    userGrid.innerHTML = ""; // Clear previous users

    users.forEach(user => {
        let userCard = document.createElement("div");
        userCard.classList.add("user-card");

         // Generate avatar using DiceBear (Bitmoji-style avatars)
         let avatarUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`;

         userCard.innerHTML = `
             <img src="${avatarUrl}" alt="${user.name}">
             <p>${user.name}</p>
         `;

        // Click event to open modal with details
        userCard.addEventListener("click", () => showUserDetails(user));
        userGrid.appendChild(userCard);
    });
}

// Show modal with user details
function showUserDetails(user) {
    const modal = document.getElementById("userModal");
    const modalContent = document.getElementById("modalContent");

    modalContent.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <p><strong>City:</strong> ${user.address.city}</p>
    `;

    modal.style.display = "flex"; // Show modal only when user clicks a card
}

// Close modal
function closeModal() {
    document.getElementById("userModal").style.display = "none";
}

// Close modal when clicking outside the box
window.onclick = function (event) {
    let modal = document.getElementById("userModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Ensure modal is hidden when the page loads
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("userModal").style.display = "none";
});

// Fetch users when the page loads
fetchUsers();
