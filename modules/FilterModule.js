
async function SetFilter(){
    var getsets = document.getElementById("sets")
    var SelectedSets = Array.from(getsets.selectedOptions)
                .map(option => option.value)
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
    var getColors = document.querySelectorAll('#colors input[type="checkbox"]:checked');
    console.log(getColors)
    var SelectedColors = Array.from(getColors)
                .map(option => option.value)
    if (SelectedColors.length>0){
        console.log('test')
        var colorSelector = document.getElementById('colorSelector').value
        console.log(colorSelector)
        switch(colorSelector){
            case '=' :
                return `color=${SelectedColors.map((i)=>`${i}`).join('')}`
            case '>=' :
                return `color>=${SelectedColors.map((i)=>`${i}`).join('')}`
            case '<=':
                return `color<=${SelectedColors.map((i)=>`${i}`).join('')}`
        }
    }
    return null
}

function FilterFunction(){
    //let sets = SetFilter()
    let color = ColorFilter()
    console.log(color)
    //console.log(sets)
    // how the url will be send to the main js after we have filterd it
    /*let url = ``
    return url*/
}


export {FilterFunction}