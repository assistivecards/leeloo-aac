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

    $add = mysqli_query($conn, "INSERT INTO `profile` (`id`, `parent`, `name`, `avatar`, `packs`) VALUES (NULL, $userId, '$name', '$avatar', '$packs');");
    $profile = mysqli_query($conn, "SELECT * FROM `profile` WHERE `parent` = '$userId' ORDER BY id desc LIMIT 1");
    $data = mysqli_fetch_object($profile);
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
