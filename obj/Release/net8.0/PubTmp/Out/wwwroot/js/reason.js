$(document).on('click', '.reason-btn', function () {
    const reason = $(this).data('reason') || 'No reason available';
    const rejectedBy = $(this).data('rejectedby') || 'Unknown';
    const rejectedOn = $(this).data('rejectedon') || 'Unknown';

    const content = `
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Rejected By:</strong> ${rejectedBy}</p>
        <p><strong>Rejected On:</strong> ${rejectedOn}</p>
    `;

    $('#reasonModalBody').html(content);
    $('#reasonModal').modal('show');
});

