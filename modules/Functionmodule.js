function replaceSymbolsWithSVGs(text, symbolMap){
    //set up regex to remove text to be replaced
    console.log(text)
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

export {replaceSymbolsWithSVGs, setflip}