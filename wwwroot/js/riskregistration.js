const form = document.getElementById("createRiskForm");
const modalDiv = document.getElementById("responseModal");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        RiskDate: document.getElementById("RiskDate").value,
        IdentifiedRisk: document.getElementById("IdentifiedRisk").value,
        SourceOfRisk: document.getElementById("SourceOfRisk").value,
        RiskCategory: document.getElementById("RiskCategory").value,

        RiskSubCategory: document.getElementById("RiskSubCategory").value,
        RiskEvent: document.getElementById("RiskEvent").value,

        RiskEventDescription: document.getElementById("RiskDescription").value,

        Effect: document.getElementById("Effect").value,
        Probability: document.getElementById("Probability").value,
        ImpactLevel: document.getElementById("ImpactLevel").value,

        InherentRiskRating: document.getElementById("InherentRiskRating").value,
        ResidualRiskLevel: document.getElementById("ResidualRiskLevel").value,

        ExistingRiskMitigation: document.getElementById("ExistingMitigation").value,
        MitigationRating: document.getElementById("MitigationRating").value,
        Recommendation: document.getElementById("Recommendation").value,

        MitigationPlannedDate: document.getElementById("MitigationPlannedDate").value,
        RiskOwner: document.getElementById("RiskOwner").value,


    };
console.log(data);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value ?? "");
    });

    const fileInput = document.getElementById("RiskAttachment");

    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
    }


    const response = await fetch("/Maker/createrisk", {
        method: "POST",
        body: formData
    });

    const result = await response.json();
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
        messageBox.innerHTML = `
    <p class="text-success fw-bold">
        Record Created Successfully!
    </p>

    <div class="alert alert-info mt-2">
        <strong>Risk ID:</strong> ${result.riskId}
    </div>
`;
        console.log(result.riskId);
        modalElement.show();

        function handleModalClose() {
            form.reset();
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