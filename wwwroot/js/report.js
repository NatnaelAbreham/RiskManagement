
document.addEventListener("DOMContentLoaded", function () {

    loadFilterOptions();
    loadReport();


    // =========================================================
    // FILTER
    // =========================================================

    const btnFilter = document.getElementById("btnFilter");

    if (btnFilter) {

        btnFilter.addEventListener("click", function () {

            loadReport();

        });

    }


    // =========================================================
    // RESET
    // =========================================================

    const btnReset = document.getElementById("btnReset");

    if (btnReset) {

        btnReset.addEventListener("click", function () {

            document.querySelectorAll(
                "#identifiedRisk, #sourceOfRisk, #riskCategory, " +
                "#riskSubCategory, #riskEvent, #effect, #probability, " +
                "#impactLevel, #inherentRiskRating, #residualRiskLevel, " +
                "#mitigationRating, #riskOwner, #status, #registeredBy, " +
                "#branchId, #branchName"
            ).forEach(function (select) {

                select.value = "";

            });


            const fromDate = document.getElementById("fromDate");
            const toDate = document.getElementById("toDate");

            if (fromDate) {
                fromDate.value = "";
            }

            if (toDate) {
                toDate.value = "";
            }


            loadReport();

        });

    }


    // =========================================================
    // LOAD FILTER OPTIONS
    // =========================================================

    function loadFilterOptions() {

        fetch("/Checker/GetReportFilterOptions")

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load filter options."
                    );

                }

                return response.json();

            })

            .then(function (data) {

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
                    "inherentRiskRating",
                    data.inherentRiskRatings
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
                    "status",
                    data.statuses
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

            .catch(function (error) {

                console.error(
                    "Filter loading error:",
                    error
                );

            });

    }


    // =========================================================
    // POPULATE DROPDOWN
    // =========================================================

    function populateDropdown(elementId, values) {

        const dropdown =
            document.getElementById(elementId);


        if (!dropdown) {
            return;
        }


        dropdown.innerHTML =
            '<option value="">All</option>';


        if (
            !values ||
            !Array.isArray(values)
        ) {

            return;

        }


        values.forEach(function (value) {

            if (
                value !== null &&
                value !== undefined &&
                value !== ""
            ) {

                const option =
                    document.createElement("option");

                option.value = value;
                option.textContent = value;

                dropdown.appendChild(option);

            }

        });

    }


    // =========================================================
    // LOAD REPORT
    // =========================================================


    let riskReportTable = null;


    function loadReport() {

        const params =
            new URLSearchParams();


        // ---------------------------------------------------------
        // FILTERS
        // ---------------------------------------------------------

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


        // ---------------------------------------------------------
        // DATES
        // ---------------------------------------------------------

        const fromDateElement =
            document.getElementById("fromDate");

        const toDateElement =
            document.getElementById("toDate");


        const fromDate =
            fromDateElement
                ? fromDateElement.value
                : "";


        const toDate =
            toDateElement
                ? toDateElement.value
                : "";


        if (fromDate) {

            params.append(
                "fromDate",
                fromDate
            );

        }


        if (toDate) {

            params.append(
                "toDate",
                toDate
            );

        }


        // ---------------------------------------------------------
        // GET DATA
        // ---------------------------------------------------------

        fetch(
            `/Checker/GetReportData?${params.toString()}`
        )

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load report data."
                    );

                }

                return response.json();

            })

            .then(function (data) {

                console.log(
                    "Report records:",
                    data
                );


                // =================================================
                // CREATE DATATABLE ONLY ONCE
                // =================================================

                if (riskReportTable === null) {

                    riskReportTable =
                        $("#riskReportTable").DataTable({

                            data: data,

                            processing: true,

                            pageLength: 10,

                            lengthMenu: [
                                [5, 10, 25, 50, 100],
                                [5, 10, 25, 50, 100]
                            ],

                            scrollX: true,

                            autoWidth: false,

                            deferRender: true,

                            language: {

                                emptyTable:
                                    "No risk records found.",

                                zeroRecords:
                                    "No matching risk records found."

                            },


                            // =================================================
                            // 26 COLUMNS
                            // =================================================

                            columns: [

                                // 1
                                {
                                    data: "riskId",
                                    defaultContent: "-"
                                },

                                // 2
                                {
                                    data: "riskDate",

                                    render: function (data) {

                                        return formatDate(data);

                                    }
                                },

                                // 3
                                {
                                    data: "identifiedRisk",
                                    defaultContent: "-"
                                },

                                // 4
                                {
                                    data: "sourceOfRisk",
                                    defaultContent: "-"
                                },

                                // 5
                                {
                                    data: "riskCategory",
                                    defaultContent: "-"
                                },

                                // 6
                                {
                                    data: "riskSubCategory",
                                    defaultContent: "-"
                                },

                                // 7
                                {
                                    data: "riskEvent",
                                    defaultContent: "-"
                                },

                                // 8
                                {
                                    data: "riskEventDescription",
                                    defaultContent: "-"
                                },

                                // 9
                                {
                                    data: "effect",
                                    defaultContent: "-"
                                },

                                // 10
                                {
                                    data: "probability",
                                    defaultContent: "-"
                                },

                                // 11
                                {
                                    data: "impactLevel",
                                    defaultContent: "-"
                                },

                                // 12
                                {
                                    data: "inherentRiskRating",
                                    defaultContent: "-"
                                },

                                // 13
                                {
                                    data: "residualRiskLevel",
                                    defaultContent: "-"
                                },

                                // 14
                                {
                                    data: "existingRiskMitigation",
                                    defaultContent: "-"
                                },

                                // 15
                                {
                                    data: "mitigationRating",
                                    defaultContent: "-"
                                },

                                // 16
                                {
                                    data: "recommendation",
                                    defaultContent: "-"
                                },

                                // 17
                                {
                                    data: "mitigationPlannedDate",

                                    render: function (data) {

                                        return formatDate(data);

                                    }
                                },

                                // 18
                                {
                                    data: "riskOwner",
                                    defaultContent: "-"
                                },

                                // 19
                                {
                                    data: "status",
                                    defaultContent: "-"
                                },

                                // 20
                                {
                                    data: "registeredBy",
                                    defaultContent: "-"
                                },

                                // 21
                                {
                                    data: "registeredDate",

                                    render: function (data) {

                                        return formatDate(data);

                                    }
                                },

                                // 22
                                {
                                    data: "branchId",
                                    defaultContent: "-"
                                },

                                // 23
                                {
                                    data: "branchName",
                                    defaultContent: "-"
                                },

                                // 24
                                {
                                    data: "approvedBy",
                                    defaultContent: "-"
                                },

                                // 25
                                {
                                    data: "approvedDate",

                                    render: function (data) {

                                        return formatDate(data);

                                    }
                                },

                                // 26
                                {
                                    data: "filePath",

                                    render: function (data) {

                                        if (!data) {

                                            return "-";

                                        }


                                        return `
                                        <a href="${escapeHtml(data)}"
                                           target="_blank"
                                           class="btn btn-sm btn-outline-primary">

                                            <i class="bi bi-paperclip"></i>
                                            View

                                        </a>
                                    `;

                                    }

                                }

                            ],


                            // =================================================
                            // EXPORT BUTTONS
                            // =================================================

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
                                            .css(
                                                "font-size",
                                                "10pt"
                                            );


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


                    // Hide native DataTables buttons
                    $(".dt-buttons").hide();

                }


                // =================================================
                // UPDATE EXISTING DATATABLE
                // =================================================

                else {

                    riskReportTable
                        .clear()
                        .rows
                        .add(data)
                        .draw();

                }

            })

            .catch(function (error) {

                console.error(
                    "Report loading error:",
                    error
                );

            });

    }

    // =========================================================
    // FILTER HELPER
    // =========================================================

    function addFilter(params, elementId) {

        const element =
            document.getElementById(elementId);


        if (!element) {
            return;
        }


        const value =
            element.value;


        if (value !== "") {

            params.append(
                elementId,
                value
            );

        }

    }


    // =========================================================
    // DATE FORMAT
    // =========================================================

    function formatDate(dateString) {

        if (!dateString) {
            return "-";
        }


        const date =
            new Date(dateString);


        if (isNaN(date.getTime())) {
            return "-";
        }


        return date.toLocaleDateString();

    }


    // =========================================================
    // HTML ESCAPE
    // =========================================================

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =========================================================
    // COPY
    // =========================================================

    const btnCopy =
        document.getElementById("btnCopy");

    if (btnCopy) {

        btnCopy.addEventListener("click", function () {

            if (
                $.fn.DataTable.isDataTable(
                    "#riskReportTable"
                )
            ) {

                $(".buttons-copy").click();

            }

        });

    }


    // =========================================================
    // EXCEL
    // =========================================================

    const btnExcel =
        document.getElementById("btnExcel");

    if (btnExcel) {

        btnExcel.addEventListener("click", function () {

            if (
                $.fn.DataTable.isDataTable(
                    "#riskReportTable"
                )
            ) {

                $(".buttons-excel").click();

            }

        });

    }


    // =========================================================
    // PDF
    // =========================================================

    const btnPdf =
        document.getElementById("btnPdf");

    if (btnPdf) {

        btnPdf.addEventListener("click", function () {

            if (
                $.fn.DataTable.isDataTable(
                    "#riskReportTable"
                )
            ) {

                $(".buttons-pdf").click();

            }

        });

    }


    // =========================================================
    // PRINT
    // =========================================================

    const btnPrint =
        document.getElementById("btnPrint");

    if (btnPrint) {

        btnPrint.addEventListener("click", function () {

            if (
                $.fn.DataTable.isDataTable(
                    "#riskReportTable"
                )
            ) {

                $(".buttons-print").click();

            }

        });

    }

});

