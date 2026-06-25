const form = document.getElementById("createRiskForm");
const modalDiv = document.getElementById("responseModal");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        riskDate: document.getElementById("RiskDate").value,
        identifiedRisk: document.getElementById("IdentifiedRisk").value,
        sourceOfRisk: document.getElementById("SourceOfRisk").value,
        riskCategory: document.getElementById("RiskCategory").value,
        riskEventDescription: document.getElementById("RiskDescription").value,

        effect: document.getElementById("Effect").value,
        probability: parseFloat(document.getElementById("Probability").value),
        impactLevel: document.getElementById("ImpactLevel").value,
        riskScore: parseFloat(document.getElementById("RiskScore").value),
        riskRating: document.getElementById("RiskRating").value,
        residualRiskLevel: document.getElementById("ResidualRiskLevel").value,

        existingRiskMitigation: document.getElementById("ExistingMitigation").value,
        mitigationRating: document.getElementById("MitigationRating").value,
        recommendation: document.getElementById("Recommendation").value,

        mitigationPlannedDate: document.getElementById("MitigationPlannedDate").value,
        riskOwner: document.getElementById("RiskOwner").value,

        status: document.getElementById("Status").value
    };

    const response = await fetch("/Maker/createrisk", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const modalElement = new bootstrap.Modal(modalDiv);
    const modalTitle = document.getElementById("modalTitle");
    const messageBox = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");
    const okButton = document.getElementById("okButton");

    if (response.ok) {

        okButton.classList.remove("btn-danger");
        okButton.classList.add("btn-success");

        modalIcon.innerHTML =
            '<i class="bi bi-check-circle-fill text-success" style="font-size:60px;"></i>';

        modalTitle.textContent = "Success";
        messageBox.innerHTML =
            '<p class="text-success fw-bold">Record Created Successfully!</p>';

        modalElement.show();

        function handleModalClose() {
            //console.log("Modal closed");

            clearValidation();
            //form.reset();

            console.log("Modal closed");
            console.log("Before reset:", document.getElementById("IdentifiedRisk").value);

            form.reset();

            console.log("After reset:", document.getElementById("IdentifiedRisk").value);

            modalDiv.removeEventListener("hidden.bs.modal", handleModalClose);
        }

        modalDiv.addEventListener("hidden.bs.modal", handleModalClose);

    } else {

        okButton.classList.remove("btn-success");
        okButton.classList.add("btn-danger");

        modalIcon.innerHTML =
            '<i class="bi bi-x-circle-fill text-danger" style="font-size:60px;"></i>';

        modalTitle.textContent = "Error";
        messageBox.innerHTML =
            '<p class="text-danger fw-bold">Something went wrong!</p>' +
            '<pre class="text-muted small">Failed to register risk</pre>';

        modalElement.show();
    }
});