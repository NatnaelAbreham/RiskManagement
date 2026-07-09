document.addEventListener("DOMContentLoaded", () => {

    loadIdentifiedRisks();

});

function loadIdentifiedRisks() {

    fetch('/Report/GetIdentifiedRisks')
        .then(response => response.json())
        .then(data => {

            const ddl = document.getElementById("identifiedRisk");

            ddl.innerHTML = '<option value="">All</option>';

            data.forEach(item => {

                ddl.innerHTML +=
                    `<option value="${item}">${item}</option>`;

            });

        })
        .catch(error => console.error(error));

}