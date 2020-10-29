window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const voiceRecognition = new SpeechRecognition();

let selectedLangFrom = "English";
let selectedLangTo = "Turkish";

let langFromOptions = document.querySelectorAll("#lang-from>a");
let langToOptions = document.querySelectorAll("#lang-to>a");
let langIn = document.querySelector("#langIn");

let swapLangBtn = document.querySelector("#btn-exchange");
let micBtn = document.querySelector("#mic-btn");
let clrBtn = document.querySelector("#clear-txt");

let translatedTxt = document.querySelector("#translatedTxt");

micBtn.addEventListener('click',(e)=>{
    micBtn.style.color = "red";
    voiceRecognition.start();
});

langFromOptions.forEach((tab)=>{
    tab.addEventListener('click',(e)=>{
        langFromOptions.forEach((item)=>{
            if (item !== e.target)
            {
                item.classList.remove("active");
            }
            else
            {
                item.classList.add("active");
                selectedLangFrom = item.textContent;
                voiceRecognition.lang = getLang(selectedLangFrom);
            }
        });
    });
});

langToOptions.forEach((tab)=>{
    tab.addEventListener('click',(e)=>{
        langToOptions.forEach((item)=>{
            if (item !== e.target)
            {
                item.classList.remove("active");
            }
            else
            {
                item.classList.add("active");
                selectedLangTo = item.textContent;
            }
        });
    });
});

swapLangBtn.addEventListener('click',(e)=>{
    langFromOptions.forEach((item)=>{
        if (item.textContent !== selectedLangTo)
        {
            item.classList.remove("active");
        }
        else
        {
            item.classList.add("active");
        }
    });

    langToOptions.forEach((item)=>{
        if (item.textContent !== selectedLangFrom)
        {
            item.classList.remove("active");
        }
        else
        {
            item.classList.add("active");
        }
    });
    [selectedLangFrom,selectedLangTo] = [selectedLangTo,selectedLangFrom];
});

clrBtn.addEventListener('click',(e)=>{
    langIn.value = "";
    translatedTxt.textContent = "";
    clrBtn.style.display = "none";
});

function processVoice(e)
{
    let transcript = Array.of(e.results)
        .map(val=>val[0])
        .map(val=>val[0].transcript)
        .join('');
    
    langIn.value = `${transcript}`.trim();
    if (langIn.value.length !== 0)
    {
        clrBtn.style.display = "block";
    }
    let url = buildUrl(transcript,getLang(selectedLangFrom),getLang(selectedLangTo));
    getTranslation(url);
}

function getLang(a)
{
    if (a === "English")
        return "en";
    else if (a === "Turkish")
        return "tr";
    else
        return "de";
}

function buildUrl(sentence="Hello world",from="en",to='fr'){
    let h = sentence.split(' ').join('%20').split('\n').join('%0A');
    return `https://api.mymemory.translated.net/get?q=${h}!&langpair=${from}|${to}`;
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function getTranslation(url)
{
    console.log(url);
    if (selectedLangFrom === selectedLangTo)
    {
        translatedTxt.textContent = langIn.value;
        return;
    }
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        translatedTxt.textContent = res.responseData.translatedText;
    })
    .catch(err=>{
        console.log(err);
    })
}

var checkInput = debounce(function(){
    if (langIn.value.length !== 0)
    {
        clrBtn.style.display = "block";
    }
    else
    {
        clrBtn.style.display = "none";
    }
    let url = buildUrl(langIn.value,getLang(selectedLangFrom),getLang(selectedLangTo));
    getTranslation(url);
},3000);

langIn.addEventListener('input',checkInput);

voiceRecognition.addEventListener('result',processVoice);
voiceRecognition.addEventListener('end',(e)=>{
    micBtn.style.color = "#828282";
});

// voiceRecognition.start();
