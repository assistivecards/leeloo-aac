var fs = require('fs');
var metadata = require('../data/packs/en/metadata.json');
let regex = /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g;
var emojiStrip = require('emoji-strip')
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

let langs = ["ar","cs","da","nl","fi","el","he","hi","hu","id","nb","pl","pt","ro","ru","sk","sv","th","tr","ur","bn","et","fil","jv","km","ne","si","uk","vi"];

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

let path = "./packs/free/";
let files = fs.readdirSync(path);

let outputArray = [];
let slugArray = [];


metadata.forEach((pack, i) => {
  pushLine(pack.slug, pack.name);
});

files.forEach((fileName, i) => {
  let fileContents = fs.readFileSync(path + fileName, {encoding:'utf8'});
  parseFile(fileContents);
});

let translationArray = [];
let langi = 5;


async function generateTranslate(){
  for (var i = 0; i < langs.length; i++) {
    translationArray = [];
    await translateAnd(langs[i], outputArray)
    fs.writeFileSync("./proof/"+langs[i]+".csv", translationArray.join("\r\n"), {encoding: "utf8"});
  }
}

generateTranslate();

async function translateAnd(lang, output){

  for (var i = 0; i < output.length; i++) {
    let line = output[i];
    let [translation] = await translate.translate(line.split(",")[1].replace(/"/g, ""), { from: "en", to: lang });
    console.log(`${line},"${translation}"`);
    translationArray.push(`${line},"${translation}"`);
  }

}

function parseFile(fileContents){
  fileContents.split("\r\n").forEach((line, i) => {
    parseLine(line);
  });
}

function parseLine(line){
  let partitions = line.split(",")
  let slug = partitions[0];
  partitions.forEach((partition, i) => {
    if(i > 0){
      let translatableText = emojiStrip(partition).replace(/[^\x00-\x7F]/g, "");
      if(i == 1){
        pushLine(slug, translatableText);
      }else{
        pushLine(slug+"_"+i, translatableText);
      }
    }
  });
}


function pushLine(slug, tt){
  if(tt && tt != "locale"){
    if(!slugArray.includes(slug)){
      outputArray.push(`"${slug}","${tt}"`);
      slugArray.push(slug);
    }
  }
}
