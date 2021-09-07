const Utils = (function () {
    return {
        truncate(str, n) {
            return str ? ((str.length > n) ? str.substr(0, n - 1) + '…' : str) : "";
        },
        formatDate(datetime) {
            const sqlDateArr = datetime.split("T");
            const daymonthyearArr = sqlDateArr[0].split("-");
            const sDay = daymonthyearArr[1];
            const sMonth = daymonthyearArr[2];
            const sYear = daymonthyearArr[0];
            return sDay + "-" + sMonth + "-" + sYear;
        },

        formatTime(datetime) {
            const sqlDateArr = datetime.split("T");
            const hourMinuteArr = sqlDateArr[1].split(":");
            const sHour = hourMinuteArr[0];
            const sMinute = hourMinuteArr[1];
            Number(sHour);
            if(sHour > 12) {
                let convertedNum = sHour - 12; 
                return convertedNum.toString() + ":" + sMinute + " PM";
            }
            return sHour + ":" + sMinute + " AM";
        },
        formatCustomerAddress({ state, city, street, house_number, zip, country }) {
            return `${house_number} ${street} ${city}, ${state}, ${country} ${zip}`;
        }
    };
})();