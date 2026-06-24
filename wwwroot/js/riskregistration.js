
document.getElementById("createRiskForm").addEventListener("submit", async function (e) {
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

    const response = await fetch("/Risk/CreateRisk", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Risk registered successfully!");
        document.getElementById("createRiskForm").reset();
    } else {
        alert("Failed to register risk");
    }
});
