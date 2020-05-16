var fs = require('fs');
let regex = /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g;
var emojiStrip = require('emoji-strip')
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

let languages = require("../data/languages.json");

let checkExist = false;
let content = fs.readFileSync("packs.csv", {encoding: "utf8"});

let packAttr = content.split("\r\n").slice(0,5);

function packTranslation(lang){
  return Promise.all(packAttr[0].split(",").map((pack, i) => {
    if(i > 0 && pack != ""){

      let locale = packAttr[3].split(",")[i];
        return translate.translate(locale, lang).then(translations => {
          return Promise.resolve({
            id: i,
            slug: packAttr[4].split(",")[i],
            color: packAttr[2].split(",")[i] ? packAttr[2].split(",")[i] : "#6989FF",
            premium: packAttr[0].split(",")[i] == "free" ? 0 : 1,
            locale: translations[0],
            count: parseInt(packAttr[1].split(",")[i])
          });
        }).catch((err) => {
          console.log("$$$$"+lang, err);
        });
    }
  }));

}


function savePack(index){
  let language = languages.languages[index].code;
  let exists = fs.existsSync("../data/packs/"+language+"/metadata.json");
  if(exists && checkExist){
    console.log("Already exists", language);
    index++;
    if(index != languages.languages.length){
      savePack(index);
    }else{
      console.log("ALL DONE!")
    }
  }else{
    packTranslation(language).then(res => {
      let packs = res.filter(p => p != null);
      fs.mkdirSync("../data/packs/"+language+"/", {recursive: true});
      fs.writeFileSync("../data/packs/"+language+"/metadata.json", JSON.stringify(packs), {encoding: "utf8"});
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

savePack(0)
