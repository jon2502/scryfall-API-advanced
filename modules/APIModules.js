
async function fetchfuntion(URL) {
    var response = await fetch(URL)
    var jsonData = await response.json();
    return jsonData
}

async function fetchSets() {
    const SetSelect = document.getElementById("sets")
    var Data = await fetchfuntion(`https://api.scryfall.com/sets`)
    for(var i = 0; i < SetSelect.children.length; i++){
        var Filter = Data.data.filter(set =>
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

function formatSets(set){
    if ($(set.element).is('optgroup')) {
        // Return the text without any formatting
        return set.text;
    }
    var iconUrl = $(set.element).data('icon');
    var $display = $(`<span><img src="${iconUrl}" style="width:20px; height:20px";/> ${set.text}</span>`)
    return $display
}

async function fetchSymbols() {
    var Data = await fetchfuntion("https://api.scryfall.com/symbology")
    var SymbolMap = {}
    Data.data.forEach(Symbol =>{
        //for each symbol we add the symbol as the key and the svg link as the value
        SymbolMap[Symbol.symbol] = Symbol.svg_uri;
    })
    return SymbolMap;
}

export {fetchfuntion, fetchSets, fetchSymbols}