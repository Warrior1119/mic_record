<?php 
    $recordfile = $_POST['myfile'];
    $email = $_POST['email'];
    $school = $_POST['school'];

    // recorded file save
    $data = explode( ',', $recordfile );
    $dir = "recorded";
    $filename = uniqid(rand(), true) . '.mp3';

    if (is_dir($dir) == false) 
    {
        mkdir($dir);
    }
    $filepath = $dir . '/' . $filename;
    file_put_contents($dir . '/' . $filename, base64_decode($data[1]));

    // connect db


    // $servername = "localhost"; 
    // $username = "evermindonline1";
    // $password = "!PdTXu?*";
    // $db = "staging";

    $servername = "localhost"; 
    $username = "root";
    $password = "";
    $db = "local";

    try {
        $conn = mysqli_connect($servername, $username, $password, $db);
         echo "Connected successfully";
    } catch(exception $e){
        echo "Connection failed: " . $e->getMessage();
    }


    $sql = "INSERT INTO `chronic_record` (email, school, record, curdate) VALUES ('$email', '$school', '$filepath', Now())";
    if (mysqli_query($conn, $sql)) {
        echo "Records inserted successfully.";
    } else {
        echo "ERROR: Could not able to execute $sql" . mysqli_error($conn);
    }

    mysqli_close($conn);

?>