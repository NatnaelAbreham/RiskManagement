// Populate Category

const categorySelect = document.getElementById("RiskCategory");
const subCategorySelect = document.getElementById("RiskSubCategory");
const eventSelect = document.getElementById("RiskEvent");

Object.keys(riskCategories).forEach(category => {

  categorySelect.innerHTML += `
        <option value="${category}">
            ${category}
        </option>
    `;

});

categorySelect.addEventListener("change", function () {

  subCategorySelect.innerHTML =
    '<option value="">Select Sub Category</option>';

  eventSelect.innerHTML =
    '<option value="">Select Risk Event</option>';

  eventSelect.disabled = true;

  if (!this.value) {

    subCategorySelect.disabled = true;
    return;

  }

  subCategorySelect.disabled = false;

  Object.keys(riskCategories[this.value]).forEach(sub => {

    subCategorySelect.innerHTML += `
            <option value="${sub}">
                ${sub}
            </option>
        `;

  });

});

subCategorySelect.addEventListener("change", function () {

  eventSelect.innerHTML =
    '<option value="">Select Risk Event</option>';

  if (!this.value) {

    eventSelect.disabled = true;
    return;

  }

  eventSelect.disabled = false;

  riskCategories[categorySelect.value][this.value].forEach(event => {

    eventSelect.innerHTML += `
            <option value="${event}">
                ${event}
            </option>
        `;

  });

});

const identifiedRiskSelect = document.getElementById("IdentifiedRisk");

IdentifiedRisks.forEach(risk => {

  identifiedRiskSelect.add(
    new Option(risk.text, risk.value)
  );

});

const sourceOfRiskSelect = document.getElementById("SourceOfRisk");

Causes.forEach(source => {

  sourceOfRiskSelect.add(
    new Option(source.text, source.value)
  );

});



const effectSelect = document.getElementById("Effect");

Effects.forEach(effect => {

  effectSelect.add(
    new Option(
      effect.text,
      effect.value
    )
  );

});
const probabilitySelect = document.getElementById("Probability");

Probabilities.forEach(probability => {

  probabilitySelect.add(
    new Option(
      probability.text,
      probability.value
    )
  );

});

const impactSelect = document.getElementById("ImpactLevel");


ImpactLevels.forEach(level => {

  impactSelect.add(
    new Option(
      level.text,
      level.value
    )
  );

});

const mitigationSelect = document.getElementById("MitigationRating");


MitigationRatings.forEach(level => {

  mitigationSelect.add(
    new Option(
      level.text,
      level.value
    )
  );

});


const recommendationSection =
  document.getElementById("recommendationSection");

const recommendation =
  document.getElementById("Recommendation");

const mitigationDate =
  document.getElementById("MitigationPlannedDate");


const badge = document.getElementById("RiskRatingBadge");
let inherentRiskRating = "";
function updateRiskRating() {

  const probability = probabilitySelect.value;
  const impact = impactSelect.value;

  if (!probability || !impact) {

    badge.className = "badge fs-6 px-4 py-3 rounded-pill bg-secondary";
    badge.textContent = "Select Probability & Impact";

    inherentRiskRating = "";
    document.getElementById("InherentRiskRating").value = "";
    document.getElementById("ResidualRiskLevel").value = "";

    updateResidualRisk();   // Reset residual badge too

    return;
  }

  inherentRiskRating = RiskMatrix[probability][impact];

  badge.className = "badge fs-6 px-4 py-3 rounded-pill risk-badge";

  switch (inherentRiskRating) {

    case "Very Low":
      badge.classList.add("risk-very-low");
      break;

    case "Low":
      badge.classList.add("risk-low");
      break;

    case "Medium":
      badge.classList.add("risk-medium");
      break;

    case "High":
      badge.classList.add("risk-high");
      break;

    case "Very High":
      badge.classList.add("risk-very-high");
      break;
  }

  badge.textContent = inherentRiskRating;
  document.getElementById("InherentRiskRating").value = inherentRiskRating;
  // Update residual risk whenever inherent risk changes
  updateResidualRisk();
}

const residualBadge = document.getElementById("ResidualRiskBadge");
function updateResidualRisk() {

  const mitigation = mitigationSelect.value;

  if (!inherentRiskRating || !mitigation) {

    document.getElementById("ResidualRiskLevel").value = "";
    residualBadge.className =
      "badge fs-6 px-4 py-3 rounded-pill bg-secondary";

    residualBadge.textContent =
      "Select Mitigation Rating";

    return;
  }


  const residual =
    ResidualRiskMatrix[inherentRiskRating][mitigation];


  residualBadge.className =
    "badge fs-6 px-4 py-3 rounded-pill risk-badge";


  switch (residual) {

    case "Very Low":
      residualBadge.classList.add("risk-very-low");
      break;

    case "Low":
      residualBadge.classList.add("risk-low");
      break;

    case "Medium":
      residualBadge.classList.add("risk-medium");
      break;

    case "High":
      residualBadge.classList.add("risk-high");
      break;

    case "Very High":
      residualBadge.classList.add("risk-very-high");
      break;
  }


  residualBadge.textContent = residual;
  document.getElementById("ResidualRiskLevel").value = residual;

  if (
    residual === "Medium" ||
    residual === "High" ||
    residual === "Very High"
  ) {

    recommendationSection.classList.remove("d-none");

    recommendation.required = true;
    mitigationDate.required = true;

  }
  else {

    recommendationSection.classList.add("d-none");

    recommendation.required = false;
    mitigationDate.required = false;

    recommendation.value = "";
    mitigationDate.value = "";
  }
}



probabilitySelect.addEventListener("change", updateRiskRating);
impactSelect.addEventListener("change", updateRiskRating);


mitigationSelect.addEventListener("change", updateResidualRisk);



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