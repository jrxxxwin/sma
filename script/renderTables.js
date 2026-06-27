function toMilitaryTime(decimalTime) {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime % 1) * 60);

    var hh = String(hours).padStart(2, '0');
    var mm = String(minutes).padStart(2, '0');

    if (hh > 12) {
        hh = parseInt(hh) - 12
        return String(hh) + ':' + mm + "PM"
    }
    else if (hh == 12) {
        return String(hh) + ':' + mm + "PM"
    }
    else {
        return hh + ':' + mm + 'AM';
    }
}
function toHours(decimalTime) {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime % 1) * 60);

    var hh = String(hours).padStart(2, '0');
    var mm = String(minutes).padStart(2, '0');

    if (mm == 0) {
        return hh
    }
    else if (mm == 60) {
        hh = parseInt(hh) + 1
        return String(hh)
    }
    else {
        return hh + ':' + mm;
    }
    
}
function calculateHrsValue(hours, nightdiff, timeIN, timeOUT, workType) {
    let overTime, nightDiffwithOT, regularHrs, salary, Ndiff = 0
    //overtime
    overTime = hours > 8 ? hours - 8 : 0
    //regularhrs
    regularHrs = getDecimalRegularhour(timeIN, timeOUT)
    //nightDiff with OT 
    let thisd = overlapNDiffOT(timeIN + 8, timeOUT, 22, 6)
    let nightDiffwithReg = overlapNDiffReg(timeIN, timeOUT)
    nightDiffwithOT = hours > 8 ? thisd : 0
    //nightDiff
    Ndiff = nightDiffwithOT > 0 ? (nightdiff > nightDiffwithOT ? nightdiff - nightDiffwithOT : nightDiffwithOT - nightdiff) : nightdiff
    //into total value 
    if(workType === "RG") {
        if(Ndiff > 0) {
            if(nightDiffwithOT > 0) {
                overTime -= nightDiffwithOT
            }
            if(regularHrs > 0 && nightDiffwithReg > 0) {
                regularHrs = 8
                salary = (regularHrs * ratePerHour) + (nightDiffwithReg *  (ratePerHour * 0.1)) + (((ratePerHour *( 0.1 + 1.25)) * nightDiffwithOT)) + ((ratePerHour * 1.25) * overTime)
            }
            else {
                salary = (regularHrs * ratePerHour) + (Ndiff *  (ratePerHour * 1.1)) + (((ratePerHour *( 0.1 + 1.25)) * nightDiffwithOT)) + ((ratePerHour * 1.25) * overTime)
            }
            //console.log("Dpay Hours: " + hours + ", regHrs: " + regularHrs + ", nightDiff: " + Ndiff + ", overTime: " + overTime + ", nightDiffwOT: " + nightDiffwithOT)
        }
        else {
            salary = (regularHrs * ratePerHour) + ((ratePerHour * 0.25) * overTime)
        }
    }
    else {
        let {salaryFOR, hoursWorked, mul} = salaryMultiplier(timeIN, timeOUT, workType)
        // console.log("Dpay Hours: " + hoursWorked + ", regHrs: " + regularHrs + ", nightDiff: " + Ndiff + ", overTime: " + overTime + ", nightDiffwOT: " + nightDiffwithOT)
        if(regularHrs < hoursWorked) {
            restHours = hoursWorked - regularHrs
            mul = "0." + mul
            if(Ndiff < 3) {
                salary = salaryFOR + ((ratePerHour * mul) * Ndiff) + (((ratePerHour * 1.1) * 1.25) * nightDiffwithOT)
            }
            else if (Ndiff > 3) {
                let newNightDiff = Ndiff - 2
                salary = salaryFOR + ((ratePerHour * mul) * 2) + ((ratePerHour * 1.1) * newNightDiff) + (((ratePerHour * 1.1) * 1.25) * nightDiffwithOT)
            }
            else if(Ndiff = 0 || overTime > 0) {
                salary = salaryFOR + ((ratePerHour * 0.25) * overTime)
            }
        }
        else {
            salary = salaryFOR + ((ratePerHour * 0.25) * overTime)
        }
    }
    overTime = overTime.toFixed(2)
    return {salary, overTime}
}

