
const fieldsToShow = [

    // =========================================================
    // SECTION 1: RISK INFORMATION
    // =========================================================
    { key: "RiskId", label: "Risk ID" },
    { key: "RegisteredDate", label: "Registered Date" },
    { key: "RiskDate", label: "Risk Date" },
    { key: "IdentifiedRisk", label: "Identified Risk" },
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


// =============================================================
// OPEN RISK DETAILS
// =============================================================

$(document).on('click', '.approveBtn', function () {

    const user = $(this).data('user');

    currentUser = user;

    // ---------------------------------------------------------
    // Validate user data
    // ---------------------------------------------------------

    if (!user) {
        Swal.fire(
            'Error',
            'Risk data is missing.',
            'error'
        );
        return;
    }

    if (!user.RiskId) {
        Swal.fire(
            'Error',
            'Risk ID is missing.',
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


    // =========================================================
    // BUILD RISK DETAILS
    // =========================================================

    let html = "";


    fieldsToShow.forEach(field => {

        const value = user[field.key];

        let displayValue = value ?? "";


        // -----------------------------------------------------
        // FORMAT DATES
        // -----------------------------------------------------

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


        // -----------------------------------------------------
        // EMPTY VALUES
        // -----------------------------------------------------

        if (
            displayValue === null ||
            displayValue === undefined ||
            displayValue === ""
        ) {
            displayValue = "-";
        }


        // -----------------------------------------------------
        // DISPLAY FIELD
        // -----------------------------------------------------

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
            class="btn btn-danger"
            id="rejectBtn"
            data-id="${user.RiskId}">

            <i class="bi bi-x-circle me-1"></i>
            Reject

        </button>


        <button
            type="button"
            class="btn btn-success"
            id="approveBtn"
            data-id="${user.RiskId}">

            <i class="bi bi-check-circle me-1"></i>
            Approve

        </button>

    `;


    // =========================================================
    // LOAD MODAL
    // =========================================================

    $("#editModalContent").html(html);

    $("#editModalFooter").html(footerHtml);

    $("#editModal").modal("show");

});


// =============================================================
// APPROVE BUTTON
// =============================================================

$(document).on('click', '#approveBtn', function () {

    if (!currentUser || !currentUser.RiskId) {

        Swal.fire(
            'Error!',
            'No risk data available.',
            'error'
        );

        return;
    }


    Swal.fire({

        title: 'Are you sure?',

        text: `You are about to approve risk ${currentUser.RiskId}.`,

        icon: 'warning',

        showCancelButton: true,

        confirmButtonColor: '#198754',

        cancelButtonColor: '#d33',

        confirmButtonText: 'Yes, approve it!',

        cancelButtonText: 'Cancel'

    }).then((result) => {

        if (!result.isConfirmed) {
            return;
        }


        // =====================================================
        // APPROVE REQUEST
        // =====================================================

        $.ajax({

            url: '/Checker/approve',

            type: 'POST',

            contentType: 'application/json',

            data: JSON.stringify({
                RiskId: currentUser.RiskId
            }),


            success: function (response) {

                Swal.fire(

                    'Approved!',

                    'Request ' +
                    currentUser.RiskId +
                    ' has been approved.',

                    'success'

                ).then(() => {

                    $('#editModal').modal('hide');

                    location.reload();

                });

            },


            error: function (xhr, status, error) {

                console.error('Approval Error:', {
                    status: status,
                    xhr: xhr,
                    error: error,
                    responseText: xhr.responseText
                });


                let message =
                    'Something went wrong while approving the request.';


                if (xhr.responseText) {

                    try {

                        const response =
                            JSON.parse(xhr.responseText);

                        if (response.message) {
                            message = response.message;
                        }

                    }
                    catch {

                        message = xhr.responseText;

                    }

                }


                Swal.fire(
                    'Error!',
                    message,
                    'error'
                );

            }

        });

    });

});


// =============================================================
// REJECT BUTTON
// =============================================================

$(document).on('click', '#rejectBtn', function () {

    if (!currentUser || !currentUser.RiskId) {

        Swal.fire(
            'Error!',
            'No risk data available.',
            'error'
        );

        return;
    }


    Swal.fire({

        title: 'Reject Request',

        input: 'textarea',

        inputLabel: 'Enter reason for rejection:',

        inputPlaceholder:
            'Type your reason here...',

        inputAttributes: {
            'aria-label': 'Reason'
        },


        inputValidator: (value) => {

            if (!value || !value.trim()) {

                return 'You must provide a reason!';

            }

        },


        showCancelButton: true,

        confirmButtonText:
            'Submit Rejection',

        confirmButtonColor:
            '#dc3545',

        cancelButtonColor:
            '#6c757d',


        target:
            document.getElementById('editModal'),


        didOpen: () => {

            const input =
                Swal.getInput();

            if (input) {
                input.focus();
            }

        }

    }).then((result) => {

        if (!result.isConfirmed) {
            return;
        }


        const reason =
            result.value?.trim();


        // =====================================================
        // VALIDATE REASON
        // =====================================================

        if (!reason) {

            Swal.fire(
                'Validation Error',
                'Rejection reason is required.',
                'warning'
            );

            return;
        }


        // =====================================================
        // REJECT REQUEST
        // =====================================================

        $.ajax({

            url: '/Checker/reject',

            type: 'POST',

            contentType: 'application/json',

            data: JSON.stringify({

                RiskId:
                    currentUser.RiskId,

                reason:
                    reason

            }),


            success: function (response) {

                Swal.fire(

                    'Rejected!',

                    'Request ' +
                    currentUser.RiskId +
                    ' has been rejected.',

                    'success'

                ).then(() => {

                    $('#editModal').modal('hide');

                    location.reload();

                });

            },


            error: function (xhr, status, error) {

                console.error(
                    'Rejection Error:',
                    {
                        status: status,
                        xhr: xhr,
                        error: error,
                        responseText:
                            xhr.responseText
                    }
                );


                let message =
                    'Something went wrong while rejecting.';


                if (xhr.responseText) {

                    try {

                        const response =
                            JSON.parse(
                                xhr.responseText
                            );


                        if (response.message) {

                            message =
                                response.message;

                        }

                    }
                    catch {

                        message =
                            xhr.responseText;

                    }

                }


                Swal.fire(
                    'Error!',
                    message,
                    'error'
                );

            }

        });

    });

});

