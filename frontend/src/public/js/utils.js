// Code to launch when page is ready
$(document).ready(function() {
    checkRunning();
    fetchInterfaces();
})

function checkRunning(){
    // Check if is running
    $.get("http://localhost:8080/api/sniffer/isRunning", function(data){
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

    $.ajax({
        url: "http://localhost:8080/api/sniffer/start",
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        data: "interface=" + interface + "&timeout=5",
        success: function(){
            checkRunning();
        }
    })
}

function stopSniffer(){
    $.ajax({
        url: "http://localhost:8080/api/sniffer/stop",
        type: "post",
        contentType: "application/x-www-form-urlencoded",
        success: function(){
            checkRunning();
        }
    })
}

function fetchInterfaces(){
    $.get("http://localhost:8080/api/sniffer/getInterfaces", function(data){
        data.interfaces.forEach(iface => {
            var _dropdown = $(".dropdown-menu");
            _dropdown.append("<a class='dropdown-item interface btn btn-secondary' role='button' onclick='startSniffer(this.innerText)'>" + iface + "</a>")
        })
    })
}