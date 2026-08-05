const sourceOfIncidentSelect = document.getElementById("SourceOfIncident");

Causes.forEach(source => {

    sourceOfIncidentSelect.add(
        new Option(source.text, source.value)
    );

});

const identifiedRiskSelect = document.getElementById("IdentifiedRisk");

IdentifiedRisks.forEach(risk => {

    identifiedRiskSelect.add(
        new Option(risk.text, risk.value)
    );

});



const form = document.getElementById("createRiskIncident");
const modalDiv = document.getElementById("responseModal");

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
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

        BusinessActivity: document.getElementById("BusinessActivity").value
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
            '<pre class="text-muted small">Failed to register Incident</pre>';

        modalElement.show();
    }
});