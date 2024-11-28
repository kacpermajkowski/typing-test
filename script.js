async function getQuoteFile(){
    let quotesFileUrl = "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/quotes/english.json";
    return await fetch(quotesFileUrl).then(file => file.text()).then(t => t);
}

async function getQuotes(){
    let quotesFileObject = JSON.parse(await getQuoteFile());
    return await quotesFileObject.quotes;
}

let textToType = null;
async function getRandomQuote(){
    let quotes = await getQuotes();
    let quoteId = (Math.random() * 1000 % quotes.length).toFixed(0);
    return quotes[quoteId].text;
}

async function loadTextToType(){
    textToType = await getRandomQuote();
}

let textTyped = '';
let DOMstatsWpm = document.getElementById("stats-wpm");
let DOMstatsTime = document.getElementById("stats-time");
let DOMstatsAccuracy = document.getElementById("stats-accuracy");

let DOMtextDisplay = document.getElementById("text-display");

let statsIntervalID;
let timerBegin = null;
let time = 0;

resetTextTyped();

document.addEventListener("keydown", (e) => {
    e.preventDefault();
    if(statsIntervalID == null){
        timerBegin = Date.now();
        statsIntervalID = setInterval(renderStats, 1000);
    }
    if(e.code === `Key${e.key.toUpperCase()}`){
        textTyped += e.key;
    } else if(e.code === "Space"){
        if(textTyped[textTyped.length-1] != " ")
            textTyped += ` `;
    } else if (e.key === "Backspace"){
        textTyped = textTyped.substring(0, textTyped.length - 1); 
    } else if (e.code === "Comma"){
        textTyped += `,`;
    } else if (e.code === "Period"){
        textTyped += `.`;
    } else if (e.code === "Tab"){
        resetTextTyped();
    }
    renderTextDisplay();
});

async function resetTextTyped(){
    stopTimer();
    textTyped = ``;
    await loadTextToType();
    renderTextDisplay();
}

function stopTimer(){
    clearInterval(statsIntervalID);
    statsIntervalID = null;
}

function renderStats(){
    let timerEnd = Date.now();
    time = timerEnd - timerBegin;
    let timeInSeconds = time / 1000;
    timeInSeconds = timeInSeconds.toFixed(0);
    let wpm = (textTyped.length / timeInSeconds ) * 12;
    wpm = wpm.toFixed(0);
    let accuracy = ((textTyped.length - DOMtextDisplay.getElementsByClassName("incorrect").length) / textTyped.length) * 100;
    accuracy = accuracy.toFixed(0);

    DOMstatsWpm.innerHTML = "Speed: " + wpm + " wpm";
    DOMstatsTime.innerHTML = "Time: " + timeInSeconds + "s";
    DOMstatsAccuracy.innerHTML = "Accuracy: " + accuracy + "%";
}

function renderTextDisplay(){
    let textToDisplay = '';

    for(let i = 0; i < textTyped.length; i++){
        let letter = document.createElement("span");
        letter.className = textTyped[i] === textToType[i] ? `correct` : `incorrect`;
        letter.innerHTML = textTyped[i];
        textToDisplay += letter.outerHTML;
    }
    textToDisplay += `</span><span class="caret" id="caret"></span>`;
    textToDisplay += textToType.slice(textTyped.length);
    DOMtextDisplay.innerHTML = textToDisplay;
}