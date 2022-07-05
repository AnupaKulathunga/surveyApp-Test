<?php
ini_set('display_errors', '1');
$host = 'localhost';
$username = 'postgres';
$password = 'adnk_2564';
$database = 'survey_application';

$conn = pg_connect("host=$host port=5432 dbname=$database user=$username password=$password");
