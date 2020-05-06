<?php
    $servername = "localhost"; 
    $username = "root";
    $password = "";
    $db = "local";

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
    mysqli_close($conn);
?>

<?php
    // $path = preg_replace('/wp-content(?!.*wp-content).*/','',__DIR__);
    // include $path.'wp-load.php';
    // global $wpdb;
    // $result = $wpdb->get_results("SELECT * FROM `chronic_record` ORDER BY curdate DESC");
    // $row = array();
    // foreach($result as $r) {
    //     $row[] = $r;
    // }
    // print json_encode($row);
?>
