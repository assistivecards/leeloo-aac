export default function titleCase(str){
  return str.charAt(0).toLocaleUpperCase() + str.substr(1).toLocaleLowerCase();
}
