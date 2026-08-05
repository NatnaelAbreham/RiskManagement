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