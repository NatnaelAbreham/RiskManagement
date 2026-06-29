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

$(document).on('click', '.edit-btn', async function () {


    const user = $(this).data('user');
    if (!user || !user.Status) {
        alert('User data or status missing!');
        return;
    }

    const status = user.Status.trim().toLowerCase();
    const isEditable = status === 'pending' || status === 'rejected';

    let html = '';

    fieldsToShow.forEach(field => {
        const value = user[field.key] ?? '-';

        // Handle dropdowns for specific fields
        if (isEditable && !["RiskId",  "RegisteredDate"].includes(field.key)) {

            if (field.key === "RiskCategory") {

                html += `
        <div class="col-md-6">
            <div class="border-bottom py-2 px-1">
                <label class="fw-semibold text-dark">${field.label}:</label>

                ${renderRiskCategorySelect(field.key, value)}
            </div>
        </div>
    `;
            } else if (field.key === "ImpactLevel") {
                html += `
<div class="col-md-6">
    <div class="border-bottom py-2 px-1">
        <label class="fw-semibold text-dark">${field.label}:</label>

        ${renderSelect(impactLevels, "ImpactLevel", value, "form-select modern-input", true)}
    </div>
</div>
`;
            } else if (field.key === "RiskRating") {
                html += `
<div class="col-md-6">
    <div class="border-bottom py-2 px-1">
        <label class="fw-semibold text-dark">${field.label}:</label>

        ${renderSelect(riskRatings, "RiskRating", value, "form-select modern-input", true)}
    </div>
</div>
`;
            }
            else if (field.key === "MitigationRating") {
                html += `
<div class="col-md-6">
    <div class="border-bottom py-2 px-1">
        <label class="fw-semibold text-dark">${field.label}:</label>

        ${renderMitigationRatingSelect(field.key, value)}
    </div>
</div>
`;
            } else if (field.key === "Status") {
                html += `
<div class="col-md-6">
    <div class="border-bottom py-2 px-1">
        <label class="fw-semibold text-dark">${field.label}:</label>

        ${renderSelect(statusOptions, "Status", value)}
    </div>
</div>
`;
            }
            else {
                // Default text input
                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold text-dark">${field.label}:</label>
                        <input type="text" class="form-control mt-1" name="${field.key}" value="${value}">
                    </div>
                </div>
            `;
            }

        } else {
            let displayValue = value;
            // Format date field
            if (field.key === "RegisteredOn" || field.key === "MitigationPlannedDate" || field.key === "RiskDate") {
                if (value != '-') {
                    const date = new Date(value);
                    displayValue = date.toLocaleDateString(); // default format: MM/DD/YYYY

                }

            }

            // Read-only view
            html += `
        <div class="col-md-6">
            <div class="border-bottom py-2 px-1">
                <span class="fw-semibold text-dark">${field.label}:</span>
                <span class="ms-1 text-muted">${displayValue}</span>
            </div>
        </div>
    `;
        }

    });


    if (isEditable) {
        if (isEditable) {
            html += `
        <div class="col-12 d-flex justify-content-center mt-3">
            <button class="btn btn-success me-3" id="saveChangesBtn" data-id="${user.RiskId}">Save Changes</button>
            <button class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
        </div>
    `;
        }


    } else {
        html += `
            <div class="col-12 mt-3 text-center">
                <div class="text-danger fw-bold mb-3">Verified or approved records cannot be edited.</div>
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
            </div>
        `;
    }



    $('#editModalContent').html(html);
    $('#editModal').modal('show');
});

document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'saveChangesBtn') {
        const queueNumber = event.target.getAttribute('data-id');

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to save the changes?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedData = {
                    RiskId: RiskId,
                };

                fieldsToShow.forEach(field => {
                    const inputElement = document.querySelector(`[name="${field.key}"]`);

                });

                // Add this line to debug
                console.log("Data to be sent to backend:", updatedData);

                fetch('/updaterisk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log("Response from backend:", data);
                        if (data.success) {
                            Swal.fire('Saved!', 'Changes have been saved successfully', 'success')
                                .then(() => location.reload());
                        } else {
                            Swal.fire('Error!', 'Failed to save changes', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('Error!', 'Something went wrong.', 'error');
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










