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

    // SECTION 5: Recorded by
     { key: "RegisteredBy", label: "Registered By" },
    /*{ key: "RegisteredDate", label: "Registered Date" }, */

];

let currentUser = null;

$(document).on('click', '.approveBtn', function () {

    const user = $(this).data('user');
    currentUser = user;
    if (!user || !user.Status) {
        Swal.fire('Error', 'User data or status is missing.', 'error');
        return;
    }

    let html = "";

    fieldsToShow.forEach(field => {

        const value = user[field.key] ?? "";

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
        

    });

    let footerHtml = "";

  

        footerHtml = `
            <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal">
                Reject
            </button>

            <button
                type="button"
                class="btn btn-success"
                id="approveBtn"
                data-id="${user.RiskId}">
                Approve
            </button>`;

    

    $("#editModalContent").html(html);
    $("#editModalFooter").html(footerHtml);

    $("#editModal").modal("show");

});

// APPROVE BUTTON HANDLER - Attached once outside view-btn click
$(document).on('click', '#approveBtn', function () {
    if (!currentUser) {
        Swal.fire('Error!', 'No user data available', 'error');
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to approve this request.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#198754',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, approve it!'
    }).then((result) => {
        if (result.isConfirmed) {
            
            $.ajax({
                url: '/Checker/approve',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    RiskId: currentUser.RiskId
                    
                }),
                success: function (response) {
                    Swal.fire('Approved!', 'Request ' + currentUser.RiskId + ' has been approved.', 'success')
                        .then(() => {
                            $('#viewModal').modal('hide');
                            location.reload();
                        });
                },
                error: function () {
                    Swal.fire('Error!', 'Something went wrong.', 'error');
                }
            });
        }
    });
});

// REJECT BUTTON HANDLER - Attached once outside view-btn click
$(document).on('click', '#rejectBtn', function () {
    if (!currentUser) {
        Swal.fire('Error!', 'No user data available', 'error');
        return;
    }

    Swal.fire({
        title: 'Reject Request',
        input: 'textarea',
        inputLabel: 'Enter reason for rejection:',
        inputPlaceholder: 'Type your reason here...',
        inputAttributes: {
            'aria-label': 'Reason'
        },
        inputValidator: (value) => {
            if (!value.trim()) {
                return 'You must provide a reason!';
            }
        },
        showCancelButton: true,
        confirmButtonText: 'Submit Rejection',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#dc3545',
        target: document.getElementById('viewModal'),
        didOpen: () => {
            Swal.getInput().focus();
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const reason = result.value;
            const rejectedBy = document.getElementById("verifiedBy").value;

            if (!rejectedBy || !reason.trim()) {
                Swal.fire('Validation Error', 'Both "Rejected By" and "Reason" are required.', 'warning');
                return;
            }

            $.ajax({
                url: '/reject',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    queueNumber: currentUser.QueueNumber,
                    rejectedBy: rejectedBy,
                    reason: reason
                }),
                success: function () {
                    Swal.fire('Rejected!', 'Request ' + currentUser.QueueNumber + ' has been rejected.', 'success')
                        .then(() => {
                            $('#viewModal').modal('hide');
                            location.reload();
                        });
                },
                error: function (xhr, status, error) {
                    console.error('Rejection Error:', {
                        status: status,
                        xhr: xhr,
                        error: error,
                        responseText: xhr.responseText
                    });

                    let message = "Something went wrong while rejecting.";
                    if (xhr.responseText) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.message) {
                                message = response.message;
                            }
                        } catch {
                            message = xhr.responseText;
                        }
                    }

                    Swal.fire('Error!', message, 'error');
                }
            });
        }
    });
});
