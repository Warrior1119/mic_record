<?php 
    $recordfile = $_POST['myfile'];
    $email = $_POST['email'];
    $school = $_POST['school'];
    $url = $_POST['url'];

    // recorded file save
    $data = explode( ',', $recordfile );
    $dir = $url . "/wp-content/themes/recorded";
    $filename = uniqid(rand(), true) . '.mp3';

    $folder = "recorded";
    if (is_dir($folder) == false) 
    {
        mkdir($folder);
    }
    $filepath = $folder . '/' . $filename;
    // file_put_contents($dir . '/' . $filename, base64_decode($data[1]));
    file_put_contents($folder . '/' . $filename, base64_decode($data[1]));

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