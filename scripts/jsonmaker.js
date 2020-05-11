var fs = require('fs');
let regex = /([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g;
var emojiStrip = require('emoji-strip')
var lang = "en";
let csv = fs.readdirSync("packs");

for (var i = 0; i < csv.length; i++) {
  let file = csv[i];

  let content = fs.readFileSync("csv/"+file, {encoding: "utf8"});
  let cardObjects = content.split("\r\n").map((card, i) => {
    if(i >= 2){
      let cardRows = card.split(",");

      let phrases = cardRows.map((phrase, j) => {
        if(j >= 2){
          let strippedPhrase = emojiStrip(phrase);
          let emoji = phrase.replace(strippedPhrase, "");
          if(phrase != ""){
            return {
              type: emoji,
              phrase: strippedPhrase
            }
          }
        }
      });

      return {
        slug: cardRows[0],
        title: cardRows[1],
        phrases: phrases.filter(ph => ph != null)
      }
    }
  }).filter(c => c != null);

/*
  cardObjects.forEach((item, i) => {
    item.phrases.forEach((item2, i) => {
      console.log(item2.type +"|||"+ item2.phrase);
    });

  });
*/
  let filename = file.split("- ")[1].split(" ")[0].split(".")[0];

  fs.writeFileSync("../data/packs/en/"+filename + ".json", JSON.stringify(cardObjects), {encoding: "utf8"});

  console.log("done");
}
