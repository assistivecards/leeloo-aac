<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.dreamoriented.org' );
session_start();
include("config.php");

$userIdentifier = $_POST['identifier'];
$name = $_POST['name'];
$avatar = $_POST['avatar'];
$packs = $_POST['packs'];

if($userIdentifier){
  $user = mysqli_query($conn, "SELECT id FROM `user` WHERE `identifier` = '$userIdentifier' LIMIT 1");

  if(mysqli_num_rows($user)){
    $user = mysqli_fetch_object($user);
    $userId = $user->id;
    if($name){
      $add = mysqli_query($conn, "INSERT INTO `profile` (`id`, `parent`, `name`, `avatar`, `packs`) VALUES (NULL, $userId, '$name', '$avatar', '$packs');");

      //https://api.trello.com/1/cards/OBXoXcxX/actions/comments?text=testing&key=e4abdea208bc321dd1aaef3029b717a4&token=81522f31fc5d354bd800dc18d0d552bb108fbf18a15f5a429bce6f53b3b688ce
      $encoded = urlencode("$name has started using leeloo! ($userId) @hannahhhmilan @buraktokak");
      $ch = curl_init("https://api.trello.com/1/cards/OBXoXcxX/actions/comments?text=".$encoded."&key=e4abdea208bc321dd1aaef3029b717a4&token=81522f31fc5d354bd800dc18d0d552bb108fbf18a15f5a429bce6f53b3b688ce");

      curl_setopt ($ch, CURLOPT_POST, true);
      curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
      curl_exec ($ch);


      $profile = mysqli_query($conn, "SELECT * FROM `profile` WHERE `parent` = '$userId' ORDER BY id desc LIMIT 1");
      $data = mysqli_fetch_object($profile);
      if($data->name != $name){
        $data = "unexpected_values";
      }
    }else{
      $data = "no_empty";
    }
  }else{
    $data = "no_auth";
  }
}else{
  $data = "error";
}


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
header('Content-Type: application/json');
echo json_encode($data);

?>
