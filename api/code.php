<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.dreamoriented.org' );
session_start();
include("config.php");

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-Type: application/json');

if($_POST["promo"]){
  $prm = $_POST["promo"];
  $co = mysqli_query($conn, "SELECT * FROM `promo` WHERE code='$prm' AND claim=0");
  $count = mysqli_num_rows($co);
  if($count == 1){
    $do = mysqli_query($conn, "UPDATE `promo` SET `claim` = '1' where code='$prm'");
    echo json_encode("true");
  }else{
    echo json_encode("false");
  }

}else{

  $postFix = strtoupper(uniqid());
  $code = "LEELOO-".$postFix;
  $add = mysqli_query($conn, "INSERT INTO `promo` (`id`, `code`, `claim`) VALUES (NULL, '$code', '0');");

  //https://api.trello.com/1/cards/OBXoXcxX/actions/comments?text=testing&key=e4abdea208bc321dd1aaef3029b717a4&token=81522f31fc5d354bd800dc18d0d552bb108fbf18a15f5a429bce6f53b3b688ce
  $encoded = urlencode("Generated promo code: `$code`");
  $ch = curl_init("https://api.trello.com/1/cards/FExgVw0J/actions/comments?text=".$encoded."&key=e4abdea208bc321dd1aaef3029b717a4&token=81522f31fc5d354bd800dc18d0d552bb108fbf18a15f5a429bce6f53b3b688ce");

  curl_setopt ($ch, CURLOPT_POST, true);
  curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
  curl_exec ($ch);

  echo "Your code is ready in the trello board.";
}


?>
