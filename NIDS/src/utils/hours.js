/**
 * Returns current date and hour
 * dd/mm/yy hh:mm:ss (24h)
 *
 */
function getCurrentTime(){
    var datetime = new Date();
    var day = (datetime.getDate() > 9 ? datetime.getDate() : '0' + datetime.getDate());
    var month = (datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1));
    var year = datetime.getFullYear();
    
    var currentDate = `${day}/${month}/${year}`

    var currentTime = datetime.toTimeString().split(' ')[0];
    if(currentTime.length < 8){
        currentTime = '0' + currentTime; // Append initial 0
    }

    return currentDate + ' ' + currentTime;
}

/**
 * Returns todays date dd/mm/yy
 *
 */
function getCurrentDate(){
    var datetime = new Date();
    var day = (datetime.getDate() > 9 ? datetime.getDate() : '0' + datetime.getDate());
    var month = (datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1));
    var year = datetime.getFullYear();
    
    var currentDate = `${day}/${month}/${year}`

    return currentDate;
}

/**
 * Returns yesterdays date dd/mm/yy
 *
 */
function getYesterdayDate(){
    var datetime = new Date();
    var day = (datetime.getDate() > 9 ? datetime.getDate() - 1 : '0' + datetime.getDate() - 1);
    var month = (datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1));
    var year = datetime.getFullYear();
    
    var currentDate = `${day}/${month}/${year}`

    return currentDate;
}

/**
 *  Given an hour, returns its locale date string from previous 24 hour interval 
 *
 * @param {*} hour
 */
function get24DateFromHour(hour){
    var datetime = new Date();
    var currentHour = datetime.getHours(); // 24h format

    if(hour >= currentHour){ // Day before
        var date = getYesterdayDate();

        if(hour.toString().length == 1){
            hour = '0' + hour;
        }

        hour = hour + ':00:00';

        return date + ' ' + hour;
    }
    else { // Current day
        var date = getCurrentDate();

        if(hour.toString().length == 1){
            hour = '0' + hour;
        }

        hour = hour + ':00:00';

        return date + ' ' + hour;
    }

    
}

/**
 *  Given an hour, returns its locale date string from previous 24 hour interval 
 *
 * @param {*} hour
 */
function get24DateToHour(hour){
    var datetime = new Date();
    var currentHour = datetime.getHours(); // 24h format

    if(hour > currentHour){ // Day before
        var date = getYesterdayDate();
        

        if(hour.toString().length == 1){
            hour = '0' + hour;
        }

        hour = hour + ':00:00';

        return date + ' ' + hour;
    }
    else { // Current day
        var date = getCurrentDate();
        
        if(hour.toString().length == 1){
            hour = '0' + hour;
        }

        hour = hour + ':00:00';

        return date + ' ' + hour;
    }
}

/**
 * Returns current hour minus one hour in format dd/mm/yy hh:mm:ss AM/PM
 *
 */
function getLastHour(){
    var datetime = new Date();
    datetime.setTime(datetime.getTime() - 60*60*1000); // current time minus one hour

    var day = (datetime.getDate() > 9 ? datetime.getDate() : '0' + datetime.getDate());
    var month = (datetime.getMonth() + 1 > 9 ? datetime.getMonth() + 1 : '0' + (datetime.getMonth() + 1));
    var year = datetime.getFullYear();
    
    var currentDate = `${day}/${month}/${year}`

    var currentTime = datetime.toTimeString().split(' ')[0];
    if(currentTime.length < 8){
        currentTime = '0' + currentTime; // Append initial 0
    }

    return currentDate + ' ' + currentTime;
}

module.exports = {
    getCurrentTime,
    getCurrentDate,
    get24DateFromHour,
    get24DateToHour,
    getLastHour
}