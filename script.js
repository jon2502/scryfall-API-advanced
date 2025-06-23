//JavaScript moudules
import * as Display from "./modules/DisplayModule.js"
import * as Filter from "./modules/FilterModule.js"
import * as Funcions from "./modules/Functionmodule.js"

//HTML DOM elements
const cardsprint = document.getElementById("cardsprint")
const BtnSection = document.getElementById("Btns")
const SetSelect = document.getElementById("sets")
const colorchecks = Array.from(document.querySelectorAll('#colors input[type="checkbox"]'))
console.log(colorchecks)

const filterMenu = document.getElementById("menu")
const FilterBtn = document.getElementById("FilterBtn")

// required API URL's
const URL1 = "https://api.scryfall.com/cards/search?q="
const URL2_1 = 'https://api.scryfall.com/cards/search?q=!"'
const URL2_2 = '"+unique%3Aprints&unique=cards'
const URL3 = 'https://api.scryfall.com/sets'

//values used on the page
let currentPage = 1
// the standart max ammount of buttons
const BasemaxButtons = 10
// a mutable value that is used to determin how many buttons will be shown on the page
let CurrentMaxButtons = 10

//URL values for use in API calls
const page = "&page="
const legal = "(f:standard or f:pioneer or f:modern or f:legacy or f:vintage or f:commander or f:oathbreaker)"

//the base url combination 
const baseURL = `${URL1}${legal}${page}`
//the saved url is made to be mutable and change based on filters
let savedURL = `${URL1}${legal}${page}`


async function setSymbolsforFilter(){
    const symbolMap = await Funcions.fetchSymbols();
    const ColorChildren = document.getElementById("colors").childNodes
    console.log(ColorChildren)
    ColorChildren.forEach(color =>{
        if(typeof color.innerHTML == "string"){
            color.innerHTML= Funcions.replaceSymbolsWithSVGs(color.innerHTML,symbolMap)
        }
        
    })
}
setSymbolsforFilter()

GenerateContent()

async function fetchSets() {
    var response = await fetch(`${URL3}`)
    var jsonData = await response.json();
    for(var i = 0; i < SetSelect.children.length; i++){
        var Filter = jsonData.data.filter(set =>
            set.set_type === SetSelect.children[i].id
        )
        var curerenttype = document.getElementById(SetSelect.children[i].id)
        for (let set of Filter){
            var ALLCapscode = set.code.toUpperCase()
            var instance = document.createElement('option')
            instance.innerHTML = `${set.name} (${ALLCapscode})`
            instance.setAttribute('value', `${set.code}`)
            instance.setAttribute('data-icon', set.icon_svg_uri);
            curerenttype.appendChild(instance)
        }
    }
    // Initialize Select2 or custom dropdown enhancement
    $("#sets").select2({
        templateResult: formatSets,
        templateSelection: formatSets,
    });
}
fetchSets()

function formatSets(set){
    if ($(set.element).is('optgroup')) {
        // Return the text without any formatting
        return set.text;
    }
    var iconUrl = $(set.element).data('icon');
    var $display = $(`<span><img src="${iconUrl}" style="width:20px; height:20px";/> ${set.text}</span>`)
    return $display
}

async function GenerateContent(){
    console.log(`${savedURL}${currentPage}`)
    var response = await fetch(`${savedURL}${currentPage}`)
    var Data = await response.json()
    console.log(Data)
    for (let CardData of Data.data) {
        Display.CardIMG(CardData)
        var cardinfo = document.getElementById(CardData.name)
        cardinfo.addEventListener('click', function(){
            CreateInfoPage(CardData)
        })
    }
    Funcions.setflip()
    
    Display.BackButtons(BtnSection)
    
    const half = Math.round(CurrentMaxButtons / 2)
    const total = Math.ceil(Data.total_cards / 175)
    if(total < 10){
        CurrentMaxButtons = total
    }else{
        CurrentMaxButtons = BasemaxButtons
    }

    var to = CurrentMaxButtons

    if (currentPage + half >= total){
        to = total;
    } else if (currentPage > half){
        to = currentPage + half
    }
    var from = to - CurrentMaxButtons
    var end = Math.min(total, from + CurrentMaxButtons);

    for(var i = from; i< end; i++){
        Display.NumberButtons(BtnSection, i)
    }

    Display.ForwardButtons(BtnSection)

    var activeBtn = document.getElementById(currentPage)
    activeBtn.classList.add('active')
    var allBtn = document.querySelectorAll('.NavBtn')
    allBtn.forEach(Btn =>{
        Btn.addEventListener("click", function(){
            currentPage = Funcions.changeCurrentBTN(Btn, currentPage, total)
            console.log(currentPage)
            cardsprint.innerHTML=""
            BtnSection.innerHTML=""
            GenerateContent()
        })
    })
}

colorchecks.forEach(check =>{
    check.addEventListener("input", function(){
        Funcions.CheckColor(colorchecks, check)
    })
})


FilterBtn.addEventListener("click", SetFilter)
async function SetFilter(){
    let selectedFilters = Filter.FilterFunction()
    savedURL = `${URL1}${selectedFilters}`
    currentPage = 1
    cardsprint.innerHTML=""
    BtnSection.innerHTML=""
    GenerateContent()
}

async function resetFilter(){
    savedURL = baseURL
    cardsprint.innerHTML=""
    BtnSection.innerHTML=""
    GenerateContent()
}



// infopage taken from 
async function CreateInfoPage(cardData){
    const symbolMap = await Funcions.fetchSymbols();
    // get data for each prinitng of a card
    console.log(cardData.name)
    const response = await fetch(`${URL2_1}${cardData.name}${URL2_2}`);
    const jsonData = await response.json();

    let overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.prepend(overlay);

    // Modal div
    let modal = document.createElement('div');
    modal.classList.add('modal');
    overlay.append(modal);

    // Close operator info button
    let closeBtn = document.createElement('button');
    closeBtn.innerText = "X";
    modal.append(closeBtn);
    closeBtn.addEventListener('click', (e) => {
        e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    })
    

    var Info = document.createElement('section')
    Info.id = "cardInfo"
        Info.innerHTML= Display.DisplayInfo(cardData, symbolMap, jsonData)
        modal.append(Info)
        Funcions.setflip()

        for (let object of jsonData.data){
            var switchinfo = document.getElementById(object.id)
            switchinfo.addEventListener('mouseover', function(){

            })
             
            switchinfo.addEventListener('click', function(){
                changeinfo(object)
            })
        }
        // change content shown based on a data for spesifick printing of a card
        function changeinfo(obj){
            var cardart = document.getElementById('singlecard')
            var artistName = document.getElementById('artist')
            var flavorBox = document.querySelectorAll('.flavorBox')


            if(cardart.hasChildNodes()){
                //check if singlecard has childelement to check if the card is doublefaced
                cardart.innerHTML = `
                <img class="overlayfrontFace" src=${obj.card_faces[0].image_uris.normal}>
                <img class="overlaybackSide" src=${obj.card_faces[1].image_uris.normal}>
                `
            }else{
                cardart.setAttribute('src', obj.image_uris.normal,)
            }

            artistName.innerText=`Illustrated by ${obj.artist}`

            Funcions.editFlavorText(obj, flavorBox)
}
}
