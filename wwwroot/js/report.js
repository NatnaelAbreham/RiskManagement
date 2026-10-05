
document.addEventListener("DOMContentLoaded", () => {

    loadFilterOptions();
    loadReport();

});


/* =========================================================
   FILTER BUTTON
   ========================================================= */

document.getElementById("btnFilter")
    .addEventListener("click", () => {

        loadReport();

    });


/* =========================================================
   RESET BUTTON
   ========================================================= */

document.getElementById("btnReset")
    .addEventListener("click", () => {

        document.querySelectorAll(
            "#identifiedRisk, #sourceOfRisk, #riskCategory, " +
            "#riskSubCategory, #riskEvent, #effect, #probability, " +
            "#impactLevel, #inherentRiskRating, #residualRiskLevel, " +
            "#mitigationRating, #riskOwner, #status, #registeredBy, " +
            "#branchId, #branchName"
        ).forEach(select => {

            select.value = "";

        });


        document.getElementById("fromDate").value = "";
        document.getElementById("toDate").value = "";

        loadReport();

    });


/* =========================================================
   LOAD ALL FILTER OPTIONS
   ========================================================= */

function loadFilterOptions() {

    fetch("/Checker/GetReportFilterOptions")

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load filter options.");
            }

            return response.json();

        })

        .then(data => {

            populateDropdown(
                "identifiedRisk",
                data.identifiedRisks
            );

            populateDropdown(
                "sourceOfRisk",
                data.sourceOfRisks
            );

            populateDropdown(
                "riskCategory",
                data.riskCategories
            );

            populateDropdown(
                "riskSubCategory",
                data.riskSubCategories
            );

            populateDropdown(
                "riskEvent",
                data.riskEvents
            );

            populateDropdown(
                "effect",
                data.effects
            );

            populateDropdown(
                "probability",
                data.probabilities
            );

            populateDropdown(
                "impactLevel",
                data.impactLevels
            );

            populateDropdown(
                "residualRiskLevel",
                data.residualRiskLevels
            );

            populateDropdown(
                "mitigationRating",
                data.mitigationRatings
            );

            populateDropdown(
                "riskOwner",
                data.riskOwners
            );

            populateDropdown(
                "registeredBy",
                data.registeredBys
            );

            populateDropdown(
                "branchId",
                data.branchIds
            );

            populateDropdown(
                "branchName",
                data.branchNames
            );

        })

        .catch(error => {

            console.error(
                "Error loading report filters:",
                error
            );

        });

}


/* =========================================================
   POPULATE DROPDOWN
   ========================================================= */

function populateDropdown(elementId, values) {

    const dropdown = document.getElementById(elementId);

    if (!dropdown || !values) {
        return;
    }

    dropdown.innerHTML =
        '<option value="">All</option>';

    values.forEach(value => {

        if (value !== null &&
            value !== undefined &&
            value !== "") {

            dropdown.innerHTML += `
                <option value="${escapeHtml(value)}">
                    ${escapeHtml(value)}
                </option>
            `;

        }

    });

}


/* =========================================================
   LOAD REPORT
   ========================================================= */

