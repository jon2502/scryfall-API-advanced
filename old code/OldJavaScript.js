//this is how i originnaly setup the page using localy stored JSON files with all the data in it

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
        card.type_line !== "Stickers" &&
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
    generateimg(ChunkData, currentPage)
    generateBtn(ChunkData, currentPage)
}
loadDoc()

FilterBtn.addEventListener('click', async function(){
    var results = $('#sets').val();
    console.log(results)
    if(results.length > 0){
        cardsprint.innerHTML=""
        Btn.innerHTML=""
        const response = await fetch(deafult_cards);
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
            card.type_line !== "Stickers" &&
            !card.promo_types?.includes("playtest") &&
            includedformats.some(format => card.legalities?.[format] === "legal") &&
            results.some(set => card.set === set)
        )
        // run next funcion with the JSON data as a parameter
        ChunkData = []
        const chunkSize = 50;
        for(let i = 0; i< Data.length; i += chunkSize){
            const chunk = Data.slice(i, i + chunkSize);
            ChunkData.push(chunk)
        }
        generateimg(ChunkData, currentPage)
        generateBtn(ChunkData, currentPage)
    }
})