const sourceOfIncidentSelect = document.getElementById("SourceOfIncident");

/* Causes.forEach(source => {

    sourceOfIncidentSelect.add(
        new Option(source.text, source.value)
    );

}); */

const identifiedRiskSelect = document.getElementById("IdentifiedRisk");

IdentifiedRisks.forEach(risk => {

    identifiedRiskSelect.add(
        new Option(risk.text, risk.value)
    );

});



const form = document.getElementById("createIncidentForm");
const modalDiv = document.getElementById("responseModal");

const lossAmount = document.getElementById("LossAmount");
const recoveryAmount = document.getElementById("RecoveryAmount");
const netLossAmount = document.getElementById("NetLossAmount");


function calculateNetLoss() {
    const loss = parseFloat(lossAmount.value) || 0;
    const recovery = parseFloat(recoveryAmount.value) || 0;

    const netLoss = Math.max(0, loss - recovery);

    netLossAmount.value = netLoss.toFixed(2);
}

lossAmount.addEventListener("input", calculateNetLoss);
recoveryAmount.addEventListener("input", calculateNetLoss);


form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        // =========================
        // Incident Information
        // =========================

        IdentifiedRisk: document.getElementById("IdentifiedRisk").value,

        IncidentName: document.getElementById("IncidentName").value,

        IncidentOwner: document.getElementById("IncidentOwner").value,

        EventOccurredDate: document.getElementById("EventOccurredDate").value,

        EventEndedDate: document.getElementById("EventEndedDate").value,

        Priority: document.getElementById("Priority").value,

        SourceOfIncident: document.getElementById("SourceOfIncident").value,

        EventDescription: document.getElementById("EventDescription").value,

        EventType: document.getElementById("EventType").value,

        BusinessLine: document.getElementById("BusinessLine").value,

        BusinessActivity: document.getElementById("BusinessActivity").value,


        // =========================
        // Impact Parameters
        // =========================

        LossType: document.getElementById("LossType").value,

        LossDate: document.getElementById("LossDate").value,

        Insurance: document.getElementById("Insurance").value,

        LossAmount: document.getElementById("LossAmount").value,

        RecoveryAmount: document.getElementById("RecoveryAmount").value,

        NetLossAmount: document.getElementById("NetLossAmount").value,


        // =========================
        // Mitigation
        // =========================

        MitigationAction: document.getElementById("MitigationAction").value,

        ActionType: document.getElementById("ActionType").value,

        ResponsiblePerson: document.getElementById("ResponsiblePerson").value,

        MitigationDescription: document.getElementById("MitigationDescription").value,

        MitigationStartDate: document.getElementById("MitigationStartDate").value,

        MitigationEndDate: document.getElementById("MitigationEndDate").value,


        // =========================
        // Status
        // =========================

        Status: document.getElementById("Status").value
    };
    console.log(data);
    const response = await fetch("/Maker/createincident", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
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
        <strong>Incident ID:</strong> ${result.incidentId}
    </div>
`;
        console.log(result.incidentId);
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
            '<pre class="text-muted small">Failed to register Incident</pre>';

        modalElement.show();
    }
});