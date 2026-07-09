document.addEventListener("DOMContentLoaded", () => {

    loadIdentifiedRisks();

});
document.getElementById("btnFilter")
    .addEventListener("click", function () {

        loadReport();

    });
document.getElementById("btnReset").addEventListener("click", () => {

    document.getElementById("identifiedRisk").value = "";
    document.getElementById("status").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";

    loadReport();

});
function loadIdentifiedRisks() {

    fetch('/Checker/GetIdentifiedRisks')
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
function loadReport() {

    const identifiedRisk = document.getElementById("identifiedRisk").value;
    const status = document.getElementById("status").value;
    const rating = document.getElementById("rating").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    const url =
        `/Checker/GetReportData?identifiedRisk=${encodeURIComponent(identifiedRisk)}
        &status=${encodeURIComponent(status)}
        &rating=${encodeURIComponent(rating)}
        &fromDate=${fromDate}
        &toDate=${toDate}`;

    fetch(url.replace(/\s/g, ""))
        .then(response => response.json())
        .then(data => {

            const tbody = document.querySelector("#reportTable tbody");

            tbody.innerHTML = "";

            data.forEach(risk => {

                tbody.innerHTML += `
                    <tr>
                        <td>${risk.riskId}</td>
                        <td>${formatDate(risk.riskDate)}</td>
                        <td>${risk.identifiedRisk ?? ""}</td>
                        <td>${risk.riskCategory}</td>
                        <td>${risk.riskRating}</td>
                        <td>${risk.riskScore}</td>
                        <td>${risk.status}</td>
                        <td>${risk.riskOwner}</td>
                    </tr>
                `;

            });

        });
}
function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString(); // e.g. 7/9/2026
}