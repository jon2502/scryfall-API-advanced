
function SetFilter(){
    var getsets = document.getElementById("sets")
    var SelectedSets = Array.from(getsets.selectedOptions)
                .map(option => option.value)
    switch(SelectedSets.length){
        case 0 :
            return null
        case 1 :
            return `set:${SelectedSets[0]} `
        default:
            return `(${SelectedSets.map((i)=> `set:${i} or `).join('').slice(0, -4)}) `
    }
}

function ColorFilter(){
    var getColors = document.querySelectorAll('#colors input[type="checkbox"]:checked');
    var SelectedColors = Array.from(getColors)
                .map(option => option.value)
    //make sure that any colors are selected at all
    if (SelectedColors.length>0){
        var colorSelector = document.getElementById('colorSelector').value
        switch(colorSelector){
            case '=' :
                return `color=${SelectedColors.map((i)=>`${i}`).join('')} `
            case '>=' :
                return `color>=${SelectedColors.map((i)=>`${i}`).join('')} `
            case '<=':
                return `color<=${SelectedColors.map((i)=>`${i}`).join('')} `
        }
    }
    return null
}

function checkStatus(val){
    return `${val != null ? `${val}`:``}`
}

function FilterFunction(){
    let sets = SetFilter()
    let color = ColorFilter()
    console.log(color)
    console.log(sets)
    // setup url and check if the status of the filteres arent null
    let url = `${checkStatus(sets)}${checkStatus(color)}&page=`
    console.log(url)
    return url
}


export {FilterFunction}