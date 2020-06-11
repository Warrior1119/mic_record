<?php
    $servername = "localhost"; 
    $username = "root";
    $password = "";
    $db = "local";

    $email = $_POST["emailAddress"];

    try {
        $conn = mysqli_connect($servername, $username, $password, $db);
    } catch(exception $e){
        die();
    }

    $sql = "SELECT record FROM  chronic_record WHERE email='$email' ORDER BY curdate DESC LIMIT 1";
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
    // print json_encode($row1);

    // $returnValue['all'] = $row;
    // $returnValue['playlist'] = $row1;

    // print json_encode($returnValue);
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