function loadReport() {

    const params = new URLSearchParams();


    addFilter(params, "identifiedRisk");
    addFilter(params, "sourceOfRisk");
    addFilter(params, "riskCategory");
    addFilter(params, "riskSubCategory");
    addFilter(params, "riskEvent");
    addFilter(params, "effect");
    addFilter(params, "probability");
    addFilter(params, "impactLevel");
    addFilter(params, "inherentRiskRating");
    addFilter(params, "residualRiskLevel");
    addFilter(params, "mitigationRating");
    addFilter(params, "riskOwner");
    addFilter(params, "status");
    addFilter(params, "registeredBy");
    addFilter(params, "branchId");
    addFilter(params, "branchName");


    const fromDate =
        document.getElementById("fromDate").value;

    const toDate =
        document.getElementById("toDate").value;


    if (fromDate) {
        params.append("fromDate", fromDate);
    }

    if (toDate) {
        params.append("toDate", toDate);
    }


    /* =====================================================
       DESTROY EXISTING DATATABLE
       ===================================================== */

    if ($.fn.DataTable.isDataTable("#dataTable")) {

        $("#dataTable")
            .DataTable()
            .destroy();

    }


    const tbody =
        document.querySelector("#dataTable tbody");

    tbody.innerHTML = `
        <tr>
            <td colspan="15"
                class="text-center text-muted py-4">

                <div class="spinner-border spinner-border-sm me-2">
                </div>

                Loading report...

            </td>
        </tr>
    `;


    /* =====================================================
       REQUEST
       ===================================================== */

    fetch(
        `/Checker/GetReportData?${params.toString()}`
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load report data."
                );
            }

            return response.json();

        })

        .then(data => {

            tbody.innerHTML = "";


            if (!data || data.length === 0) {

                tbody.innerHTML = `
                    <tr>
                        <td colspan="15"
                            class="text-center text-muted py-4">

                            No risk records found.

                        </td>
                    </tr>
                `;

                initializeDataTable();

                return;

            }


            data.forEach(risk => {

                tbody.innerHTML += `

                    <tr>

                        <td>
                            ${risk.riskId ?? ""}
                        </td>

                        <td>
                            ${formatDate(risk.riskDate)}
                        </td>

                        <td>
                            ${risk.identifiedRisk ?? ""}
                        </td>

                        <td>
                            ${risk.sourceOfRisk ?? ""}
                        </td>

                        <td>
                            ${risk.riskCategory ?? ""}
                        </td>

                        <td>
                            ${risk.riskSubCategory ?? ""}
                        </td>

                        <td>
                            ${risk.riskEvent ?? ""}
                        </td>

                        <td>
                            ${risk.probability ?? ""}
                        </td>

                        <td>
                            ${risk.impactLevel ?? ""}
                        </td>

                        <td>
                            ${risk.inherentRiskRating ?? ""}
                        </td>

                        <td>
                            ${risk.residualRiskLevel ?? ""}
                        </td>

                        <td>
                            ${risk.mitigationRating ?? ""}
                        </td>

                        <td>
                            ${risk.status ?? ""}
                        </td>

                        <td>
                            ${risk.riskOwner ?? ""}
                        </td>

                        <td>
                            ${risk.branchName ?? ""}
                        </td>

                    </tr>

                `;

            });


            initializeDataTable();

        })

        .catch(error => {

            console.error(
                "Error loading report:",
                error
            );

            tbody.innerHTML = `
                <tr>
                    <td colspan="15"
                        class="text-center text-danger py-4">

                        Failed to load report data.

                    </td>
                </tr>
            `;

        });

}


/* =========================================================
   ADD FILTER PARAMETER
   ========================================================= */

function addFilter(params, elementId) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    const value = element.value;

    if (value !== "") {

        params.append(
            elementId,
            value
        );

    }

}


/* =========================================================
   DATATABLE
   ========================================================= */

function initializeDataTable() {

    const table =
        $("#dataTable").DataTable({

            pageLength: 10,

            lengthMenu: [
                5,
                10,
                25,
                50,
                100
            ],

            dom: "Bfrtip",

            buttons: [

                {
                    extend: "copyHtml5",
                    className: "buttons-copy"
                },

                {
                    extend: "excelHtml5",
                    className: "buttons-excel",
                    title: "Risk Management Report"
                },

                {
                    extend: "pdfHtml5",
                    className: "buttons-pdf",
                    title: "Risk Management Report",
                    orientation: "landscape",
                    pageSize: "A3"
                },

                {
                    extend: "print",
                    className: "buttons-print",
                    title: "Risk Management Report",

                    customize: function (win) {

                        $(win.document.body)
                            .css("font-size", "10pt");

                        $(win.document.body)
                            .find("table")
                            .addClass(
                                "table table-bordered"
                            )
                            .css(
                                "font-size",
                                "inherit"
                            );

                    }

                }

            ]

        });


    table
        .buttons()
        .container()
        .hide();

}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(dateString);

    return date.toLocaleDateString();

}


/* =========================================================
   EXPORT BUTTONS
   ========================================================= */

document.getElementById("btnCopy")
    .addEventListener("click", () => {

        $(".buttons-copy").click();

    });


document.getElementById("btnExcel")
    .addEventListener("click", () => {

        $(".buttons-excel").click();

    });


document.getElementById("btnPdf")
    .addEventListener("click", () => {

        $(".buttons-pdf").click();

    });


document.getElementById("btnPrint")
    .addEventListener("click", () => {

        $(".buttons-print").click();

    });


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

