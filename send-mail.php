<?php
// ВКЛЮЧАЕМ ОШИБКИ ДЛЯ ОТЛАДКИ
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_POST) {
    // ПРОСТО БЕРЕМ ДАННЫЕ БЕЗ ПРОВЕРОК
    $name = $_POST["name"];
    $email = $_POST["email"]; 
    $phone = $_POST["phone"];
    $service_type = $_POST["service_type"];
    $budget = $_POST["budget"];
    $message = $_POST["message"];
    
    // ПРОСТАЯ ОТПРАВКА ЧЕРЕЗ mail()
    $to = "resulsopyyev71@gmail.com";
    $subject = "Новый заказ от: $name";
    $email_message = "
        Имя: $name
        Email: $email
        Телефон: $phone
        Услуга: $service_type
        Бюджет: $budget
        
        Сообщение:
        $message
    ";
    
    $headers = "From: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    
    // ПРОБУЕМ ОТПРАВИТЬ
    if (mail($to, $subject, $email_message, $headers)) {
        echo "<h1>✅ УСПЕХ! Заказ отправлен!</h1>";
        echo "<p>Имя: $name</p>";
        echo "<p>Email: $email</p>";
        echo "<p>Телефон: $phone</p>";
        echo "<p>Услуга: $service_type</p>";
        echo "<p>Бюджет: $budget</p>";
        echo "<p>Сообщение: $message</p>";
        echo '<a href="index.php">Вернуться на главную</a>';
    } else {
        echo "<h1>❌ ОШИБКА отправки!</h1>";
        echo "<p>Функция mail() не сработала. Возможно, хостинг не поддерживает отправку почты.</p>";
        echo '<a href="index.php">Вернуться назад</a>';
    }
} else {
    header("Location: index.php");
}
?>
