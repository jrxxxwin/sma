let collapseStatus = false;
function collapse() {
    const container = document.getElementById('workLogTable')
    const btn = document.getElementById('dropDown')

    if (collapseStatus == false) {
        container.style.display = "none"
        btn.classList.add('flipDrop')
        collapseStatus = true
    }
    else {
        container.style.display = "table"
        btn.classList.remove('flipDrop')
        collapseStatus = false
    }
}