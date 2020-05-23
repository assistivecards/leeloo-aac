var fs = require('fs');
let regex = /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g;
var emojiStrip = require('emoji-strip')
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

let languages = require("../data/languages.json");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

let existCheck = false;
let type = "free";
let filename = "feelings";
let content = fs.readFileSync("packs/"+type+"/"+filename+".csv", {encoding: "utf8"});

function phraseTranslation(lang, cardRows){
  return Promise.all(cardRows.map((phrase, j) => {
    if(j >= 2){
      let strippedPhrase = emojiStrip(phrase).replace(/[^\x00-\x7F]/g, ""); // 🧼🧻🧸🧽🧍🥶🧎🦶
      let emoji = phrase.replace(strippedPhrase, "");
      if(phrase != ""){
        if(lang == "en"){
          return Promise.resolve({
            type: emoji,
            phrase: strippedPhrase
          });
        }else{
          return translate.translate(strippedPhrase, { from: "en", to: lang }).then(translations => {
            return Promise.resolve({
              type: emoji,
              phrase: translations[0]
            });
          }).catch((err) => {
            console.log("$$$$"+lang, err);
          });
        }
      }
    }
  }));
}

function cardTranslation(lang){
  return Promise.all(content.split("\r\n").filter(c => c != "").map((card, i) => {
    if(i >= 2){
      let cardRows = card.split(",");
      return phraseTranslation(lang, cardRows).then(translatedPhrases => {
        if(lang == "en"){
          return Promise.resolve({
            slug: cardRows[0],
            title: cardRows[1],
            phrases: translatedPhrases.filter(ph => ph != null)
          });
        }else {
          return translate.translate(cardRows[1], { from: "en", to: lang }).then(translations => {
            return Promise.resolve({
              slug: cardRows[0],
              title: translations[0],
              phrases: translatedPhrases.filter(ph => ph != null)
            });
          }).catch((err) => {
            console.log("$$$$"+lang, err);
          });
        }
      })
    }
  }));
}

function savePack(index){
  let language = languages.languages[index].code;
  let exists = fs.existsSync("../data/packs/"+language+"/"+filename+".json");
  if(exists && existCheck){
    console.log("Already exists", language);
    index++;
    if(index != languages.languages.length){
      savePack(index);
    }else{
      console.log("ALL DONE!")
    }
  }else{
    cardTranslation(language).then(res => {
      let cardData = res.filter(p => p != null);
      fs.mkdirSync("../data/packs/"+language+"/", {recursive: true});
      fs.writeFileSync("../data/packs/"+language+"/"+filename+".json", JSON.stringify(cardData), {encoding: "utf8"});
      console.log("Saved", language);


      index++;
      if(index != languages.languages.length){
        sleep(5000);
        savePack(index);
      }else{
        console.log("ALL DONE!")
      }
    });
  }
}

savePack(0)
