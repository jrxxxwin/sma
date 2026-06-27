// function SummaryBreakdown() {
//     const popup = document.createElement('div');
//     const subsi = JSON.parse(localStorage.getItem('subsidies'))
//     popup.id  = 'summaryContainer';

//     subsi.forEach(element => {
//         let {salary , overTime, SSS, pagIbig, pHealth} = element
//         popup.innerHTML = `
//         <h1 id="highs">Salary Breakdown</h1>
//         <div id="SummaryDetails">
//             <p>Salary: <span class="greenNumber">${salary}</span></p>
//             <p>OverTime rate: <span class="greenNumber">+${overTime.toFixed(2)}</span></p>
//             <p>SSS: <span class="redNumber">-${SSS.toFixed(2)}</span></p>
//             <p>Pag-ibig: <span class="redNumber">-${pagIbig.toFixed(2)}</span></p>
//             <p>PhiHealth: <span class="redNumber">-${pHealth.toFixed(2)}</span></p>
//         </div>
//     `
//     document.body.appendChild(popup);
//     });

//     // 3. Handle fade-out animation sequence
//     setTimeout(() => {
//         popup.style.opacity = '0';
//     }, 3500);

//     setTimeout(() => {
//         popup.remove();
//     }, 4000);
// }
function printPage() {
    window.print();
}
function deleteEntry(dateToDelete, monthKey) {
    var findDate = parseInt(dateToDelete)

    const rawData = localStorage.getItem("monthlyRecord"); 
    
    if (!rawData) {
        console.error("Storage key not found");
        return;
    }

    const data = JSON.parse(rawData);

    if (data[monthKey] && Array.isArray(data[monthKey])) {
        
        const index = data[monthKey].findIndex(item => item.indexID === findDate);
        
        if (index !== -1) {
        data[monthKey].splice(index, 1);
        
        localStorage.setItem("monthlyRecord", JSON.stringify(data));
        console.log("Item deleted and storage updated!");
        } else {}

    } else {}
    window.location.reload();
}