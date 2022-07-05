<?php
include 'db.php';
$type = $_POST['typeofgeom'];
$name = $_POST['nameofgeom'];
$stringofgeom = $_POST['stringofgeom'];

$sql = "INSERT INTO public.\"FeatureDrawn\" (type,name,geom) VALUES ('$type','$name',ST_GeomFromGeoJSON('$stringofgeom'))";
 
$query = pg_send_query($conn,$sql);
$result =pg_get_result($conn);
if ($result){
    echo json_encode(array("statusCode"=> 200));
}
else{
    echo json_encode(array("statusCode"=> 201));
}
?>