<!DOCTYPE html>
<html lang="pl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formularz przesyłania zdjęcia</title>
</head>

<body>
    <h1>Prześlij zdjęcie śmieci</h1>
    <form action="upload2.php" method="post" enctype="multipart/form-data">
        <label for="file">Wybierz zdjęcie:</label>
        <input type="file" name="file" id="file" required>
        <input type="submit" value="Prześlij">
    </form>
</body>

</html>