
async function SetFilter(){
    //var baseURL = ""
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

//${data.affiliation.map((i)=> `${i}, `).slice(0, -2)}

function FilterFunction(){
    let sets = SetFilter()
    console.log(sets)
    // how the url will be send to the main js after we have filterd it
    /*let url = ``
    return url*/
}


export {FilterFunction}