//JavaScript moudules
import * as Display from "./modules/DisplayModule.js"
import * as Filter from "/modules/FilterModule.js"

//HTML DOM elements
var cardsprint = document.getElementById("cardsprint")
var BtnSection = document.getElementById("Btns")
var SetSelect = document.getElementById("sets")
var FilterBtn = document.getElementById("FilterBtn")

// required API URL's and file paths
const URL1 = "https://api.scryfall.com/cards/search?q="
const URL2_1 = 'https://api.scryfall.com/cards/search?q=!"'
const URL2_2 = '"+unique%3Aprints&unique=cards'
const URL3 = 'https://api.scryfall.com/symbology'
const URL4 = 'https://api.scryfall.com/sets'


let currentPage = 1
const maxButtons = 10
const page = "&page="
const legal = "(f:standard or f:pioneer or f:modern or f:legacy or f:vintage or f:commander or f:oathbreaker)"

let savedURL = `${URL1}${legal}${page}`

GenerateContent()

async function fetchSymbols() {
    var response = await fetch(`${URL3}`)
    var jsonData = await response.json();
    var SymbolMap = {}
    jsonData.data.forEach(Symbol =>{
        //for each symbol we add the symbol as the key and the svg link as the value
        SymbolMap[Symbol.symbol] = Symbol.svg_uri;
    })
    return SymbolMap;
}

async function fetchSets() {
    var response = await fetch(`${URL4}`)
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
    Filter.FilterFunction()
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
        setflip()
    
    Display.BackButtons(BtnSection)
    
    const half = Math.round(maxButtons / 2)
    const total = Math.ceil(Data.total_cards / 175)
    var to = maxButtons

    if (currentPage + half >= total){
        to = total;
    } else if (currentPage > half){
        to = currentPage + half
    }
    var from = to - maxButtons
    var end = Math.min(total, from + maxButtons);

    for(var i = from; i< end; i++){
        Display.NumberButtons(BtnSection, i)
    }

    Display.ForwardButtons(BtnSection)

    var activeBtn = document.getElementById(currentPage)
    activeBtn.classList.add('active')
    var allBtn = document.querySelectorAll('.NavBtn')
    allBtn.forEach(Btn =>{
        Btn.addEventListener("click", function(){
            switch(this.id){
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
                    currentPage = parseInt(this.id)
            }
            if(currentPage < 1){
                currentPage = 1
            } else if(currentPage > total){
                currentPage = total
            }
            cardsprint.innerHTML=""
            BtnSection.innerHTML=""
            GenerateContent()
        })
    })
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

// infopage taken from 
async function CreateInfoPage(cardData){
    const symbolMap = await fetchSymbols();
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
    const generateTextBoxHTML = (i) => {
        return`<h1>${cardData.card_faces[i].name} ${replaceSymbolsWithSVGs(cardData.card_faces[i].mana_cost, symbolMap)}</h1>
        <p>${cardData.card_faces[i].type_line}</p>
        <div>
            <p>${replaceSymbolsWithSVGs(cardData.card_faces[i].oracle_text,symbolMap)}</p>
        </div>
        <div class="flavorBox" id="${i}">
        ${'flavor_text' in cardData.card_faces[i] ?`
            <p class="flavortext"><i>${cardData.card_faces[i].flavor_text}</i></p>
        `:``}
        </div>
        ${'power' in cardData ?`
        <p>${cardData.card_faces[i].power}/${cardData.card_faces[i].toughness}</p>
        `:``}`
    }
    
    function replaceSymbolsWithSVGs(text, symbolMap){
        //set up regex to remove text to be replaced
        const regex = /\{([A-Za-z0-9\+\-\/]+)\}/g;
        return text.replace(regex, (match, symbol) => {
            var NewSymbol = `{${symbol}}`
            if (symbolMap[NewSymbol]) {
                //return an img with the svg link
                return `<img src="${symbolMap[NewSymbol]}" alt="${NewSymbol}" class="symbol-icon">`;
            }
            // If no SVG is found, return the symbol as is
            return match;
        });
    }

    var Info = document.createElement('section')
    Info.id = "cardInfo"
        /*check if the data for the cards contains card faces to check if its either a doublefaced card or a split card.*/
        Info.innerHTML=`
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
                    ${/* generate info for each of the cardfaces of a doublefaced card*/ generateTextBoxHTML(0)}
                </div>
                <div id="backSideText">
                    ${generateTextBoxHTML(1)}
                </div>
                <p id="artist">Illustrated by ${cardData.artist}</p>
            </section>
        `:`
            <section id="cardbox">
            <img id="singlecard" src=${cardData.image_uris.normal}>
            </section>
            <section id="textbox">
                <h1>${cardData.name} ${replaceSymbolsWithSVGs(cardData.mana_cost, symbolMap)}</h1>
                <hr>
                <p>${cardData.type_line}</p>
                <hr>
                <div>
                    <p>${replaceSymbolsWithSVGs(cardData.oracle_text, symbolMap)}</p>
                </div>
                <div class="flavorBox">
                ${'flavor_text' in cardData ?`
                    <p class="flavortext"><i>${cardData.flavor_text}</i></p>
                    <hr>
                `:``}
                </div>
                ${'power' in cardData ? /* check if the card has a power value this is beacus only creatur cards has a power toughness value */`
                    <p>${cardData.power}/${cardData.toughness}</p>
                    <hr>
                `:``}
            <p id="artist">Illustrated by ${cardData.artist}</p>
            </section>
            `}
        <section id="altbox">
            ${jsonData.data.map((card) => `<button id="${card.id}">${card.set_name} #${card.collector_number}</button>`).join('')}
        </section>
        `
        modal.append(Info)
        setflip()

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
}
