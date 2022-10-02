<?php
  error_reporting(0);
  $servername = "private-svgrepo-nyc3-do-user-1344855-0.a.db.ondigitalocean.com";
  $username = "svgrepo";
  $password = "";
  $dbname = "leeloo_db";
  $port = 25060;

  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname, $port);
  $GLOBALS["connection"] = $conn;
  // Check connection
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }
