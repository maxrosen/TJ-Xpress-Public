$(document).ready(function() {
    const navButtonsQuery = $("ul#menu button");
    navButtonsQuery.click(function(event) {
        navButtonsQuery.removeClass("active").prop('disabled', false);
        event.target.classList.add("active");
        event.target.disabled = true;
    });
});

$(".modal button.delete, .modal-background").click(() => {
    ModalFunctions.hideModal();
});