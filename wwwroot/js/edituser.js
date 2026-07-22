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

$(document).on('click', '.edit-btn', function () {

    const user = $(this).data('user');

    if (!user || !user.Status) {
        Swal.fire('Error', 'User data or status is missing.', 'error');
        return;
    }

    const status = user.Status.trim().toLowerCase();

    let html = "";

    fieldsToShow.forEach(field => {

        const value = user[field.key] ?? "";

        let inputType = "text";
        let inputValue = value;
        let extra = "";

        if (!["CreatedOn"].includes(field.key)) {

            if (field.key === "Role") {


                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold">${field.label}</label>
                        ${roleSelect(field.key, value)}
                    </div>
                </div>`;

                return;
            } if (field.key === "Id") {

                return;
            } if (field.key === "Status") {

                const isChecked = Number(value) === 1 ? "checked" : "";

                html += `
    <div class="col-md-6">
        <div class="border-bottom py-2 px-1">
            <label class="fw-semibold">${field.label}</label>

            <div class="form-check form-switch mt-2">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="statusToggle"
                    name="Status"
                    value="1"
                    ${isChecked}>
                <label class="form-check-label" for="statusToggle">
                    <span id="statusText">${Number(value) === 1 ? "On" : "Off"}</span>
                </label>
            </div>
        </div>
    </div>`;

                return;
            }


            html += `
            <div class="col-md-6">
                <div class="border-bottom py-2 px-1">
                    <label class="fw-semibold">${field.label}</label>

                    <input
                        type="${inputType}"
                        class="form-control mt-1"
                        name="${field.key}"
                        value="${inputValue}"
                        ${extra}>
                </div>
            </div>`;

        }
        else {

            let displayValue = value;

            // Format Dates
            if (
                field.key === "CreatedOn"
            ) {

                if (value) {
                    displayValue = new Date(value).toLocaleDateString();
                }
            }

            html += `
            <div class="col-md-6">
                <div class="border-bottom py-2 px-1">
                    <span class="fw-semibold">${field.label}:</span>
                    <span class="ms-1 text-muted">${displayValue}</span>
                </div>
            </div>`;
        }

    });

    let footerHtml = "";



    footerHtml = `
            <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal">
                Cancel
            </button>

            <button
                type="button"
                class="btn btn-success"
                id="saveChangesBtn"
                data-id="${user.Id}">
                Save Changes
            </button>`;



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
                Id: Id
            };



            console.log("Sending to backend:", updatedData);

            try {

                const response = await fetch('/Maker/editrisk', {
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
