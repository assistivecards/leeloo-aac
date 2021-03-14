
// import this file for static assets
let Obj = {
  ar_json:require('./interface/ar.json'),bn_json:require('./interface/bn.json'),cs_json:require('./interface/cs.json'),da_json:require('./interface/da.json'),de_json:require('./interface/de.json'),el_json:require('./interface/el.json'),en_json:require('./interface/en.json'),es_json:require('./interface/es.json'),et_json:require('./interface/et.json'),fi_json:require('./interface/fi.json'),fil_json:require('./interface/fil.json'),fr_json:require('./interface/fr.json'),he_json:require('./interface/he.json'),hi_json:require('./interface/hi.json'),hu_json:require('./interface/hu.json'),id_json:require('./interface/id.json'),it_json:require('./interface/it.json'),ja_json:require('./interface/ja.json'),jv_json:require('./interface/jv.json'),km_json:require('./interface/km.json'),ko_json:require('./interface/ko.json'),nb_json:require('./interface/nb.json'),ne_json:require('./interface/ne.json'),nl_json:require('./interface/nl.json'),pl_json:require('./interface/pl.json'),pt_json:require('./interface/pt.json'),ro_json:require('./interface/ro.json'),ru_json:require('./interface/ru.json'),si_json:require('./interface/si.json'),sk_json:require('./interface/sk.json'),sv_json:require('./interface/sv.json'),th_json:require('./interface/th.json'),tr_json:require('./interface/tr.json'),uk_json:require('./interface/uk.json'),ur_json:require('./interface/ur.json'),vi_json:require('./interface/vi.json'),zh_json:require('./interface/zh.json'),
  search: function searchFile(key) {
    if (this.hasOwnProperty(key)) {
        return this[key];
    } else {
        return -1;
    }
},
  format: function searchFileFormat(extension) {
    var filteredArray = this.filter(function (assetSlug) {
        return assetSlug.includes("-" + extention);
    });
    if (filteredArray.length) {
        return filteredArray;
    } else {
        return -1;
    }
}
}
export default Obj;
      