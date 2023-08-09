document.addEventListener('DOMContentLoaded', function () {
  const aboutLink = document.getElementById('about-button');

  aboutLink.addEventListener('click', function () {
    // Use window.location to navigate to the About page
    window.location.href = 'about.html';
  });
});