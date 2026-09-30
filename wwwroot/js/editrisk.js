$(document).on('click', '.edit-btn', function () {

    const user = $(this).data('user');

    if (!user || !user.Status) {
        Swal.fire(
            'Error',
            'Risk data or status is missing.',
            'error'
        );
        return;
    }

    const status = user.Status.trim().toLowerCase();

    const isEditable =
        status === "pending" ||
        status === "rejected";

    // ============================================================
    // READ EXISTING VALUES
    // ============================================================

    const riskId = user.RiskId ?? "";

    const riskDate = formatDateForInput(user.RiskDate);

    const identifiedRisk = user.IdentifiedRisk ?? "";
    const sourceOfRisk = user.SourceOfRisk ?? "";

    const riskCategory = user.RiskCategory ?? "";
    const riskSubCategory = user.RiskSubCategory ?? "";
    const riskEvent = user.RiskEvent ?? "";

    const riskDescription =
        user.RiskEventDescription ?? "";

    const effect = user.Effect ?? "";
    const probability = user.Probability ?? "";
    const impactLevel = user.ImpactLevel ?? "";
    const mitigationRating = user.MitigationRating ?? "";

    const existingMitigation =
        user.ExistingRiskMitigation ?? "";

    const recommendation =
        user.Recommendation ?? "";

    const mitigationPlannedDate =
        formatDateForInput(user.MitigationPlannedDate);

    const riskOwner =
        user.RiskOwner ?? "";

    // ============================================================
    // READ-ONLY VIEW FOR APPROVED RECORDS
    // ============================================================

    if (!isEditable) {

        const html = `
            <div class="row g-4">

                <div class="col-md-6">
                    <label class="fw-semibold">Risk ID</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(riskId)}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Risk Date</label>
                    <div class="form-control bg-light">
                        ${formatDisplayDate(user.RiskDate)}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Business Unit</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(identifiedRisk)}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Cause / Source of Risk</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(sourceOfRisk)}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Risk Category</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(riskCategory)}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Sub Category</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(riskSubCategory)}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Risk Event</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(riskEvent)}
                    </div>
                </div>

                <div class="col-12">
                    <label class="fw-semibold">Risk Description</label>
                    <textarea class="form-control" rows="5" readonly>${escapeHtml(riskDescription)}</textarea>
                </div>

                <div class="col-md-3">
                    <label class="fw-semibold">Effect</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(effect)}
                    </div>
                </div>

                <div class="col-md-3">
                    <label class="fw-semibold">Probability</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(probability)}
                    </div>
                </div>

                <div class="col-md-3">
                    <label class="fw-semibold">Impact Level</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(impactLevel)}
                    </div>
                </div>

                <div class="col-md-3">
                    <label class="fw-semibold">Mitigation Rating</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(mitigationRating)}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Inherent Risk Rating</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(user.InherentRiskRating ?? "")}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Residual Risk Level</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(user.ResidualRiskLevel ?? "")}
                    </div>
                </div>

                <div class="col-12">
                    <label class="fw-semibold">
                        Existing Risk Mitigation
                    </label>

                    <textarea
                        class="form-control"
                        rows="5"
                        readonly>${escapeHtml(existingMitigation)}</textarea>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Recommendation</label>
                    <textarea
                        class="form-control"
                        rows="4"
                        readonly>${escapeHtml(recommendation)}</textarea>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">
                        Mitigation Planned Date
                    </label>

                    <div class="form-control bg-light">
                        ${formatDisplayDate(user.MitigationPlannedDate)}
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="fw-semibold">Risk Owner</label>
                    <div class="form-control bg-light">
                        ${escapeHtml(riskOwner)}
                    </div>
                </div>

                <div class="col-12">
                    <div class="alert alert-warning text-center mb-0">
                        Approved records cannot be edited.
                    </div>
                </div>

            </div>
        `;

        $("#editModalContent").html(html);

        $("#editModalFooter").html(`
            <button
                type="button"
                class="btn btn-success"
                data-bs-dismiss="modal">
                OK
            </button>
        `);

        $("#editModal").modal("show");

        return;
    }

    // ============================================================
    // EDIT FORM
    // ============================================================

    const html = `

        <form id="editRiskForm">

            <div class="p-4">

                <div class="row g-4">

                    <!-- ================================================= -->
                    <!-- SECTION 1: RISK INFORMATION -->
                    <!-- ================================================= -->

                    <div class="col-lg-3 col-md-6">

                        <label class="form-label fw-semibold">
                            Risk Date
                            <span class="text-danger">*</span>
                        </label>

                        <input
                            type="date"
                            class="form-control modern-input"
                            id="EditRiskDate"
                            name="RiskDate"
                            value="${riskDate}"
                            required>
                    </div>


                    <div class="col-lg-3 col-md-6">

                        <label class="form-label fw-semibold">
                            Business Unit
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditIdentifiedRisk"
                            name="IdentifiedRisk"
                            class="form-select"
                            required>

                            <option value="">
                                Choose a Business Unit...
                            </option>

                            ${IdentifiedRisks.map(r => `
                                <option
                                    value="${r.value}"
                                    ${identifiedRisk === r.value ? "selected" : ""}>
                                    ${r.text}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="col-lg-3 col-md-6">

                        <label class="form-label fw-semibold">
                            Cause / Source of Risk
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditSourceOfRisk"
                            name="SourceOfRisk"
                            class="form-select"
                            required>

                            <option value="">
                                Choose the source of risk...
                            </option>

                            ${Causes.map(c => `
                                <option
                                    value="${c.value}"
                                    ${sourceOfRisk === c.value ? "selected" : ""}>
                                    ${c.text}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="col-lg-3 col-md-6">

                        <label class="form-label fw-semibold">
                            Risk Category
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditRiskCategory"
                            name="RiskCategory"
                            class="form-select"
                            required>

                            <option value="">
                                Select Category
                            </option>

                            ${Object.keys(riskCategories).map(category => `
                                <option
                                    value="${escapeHtml(category)}"
                                    ${riskCategory === category ? "selected" : ""}>
                                    ${escapeHtml(category)}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="col-md-6">

                        <label class="form-label fw-semibold">
                            Sub Category
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditRiskSubCategory"
                            name="RiskSubCategory"
                            class="form-select"
                            required>

                            <option value="">
                                Select Sub Category
                            </option>

                        </select>

                    </div>


                    <div class="col-md-6">

                        <label class="form-label fw-semibold">
                            Risk Event
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditRiskEvent"
                            name="RiskEvent"
                            class="form-select"
                            required>

                            <option value="">
                                Select Risk Event
                            </option>

                        </select>

                    </div>


                    <div class="col-12">

                        <label class="form-label fw-semibold">
                            Risk Description
                            <span class="text-danger">*</span>
                        </label>

                        <textarea
                            class="form-control"
                            rows="6"
                            id="EditRiskDescription"
                            name="RiskEventDescription"
                            required>${escapeHtml(riskDescription)}</textarea>

                    </div>


                    <!-- ================================================= -->
                    <!-- SECTION 2: RISK ASSESSMENT -->
                    <!-- ================================================= -->

                    <div class="col-lg-3 col-md-6">

                        <label class="form-label fw-semibold">
                            Effect
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditEffect"
                            name="Effect"
                            class="form-select"
                            required>

                            <option value="">
                                Select Effect
                            </option>

                            ${Effects.map(e => `
                                <option
                                    value="${e.value}"
                                    ${effect === e.value ? "selected" : ""}>
                                    ${e.text}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="col-lg-3 col-md-6">

                        <label class="form-label fw-semibold">
                            Probability
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditProbability"
                            name="Probability"
                            class="form-select"
                            required>

                            <option value="">
                                Select Probability
                            </option>

                            ${Probabilities.map(p => `
                                <option
                                    value="${p.value}"
                                    ${probability === p.value ? "selected" : ""}>
                                    ${p.text}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="col-lg-3 col-md-6">

                        <label class="form-label fw-semibold">
                            Impact Level
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditImpactLevel"
                            name="ImpactLevel"
                            class="form-select"
                            required>

                            <option value="">
                                Select Impact
                            </option>

                            ${ImpactLevels.map(i => `
                                <option
                                    value="${i.value}"
                                    ${impactLevel === i.value ? "selected" : ""}>
                                    ${i.text}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <div class="col-lg-3 col-md-6">

                        <label class="form-label fw-semibold">
                            Mitigation Rating
                            <span class="text-danger">*</span>
                        </label>

                        <select
                            id="EditMitigationRating"
                            name="MitigationRating"
                            class="form-select"
                            required>

                            <option value="">
                                Select Rating
                            </option>

                            ${MitigationRatings.map(m => `
                                <option
                                    value="${m.value}"
                                    ${mitigationRating === m.value ? "selected" : ""}>
                                    ${m.text}
                                </option>
                            `).join("")}

                        </select>

                    </div>


                    <!-- ================================================= -->
                    <!-- CALCULATED RATINGS -->
                    <!-- ================================================= -->

                    <div class="col-lg-6">

                        <label class="form-label fw-semibold">
                            Inherent Risk Rating
                        </label>

                        <div
                            id="EditRiskRatingBadge"
                            class="badge fs-6 px-4 py-3 rounded-pill bg-secondary">
                            Select Probability & Impact
                        </div>

                        <input
                            type="hidden"
                            id="EditInherentRiskRating"
                            name="InherentRiskRating">

                    </div>


                    <div class="col-lg-6">

                        <label class="form-label fw-semibold">
                            Residual Risk Level
                        </label>

                        <div
                            id="EditResidualRiskBadge"
                            class="badge fs-6 px-4 py-3 rounded-pill bg-secondary">
                            Select Mitigation Rating
                        </div>

                        <input
                            type="hidden"
                            id="EditResidualRiskLevel"
                            name="ResidualRiskLevel">

                    </div>


                    <!-- ================================================= -->
                    <!-- RECOMMENDATION -->
                    <!-- ================================================= -->

                    <div
                        id="EditRecommendationSection"
                        class="row g-4 d-none">

                        <div class="col-lg-6">

                            <label class="form-label fw-semibold">
                                Recommendation
                            </label>

                            <textarea
                                class="form-control"
                                id="EditRecommendation"
                                name="Recommendation"
                                placeholder="Provide recommended actions...">${escapeHtml(recommendation)}</textarea>

                        </div>


                        <div class="col-lg-4 col-md-6">

                            <label class="form-label fw-semibold">
                                Mitigation Planned Date
                            </label>

                            <input
                                type="date"
                                class="form-control"
                                id="EditMitigationPlannedDate"
                                name="MitigationPlannedDate"
                                value="${mitigationPlannedDate}">

                        </div>

                    </div>


                    <!-- ================================================= -->
                    <!-- MITIGATION -->
                    <!-- ================================================= -->

                    <div class="col-12">

                        <label class="form-label fw-semibold">
                            Existing Risk Mitigation
                            <span class="text-danger">*</span>
                        </label>

                        <textarea
                            class="form-control"
                            id="EditExistingMitigation"
                            name="ExistingRiskMitigation"
                            rows="5"
                            required
                            placeholder="Describe all existing controls, safeguards, and mitigation measures...">${escapeHtml(existingMitigation)}</textarea>

                    </div>


                    <!-- ================================================= -->
                    <!-- OWNER -->
                    <!-- ================================================= -->

                    <div class="col-md-6">

                        <label class="form-label fw-semibold">
                            Risk Owner
                            <span class="text-danger">*</span>
                        </label>

                        <input
                            type="text"
                            class="form-control"
                            id="EditRiskOwner"
                            name="RiskOwner"
                            value="${escapeHtml(riskOwner)}"
                            required>

                    </div>

                </div>

            </div>

        </form>
    `;


    // ============================================================
    // FOOTER
    // ============================================================

    const footerHtml = `

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
            data-id="${riskId}">
            <i class="bi bi-floppy me-2"></i>
            Save Changes
        </button>
    `;


    $("#editModalContent").html(html);
    $("#editModalFooter").html(footerHtml);

    $("#editModal").modal("show");


    // ============================================================
    // INITIALIZE DEPENDENT DROPDOWNS
    // ============================================================

    initializeEditRiskHierarchy(
        riskCategory,
        riskSubCategory,
        riskEvent
    );


    // ============================================================
    // INITIALIZE RISK CALCULATION
    // ============================================================

    initializeEditRiskCalculation(
        probability,
        impactLevel,
        mitigationRating,
        user.InherentRiskRating,
        user.ResidualRiskLevel
    );

});


// ================================================================
// CATEGORY → SUB CATEGORY → EVENT
// ================================================================

function initializeEditRiskHierarchy(
    selectedCategory,
    selectedSubCategory,
    selectedEvent
) {

    const categorySelect =
        document.getElementById("EditRiskCategory");

    const subCategorySelect =
        document.getElementById("EditRiskSubCategory");

    const eventSelect =
        document.getElementById("EditRiskEvent");


    if (!categorySelect ||
        !subCategorySelect ||
        !eventSelect)
        return;


    function loadSubCategories(category) {

        subCategorySelect.innerHTML =
            '<option value="">Select Sub Category</option>';

        eventSelect.innerHTML =
            '<option value="">Select Risk Event</option>';

        if (!category ||
            !riskCategories[category]) {

            subCategorySelect.disabled = true;
            eventSelect.disabled = true;

            return;
        }


        subCategorySelect.disabled = false;


        Object.keys(
            riskCategories[category]
        ).forEach(sub => {

            subCategorySelect.innerHTML += `
                <option value="${escapeHtml(sub)}">
                    ${escapeHtml(sub)}
                </option>
            `;

        });


        if (selectedSubCategory) {

            subCategorySelect.value =
                selectedSubCategory;

            loadEvents(
                category,
                selectedSubCategory
            );

        }

    }


    function loadEvents(category, subCategory) {

        eventSelect.innerHTML =
            '<option value="">Select Risk Event</option>';

        if (
            !category ||
            !subCategory ||
            !riskCategories[category] ||
            !riskCategories[category][subCategory]
        ) {

            eventSelect.disabled = true;

            return;
        }


        eventSelect.disabled = false;


        riskCategories[category][subCategory]
            .forEach(event => {

                eventSelect.innerHTML += `
                    <option value="${escapeHtml(event)}">
                        ${escapeHtml(event)}
                    </option>
                `;

            });


        if (selectedEvent) {

            eventSelect.value =
                selectedEvent;

        }

    }


    categorySelect.addEventListener(
        "change",
        function () {

            selectedSubCategory = "";
            selectedEvent = "";

            loadSubCategories(
                this.value
            );

        }
    );


    subCategorySelect.addEventListener(
        "change",
        function () {

            selectedEvent = "";

            loadEvents(
                categorySelect.value,
                this.value
            );

        }
    );


    // Load existing values
    loadSubCategories(
        selectedCategory
    );
}


// ================================================================
// RISK CALCULATION
// ================================================================

function initializeEditRiskCalculation(
    selectedProbability,
    selectedImpact,
    selectedMitigation,
    existingInherent,
    existingResidual
) {

    const probabilitySelect =
        document.getElementById("EditProbability");

    const impactSelect =
        document.getElementById("EditImpactLevel");

    const mitigationSelect =
        document.getElementById("EditMitigationRating");

    const badge =
        document.getElementById("EditRiskRatingBadge");

    const residualBadge =
        document.getElementById("EditResidualRiskBadge");

    const inherentInput =
        document.getElementById("EditInherentRiskRating");

    const residualInput =
        document.getElementById("EditResidualRiskLevel");

    const recommendationSection =
        document.getElementById("EditRecommendationSection");

    const recommendation =
        document.getElementById("EditRecommendation");

    const mitigationDate =
        document.getElementById("EditMitigationPlannedDate");


    function updateRecommendationVisibility(residual) {

        if (
            residual === "Medium" ||
            residual === "High" ||
            residual === "Very High"
        ) {

            recommendationSection.classList.remove(
                "d-none"
            );

            recommendation.required = true;
            mitigationDate.required = true;

        }
        else {

            recommendationSection.classList.add(
                "d-none"
            );

            recommendation.required = false;
            mitigationDate.required = false;

            // Don't erase existing values during initial load.
        }

    }


    function updateResidualRisk() {

        const mitigation =
            mitigationSelect.value;

        const inherent =
            inherentInput.value;


        if (!inherent || !mitigation) {

            residualInput.value = "";

            residualBadge.className =
                "badge fs-6 px-4 py-3 rounded-pill bg-secondary";

            residualBadge.textContent =
                "Select Mitigation Rating";

            recommendationSection.classList.add(
                "d-none"
            );

            return;
        }


        const residual =
            ResidualRiskMatrix[inherent]?.[mitigation];


        if (!residual) {

            console.error(
                "Residual risk mapping not found:",
                inherent,
                mitigation
            );

            residualInput.value = "";

            residualBadge.className =
                "badge fs-6 px-4 py-3 rounded-pill bg-secondary";

            residualBadge.textContent =
                "Unable to calculate";

            return;
        }


        residualInput.value =
            residual;


        residualBadge.className =
            "badge fs-6 px-4 py-3 rounded-pill risk-badge";


        switch (residual) {

            case "Very Low":
                residualBadge.classList.add(
                    "risk-very-low"
                );
                break;

            case "Low":
                residualBadge.classList.add(
                    "risk-low"
                );
                break;

            case "Medium":
                residualBadge.classList.add(
                    "risk-medium"
                );
                break;

            case "High":
                residualBadge.classList.add(
                    "risk-high"
                );
                break;

            case "Very High":
                residualBadge.classList.add(
                    "risk-very-high"
                );
                break;
        }


        residualBadge.textContent =
            residual;


        updateRecommendationVisibility(
            residual
        );
    }


    function updateRiskRating() {

        const probability =
            probabilitySelect.value;

        const impact =
            impactSelect.value;


        if (!probability || !impact) {

            inherentInput.value = "";

            badge.className =
                "badge fs-6 px-4 py-3 rounded-pill bg-secondary";

            badge.textContent =
                "Select Probability & Impact";

            residualInput.value = "";

            updateResidualRisk();

            return;
        }


        const probabilityScore =
            Probabilities.find(
                p => p.value === probability
            )?.score;


        const impactScore =
            ImpactLevels.find(
                i => i.value === impact
            )?.score;


        if (!probabilityScore ||
            !impactScore)
            return;


        const score =
            probabilityScore *
            impactScore;


        let rating = "";


        if (score === 1) {

            rating = "Very Low";

        }
        else if (
            score > 1 &&
            score <= 4
        ) {

            rating = "Low";

        }
        else if (
            score >= 5 &&
            score <= 9
        ) {

            rating = "Moderate";

        }
        else if (
            score >= 10 &&
            score <= 15
        ) {

            rating = "High";

        }
        else if (
            score >= 16 &&
            score <= 25
        ) {

            rating = "Very High";

        }


        inherentInput.value =
            rating;


        badge.className =
            "badge fs-6 px-4 py-3 rounded-pill risk-badge";


        switch (rating) {

            case "Very Low":
                badge.classList.add(
                    "risk-very-low"
                );
                break;

            case "Low":
                badge.classList.add(
                    "risk-low"
                );
                break;

            case "Moderate":
                badge.classList.add(
                    "risk-medium"
                );
                break;

            case "High":
                badge.classList.add(
                    "risk-high"
                );
                break;

            case "Very High":
                badge.classList.add(
                    "risk-very-high"
                );
                break;
        }


        badge.textContent =
            `${rating} (${score}/25)`;


        updateResidualRisk();
    }


    probabilitySelect.addEventListener(
        "change",
        updateRiskRating
    );

    impactSelect.addEventListener(
        "change",
        updateRiskRating
    );

    mitigationSelect.addEventListener(
        "change",
        updateResidualRisk
    );


    // ============================================================
    // INITIALIZE WITH EXISTING VALUES
    // ============================================================

    probabilitySelect.value =
        selectedProbability;

    impactSelect.value =
        selectedImpact;

    mitigationSelect.value =
        selectedMitigation;


    // Recalculate from the actual selected values.
    updateRiskRating();

    // If calculation cannot be reproduced for some reason,
    // preserve the existing backend values.
    if (!inherentInput.value && existingInherent) {
        inherentInput.value =
            existingInherent;
    }

    if (!residualInput.value && existingResidual) {
        residualInput.value =
            existingResidual;
    }

    if (residualInput.value) {
        updateRecommendationVisibility(
            residualInput.value
        );
    }
}


// ================================================================
// SAVE
// ================================================================

document.addEventListener(
    'click',
    function (event) {

        if (
            !event.target ||
            event.target.id !==
            'saveChangesBtn'
        ) {
            return;
        }


        const riskId =
            event.target.getAttribute(
                'data-id'
            );


        const form =
            document.getElementById(
                "editRiskForm"
            );


        if (!form.checkValidity()) {

            form.reportValidity();

            return;
        }


        Swal.fire({

            title: 'Are you sure?',

            text:
                'Do you want to save the changes?',

            icon: 'warning',

            showCancelButton: true,

            confirmButtonColor: '#198754',

            cancelButtonColor: '#d33',

            confirmButtonText:
                'Yes, Save it!',

            cancelButtonText:
                'Cancel'

        }).then(async result => {

            if (!result.isConfirmed)
                return;


            // ====================================================
            // BUILD COMPLETE OBJECT
            // ====================================================

            const updatedData = {

                RiskId: riskId,

                RiskDate:
                    document.getElementById(
                        "EditRiskDate"
                    ).value,

                IdentifiedRisk:
                    document.getElementById(
                        "EditIdentifiedRisk"
                    ).value,

                SourceOfRisk:
                    document.getElementById(
                        "EditSourceOfRisk"
                    ).value,

                RiskCategory:
                    document.getElementById(
                        "EditRiskCategory"
                    ).value,

                RiskSubCategory:
                    document.getElementById(
                        "EditRiskSubCategory"
                    ).value,

                RiskEvent:
                    document.getElementById(
                        "EditRiskEvent"
                    ).value,

                RiskEventDescription:
                    document.getElementById(
                        "EditRiskDescription"
                    ).value,

                Effect:
                    document.getElementById(
                        "EditEffect"
                    ).value,

                Probability:
                    document.getElementById(
                        "EditProbability"
                    ).value,

                ImpactLevel:
                    document.getElementById(
                        "EditImpactLevel"
                    ).value,

                InherentRiskRating:
                    document.getElementById(
                        "EditInherentRiskRating"
                    ).value,

                ResidualRiskLevel:
                    document.getElementById(
                        "EditResidualRiskLevel"
                    ).value,

                ExistingRiskMitigation:
                    document.getElementById(
                        "EditExistingMitigation"
                    ).value,

                MitigationRating:
                    document.getElementById(
                        "EditMitigationRating"
                    ).value,

                Recommendation:
                    document.getElementById(
                        "EditRecommendation"
                    ).value,

                MitigationPlannedDate:
                    document.getElementById(
                        "EditMitigationPlannedDate"
                    ).value,

                RiskOwner:
                    document.getElementById(
                        "EditRiskOwner"
                    ).value
            };


            console.log(
                "Sending updated risk:",
                updatedData
            );


            try {

                const response =
                    await fetch(
                        '/Maker/editrisk',
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body:
                                JSON.stringify(
                                    updatedData
                                )
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        "Backend error:",
                        result
                    );

                    Swal.fire({

                        icon: 'error',

                        title:
                            'Request Failed',

                        text:
                            result.message ||
                            'Unable to update risk.'

                    });

                    return;
                }


                Swal.fire({

                    icon: 'success',

                    title: 'Success',

                    text:
                        result.message ||
                        'Risk updated successfully.'

                }).then(() => {

                    location.reload();

                });

            }
            catch (error) {

                console.error(
                    "Update error:",
                    error
                );

                Swal.fire({

                    icon: 'error',

                    title: 'Error',

                    text:
                        'Something went wrong while updating the risk.'

                });

            }

        });

    }
);


// ================================================================
// HELPERS
// ================================================================

function formatDateForInput(value) {

    if (!value)
        return "";

    const date =
        new Date(value);

    if (isNaN(date.getTime()))
        return "";

    return date
        .toISOString()
        .split("T")[0];
}


function formatDisplayDate(value) {

    if (!value)
        return "";

    const date =
        new Date(value);

    if (isNaN(date.getTime()))
        return "";

    return date.toLocaleDateString();
}


function escapeHtml(value) {

    if (value === null ||
        value === undefined)
        return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

