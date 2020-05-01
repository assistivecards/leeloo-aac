<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.dreamoriented.org' );
session_start();
include("config.php");

$profileId = $_POST['id'];
$userIdentifier = $_POST['identifier'];

if($userIdentifier){
  $user = mysqli_query($conn, "SELECT * FROM `user` WHERE `identifier` = '$userIdentifier' LIMIT 1");
  if(mysqli_num_rows($user)){
    $userId = intval(mysqli_fetch_object($user)->id);
    $profile = mysqli_query($conn, "SELECT * FROM `profile` WHERE `parent` = $userId AND `id` = $profileId");
    if(mysqli_num_rows($profile)){
      $delete = mysqli_query($conn, "DELETE FROM `profile` WHERE id = $profileId");
      $data = "deleted";
    }else{
      $data = "no_auth";
    }
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
