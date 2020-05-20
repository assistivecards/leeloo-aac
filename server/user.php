<?php
ini_set('session.gc_maxlifetime', 2592000);
session_set_cookie_params(2592000);
ini_set('session.cookie_domain', '.dreamoriented.org' );
session_start();
include("config.php");
require 'vendor/autoload.php';

$userIdentifier = $_POST['identifier'];
$type = $_POST['type'];
$name = $_POST['name'];
$email = $_POST['email'];
$avatar = $_POST['avatar'];
$language = $_POST['language'];
$voice = $_POST['voice'];
$os = $_POST['os'];
$modelName = $_POST['modelName'];
$timeline = $_POST['timeline'];

//$pass = $_POST['pass']; for email signups.

if($userIdentifier){
  $user = mysqli_query($conn, "SELECT * FROM `user` WHERE `identifier` = '$userIdentifier' LIMIT 1");

  if(mysqli_num_rows($user)){
    $data = mysqli_fetch_object($user);
    $userId = $data->id;
    $profile = mysqli_query($conn, "SELECT * FROM `profile` WHERE `parent` = $userId AND active = 1");
    if($profile){
      $profiles = array();
      while($row = mysqli_fetch_assoc($profile))
      {
          $profiles[] = $row;
      }

      for ($i=0; $i < sizeof($profiles); $i++) {
        $profiles[$i]->packs = json_decode($profiles[$i]->packs);
      }

      $data->profiles = $profiles;
    }
    $time = time();
    $update = mysqli_query($conn, "UPDATE `user` SET `last_active` = $time, rate = rate+1 WHERE `identifier` = '$userIdentifier';");

    $data->session_id = session_id();
  }else{
    $time = time();
    if($type){
      $add = mysqli_query($conn, "INSERT INTO `user` (`id`, `type`, `identifier`, `email`, `name`, `avatar`, `register_time`, `last_active`, `language`, `voice`, `os`, `modelName`, `timeline`) VALUES (NULL, '$type', '$userIdentifier', '$email', '$name', '$avatar', $time, $time, '$language', '$voice', '$os', '$modelName', '$timeline');");

      $groupsApi = (new MailerLiteApi\MailerLite("587f7f5d4fd7c7ea59c620b2ea9e4ad9"))->groups();

      $subscriber = [
          'email' => $email,
          'fields' => [
              'name' => $name,
              'language' => $language,
              'timeline' => $os,
              'os' => $timeline
          ]
      ];

      $response = $groupsApi->addSubscriber(103002618, $subscriber);

      $user = mysqli_query($conn, "SELECT * FROM `user` WHERE `identifier` = '$userIdentifier' LIMIT 1");
      $data = mysqli_fetch_object($user);

      $profiles = array();
      $data->profiles = $profiles;


      $_SESSION['user_id'] = intval($user->id);
    }
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
