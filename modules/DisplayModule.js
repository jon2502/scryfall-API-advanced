
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

function BackButtons (BtnSection){
    var button = document.createElement('button')
    button.setAttribute('id', 'start')
    button.classList.add('NavBtn')
    button.innerHTML = `<<`
    BtnSection.appendChild(button)
    var button = document.createElement('button')
    button.setAttribute('id', 'previous')
    button.classList.add('NavBtn')
    button.innerHTML = `<`
    BtnSection.appendChild(button)
}

function NumberButtons(BtnSection,i){
    var button = document.createElement('button')
    button.setAttribute('id', i + 1)
    button.classList.add('NavBtn')
    button.innerHTML = `${i+1}`
    BtnSection.appendChild(button)
}

function ForwardButtons(BtnSection){
    var button = document.createElement('button')
    button.setAttribute('id', 'next')
    button.classList.add('NavBtn')
    button.innerHTML = `>`
    BtnSection.appendChild(button)
    var button = document.createElement('button')
    button.setAttribute('id', 'end')
    button.classList.add('NavBtn')
    button.innerHTML = `>>`
    BtnSection.appendChild(button)
}


export {CardIMG, BackButtons, NumberButtons, ForwardButtons}