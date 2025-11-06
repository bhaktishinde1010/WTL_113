interface User {
    name: string;
    email: string;
    role: string;
}

const loadButton = document.getElementById("loadUsers") as HTMLButtonElement;
const tableBody = document.querySelector("#userTable tbody") as HTMLTableSectionElement;
let users: User[] = [];
let sortDirection: boolean = true;

async function fetchUsers(): Promise<void> {
    try {
        const response = await fetch("backend.php");
        users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function displayUsers(data: User[]): void {
    tableBody.innerHTML = "";
    data.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
        `;
        tableBody.appendChild(row);
    });
}

function sortTable(key: keyof User): void {
    users.sort((a, b) => {
        if (a[key] < b[key]) return sortDirection ? -1 : 1;
        if (a[key] > b[key]) return sortDirection ? 1 : -1;
        return 0;
    });
    sortDirection = !sortDirection;
    displayUsers(users);
}

loadButton.addEventListener("click", fetchUsers);

// Add sorting on header click
document.querySelectorAll("th").forEach(th => {
    th.addEventListener("click", () => {
        const key = th.getAttribute("data-key") as keyof User;
        sortTable(key);
    });
});
