var fs = require('fs');
let regex = /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g;
var emojiStrip = require('emoji-strip')
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

let languages = require("../data/languages.json");

let checkExist = false;
let content = require("../data/interface/en.json");

let keys = Object.keys(content);
let values = Object.values(content);

function UITranslation(lang){
  return Promise.all(values.map((value, i) =>
  {
    let locale = value.replace("$1", "XXXXX");
    return translate.translate(locale, { from: "en", to: lang }).then(translations => {
      return Promise.resolve(translations[0].replace("XXXXX", "$1"));
    }).catch((err) => {
      console.log("$$$$"+lang, err);
    });
  }));

}


function savePack(index){
  let language = languages.languages[index].code;
  if(language == "en"){
    return savePack(index+1);
  }else{

    let exists = fs.existsSync("../data/interface/"+language+".json");
    if(exists && checkExist){
      console.log("Already exists", language);
      index++;
      if(index != languages.languages.length){
        savePack(index);
      }else{
        console.log("ALL DONE!")
      }
    }else{
      UITranslation(language).then(res => {
        let translationObj = {};

        keys.forEach((trans, i) => {
            translationObj[trans] = res[i];
        });

        fs.writeFileSync("../data/interface/"+language+".json", JSON.stringify(translationObj, null, 2), {encoding: "utf8"});
        console.log("Saved", language);


        index++;
        if(index != languages.languages.length){
          savePack(index);
        }else{
          console.log("ALL DONE!")
        }
      });
    }
  }
}

savePack(0)
