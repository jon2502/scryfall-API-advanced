
import * as Funcions from "./Functionmodule.js"

//display content for the page

//Main page
function CardIMG (CardData){
    const cards = document.createElement('div')
    cards.classList.add('card')
    if ('card_faces' in CardData){
            if (CardData.layout == "split" || CardData.layout == "adventure" || CardData.layout == "flip"){
                cards.setAttribute("id", CardData.name);
                cards.innerHTML=`<img src=${CardData.image_uris.normal}>`
            }else{
                cards.innerHTML=`<div class="doublefacedcard" id="${CardData.name}">
                    <img class="frontFace" src=${CardData.card_faces[0].image_uris.normal}>
                    <img class="backSide" src=${CardData.card_faces[1].image_uris.normal}>
                </div><button class="flipbtn">flip</button>`  
            }
        } else {
            cards.setAttribute("id", CardData.name);
            cards.innerHTML=`<img src=${CardData.image_uris.normal}>` 
        }
        cardsprint.appendChild(cards)
}

//Nav buton geniration
function BTN (BtnSection, currentPage, CurrentMaxButtons, total, BasemaxButtons){

    var Back = [
        {icon: `<<`, id: `start`},
        {icon: `<`, id: `previous`}]
    for(var i = 0; i< Back.length; i++){
        var button = document.createElement('button')
        button.setAttribute('id', Back[i].id)
        button.classList.add('NavBtn')
        button.innerHTML = Back[i].icon
        BtnSection.appendChild(button)
    }

    
    if(total < 10){
        CurrentMaxButtons = total
    }else{
        CurrentMaxButtons = BasemaxButtons
    }

    //Find the "halfway point" in the max number of buttons.
    const half = Math.round(CurrentMaxButtons / 2)

    //get index endpoint

    // if curentpage + halft toal amount of buttons exceeds the total page count,
    // Then set end index to total as to not generate aditional buttons
    if (currentPage + half >= total){
        var end = total
    //If currentPage is larger then half the value of total buttons,
    //then set it so that curent currentPage button is centrelized in the button menu
    } else if (currentPage > half){
        var end = currentPage + half
    //else the index is close to the start page 1 to 5 and therefor we just set end to max buttons value
    } else {
        var end = CurrentMaxButtons
    }

    //calculate starting point by subtracting CurrentMaxButtons from end value
    var from = end - CurrentMaxButtons


    //Loop through the range and create a button for each page number.
    for(var i = from; i< end; i++){
        console.log(i)
        var button = document.createElement('button')
        button.setAttribute('id', i + 1)
        button.classList.add('NavBtn')
        button.innerHTML = `${i+1}`
        BtnSection.appendChild(button)
    }

    var Forward = [
        {icon: `>`, id: `next`},
        {icon: `>>`, id: `end`}
    ]

    for(var i = 0; i< Forward.length; i++){
        var button = document.createElement('button')
        button.setAttribute('id', Forward[i].id)
        button.classList.add('NavBtn')
        button.innerHTML = Forward[i].icon
        BtnSection.appendChild(button)
    }
}

//Overlay display
function DisplayInfo(cardData, symbolMap, jsonData){

    //${'check if card has index' in card ?`id="${index}"`:``}
    const generateTextBoxHTML = (card, index) => {
        return`
        <h1>${card.name} ${Funcions.replaceSymbolsWithSVGs(card.mana_cost, symbolMap)}</h1>
        <hr>
        <p>${card.type_line}</p>
        <hr>
        <div>
            <p>${Funcions.replaceSymbolsWithSVGs(card.oracle_text,symbolMap)}</p>
            <hr>
        </div>
        ${'flavor_text' in card ?`
        <div class="flavorBox" ${index != null ? `id="${index}"`:``}>
            <p class="flavortext"><i>${card.flavor_text}</i></p>
            <hr>
        </div>
        `:``}
        ${'power' in card ?`
        <p>${card.power}/${card.toughness}</p>
        <hr>
        `:``}`
    }

    /*check if the data for the cards contains card faces to check if its either a doublefaced card or a split card.*/
    const card = `
            ${'card_faces' in cardData ? `
            <section id="cardbox">${'split' == cardData.layout ? `
            <img id="singlecard" src=${cardData.image_uris.normal}>
        `:`<div class="doublefacedcard" id="singlecard">
                    <img class="overlayfrontFace" src=${cardData.card_faces[0].image_uris.normal}>
                    <img class="overlaybackSide" src=${cardData.card_faces[1].image_uris.normal}>
                </div>
                <button class="flipbtn">flip</button>
            `}
            </section>
            <section id="textbox">
                <div id="frontFaceText">
                    ${generateTextBoxHTML(cardData.card_faces[0], 0)}
                </div>
                <div id="backSideText">
                    ${generateTextBoxHTML(cardData.card_faces[1], 1)}
                </div>
                <p id="artist">Illustrated by ${cardData.artist}</p>
            </section>
        `:`
            <section id="cardbox">
            <img id="singlecard" src=${cardData.image_uris.normal}>
            </section>
            <section id="textbox">
                ${generateTextBoxHTML(cardData, null)}
            <p id="artist">Illustrated by ${cardData.artist}</p>
            </section>
            `}
        <section id="altbox">
            ${jsonData.data.map((card) => `<button id="${card.id}">${card.set_name} #${card.collector_number}</button>`).join('')}
        </section>
        `
    return card
}

export {CardIMG, BTN, DisplayInfo}