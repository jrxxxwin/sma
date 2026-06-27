const monthsFixed = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();
let payday1, payday2, nightdiff = 0
let monthlyRecord = {};
let storedMonth = {};
var ratePerHour = 75

window.onload = function() {
    renderTable()
    getDate()   
    autoLogPerMonth()
}
function getDate() {
    let months = monthsFixed[today.getMonth()];
    const conta = document.getElementById('monthContainer');
    conta.innerText = months;
    
    if (day <= 15) {
        conta.innerText += " 1 - 15";
    } else {
        conta.innerText += " 16 - 31";
    }
}
function timeStringToFloat(time) {
  var hoursMinutes = time.split(/[.:]/);
  var hours = parseInt(hoursMinutes[0], 10);
  var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
  return hours + minutes / 60;
}
function addEntry() {
    const date = document.getElementById('date').value;
    const timeIN = document.getElementById('inTime').value;
    const timeOUT = document.getElementById('outTime').value;
    const inpuits = document.querySelectorAll('input');
    const types = document.getElementById('workType').value
    
    let Tin = timeStringToFloat(timeIN);
    let Tout = timeStringToFloat(timeOUT);
    let currentMonth = String(month)

    const dateObj = new Date(date);
    //===========================================================
    if (!date || isNaN(Tin) || isNaN(Tout)) {
        alert("Please fill in all fields correctly.");
        return;
    }
    let datePar = date.replaceAll('-', '')
    const days = dateObj.getDate();
    let indexID = parseInt(datePar)
    
    if (day >= 1 && day <= 15) {
        currentMonth = currentMonth + 1 
        if (days <= 15 && days >= 1) {} 
        else {
            alert("Date is not within current cut-off   ")
            return
        }
    }
    else if (day >= 16 && day <= 31) {
        currentMonth = currentMonth + 16         
        if (days <= 31 && days >= 16) {} 
        else {
            alert("Date is not within current cut-off   ")
            return
        }
    }

    const checkThisMonth = localStorage.getItem('monthlyRecord');
    const verifyThisMonth = checkThisMonth ? JSON.parse(checkThisMonth) : {};

    if (!verifyThisMonth[currentMonth]) {
        verifyThisMonth[currentMonth] = []
        verifyThisMonth[currentMonth].push({ indexID, date, timeIN: Tin, timeOUT: Tout, workType: types});
    }
    else {
        verifyThisMonth[currentMonth].push({ indexID, date, timeIN: Tin, timeOUT: Tout, workType: types});
    }
    localStorage.setItem('monthlyRecord', JSON.stringify(verifyThisMonth));
    inpuits.forEach(input => input.value = '');
    window.location.reload();
}
function deductions(salary, OT) {
    const tot = document.getElementById('totalamounts')
    
    if (OT )
    var overTime = (ratePerHour * 1.25) * OT
    const SSS = 250
    const pagIbig = salary * 0.01
    const pHealth = 250

    var estSalary = salary - (SSS + pagIbig + pHealth)
    if(salary == 0 ){
        estSalary = 0
    }

    let icon = `<img src="components/icons/calendar.png" onclick='SummaryBreakdown()'>`
    tot.innerHTML = "₱" + estSalary.toFixed(2) + icon
    
    const summart = []
    summart.push({salary , overTime, SSS, pagIbig, pHealth})
    localStorage.setItem('subsidies', JSON.stringify(summart))
}
function salaryMultiplier(timeIN, timeOUT, workType) {
    
    let salaryFOR = 0
    let mul = 0

    if(timeOUT < timeIN) {
        timeOUT += 24
    }

    if(timeOUT > 24) {
        timeOUT = 24
    }

    let hoursWorked = timeOUT - timeIN

    switch(workType) {
        case "RH" : {
                salaryFOR = (hoursWorked * ratePerHour) * 2
                mul = 2
            break
        }
        case "SND" || "RD" : {
                salaryFOR = (hoursWorked * ratePerHour) * 1.30
                mul = 1.30
            break
        }
        case "RHRD" : {
                salaryFOR = (hoursWorked * ratePerHour) * 2.60
                mul = 2.60
            break
        }
        case "SNDRD" : {
                salaryFOR = (hoursWorked * ratePerHour) * 1.5
                mul = 1.5
            break
        }
    }
    return {salaryFOR, hoursWorked, mul}
}
function autoLogPerMonth() {
    let tom = new Date()
    tom.setDate(tom.getDate() + 1)
    tom = tom.getDate()

    let currentMonth = JSON.parse(localStorage.getItem('monthlyRecord')) || {}
    let storedMonth = JSON.parse(localStorage.getItem('storedMonth')) || {}

    if(tom === payday1 || tom === payday2) {
        let newStoredMonth = {...currentMonth,...storedMonth}
        localStorage.setItem("storedMonth", JSON.stringify(newStoredMonth))
        localStorage.removeItem('monthlyRecord')
    }
}
function overlapNDiffOT(start1, end1, start2, end2) {
    if (end1 < start1) end1 += 24;
    if (end2 < start2) end2 += 24;
    const startOverlap = Math.max(start1, start2);
    const endOverlap = Math.min(end1, end2);
    return Math.max(0, endOverlap - startOverlap);
}
function overlapNDiffReg(start1, end1) {
    let start2 = 22
    let end2 = 6

    if (end1 < start1) end1 += 24;
    if (end2 < start2) end2 += 24;
    
    // const startOverlap = Math.max(start1, start2);
    // const endOverlap = Math.min(end1, end2);
    let overlapDiffReg = 0

    
    if (start1 < 6) {
        let earlyOverlapStart = Math.max(start1, -2);
        let earlyOverlapEnd = Math.min(end1, 6);
        overlapDiffReg += Math.max(0, earlyOverlapEnd - earlyOverlapStart);
    }
    return overlapDiffReg
}