var ratePerHour = 75
var i = 0
let nightdiff = 0

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const totalamount = document.getElementById('totalamount');
    const totalOT = document.getElementById('totalOT')
    const totalD = document.getElementById('totalD')
    const totalH = document.getElementById('totalH')

    const thisMonth = localStorage.getItem('monthlyRecord')
    const datas = (thisMonth && thisMonth.trim() !== "") ? JSON.parse(thisMonth) : {};
    
   
    let htmlsss = '';
    let salarytotal = 0;
    let TOTALot, TOTALhours, ot = 0;
    let TD = 0;
    let TH = 0;

    // console.log(datas)
    Object.entries(datas).forEach(([months, dataArray]) => { 

        dataArray.forEach(({ indexID, date, timeIN, timeOUT, hrs, workType}) => {
        let nightdiff =  getDecimalNightDiff(timeIN, timeOUT)
         doublePayNextDay(indexID, timeOUT)
        dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

        let hrsworkedFixed = 0
        if (timeOUT < timeIN) {
            hrsworkedFixed = (timeOUT - 0) + (24 - timeIN) ;  
        }
        else if (timeOUT > timeIN) {
            hrsworkedFixed = timeOUT - timeIN;
        }
        let hrsworked = hrsworkedFixed
        if(workType === undefined) {
            workType = "RG"
        }
        let {salary, overTime} = calculateHrsValue(hrsworked, nightdiff, timeIN, timeOUT, workType)

        let TIMEin = toMilitaryTime(timeIN)
        let TIMEout = toMilitaryTime(timeOUT)
        let TIMEot = toHours(overTime)

        let TOTALhrs = toHours(hrsworkedFixed).replace(/^0+/, '')

        const row = `<tr>
            <td>${indexID}</td>
            <td>${TIMEin}</td>
            <td>${TIMEout}</td>
            <td>${TOTALhrs}</td>
            <td>${overTime}</td>
            <td>₱${salary.toFixed(2)}</td>
            <td><button onclick="deleteEntry(${indexID}, ${months})">Delete</button></td>
        </tr>`;
        htmlsss += row;
        salarytotal += (salary);
        ot += parseInt(overTime)
        TOTALot = toHours(ot).replace(/^0+/, '')
        TD++
        TH += hrsworkedFixed
        TOTALhours = toHours(TH).replace(/^0+/, '')
    })
    deductions(salarytotal, ot)
    tableBody.innerHTML = htmlsss;
    totalamount.innerText = "₱" + salarytotal.toFixed(2);
    totalOT.innerText = TOTALot === undefined ? 0 : (TOTALot == 0 ? 0 : TOTALot)
    totalD.innerText = TD
    totalH.innerText = TOTALhours === undefined ? 0 : TOTALhours
})
}
function getDecimalRegularhour(start, end) {
    if (end < start) {
        end += 24; 
    }

    let ndStart = 6;
    let ndEnd = 22;

    let overlapStart = Math.max(start, ndStart);
    let overlapEnd = Math.min(end, ndEnd);
    let regularHOURS = Math.max(0, overlapEnd - overlapStart);

    if (start > 6) {
        let earlyOverlapStart = Math.max(start, 0);
        let earlyOverlapEnd = Math.min(end, 6);
        regularHOURS += Math.max(0, earlyOverlapEnd - earlyOverlapStart);
    }
    return regularHOURS
}
function getDecimalNightDiff(start, end) {
    if (end < start) {
        end += 24; 
    }

    let ndStart = 22;
    let ndEnd = 30;

    let overlapStart = Math.max(start, ndStart);
    let overlapEnd = Math.min(end, ndEnd);
    let nightHours = Math.max(0, overlapEnd - overlapStart);

    if (start < 6) {
        let earlyOverlapStart = Math.max(start, 0);
        let earlyOverlapEnd = Math.min(end, 6);
        nightHours += Math.max(0, earlyOverlapEnd - earlyOverlapStart);
    }
    return nightHours
}
function doublePayNextDay(index, timeOUT) {
    let data = JSON.parse(localStorage.getItem('monthlyRecord'))
    let asd = index + 1
    let allItems = Object.values(data).flat()
    let checkTom = allItems.find(b => b.indexID === asd)
    let asjd = checkTom ? checkTom.workType : false
    let start = 24
    timeOUT = timeOUT < 24 ? timeOUT + 24 : timeOUT
    if(timeOUT > 24) {
        switch(asjd) {
            case 'RH': {
                let Thours = timeOUT - start
                return 
                break
            }
        }
    }
    
}
