<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.dreamoriented.org' );
session_start();
include("config.php");

$userIdentifier = $_POST['identifier'];
$name = $_POST['name'];
$email = $_POST['email'];
$language = $_POST['language'];
$voice = $_POST['voice'];
$premium = $_POST['premium'];
$notificationToken = $_POST['notificationToken'];
$notificationSettings = $_POST['notificationSettings'];

if($userIdentifier){
  $user = mysqli_query($conn, "SELECT * FROM `user` WHERE `identifier` = '$userIdentifier' LIMIT 1");
  if(mysqli_num_rows($user)){
    $setString = "SET rate = rate+1";
    if(!empty($name)){
      $setString .= ", `name` = '$name'";
    }

    if(!empty($email)){
      $setString .= ", `email` = '$email'";
    }

    if(!empty($language)){
      $setString .= ", `language` = '$language'";
    }

    if(!empty($voice)){
      $setString .= ", `voice` = '$voice'";
    }

    if(!empty($premium)){
      $setString .= ", `premium` = '$premium'";
      //https://api.trello.com/1/cards/OBXoXcxX/actions/comments?text=testing&key=e4abdea208bc321dd1aaef3029b717a4&token=81522f31fc5d354bd800dc18d0d552bb108fbf18a15f5a429bce6f53b3b688ce
      $encoded = urlencode("A user has purchased premium plan: `$premium`");
      $ch = curl_init("https://api.trello.com/1/cards/WuTZ0amD/actions/comments?text=".$encoded."&key=e4abdea208bc321dd1aaef3029b717a4&token=81522f31fc5d354bd800dc18d0d552bb108fbf18a15f5a429bce6f53b3b688ce");

      curl_setopt ($ch, CURLOPT_POST, true);
      curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
      curl_exec ($ch);
    }

    if(!empty($notificationToken)){
      $setString .= ", `notificationToken` = '$notificationToken'";
    }

    if(!empty($notificationSettings)){
      $setString .= ", `notificationSettings` = '$notificationSettings'";
    }

    $update = mysqli_query($conn, "UPDATE `user` ".$setString." WHERE `identifier` = '$userIdentifier';");

    $user = mysqli_query($conn, "SELECT * FROM `user` WHERE `identifier` = '$userIdentifier' LIMIT 1");
    $data = mysqli_fetch_object($user);
    $userId = $data->id;
    $profile = mysqli_query($conn, "SELECT * FROM `profile` WHERE `parent` = $userId AND active = 1");
    if($profile){
      $profiles = array();
      while($row = mysqli_fetch_assoc($profile))
      {
          $profiles[] = $row;
      }
      $data->profiles = $profiles;
    }
    $time = time();
    $update = mysqli_query($conn, "UPDATE `user` SET `last_active` = $time, rate = rate+1 WHERE `identifier` = '$userIdentifier';");

    $data->session_id = session_id();
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
