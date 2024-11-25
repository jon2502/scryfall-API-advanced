var print = document.getElementById("cardsprint")
var Btn = document.getElementById("Btn")

// required API URL's and file paths
const deaoracle_cards = "Bulk_data/default_cards.json"


async function loadDoc() {
    const response = await fetch(deaoracle_cards);
    var Data = await response.json();
    //filter the data then send it to the function that generate images
    var Data = Data.filter(data=> data.set_type != "memorabilia")
    var Data = Data.filter(data=> data.layout != "token")
    var Data = Data.filter(data=> data.layout != "emblem")
    var Data = Data.filter(data=> data.layout != "double_faced_token")
    var Data = Data.filter(data=> data.layout != "planar")
    var Data = Data.filter(data=> !(Array.isArray(data.promo_types) && data.promo_types.includes('playtest')))
    var Data = Data.filter(data=> data.games.length === 1 && !data.games.includes("arena"))
    var Data = Data.filter(data=> data.games.length === 1 && !data.games.includes("mtgo"))
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
    button.innerHTML = `<<`
    Btn.appendChild(button)
    var button = document.createElement('button')
    button.setAttribute('id', '<')
    button.innerHTML = `<`
    Btn.appendChild(button)
    for(var i = 0; i< Data.length; i++){
        var button = document.createElement('button')
        button.setAttribute('id', i+1)
        button.innerHTML = `${i+1}`
        Btn.appendChild(button)
    }
    var button = document.createElement('button')
    button.setAttribute('id', '>')
    button.innerHTML = `>`
    Btn.appendChild(button)
    var button = document.createElement('button')
    button.setAttribute('id', '>>')
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