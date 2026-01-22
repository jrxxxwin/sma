let datas = [];
let pastMonthDatas = [];

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
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let month = months[today.getMonth()];
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
    datas.push({ date, timeIN: Tin, timeOUT: Tout, hrs: hrss });
    
    let jsonaray = JSON.stringify(datas);

    if (!!dateObj.valueOf()) {
        const days = dateObj.getDate();

        
        if (day <= 15) {
        if (days <= 15) {
            // Do nothing
        } else {
            alert("Date is not within the current period.");
            return;
        } }
    
        if (days > 15) {
            // Do nothing
        } else {
            alert("Date is not within the current period.");
            return;
        }  

        if (days == 15 || days == 31 || days == 30) {
            pastMonthDatas.push(datas)
        } 
    }

    localStorage.setItem("months", JSON.stringify(pastMonthDatas));
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

        datas.sort((a, b) => new Date(a.date) - new Date(b.date));

        let hrsworked
        let hrsworkedFixed
        if (data.timeOUT < data.timeIN) {
            hrsworked = (data.timeOUT - 0) + (24 - data.timeIN) ;
            hrsworkedFixed = hrsworked.toFixed(2);
        }
        else if (data.timeOUT > data.timeIN) {
            hrsworked = data.timeOUT - data.timeIN;
            hrsworkedFixed = hrsworked.toFixed(2);
        }
        
    
        let OT = data.hrs - hrsworked;

        if (OT < 0) {
            OT = OT * -1;
        }
        if (data.hrs >= hrsworked) {
            OT = 0;
        }
        let amount = (hrsworked + OT) * 71.35
        let amountFixed = amount.toFixed(2);

        const row = `<tr>
            <td>${data.date}</td>
            <td>${data.timeIN.toFixed(2)}</td>
            <td>${data.timeOUT.toFixed(2)}</td>
            <td>${hrsworkedFixed}</td>
            <td>${data.hrs}</td>
            <td>${OT.toFixed(2)}</td>
            <td>₱${amountFixed}</td>
            <td><button onclick="deleteEntrey(${index})">Delete</button></td>
        </tr>`;
        htmlsss += row;
        salarytotal += parseFloat(amountFixed);
    })
    tableBody.innerHTML = htmlsss;
    totalamount.innerText = "₱" +salarytotal.toFixed(2);
    console.log(datas);
}
function deleteEntrey(index) {
    datas.splice(index, 1);
    let jsonaray = JSON.stringify(datas);
    localStorage.setItem("datas", jsonaray);
    window.location.reload();
}