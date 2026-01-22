let datas = [];

window.onload = function() {
    renderTable();
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

    let Tin = timeStringToFloat(timeIN);
    let Tout = timeStringToFloat(timeOUT);
    let hrss = parseInt(hrs);

    if (!date || isNaN(Tin) || isNaN(Tout) || isNaN(hrss)) {
        alert("Please fill in all fields correctly.");
        return;
    }
    datas.push({ date, timeIN: Tin, timeOUT: Tout, hrs: hrss });
    renderTable();

    let jsonaray = JSON.stringify(datas);
    localStorage.setItem("datas", jsonaray);
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
            <td>${OT}</td>
            <td>₱${amountFixed}</td>
            <td><button>Edit</button> <button>Delete</button></td>
        </tr>`;
        htmlsss += row;
        salarytotal += parseFloat(amountFixed);
    })
    tableBody.innerHTML = htmlsss;
    totalamount.innerText = "₱" +salarytotal.toFixed(2);
    console.log(datas);
}
