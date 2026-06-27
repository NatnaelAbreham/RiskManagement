$(function () {
    $('#dataTable').DataTable({
    responsive: true,
    pageLength: 10,
    scrollX: true,
    autoWidth: false,
    language: {
        search: "",
        searchPlaceholder: "Search risk records..."
    }
});
});