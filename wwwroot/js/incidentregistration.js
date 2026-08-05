const sourceOfIncidentSelect = document.getElementById("SourceOfIncident");

Causes.forEach(source => {

  sourceOfIncidentSelect.add(
    new Option(source.text, source.value)
  );

});