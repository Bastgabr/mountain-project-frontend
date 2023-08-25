window.onload = function() {
  //Hide loading screen
  $('#loading-screen').css(
    {"opacity":"0",
    "visibility":"hidden",
    });

}


$("#submit-button").on('click', function(){
  //Check the entries 
  alert("Ok");
});


$("input.form-section__input").on("focusout", function(){
  let inputField = $(this);
  if(inputField.val() == ""){
    inputField.css('border');
    inputField.css({
      border: '2px solid #b20a37',
      color: '#b20a37',
    });
  }
  else{
    inputField.css({
      border: '',
      color: '',
    });
  }
});

$("input.form-section__input").on("focusin", function(){
  let inputField = $(this);
  inputField.css({
    border: '',
    color: '',
  });
})


