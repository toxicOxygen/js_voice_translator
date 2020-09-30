window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

var eng_box = document.querySelector("#eng_box");
var trans_box = document.querySelector("#trans_box");
var langs = document.querySelectorAll('#to .nav-link');
var current_lng = "tr";


const voiceRecognition = new SpeechRecognition();

function handleTranslationSwitch(selected){
    langs.forEach(lang =>{
        if (lang !== selected){
            lang.classList.remove('active');
        }else{
            lang.classList.add('active');
            current_lng = lang.dataset.lng;
        }
    });
}

function processVoice(e){
    let transcript = Array.of(e.results)
        .map(val=>val[0])
        .map(val=>val[0].transcript)
        .join('');
    
    console.log("current lang "+current_lng);
    writeToScreen(transcript);
    getTranslation(transcript,current_lng);
}

function buildUrl(sentence="Hello world",from="en",to='fr'){
    sentence.split(' ').join('%20');
    return `https://api.mymemory.translated.net/get?q=${sentence}!&langpair=${from}|${to}`;
}

function getTranslation(sentence,to,from="en"){
    let url = buildUrl(sentence,from,to);
    fetch(url)
    .then(res=>res.json())
    .then(res=>{
        writeToScreen(res.responseData.translatedText,false);
    })
    .catch(err=>{
        console.log(err);
    })
}

function writeToScreen(sentence,isSpoken=true){
    let p = document.createElement('p');
    p.classList.add('lead');
    p.innerText = sentence;
    if(isSpoken){
        eng_box.appendChild(p);
    }else{
        trans_box.appendChild(p);
    }
}

langs.forEach(lang => {
    lang.addEventListener('click',(e)=>handleTranslationSwitch(lang));
});

voiceRecognition.addEventListener('result',processVoice);
voiceRecognition.addEventListener('end',voiceRecognition.start);


voiceRecognition.start();