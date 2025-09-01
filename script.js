//JavaScript moudules
import * as Display from "./modules/DisplayModule.js"
import * as Filter from "./modules/FilterModule.js"
import * as Funcions from "./modules/Functionmodule.js"
import * as API from "./modules/APIModules.js"

//HTML DOM elements
const cardsprint = document.getElementById("cardsprint")
const BtnSection = document.getElementById("Btns")
const colorchecks = Array.from(document.querySelectorAll('#colors input[type="checkbox"]'))

const filterMenu = document.getElementById("menu")
const FilterBtn = document.getElementById("FilterBtn")
const ResetBtn =document.getElementById('ResetBtn')

// required API URL's
const URL1 = "https://api.scryfall.com/cards/search?q="
const URL2_1 = 'https://api.scryfall.com/cards/search?q=!"'
const URL2_2 = '"+unique%3Aprints&unique=cards'

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
    const symbolMap = await API.fetchSymbols();
    const ColorChildren = document.getElementById("colors").childNodes
    ColorChildren.forEach(color =>{
        if(typeof color.innerHTML == "string"){
            color.innerHTML= Funcions.replaceSymbolsWithSVGs(color.innerHTML,symbolMap)
        }
        
    })
}
setSymbolsforFilter()
GenerateContent()

API.fetchSets()

async function GenerateContent(){
    var Data = await API.fetchfuntion(`${savedURL}${currentPage}`)
    for (let CardData of Data.data) {
        Display.CardIMG(CardData)
        var cardinfo = document.getElementById(CardData.name)
        cardinfo.addEventListener('click', function(){
            CreateInfoPage(CardData)
        })
    }
    Funcions.setflip()
    
    //total amount of pages generarated by dividing the total ammout of cards with the amount of cards pr page
    const total = Math.ceil(Data.total_cards/ 175)
    Display.BTN(BtnSection, currentPage, CurrentMaxButtons,total, BasemaxButtons)

    var activeBtn = document.getElementById(currentPage)
    activeBtn.classList.add('active')
    var allBtn = document.querySelectorAll('.NavBtn')
    allBtn.forEach(Btn =>{
        Btn.addEventListener("click", function(){
            currentPage = Funcions.changeCurrentBTN(Btn, currentPage, total)
            Funcions.ResetCardsAndbtn(cardsprint, BtnSection)
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
    Funcions.ResetCardsAndbtn(cardsprint, BtnSection)
    GenerateContent()
}

ResetBtn.addEventListener("click", resetFilter)
async function resetFilter(){
    savedURL = baseURL
    Funcions.ResetCardsAndbtn(cardsprint, BtnSection)
    GenerateContent()
}

// infopage taken from 
async function CreateInfoPage(cardData){
    const symbolMap = await API.fetchSymbols();
    // get data for each prinitng of a card
    var Data = await API.fetchfuntion(`${URL2_1}${cardData.name}${URL2_2}`)
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
    Info.innerHTML= Display.DisplayInfo(cardData, symbolMap, Data)
    modal.append(Info)
    Funcions.setflip()

        for (let object of Data.data){
            var switchinfo = document.getElementById(object.id)
            switchinfo.addEventListener('mouseover', function(){

            })
             
            switchinfo.addEventListener('click', function(){
                Funcions.changeinfo(object)
            })
        }
}