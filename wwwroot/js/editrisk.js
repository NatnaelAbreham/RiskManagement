const fieldsToShow = [
    // SECTION 1: RISK INFORMATION
    { key: "RiskId", label: "Risk ID" },
    { key: "RegisteredDate", label: "Registered Date" },
    { key: "RiskDate", label: "Risk Date" },
    /*{ key: "IdentifiedRisk", label: "Identified Risk" },*/
    { key: "SourceOfRisk", label: "Source of Risk" },
    { key: "RiskCategory", label: "Risk Category" },
    { key: "RiskEventDescription", label: "Risk Event Description" },

    // SECTION 2: RISK ASSESSMENT
    { key: "Effect", label: "Effect" },
    { key: "Probability", label: "Probability" },
    { key: "ImpactLevel", label: "Impact Level" },
    { key: "RiskScore", label: "Risk Score" },
    { key: "RiskRating", label: "Risk Rating" },
    { key: "ResidualRiskLevel", label: "Residual Risk Level" },

    // SECTION 3: MITIGATION & CONTROLS
    { key: "ExistingRiskMitigation", label: "Existing Risk Mitigation" },
    { key: "MitigationRating", label: "Mitigation Rating" },
    { key: "Recommendation", label: "Recommendation" },

    // SECTION 4: OWNERSHIP & PLANNING
    { key: "MitigationPlannedDate", label: "Mitigation Planned Date" },
    { key: "RiskOwner", label: "Risk Owner" },
    { key: "Status", label: "Status" },



];

const riskCategories = [
    { value: "InternalFraud", text: "Internal Fraud" },
    { value: "ExternalFraud", text: "External Fraud" },
    { value: "EmploymentWorkplaceSafety", text: "Employment & Workplace Safety" },
    { value: "PropertyDamage", text: "Property Damage" },
    { value: "SystemFailureBusinessDisruption", text: "System Failure & Business Disruption" },
    { value: "ProcessManagementExecution", text: "Process Management & Execution" },
    { value: "CustomerProductRisk", text: "Customer & Product Risk" }
];
const impactLevels = [
    { value: "", text: "Select Impact" },
    { value: "Low", text: "Low" },
    { value: "Medium", text: "Medium" },
    { value: "High", text: "High" },
    { value: "Critical", text: "Critical" }
];
const riskRatings = [
    { value: "", text: "Select Rating" },
    { value: "Low", text: "Low" },
    { value: "Medium", text: "Medium" },
    { value: "High", text: "High" },
    { value: "Extreme", text: "Extreme" }
];
const mitigationRatings = [
    { value: "", text: "Select Rating" },
    { value: "VeryWeak", text: "Very Weak" },
    { value: "Weak", text: "Weak" },
    { value: "Moderate", text: "Moderate" },
    { value: "Strong", text: "Strong" },
    { value: "VeryStrong", text: "Very Strong" }
];
const statusOptions = [
    { value: "Open", text: "Open" },
    { value: "InProgress", text: "In Progress" },
    { value: "Closed", text: "Closed" }
];

$(document).on('click', '.edit-btn', function () {

    const user = $(this).data('user');

    if (!user || !user.Status) {
        Swal.fire('Error', 'User data or status is missing.', 'error');
        return;
    }

    const status = user.Status.trim().toLowerCase();
    const isEditable = status === "pending" || status === "rejected";

    let html = "";

    fieldsToShow.forEach(field => {

        const value = user[field.key] ?? "";

        if (isEditable && !["RiskId", "RegisteredDate"].includes(field.key)) {

            // ------------------------------
            // Dropdowns
            // ------------------------------

            if (field.key === "RiskCategory") {

                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold">${field.label}</label>
                        ${renderRiskCategorySelect(field.key, value)}
                    </div>
                </div>`;

                return;
            }

            if (field.key === "ImpactLevel") {

                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold">${field.label}</label>
                        ${renderSelect(impactLevels, field.key, value)}
                    </div>
                </div>`;

                return;
            }

            if (field.key === "RiskRating") {

                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold">${field.label}</label>
                        ${renderSelect(riskRatings, field.key, value)}
                    </div>
                </div>`;

                return;
            }

            if (field.key === "MitigationRating") {

                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold">${field.label}</label>
                        ${renderMitigationRatingSelect(field.key, value)}
                    </div>
                </div>`;

                return;
            }

            if (field.key === "Status") {

                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold">${field.label}</label>
                        ${renderSelect(statusOptions, field.key, value)}
                    </div>
                </div>`;

                return;
            }

            // ------------------------------
            // Decide Input Type
            // ------------------------------

            let inputType = "text";
            let inputValue = value;
            let extra = "";

            // Date Fields
            if (field.key === "RiskDate" || field.key === "MitigationPlannedDate") {

                inputType = "date";

                if (value) {
                    inputValue = new Date(value).toISOString().split("T")[0];
                }
                else {
                    inputValue = "";
                }
            }

            // Decimal Fields
            if (field.key === "Probability" || field.key === "RiskScore") {

                inputType = "number";
                extra = 'step="0.01"';
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
                field.key === "RegisteredDate" ||
                field.key === "RiskDate" ||
                field.key === "MitigationPlannedDate"
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

function renderMitigationRatingSelect(name, value) {
    return `
        <select class="form-select modern-input" id="${name}" name="${name}" required>
            ${mitigationRatings.map(r => `
                <option value="${r.value}" ${value === r.value ? 'selected' : ''}>
                    ${r.text}
                </option>
            `).join('')}
        </select>
    `;
}

function renderRiskCategorySelect(name, value) {
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
function renderSelect(options, name, value, className = "form-select modern-input", required = false) {
    return `
        <select class="${className}" id="${name}" name="${name}" ${required ? "required" : ""}>
            ${options.map(o => `
                <option value="${o.value}" ${value === o.value ? 'selected' : ''}>
                    ${o.text}
                </option>
            `).join('')}
        </select>
    `;
}

function renderSelect(options, name, value, className = "form-select modern-input", required = false) {
    return `
        <select class="${className}" id="${name}" name="${name}" ${required ? "required" : ""}>
            ${options.map(o => `
                <option value="${o.value}" ${value === o.value ? 'selected' : ''}>
                    ${o.text}
                </option>
            `).join('')}
        </select>
    `;
}
function renderSelect(options, name, value, className = "form-select modern-input", required = false) {
    return `
        <select class="${className}" id="${name}" name="${name}" ${required ? "required" : ""}>
            ${options.map(o => `
                <option value="${o.value}" ${value === o.value ? 'selected' : ''}>
                    ${o.text}
                </option>
            `).join('')}
        </select>
    `;
}










