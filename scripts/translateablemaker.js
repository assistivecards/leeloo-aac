var fs = require('fs');
let regex = /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g;
var emojiStrip = require('emoji-strip')

let path = "./packs/free/";
let files = fs.readdirSync(path);

let outputArray = [];
let slugArray = [];

files.forEach((fileName, i) => {
  let fileContents = fs.readFileSync(path + fileName, {encoding:'utf8'});
  parseFile(fileContents);
});


fs.writeFileSync("./translateable.csv", outputArray.join("\r\n"), {encoding: "utf8"});


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
      outputArray.push(`${slug},${tt}`);
      slugArray.push(slug);
    }
  }
}
