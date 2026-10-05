const fieldsToShow = [

    // =========================================================
    // SECTION 1: RISK INFORMATION
    // =========================================================
    { key: "RiskId", label: "Risk ID" },
    { key: "RegisteredDate", label: "Registered Date" },
    { key: "RiskDate", label: "Risk Date" },
    { key: "IdentifiedRisk", label: "Bussiness unit" },
    { key: "SourceOfRisk", label: "Source of Risk" },
    { key: "RiskCategory", label: "Risk Category" },
    { key: "RiskSubCategory", label: "Risk Sub Category" },
    { key: "RiskEvent", label: "Risk Event" },
    { key: "RiskEventDescription", label: "Risk Event Description" },

    // =========================================================
    // SECTION 2: RISK ASSESSMENT
    // =========================================================
    { key: "Effect", label: "Effect" },
    { key: "Probability", label: "Probability" },
    { key: "ImpactLevel", label: "Impact Level" },
    { key: "InherentRiskRating", label: "Inherent Risk Rating" },
    { key: "ResidualRiskLevel", label: "Residual Risk Level" },

    // =========================================================
    // SECTION 3: MITIGATION & CONTROLS
    // =========================================================
    { key: "ExistingRiskMitigation", label: "Existing Risk Mitigation" },
    { key: "MitigationRating", label: "Mitigation Rating" },
    { key: "Recommendation", label: "Recommendation" },

    // =========================================================
    // SECTION 4: OWNERSHIP & PLANNING
    // =========================================================
    { key: "MitigationPlannedDate", label: "Mitigation Planned Date" },
    { key: "RiskOwner", label: "Risk Owner" },
    { key: "Status", label: "Status" },

    // =========================================================
    // SECTION 5: BRANCH INFORMATION
    // =========================================================
    { key: "BranchId", label: "Branch ID" },
    { key: "BranchName", label: "Branch Name" },

    // =========================================================
    // SECTION 6: AUDIT / APPROVAL INFORMATION
    // =========================================================
    { key: "RegisteredBy", label: "Registered By" },
    { key: "ApprovedBy", label: "Approved By" },
    { key: "ApprovedDate", label: "Approved Date" },

    // =========================================================
    // SECTION 7: ATTACHMENT
    // =========================================================
    { key: "FilePath", label: "Attachment" }
];

let currentUser = null;

$(document).on('click', '.view-btn', function () {

    const user = $(this).data('user');

    currentUser = user;

    // Validate data
    if (!user) {
        Swal.fire(
            'Error',
            'Risk data is missing.',
            'error'
        );
        return;
    }

    if (!user.Status) {
        Swal.fire(
            'Error',
            'Risk status is missing.',
            'error'
        );
        return;
    }

    let html = "";

    fieldsToShow.forEach(field => {

        // Get field value
        const value = user[field.key];

        let displayValue = value ?? "";

        // =====================================================
        // FORMAT DATES
        // =====================================================
        if (
            field.key === "RegisteredDate" ||
            field.key === "RiskDate" ||
            field.key === "MitigationPlannedDate" ||
            field.key === "ApprovedDate"
        ) {
            if (value) {
                const date = new Date(value);

                if (!isNaN(date.getTime())) {
                    displayValue = date.toLocaleDateString();
                }
            }
        }

        // =====================================================
        // EMPTY VALUE
        // =====================================================
        if (
            displayValue === null ||
            displayValue === undefined ||
            displayValue === ""
        ) {
            displayValue = "-";
        }

        // =====================================================
        // DISPLAY FIELD
        // =====================================================
        html += `
            <div class="col-md-6">
                <div class="border-bottom py-2 px-1">

                    <span class="fw-semibold">
                        ${field.label}:
                    </span>

                    <span class="ms-1 text-muted">
                        ${displayValue}
                    </span>

                </div>
            </div>
        `;
    });

    // =========================================================
    // MODAL FOOTER
    // =========================================================

    const footerHtml = `
        <button
            type="button"
            class="btn btn-success"
            data-bs-dismiss="modal">
            OK
        </button>
    `;

    // =========================================================
    // LOAD MODAL
    // =========================================================

    $("#editModalContent").html(html);
    $("#editModalFooter").html(footerHtml);

    $("#editModal").modal("show");
});

