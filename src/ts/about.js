document.addEventListener('DOMContentLoaded', function () {
    const aboutLink = document.getElementById('home-button');
    aboutLink.addEventListener('click', function () {
        // Use window.location to navigate to the About page
        window.location.href = 'index.html';
    });
});
$("#submit-button").on('click', function () {
    //Check the entries 
    alert("Ok");
});
$("#name-input").on("focusout", function () {
    let inputField = $("#name-input");
    if (inputField.val() == "") {
        inputField.css('border');
        inputField.css({
            border: '2px solid #b20a37',
            color: '#b20a37',
        });
    }
    else {
        inputField.css({
            border: '',
            color: '',
        });
    }
});
$("#name-input").on("focusin", function () {
    let inputField = $("#name-input");
    inputField.css({
        border: '',
        color: '',
    });
});
//# sourceMappingURL=about.js.map