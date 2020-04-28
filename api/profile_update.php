<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.dreamoriented.org' );
session_start();
include("config.php");

$profileId = $_POST['id'];
$userIdentifier = $_POST['identifier'];
$name = $_POST['name'];
$active = $_POST['active'];
$packs = $_POST['packs'];
$remove = $_POST['remove'];

if($userIdentifier){
  $user = mysqli_query($conn, "SELECT * FROM `user` WHERE `identifier` = '$userIdentifier' LIMIT 1");
  if(mysqli_num_rows($user)){
    $userId = intval(mysqli_fetch_object($user)->id);
    $profile = mysqli_query($conn, "SELECT * FROM `profile` WHERE `parent` = $userId AND `id` = $profileId");
    if(mysqli_num_rows($profile)){

      if($remove){
        $delete = mysqli_query($conn, "DELETE FROM `profile` WHERE id = $profileId");
        $data = "deleted";
      }else{
        $setString = "SET rate = rate+1";
        if(!empty($name)){
          $setString .= ", `name` = '$name'";
        }

        if(!empty($active)){
          $setString .= ", `active` = '$active'";
        }

        if(!empty($packs)){
          $setString .= ", `packs` = '$packs'";
        }

        $update = mysqli_query($conn, "UPDATE `profile` ".$setString." WHERE `id` = $profileId;");
        $profileResult = mysqli_query($conn, "SELECT * FROM `profile` WHERE `id` = $profileId");

        $data = mysqli_fetch_object($profileResult);
      }

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
