
//functions that are used on the site

function replaceSymbolsWithSVGs(text, symbolMap){
    //set up regex to remove text to be replaced
    var newtext = text.replace(/\n/g, "<br>");
    const regex = /\{([A-Za-z0-9\+\-\/]+)\}/g;
    return newtext.replace(regex, (match, symbol) => {
        var NewSymbol = `{${symbol}}`
        if (symbolMap[NewSymbol]) {
            //return an img with the svg link
            return `<img src="${symbolMap[NewSymbol]}" alt="${NewSymbol}" class="symbol-icon">`;
        }
        // If no SVG is found, return the symbol as is
        return match;
    });
}

// set a funcion that adds a class to the element on click 
//which cahnges the styling of the card resulting in it showing the element beneth it
function setflip(){
    var flipButtons = document.querySelectorAll('.flipbtn')
    flipButtons.forEach(btn=>{
        console.log(btn)
        btn.addEventListener('click',function(){
            var card = btn.parentElement.childNodes[0]
            if(card.classList.contains('flip')){
                card.classList.remove('flip')
            }else{
                card.classList.add('flip')
            }
        })
    })
}

function CheckColor(colorchecks, check){
    switch(check.value){
        case "C" :
            colorchecks.forEach(set =>{
                if(set.value != "C"){
                    set.checked = false
                }
            })
        break
        default:
            colorchecks[colorchecks.length -1].checked= false
        break;
        }
}

function editFlavorText(obj, flavorBox){
    //check if card is doublefaced and has two flavorboxes for doublefaced cards
    //added to make sure everything is done correctly and the change of data doesent destroy the defult UI for the data
    if(flavorBox.length > 1){
        flavorBox.forEach(box => {
            var flavorText = box.querySelector('.flavortext');
            if (!obj.card_faces[box.id].flavor_text) {
                if(flavorText){
                    flavorText.innerHTML = ''; // Clear flavor text if it doesn't exist
                }
            }else{
                //check if flavor text already exist else add it againg
                if(flavorText){
                    flavorText.innerHTML = `<i>${obj.card_faces[box.id].flavor_text}</i>`;
                }else{
                    flavorText = document.createElement('p');
                    flavorText.classList.add('flavortext');
                    flavorText.setAttribute('id', `${box.id}`)
                    flavorText.innerHTML=`<i>${obj.card_faces[box.id].flavor_text}</i>`
                    box.appendChild(flavorText);
                }
            }
        })
    } else {
        flavorBox.forEach(box => {
            var flavorText = box.querySelector('.flavortext');
            // Clear flavor text if it doesn't exist in the new data
            if (!obj.flavor_text) {
                if(flavorText){
                    flavorText.innerHTML = ''; 
                }
            }else {
                if(flavorText){
                    //set flavortext to new value
                    flavorText.innerHTML = `<i>${obj.flavor_text}</i>`;
                }else{
                    // if flavor text dosent exist create it again
                    flavorText = document.createElement('p');
                    flavorText.classList.add('flavortext');
                    flavorText.innerHTML=`<i>${obj.flavor_text}</i>`
                    box.appendChild(flavorText);
                }
            }
        });
    }
}

function changeCurrentBTN(Btn, currentPage, total){
    switch(Btn.id){
        case 'start':
            currentPage = 1
            break;
        case 'next':
            currentPage = currentPage + 1
            break;
        case 'previous':
            currentPage = currentPage - 1
            break;                 
        case 'end':
            currentPage = total
            break;
        default:
            currentPage = parseInt(Btn.id)
    }
    if(currentPage < 1){
        currentPage = 1
    } else if(currentPage > total){
        currentPage = total
    }
    return currentPage
}

export {replaceSymbolsWithSVGs, setflip, CheckColor, editFlavorText, changeCurrentBTN}