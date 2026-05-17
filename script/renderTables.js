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
var ratePerHour = 71.35
var i = 0
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
    let ot = 0;
    let TOTALot = 0;
    let TOTALhours = 0;
    let TD = 0;
    let TH = 0;
    let con = 0
    let index = 0

    Object.entries(datas).forEach(([months, dataArray]) => { 

        dataArray.forEach(({ indexID, date, timeIN, timeOUT, hrs}) => {

        getDecimalNightDiff(timeIN, timeOUT)

        dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

        
        let hrsworkedFixed = 0

        if (timeOUT < timeIN) {
            hrsworkedFixed = (timeOUT - 0) + (24 - timeIN) ;  
        }
        else if (timeOUT > timeIN) {
            hrsworkedFixed = timeOUT - timeIN;
        }
        let hrsworked = hrsworkedFixed
        // console.log(nightdiff)

        let actualOT = 0
        let nightDiffPLusOT = 0
        let hrsworked_without_nightdiff = 0

        hrsworked_without_nightdiff = hrsworked - nightdiff

        if(hrsworked >= 8) {
            actualOT = hrsworked - 8
            

            if(nightdiff == 1 || actualOT == 1) {
                nightDiffPLusOT = 1
            }
            else {
                if (actualOT == 0) {
                    nightDiffPLusOT = actualOT
                } 
                else {
                    if (actualOT < 1) {
                        nightDiffPLusOT = 1 - actualOT 
                    }
                    else {
                        nightdiff = nightdiff - actualOT
                        nightDiffPLusOT = nightdiff - actualOT 
                    }
                }     
            }
        }
        else if(hrsworked < 8) {
            actualOT = 0
            nightdiff
        }
        
//$$\text{Pay} = 71.35 \times 1.00 \times 4 = \mathbf{₱285.40}$$
//$$\text{Pay} = 71.35 \times 1.10 \times 4 = \mathbf{₱313.94}$$
//$$\text{Pay} = 71.35 \times 1.375 \times 2 = \mathbf{₱196.2125}$$
//$$\text{Total Daily Salary} = 285.40 + 313.94 + 196.2125 = \mathbf{₱795.5525}$$  
        console.log("hrsworked: "  + String(hrsworked) +  "    hrsworked_without_nightdiff: " + String(hrsworked_without_nightdiff) + "    nightdiff: " + String(nightdiff) + "  actualOT:   " + String(actualOT) +  "  nightDiffPLusOT:   " + String(nightDiffPLusOT) )

        let accurateValue = 0

        if(!nightDiffPLusOT > 0) {
            accurateValue = (hrsworked_without_nightdiff * ratePerHour) + ((ratePerHour * 1.10) * nightdiff) + ((ratePerHour * 1.25) * actualOT)
        }
        else {
            accurateValue = (hrsworked_without_nightdiff * ratePerHour) + ((ratePerHour * 1.10) * nightdiff) + ((ratePerHour * 1.375) * nightDiffPLusOT)
        }
        let amount = (hrsworked * ratePerHour) + ((ratePerHour * 0.25) * actualOT)
        let amountFixed = parseInt(accurateValue.toFixed(2));

        let TIMEin = toMilitaryTime(timeIN)
        let TIMEout = toMilitaryTime(timeOUT)
        let TIMEot = toHours(actualOT)
        let TimeOT = 0

        if (actualOT == 0) {
            TimeOT
        }
        else {
            TimeOT = TIMEot.replace(/^0+/, '')
        }
        
        let TOTALhrs = toHours(hrsworkedFixed).replace(/^0+/, '')

        const row = `<tr>
            <td>${date}</td>
            <td>${TIMEin}</td>
            <td>${TIMEout}</td>
            <td>${TOTALhrs}</td>
            <td>${hrs}</td>
            <td>${actualOT}</td>
            <td>₱${amountFixed}</td>
            <td><button onclick="deleteEntry(${indexID}, ${months})">Delete</button></td>
        </tr>`;
        htmlsss += row;
        salarytotal += (amountFixed);
        ot += actualOT;
        TOTALot = toHours(ot).replace(/^0+/, '')
        TD++
        TH += hrsworkedFixed
        TOTALhours = toHours(TH).replace(/^0+/, '')
    })
    tableBody.innerHTML = htmlsss;
    totalamount.innerText = "₱" +salarytotal;
    deductions(salarytotal, ot)
    totalOT.innerText = TOTALot
    totalD.innerText = TD
    totalH.innerText = TOTALhours

    
})
}
let nightdiff = 0
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
     return nightdiff  = nightHours
}
