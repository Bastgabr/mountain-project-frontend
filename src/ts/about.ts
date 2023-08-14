document.addEventListener('DOMContentLoaded', function () {
  const aboutLink = document.getElementById('home-button');

  aboutLink.addEventListener('click', function () {
    // Use window.location to navigate to the About page
    window.location.href = 'index.html';
  });
});

$("#submit-button").on('click', function(){
  //Check the entries 

  alert("Ok");

});