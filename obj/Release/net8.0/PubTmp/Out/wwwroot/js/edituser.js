const fieldsToShow = [

    { key: "Id", label: "User Id" },
    { key: "FullName", label: "Full Name" },
    { key: "Email", label: "Email" },
    { key: "Phone", label: "Phone" },
    { key: "Role", label: "Role" },
    { key: "Status", label: "User Status" },
    { key: "CreatedOn", label: "Created On" },
];

const userRoles = [
    { value: "Maker", text: "Maker" },
    { value: "Checker", text: "Checker" },
    { value: "Admin", text: "Admin" }
];

const fieldIcons = {
    FullName: "bi bi-person",
    Email: "bi bi-envelope",
    Phone: "bi bi-telephone",
    Role: "bi bi-shield-lock",
    Status: "bi bi-toggle-on",
    CreatedOn: "bi bi-calendar",
};

$(document).on('click', '.edit-btn', function () {

    const user = $(this).data('user');

    if (!user || !user.Status) {
        Swal.fire('Error', 'User data or status is missing.', 'error');
        return;
    }

    let html = "";

    fieldsToShow.forEach(field => {

        const value = user[field.key] ?? "";

        // Skip ID
        if (field.key === "Id")
            return;

        // ===========================
        // READ ONLY FIELD
        // ===========================
        if (field.key === "CreatedOn") {

            let displayValue = "";

            if (value) {
                displayValue = new Date(value).toLocaleDateString();
            }

            html += `
            <div class="col-md-6">
                <div class="profile-card">

                    <label class="profile-label">
                        <i class="${fieldIcons[field.key]}"></i>
                        ${field.label}
                    </label>

                    <div class="form-control bg-light d-flex align-items-center">
                        ${displayValue}
                    </div>

                </div>
            </div>`;

            return;
        }

        // ===========================
        // ROLE
        // ===========================
        if (field.key === "Role") {

            html += `
            <div class="col-md-6">
                <div class="profile-card">

                    <label class="profile-label">
                        <i class="${fieldIcons[field.key]}"></i>
                        ${field.label}
                    </label>

                    ${roleSelect(field.key, value)}

                </div>
            </div>`;

            return;
        }

        // ===========================
        // STATUS
        // ===========================
        if (field.key === "Status") {

            const isChecked = Number(value) === 1 ? "checked" : "";
            const badgeClass = Number(value) === 1 ? "bg-success" : "bg-secondary";
            const statusText = Number(value) === 1 ? "Active" : "Inactive";

            html += `
            <div class="col-md-6">

                <div class="profile-card">

                    <label class="profile-label">
                        <i class="${fieldIcons[field.key]}"></i>
                        ${field.label}
                    </label>

                    <div class="d-flex align-items-center justify-content-between mt-3">

                        <div class="form-check form-switch fs-5 m-0">

                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="statusToggle"
                                name="Status"
                                value="1"
                                ${isChecked}>

                        </div>

                        <span id="statusText"
                              class="badge ${badgeClass} px-3 py-2 rounded-pill">
                              ${statusText}
                        </span>

                    </div>

                </div>

            </div>`;

            return;
        }

        // ===========================
        // NORMAL INPUTS
        // ===========================
        html += `
        <div class="col-md-6">

            <div class="profile-card">

                <label class="profile-label">
                    <i class="${fieldIcons[field.key]}"></i>
                    ${field.label}
                </label>

                <input
                    type="text"
                    class="form-control"
                    name="${field.key}"
                    value="${value}">

            </div>

        </div>`;

    });

    // ===========================
    // Footer
    // ===========================

    const footerHtml = `

<button
    type="button"
    class="btn btn-danger btn-cancel px-4"
    data-bs-dismiss="modal">

    <i class="bi bi-x-circle me-2"></i>

    Cancel

</button>

<button
    type="button"
    class="btn btn-success btn-save px-4"
    id="saveChangesBtn"
    data-id="${user.Id}">

    <i class="bi bi-check-circle me-2"></i>

    Save Changes

</button>

`;

    // ===========================
    // Update Profile Header
    // ===========================

    $("#profileName").text(user.FullName);
    $("#profileEmail").text(user.Email);

    const initials = user.FullName
        .split(" ")
        .map(x => x.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

    $("#profileAvatar").text(initials);

    // ===========================
    // Render
    // ===========================

    $("#editModalContent").html(html);
    $("#editModalFooter").html(footerHtml);

    $("#editModal").modal("show");

});

document.addEventListener('click', function (event) {

    if (event.target && event.target.id === 'saveChangesBtn') {

        const Id = event.target.getAttribute('data-id');

        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save the changes?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Save it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {

            if (!result.isConfirmed)
                return;

            const updatedData = {
                Id: Id,
                FullName: document.querySelector('[name="FullName"]').value,
                Email: document.querySelector('[name="Email"]').value,
                Phone: document.querySelector('[name="Phone"]').value,
                Role: document.querySelector('[name="Role"]').value,
                Status: document.querySelector('#statusToggle').checked ? "1" : "0"
            };



            console.log("Sending to backend:", updatedData);

            try {

                const response = await fetch('/Admin/edituser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                });

                const result = await response.json();

                console.log("Backend Response:", result);

                if (!response.ok) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Request Failed',
                        text: result.message || 'Bad Request'
                    });

                    return;
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: result.message
                }).then(() => {
                    location.reload();
                });

            }
            catch (err) {

                console.error(err);

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong.'
                });
            }

        });

    }

});

$(document).on("change", "#statusToggle", function () {
    $("#statusText").text(this.checked ? "On" : "Off");
});

function roleSelect(name, value) {
    return `
        <select class="form-control mt-1" name="${name}">
            ${userRoles.map(c => `
                <option value="${c.value}" ${value === c.value ? 'selected' : ''}>
                    ${c.text}
                </option>
            `).join('')}
        </select>
    `;
}
