const fieldsToShow = [
    { key: "QueueNumber", label: "Queue Number" },
    { key: "FormDate", label: "Date" },
    { key: "Balance", label: "Account Balance" },
    { key: "Branch", label: "Branch" },
    { key: "ImporterName", label: "Importer Name" },
    { key: "ImporterNBEAcc", label: "Importer NBE Account" },
    { key: "ImporterTIN", label: "Importer TIN" },
    { key: "ImporterPhone", label: "Importer Phone" },
    { key: "PerformaNumber", label: "Performa Number" },
    { key: "Currency", label: "Currency" },
    { key: "PerformaAmount", label: "Performa Amount" },
    { key: "PerformaUSD", label: "Performa USD" },
    { key: "PaymentMethod", label: "Payment Method" },
    { key: "Priority", label: "Priority" },
    { key: "Item", label: "Item" },
    { key: "CustomerAccount", label: "Customer Account" },

    //{ key: "CreatedOn", label: "Recorded On" },
    //{ key: "FormDate", label: "Date" }
];
let branches = [];
const currencyOptions = [
    "US DOLLAR", "POUND STERLING", "SWISS FRANC", "SWEDISH KRONER",
    "NORWEGIAN KRONER", "DANISH KRONER", "DJIBOUTI FRANC", "INDIAN RUPEE",
    "KENYA SHILLING", "JAPANESE YEN", "CANADIAN DOLLAR", "AUSTRALIAN DOLLAR",
    "SAUDI RIYAL", "UAE DIRHAM", "EURO", "SOUTH AFRICA RAND", "CHINESE YUAN",
    "KUWAITI DINAR"
];

$(document).on('click', '.reason-btn', function () {
    const reason = $(this).data('reason') || 'No reason available';
    const rejectedBy = $(this).data('rejectedby') || 'Unknown';
    const rejectedOn = $(this).data('rejectedon') || 'Unknown';

    const content = `
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Rejected By:</strong> ${rejectedBy}</p>
        <p><strong>Rejected On:</strong> ${rejectedOn}</p>
    `;

    $('#reasonModalBody').html(content);
    $('#reasonModal').modal('show');
});

