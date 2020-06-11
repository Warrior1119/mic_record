<?php
  require_once ('./php/campaignmonitor-createsend-php-12a4c1f/csrest-subscribers.php');

  $email = $_POST['email'];
  $fullname = $_POST['fullname'];

  // function storeAddress($name,$email) {
    $wrap = new CS_REST_Subscribers('a65440c7545f2842c425e66d24242451', 'WjET0+htnDkgFloL9GTc/6Janf14tTSgvHCal1WWQMboEpjWHZFbnAAKkNOSvNzSEUNwpOGpwE0/tXkWGOEr9fVVrRTrb3Sfp435uR0BAzq102p2X+xEe1lSdkpeEk+Vbl2ljTUEO52Dr4jJcO/Tlw==');
    $result = $wrap->add(array(
      'EmailAddress' => $email,
      'Name' => $name,
      'Resubscribe' => true
    ));
    
    print $result;
// }
?>