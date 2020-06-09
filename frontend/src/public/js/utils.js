// Code to launch when page is ready
$(document).ready(function() {
    checkRunning();
    fetchInterfaces();
})

function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");

    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
     }
}

function checkRunning(){
    // Check if is running
    $.get("https://" + location.hostname + ":8080/api/sniffer/isRunning", function(data){
        if(data.running){
            $('#dropdownMenuButton').addClass('stop').removeClass('start').removeClass('dropdown-toggle');
            $('#dropdownMenuButton').html('Stop')
            $('#dropdownMenuButton').attr("onclick", "stopSniffer();");
            $('#dropdownMenuButton').attr("data-toggle", "");
        }
        else{
            $('#dropdownMenuButton').addClass('start').addClass('dropdown-toggle').removeClass('stop');
            $('#dropdownMenuButton').removeAttr("onclick", "stopSniffer();");
            $('#dropdownMenuButton').attr("aria-expanded", "false");
            $('#dropdown-div').removeClass('open');
            $('#dropdownMenuButton').html('Launch');
            $('#dropdownMenuButton').attr("data-toggle", "dropdown");
        }
    })
}

function startSniffer(interface){
    var token = getCookie('token');
    var username = getCookie('username');
    $.ajax({
        url: "https://" + location.hostname + ":8080/api/sniffer/start",
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        data: "interface=" + interface + "&timeout=15&token=" + token + "&username=" + username,
        success: function(){
            checkRunning();
        }
    })
}

function stopSniffer(){
    var token = getCookie('token');
    var username = getCookie('username');
    $.ajax({
        url: "https://" + location.hostname + ":8080/api/sniffer/stop",
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        data: "token=" + token + "&username=" + username,
        success: function(){
            checkRunning();
        }
    })
}

function fetchInterfaces(){
    var token = getCookie('token');
    var username = getCookie('username');
    $.get("https://" + location.hostname + ":8080/api/sniffer/getInterfaces?token="+token+"&username="+username, function(data){
        data.interfaces.forEach(iface => {
            var _dropdown = $(".dropdown-menu");
            _dropdown.append("<a class='dropdown-item interface btn btn-secondary' role='button' onclick='startSniffer(this.innerText)'>" + iface + "</a>")
        })
    })
}