$(document).on('click', '.edit-btn', async function () {


    const user = $(this).data('user');
    if (!user || !user.Status) {
        alert('User data or status missing!');
        return;
    }
    await loadBranches()
    const status = user.Status.trim().toLowerCase();
    const isEditable = status === 'pending' || status === 'rejected';

    let html = '';

    fieldsToShow.forEach(field => {
        const value = user[field.key] ?? '-';

        // Handle dropdowns for specific fields
        if (isEditable && !["QueueNumber", "RecordedBy", "CreatedOn"].includes(field.key)) {

            if (field.key === "Priority") {
                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold text-dark">${field.label}:</label>
                        <select class="form-control mt-1" name="${field.key}">
                            <option value="Priority" ${value === 'Priority' ? 'selected' : ''}>Priority</option>
                            <option value="NonPriority" ${value === 'NonPriority' ? 'selected' : ''}>Non Priority</option>
                        </select>
                    </div>
                </div>
            `;
            } else if (field.key === "Branch") {

                html += `
        <div class="col-md-6" style="position: relative;">
            <div class="border-bottom py-2 px-1">
                <label for="branch" class="fw-semibold text-dark">${field.label}:</label>
                <input 
                    type="text" 
                    class="form-control branch-input mt-1" 
                    name="${field.key}" 
                    id="branch" 
                    placeholder="Start typing branch name..." 
                    autocomplete="off"
                >
                <div id="branchDropdown" class="autocomplete-list"></div>
                <div class="error-message" id="branchError"></div>
            </div>
        </div>
    `;
            }
            else if (field.key === "Currency") {
                html += `
        <div class="col-md-6">
            <div class="border-bottom py-2 px-1">
                <label class="fw-semibold text-dark">${field.label}:</label>
                <select class="form-control mt-1" name="${field.key}" id="currency">
                    ${currencyOptions.map(curr => `
                        <option value="${curr}" ${curr === user.Currency ? 'selected' : ''}>${curr}</option>
                    `).join('')}
                </select>
            </div>
        </div>
    `;
            }

            else if (field.key === "PaymentMethod") {
                html += `
                <div class="col-md-6">
                    <div class="border-bottom py-2 px-1">
                        <label class="fw-semibold text-dark">${field.label}:</label>
                        <select class="form-control mt-1" name="${field.key}">
                            <option value="LC" ${value === 'LC' ? 'selected' : ''}>LC</option>
                            <option value="CAD" ${value === 'CAD' ? 'selected' : ''}>CAD</option>
                            <option value="TT" ${value === 'TT' ? 'selected' : ''}>TT</option>
                        </select>
                    </div>
                </div>
            `;
            } else if (
                field.key === "FormDate" 
            ) {
                html += `
    <div class="col-md-6">
        <div class="border-bottom py-2 px-1">
            <label class="fw-semibold text-dark">${field.label}:</label>
            <input
                type="date"
                class="form-control mt-1"
                name="${field.key}"
                value="${value ? value.split('T')[0] : ''}"
            >
        </div>
    </div>
    `;
            } else {
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
            // Format money fields
            let displayValue = value;
            if (["Balance", "PerformaUSD", "PerformaAmount"].includes(field.key) && !isNaN(value)) {
                displayValue = Number(value).toLocaleString(); // Adds commas
            }

            // Format date field
            if (field.key === "CreatedOn" || field.key === "FormDate" || field.key === "ApprovedOn" || field.key === "VerifiedOn") {
                if (value != '-') {
                    const date = new Date(value);
                    displayValue = date.toLocaleDateString(); // default format: MM/DD/YYYY

                }
                // If you want, you can customize: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
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
            <button class="btn btn-success me-3" id="saveChangesBtn" data-id="${user.QueueNumber}">Save Changes</button>
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

    const branchInput = document.getElementById('branch');
    if (branchInput && user.Branch) {
        branchInput.value = user.Branch;
    }








});

async function loadBranches() {
    try {
        const response = await fetch('/getbranches');
        const data = await response.json();

        if (response.ok && Array.isArray(data.branches)) {
            branches = data.branches; // array of strings
        } else {
            console.error('Invalid branch response:', data);
        }

    } catch (error) {
        console.error('Error fetching branches:', error);
    }
}

//document.addEventListener('click', function (event) {
//    if (event.target && event.target.id === 'saveChangesBtn') {
//        const queueNumber = event.target.getAttribute('data-id');

//        Swal.fire({
//            title: 'Are you sure?',
//            text: "Do you want to save the changes?",
//            icon: 'warning',
//            showCancelButton: true,
//            confirmButtonText: 'Yes, save it!',
//            cancelButtonText: 'No, cancel',
//        }).then((result) => {
//            if (result.isConfirmed) {
//                const updatedData = {
//                    queueNumber: queueNumber, // Already included
//                };

//                // Loop through fieldsToShow and get the value from input fields
//                fieldsToShow.forEach(field => {
//                    const inputElement = document.querySelector(`[name="${field.key}"]`);

//                    if (inputElement) {
//                        updatedData[field.key] = inputElement.value.trim(); // Safely extract value
//                    }
//                });


//                fetch('/updatefcy', {
//                    method: 'POST',
//                    headers: {
//                        'Content-Type': 'application/json',
//                    },
//                    body: JSON.stringify(updatedData)
//                })
//                    .then(res => res.json())  // <-- Add this to parse JSON response
//                    .then(data => {
//                        if (data.success) {
//                            const queueNumber = updatedData.queueNumber || data.data?.queueNumber || "this record";

//                            Swal.fire('Saved!', 'Changes have been saved for ' + queueNumber + ' successfully', 'success')
//                                .then(() => {
//                                    $('#viewModal').modal('hide'); // Close modal
//                                    location.reload();             // Refresh page
//                                });
//                        } else {
//                            Swal.fire('Error!', 'Failed to save changes for ' + updatedData.queueNumber, 'error');
//                        }
//                    })
//                    .catch(error => {
//                        console.error('Error:', error);
//                        Swal.fire('Error!', 'Something went wrong.', 'error');
//                    });

//            }
//        });
//    }
//});




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
                    queueNumber: queueNumber,
                };

                fieldsToShow.forEach(field => {
                    const inputElement = document.querySelector(`[name="${field.key}"]`);
                    if (inputElement) {
                        let value = inputElement.value.trim();
                        // Convert numeric fields
                        if (["Balance", "PerformaAmount", "PerformaUSD", "CustomerAccountBalance"].includes(field.key)) {
                            value = Number(value) || 0;
                        }
                        updatedData[field.key] = value;
                    }
                });

                // Add this line to debug
                console.log("Data to be sent to backend:", updatedData);

                fetch('/updatefcy', {
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



document.addEventListener('input', function (e) {
    if (!e.target.classList.contains('branch-input')) return;

    const input = e.target;
    const query = input.value.toLowerCase();
    const dropdown = document.getElementById('branchDropdown');

    dropdown.innerHTML = '';

    if (!query) {
        dropdown.style.display = 'none';
        return;
    }

    const matches = branches.filter(b =>
        b.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    matches.forEach(branch => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = branch;

        item.onclick = () => {
            input.value = branch;
            dropdown.innerHTML = '';
            dropdown.style.display = 'none';
        };

        dropdown.appendChild(item);
    });

    dropdown.style.display = 'block';
});






