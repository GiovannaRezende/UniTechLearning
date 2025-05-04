document.addEventListener("DOMContentLoaded", function() {
    fetch("../components/header/header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("beforeend", data);
        });
});