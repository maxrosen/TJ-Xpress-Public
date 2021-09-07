//signup modal
const signupButton = document.querySelector('#signup');
const signupModalBg = document.querySelector('#signupModalBg');
const signupModal = document.querySelector('#signupModal');

const loginButton = document.querySelector('#login');
const loginModalBg = document.querySelector('#loginModalBg');
const loginModal = document.querySelector('#loginModal');
const loginSubmit = document.querySelector('#login-submit')

signupButton.addEventListener('click', () => {
    signupModal.classList.add('is-active'); 
});

signupModalBg.addEventListener('click', () => {
    signupModal.classList.remove('is-active');
});

loginButton.addEventListener('click', () => {
    loginModal.classList.add('is-active');

});

loginModalBg.addEventListener('click', () => {
    loginModal.classList.remove('is-active');
});

loginSubmit.addEventListener('click', () => {

// var form = $(this);
// var action = form.attr("signin");
// var data = form.serializeArray();

// console.log(data);

$.ajax({
url: '/home', 
dataType: 'json',
type: 'POST',
contentType: 'application/json',
data: JSON.stringify( { "username": $('#username').val(), "password": $('#password').val() } ),
success: function(data){
console.log("DATA POSTED SUCCESSFULLY"+data);
},
error: function( jqXhr, textStatus, errorThrown ){
console.log(errorThrown);
}
}); 
});  
