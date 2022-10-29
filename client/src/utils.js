function convertTimeFromMSToText(diff) {
    let seconds = Math.floor(diff / 1000),
        minutes = Math.floor(seconds / 60),
        hours   = Math.floor(minutes / 60),
        days    = Math.floor(hours / 24),
        months  = Math.floor(days / 30),
        years   = Math.floor(days / 365);
    
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    days %= 30;
    months %= 12;
    
    let timeAsText = ''
    let displayRest = false 
    if (years > 0 || displayRest) { timeAsText += `${years} Years `; displayRest = true; }
    if (months > 0 || displayRest) { timeAsText += `${months} Months `; displayRest = true; }
    if (days > 0 || displayRest) { timeAsText += `${days} Days `; displayRest = true; }
    if (hours > 0 || displayRest) { timeAsText += `${hours} Hours `; displayRest = true; }
    if (minutes > 0 || displayRest) { timeAsText += `${minutes} Minutes `; displayRest = true; }
    // if (seconds > 0 || displayRest) { timeAsText += `${seconds} Seconds `; displayRest = true; }

    return timeAsText
}

export { convertTimeFromMSToText }