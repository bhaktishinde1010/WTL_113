var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const loadButton = document.getElementById("loadUsers");
const tableBody = document.querySelector("#userTable tbody");
let users = [];
let sortDirection = true;
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("backend.php");
            users = yield response.json();
            displayUsers(users);
        }
        catch (error) {
            console.error("Error fetching users:", error);
        }
    });
}
function displayUsers(data) {
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
function sortTable(key) {
    users.sort((a, b) => {
        if (a[key] < b[key])
            return sortDirection ? -1 : 1;
        if (a[key] > b[key])
            return sortDirection ? 1 : -1;
        return 0;
    });
    sortDirection = !sortDirection;
    displayUsers(users);
}
loadButton.addEventListener("click", fetchUsers);
// Add sorting on header click
document.querySelectorAll("th").forEach(th => {
    th.addEventListener("click", () => {
        const key = th.getAttribute("data-key");
        sortTable(key);
    });
});
