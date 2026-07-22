const fieldsToShow = [
    
    { key: "FullName", label: "Full Name" },
    { key: "Email", label: "Email" },
    { key: "Phone", label: "Phone" },
    { key: "Status", label: "User Status" },
    { key: "Role", label: "Role" },
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

        if (!["CreatedOn"].includes(field.key)) {

            if (field.key === "userRoles") {

                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold">${field.label}</label>
                        ${roleSelect(field.key, value)}
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

    if (isEditable) {

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
                data-id="${user.RiskId}">
                Save Changes
            </button>`;

    } else {

        html += `
        <div class="col-12">
            <div class="alert alert-warning text-center mb-0">
                 Approved records cannot be edited.
            </div>
        </div>`;

        footerHtml = `
            <button
                type="button"
                class="btn btn-success"
                data-bs-dismiss="modal">
                OK
            </button>`;
    }

    $("#editModalContent").html(html);
    $("#editModalFooter").html(footerHtml);

    $("#editModal").modal("show");

});

document.addEventListener('click', function (event) {

    if (event.target && event.target.id === 'saveChangesBtn') {

        const RiskId = event.target.getAttribute('data-id');

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
                RiskId: RiskId
            };

            // Read all editable controls
            fieldsToShow.forEach(field => {

                if (field.key === "RiskId" || field.key === "RegisteredDate")
                    return;

                const element = document.querySelector(`[name="${field.key}"]`);

                if (!element)
                    return;

                let value = element.value;

                // Convert decimal fields
                if (field.key === "Probability" || field.key === "RiskScore") {
                    value = value === "" ? 0 : parseFloat(value);
                }

                updatedData[field.key] = value;
            });

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

function roleSelect(name, value) {
    return `
        <select class="form-control mt-1" name="${name}">
            ${riskCategories.map(c => `
                <option value="${c.value}" ${value === c.value ? 'selected' : ''}>
                    ${c.text}
                </option>
            `).join('')}
        </select>
    `;
}
