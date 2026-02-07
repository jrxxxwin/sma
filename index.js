let datas = [];
let pastMonthDatas = [

];

const monthsFixed = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.onload = function() {
    renderTable();
    getDate()   
}
const today = new Date();
const day = today.getDate();

function printPage() {
    window.print();
}
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

    const dateObj = new Date(date);
    //===========================================================
    if (!date || isNaN(Tin) || isNaN(Tout) || isNaN(hrss)) {
        alert("Please fill in all fields correctly.");
        return;
    }
    
    const days = dateObj.getDate();
    
    if (day >= 1 && day <= 15) {
        if (days <= 15 && days >= 1) {} 
        else {
            alert("Date is not within current cut-off   ")
            return
        }
    }
    else if (day >= 16 && day <= 31) {
        if (days <= 31 && days >= 16) {} 
        else {
            alert("Date is not within current cut-off   ")
            return
        }
    }


    if (days == 15 || days == 31 || days == 30) {
        pastMonthDatas.push(datas)
    } 


    datas.push({ date, timeIN: Tin, timeOUT: Tout, hrs: hrss });
    
    let jsonaray = JSON.stringify(datas);

    localStorage.setItem("datas", jsonaray);
    inpuits.forEach(input => input.value = '');
    window.location.reload();
}
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const totalamount = document.getElementById('totalamount');

    const storedData = localStorage.getItem("datas");
    if (storedData) {
        datas = JSON.parse(storedData);
    }
    
    let htmlsss = '';
    let salarytotal = 0;

    datas.forEach((data, index) => {
        let {date, timeIN, timeOUT, hrs} = data;
        // let month = monthsFixed[date.split('-')[1]];
        datas.sort((a, b) => new Date(a.date) - new Date(b.date));

        let hrsworked
        let hrsworkedFixed
        if (timeOUT < timeIN) {
            hrsworked = (timeOUT - 0) + (24 - timeIN) ;
            hrsworkedFixed = parseInt(hrsworked.toFixed(2));
        }
        else if (timeOUT > timeIN) {
            hrsworked = timeOUT - timeIN;
            hrsworkedFixed = parseInt(hrsworked.toFixed(2));
        }
        
    
        let OT = data.hrs - hrsworked;
        let OTF = OT;
        if (OT < 0) {
            OTF = OT * -1;
        }
        if (hrs >= hrsworked) {
            OTF = 0;
        }
        let amount = (hrsworked) * 71.35
        let amountFixed = parseInt(amount.toFixed(2));

        pastMonthDatas.push(month = {date, timeIN, timeOUT, hrsworkedFixed, hrs, OTF, amountFixed});
        const row = `<tr>
            <td>${data.date}</td>
            <td>${data.timeIN.toFixed(2)}</td>
            <td>${data.timeOUT.toFixed(2)}</td>
            <td>${hrsworkedFixed}</td>
            <td>${data.hrs}</td>
            <td>${OTF.toFixed(2)}</td>
            <td>₱${amountFixed}</td>
            <td><button onclick="deleteEntrey(${index})">Delete</button></td>
        </tr>`;
        htmlsss += row;
        salarytotal += (amountFixed);
    })
    tableBody.innerHTML = htmlsss;
    totalamount.innerText = "₱" +salarytotal;
}
function deleteEntrey(index) {
    datas.splice(index, 1);
    let jsonaray = JSON.stringify(datas);
    localStorage.setItem("datas", jsonaray);
    window.location.reload();
}

// function renderLastMonth() {
//     const monthContainer = document.getElementById('pastMonthTable');

//     let html = ''

//     pastMonthDatas.forEach((monthData, monthIndex) => {
//         let monthName = monthsFixed[monthIndex];
//         let year = pastMonthDatas[monthIndex][0]?.date.split('-')[0];
//         let totalHrs = 0;
//         let totalOT = 0;
//         let totalRegular = 0;
//         let totalAmount = 0;

//         // monthData.forEach(entry => {
//         //     // totalHrs += ;
//         //     totalOT += entry.hrs - (entry.timeOUT < entry.timeIN ? (entry.timeOUT + 24 - entry.timeIN) : (entry.timeOUT - entry.timeIN));
//         //     totalRegular += entry.hrs
//         // })

//         const row = `
//             <tr>
//                 <td>${monthName} ${year}</td>
//                 <td>${totalHrs}</td>
//                 <td>${totalRegular}</td>
//                 <td>${totalOT}</td>
//                 <td>$1,150</td>
//                 <td>$1,000 ($25/hr) + $150 ($50/hr)</td>
//             </tr>
//         `
//         html += row;
//     })
//     monthContainer.innerHTML = html;
//     console.log(html);
// }