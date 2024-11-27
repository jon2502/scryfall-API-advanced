var print = document.getElementById("cardsprint")
var Btn = document.getElementById("Btn")

// required API URL's and file paths
const oracle_cards = "Bulk_data/oracle_cards.json"
const deafult_cards = "Bulk_data/default_cards.json"


async function loadDoc() {
    const response = await fetch(oracle_cards);
    var Data = await response.json();
    //a list of formats where a card needs to be legal in atleast one. This is to make sure that arena exlusive cards are not included.
    const includedformats = ["standard", "pioneer", "modern", "legacy", "vintage", "commander", "oathbreaker"]
    //start with filtering the data to remove parts that arent necessary for displaying
    Data = Data.filter(card => 
        card.set_type !== "memorabilia" &&
        card.layout !== "token" &&
        card.layout !== "emblem" &&
        card.layout !== "double_faced_token" &&
        card.layout !== "planar" &&
        !card.promo_types?.includes("playtest") &&
        includedformats.some(format => card.legalities?.[format] === "legal")
    )
    // run next funcion with the JSON data as a parameter
    ChunkData = []
    const chunkSize = 50;
    for(let i = 0; i< Data.length; i += chunkSize){
        const chunk = Data.slice(i, i + chunkSize);
        ChunkData.push(chunk)
    }
    generateimg(ChunkData, 1)
    generateBtn(ChunkData)
}
loadDoc()


async function generateimg(Data, i){
    console.log(i)
    console.log(Data[i])
    for (CardData of Data[i]) {
        if ('card_faces' in CardData){
                const cards = document.createElement('div')
                cards.classList.add('card')
                if (CardData.layout == "split" || CardData.layout == "adventure" || CardData.layout == "flip"){
                    cards.setAttribute("id", CardData.name);
                    cards.innerHTML=`<img src=${CardData.image_uris.normal}>`
                }else{
                    cards.innerHTML=`<div class="doublefacedcard" id="${CardData.name}">
                        <img class="frontFace" src=${CardData.card_faces[0].image_uris.normal}>
                        <img class="backSide" src=${CardData.card_faces[1].image_uris.normal}>
                    </div><button class="flipbtn">flip</button>`  
                }
                cardsprint.appendChild(cards)
    
            } else {
                const cards = document.createElement('div')
                cards.classList.add('card')
                cards.setAttribute("id", CardData.name);
                cards.innerHTML=`<img src=${CardData.image_uris.normal}>`
                cardsprint.appendChild(cards)
            }
            cardinfo = document.getElementById(CardData.name)
            cardinfo.addEventListener('click', function(){
                //CreateInfoPage(CardData)
        })
    }
        setflip()

}

async function generateBtn(Data){
    var button = document.createElement('button')
    button.setAttribute('id', '<<')
    button.classList.add('NavBtn')
    button.innerHTML = `<<`
    Btn.appendChild(button)
    var button = document.createElement('button')
    button.setAttribute('id', '<')
    button.classList.add('NavBtn')
    button.innerHTML = `<`
    Btn.appendChild(button)
    for(var i = 0; i< Data.length; i++){
        var button = document.createElement('button')
        button.setAttribute('id', i)
        button.classList.add('NavBtn')
        button.innerHTML = `${i+1}`
        Btn.appendChild(button)
    }
    var button = document.createElement('button')
    button.setAttribute('id', '>')
    button.classList.add('NavBtn')
    button.innerHTML = `>`
    Btn.appendChild(button)
    var button = document.createElement('button')
    button.setAttribute('id', '>>')
    button.classList.add('NavBtn')
    button.innerHTML = `>>`
    Btn.appendChild(button)
}

// set a funcion that adds a class to the element on click 
//which cahnges the styling of the card resulting in it showing the element beneth it
function setflip(){
    var flipButtons = document.querySelectorAll('.flipbtn')
    flipButtons.forEach(btn=>{
        btn.addEventListener('click',function(){
            card = btn.parentElement.childNodes[0]
            if(card.classList.contains('flip')){
                card.classList.remove('flip')
            }else{
                card.classList.add('flip')
            }
        })
    })
}