
async function SetFilter(){
    var getsets = document.getElementById("sets")
    var SelectedSets = Array.from(getsets.selectedOptions)
                .map(option => option.value)
    console.log(SelectedSets)
    switch(SelectedSets.length){
        case 0 :
            return null
        case 1 :
            return `set:${SelectedSets[0]}`
        default:
            return `(${SelectedSets.map((i)=> `set:${i} or `).join('').slice(0, -4)})`
    }
}

async function ColorFilter(){
    
}

function FilterFunction(){
    let sets = SetFilter()
    let color = ColorFilter()
    console.log(color)
    console.log(sets)
    // how the url will be send to the main js after we have filterd it
    /*let url = ``
    return url*/
}


export {FilterFunction}