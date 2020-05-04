<?php
    $servername = "mysql.evermind.online"; 
    $username = "evermindonline1";
    $password = "!PdTXu?*";
    $db = "staging";

    // $path = preg_replace('/wp-content(?!.*wp-content).*/','',__DIR__);
    // include $path.'wp-load.php';
    // global $wpdb;  
    // $result = $wpdb->get_row("SELECT * FROM `chronic_record` ORDER BY curdate DESC");

    // $servername = "localhost"; 
    // $username = "root";
    // $password = "";
    // $db = "local";

    try {
        $conn = mysqli_connect($servername, $username, $password, $db);
    } catch(exception $e){
        die();
    }

    $sql = "SELECT * FROM  chronic_record ORDER BY curdate DESC";
    $result = $conn->query($sql);

    $row = array();
    if ($result->num_rows > 0) {
        while($r = mysqli_fetch_assoc($result)) {
            $row[] = $r;
        }
    } else {
        echo "0";
    }

    print json_encode($row);

    // echo $result;
    // if (mysqli_query($conn, $sql)) {
    //     echo "Records inserted successfully.";
    // } else {
    //     echo "ERROR: Could not able to execute $sql" . mysqli_error($conn);
    // }

    mysqli_close($conn);
?>