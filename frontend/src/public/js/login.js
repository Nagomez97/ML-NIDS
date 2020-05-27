// Code to launch when page is ready
function checkForm(){
    var username = $('#username').val();
    var passwd = $('#passwd').val();

    if(username.length > 0 && passwd.length > 0){
        $('#submit-button').removeClass('empty');
        $('#submit-button')[0].type = 'submit';
    }
    else{
        $('#submit-button').addClass('empty');
        $('#submit-button')[0].type = 'button';
    }
}