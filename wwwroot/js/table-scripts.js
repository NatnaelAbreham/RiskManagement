$(function () {
    $('#dataTable').DataTable({
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50, 100]
    });
});

const table = $('#dataTable').DataTable({
    pageLength: 5,
    lengthMenu: [5, 10, 25, 50, 100],

    dom: 'Bfrtip',

    buttons: [
        {
            extend: 'copy',
            className: 'buttons-copy'
        },
        {
            extend: 'excel',
            className: 'buttons-excel'
        }
    ]
});

$('.dt-buttons').hide();