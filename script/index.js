let monthlyRecord = {};
let pastMonthDatas = {};

const monthsFixed = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const salaryRate = 71.35;
const OTrate = salaryRate * 1.25

window.onload = function() {
    // localStorage.clear('monthlyRecord')
    let sdsa = JSON.parse(localStorage.getItem('monthlyRecord'))
    console.log(sdsa)
    renderTable();
    getDate()   
    // autoSummary()
}

const today = new Date();
const day = today.getDate();
const month = today.getMonth();
const year = today.getFullYear();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

function getDate() {
    let month = monthsFixed[today.getMonth()];
    const conta = document.getElementById('monthContainer');
    conta.innerText = month;
    
    if (day <= 15) {
        conta.innerText += " 1 - 15";
    } else {
        conta.innerText += " 16 - 31";
    }
}
// function autoSummary() {
//     if(day == 15 || tomorrow.getDate() === 1) {
//         // 1. Get data from both the source and destination
//         const oldMonth = localStorage.getItem("datas");
//         const monthHistory = localStorage.getItem("pastMonthDatas");

//         // 2. Only proceed if there is actually data to transfer
//         if (sourceRaw) {
//         // Convert both items from strings back into JavaScript arrays
//         const sourceArray = JSON.parse(oldMonth);
//         const destinationArray = monthHistory ? JSON.parse(monthHistory) : {};

//         // 3. Combine both arrays together using the spread operator
//         const mergedArray = [...destinationArray, ...sourceArray];

//         // 4. Save the combined list back to the destination key
//         localStorage.setItem("monthHistory", JSON.stringify(mergedArray));

//         // 5. Delete the old key so you don't duplicate data later
//         localStorage.removeItem("oldMonth");
//         }
//     } 
// }
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
    const hrs = document.getElementById('hours').value;
    const inpuits = document.querySelectorAll('input');
    
    let Tin = timeStringToFloat(timeIN);
    let Tout = timeStringToFloat(timeOUT);
    let hrss = parseInt(hrs);
    let currentMonth = String(month)

    const dateObj = new Date(date);
    //===========================================================
    if (!date || isNaN(Tin) || isNaN(Tout) || isNaN(hrss)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const days = dateObj.getDate();
    let indexid = String(year) + currentMonth + String(days)
    let indexID = parseInt(indexid)
    
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

    // if (days == 15 || days == 31 || days == 30) {
    //     pastMonthDatas[currentMonth].push(datas)
    // } 
    const checkThisMonth = localStorage.getItem('monthlyRecord');
    const verifyThisMonth = checkThisMonth ? JSON.parse(checkThisMonth) : {};

    if (!verifyThisMonth[currentMonth]) {
        verifyThisMonth[currentMonth] = []
        verifyThisMonth[currentMonth].push({ indexID, date, timeIN: Tin, timeOUT: Tout, hrs: hrss });
    }
    else {
        verifyThisMonth[currentMonth].push({ indexID, date, timeIN: Tin, timeOUT: Tout, hrs: hrss });
    }

    localStorage.setItem('monthlyRecord', JSON.stringify(verifyThisMonth));
    inpuits.forEach(input => input.value = '');
    window.location.reload();
    // console.log(verifyThisMonth)
}
function deductions(salary, OT) {
    const tot = document.getElementById('totalamounts')
    
    if (OT )
    var overTime = (71.35 * 1.25) * OT
    const SSS = salary * 0.045
    const pagIbig = salary * 0.02
    const pHealth = salary * 0.025

    const estSalary = salary - (SSS + pagIbig + pHealth)

    let icon = `<img src="https://cdn-icons-png.flaticon.com/128/19025/19025308.png" onclick='SummaryBreakdown()'>`

    tot.innerHTML = "₱" + estSalary + icon
    
    const summart = []
    summart.push({salary , overTime, SSS, pagIbig, pHealth})
    localStorage.setItem('subsidies', JSON.stringify(summart))
}

