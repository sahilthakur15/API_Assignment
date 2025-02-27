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

        // Click event to navigate to user details page
        userCard.addEventListener("click", () => {
            window.location.href = `user-details.html?id=${user.id}`;
        });

        // Append the user card to the grid
        userGrid.appendChild(userCard);
    });
}

fetchUsers();
