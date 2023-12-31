<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ecom";
$connect = new mysqli($servername, $username, $password, $dbname);

function signin($connect){
    $email = $_POST['email'];
    $passcode = $_POST['password'];

    $sql = $connect->prepare('SELECT 1 FROM users WHERE email=? AND passcode=?');
    $sql->bind_param('ss', $email, $passcode);
    $sql->execute();
    $found = (bool) $sql->get_result()->fetch_row();
    if($found){ echo "found"; }
    else{ echo "notfound"; }
}

function signup($connect){
    $name = $_POST['name'];
    $contact = $_POST['contact'];
    $email = $_POST['email'];
    $passcode = $_POST['password'];

    $sql = $connect->prepare('SELECT 1 FROM users WHERE email=?');
    $sql->bind_param('s', $email);
    $sql->execute();
    $exists = (bool) $sql->get_result()->fetch_row();
    if($exists){ echo "exists"; }
    else{
        $sql = $connect->prepare("INSERT INTO users (username, contact, email, passcode) VALUES (?, ?, ?, ?)");
        $sql->bind_param("ssss", $name, $contact, $email, $passcode);
        $sql->execute();
        echo "registered";
    }
}

function profile($connect){
    $email = $_POST['email'];

    $sql = $connect->prepare('SELECT 1 FROM users WHERE email=?');
    $sql->bind_param('s', $email);
    $sql->execute();

    $sql = "SELECT username, contact, email, passcode FROM users WHERE email='$email'";
    $result = $connect->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo $row["username"]."&".$row["contact"]."&".$row["email"]."&".$row["passcode"];
        }
    }
    else { echo "0 results"; }
}

function update($connect){
    $name = $_POST['name'];
    $contact = $_POST['contact'];
    $email = $_POST['email'];
    $email_c = $_POST['email_c'];
    $passcode = $_POST['password'];

    $sql = "UPDATE users SET username='$name', contact='$contact', email='$email_c', passcode='$passcode' WHERE email='$email'";
    $sql = $connect->query($sql);

    if ($sql) { echo "updated"; }
    else { echo "error"; }
}

function products($connect){

    $sql = "SELECT p_image, p_name, descr, rate, qty FROM products";
    $result = $connect->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $productData[] = $row;
        }
    }
    else { echo "none"; }
    $connect->close();

    header('Content-Type: application/json');
    echo json_encode($productData);
}

function add_product($connect){
    $p_image = $_POST['p_image'];
    $p_name = $_POST['p_name'];
    $descr = $_POST['descr'];
    $rate = $_POST['rate'];
    $qty = $_POST['qty'];
    $stock = $_POST['stock'];
    $_id = $_POST['_id'];
    $sql = $connect->prepare("INSERT INTO products (p_image, p_name, descr, rate, qty, stock, _id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $sql->bind_param("sssssss", $p_image,$p_name,$descr,$rate,$qty,$stock,$_id);
    $sql->execute();
}

$fuc = $_POST['fuc'];
$fuc($connect);

?>
