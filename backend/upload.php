<?php
// Sprawdzenie, czy plik został przesłany
if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $imagePath = $_FILES['file']['tmp_name'];

    // Odczytaj zawartość pliku obrazu (możesz przetworzyć obraz w zależności od potrzeb)
    $imageData = file_get_contents($imagePath);

    // Przygotowanie pytania do OpenAI
    $question = "Na podstawie tego zdjęcia, do jakiego kosza należy wrzucić ten śmieć?";

    // Zdefiniowanie klucza API
    $apiKey = "API-KEY'  // Wstaw swój klucz API OpenAI

    // Przygotowanie żądania do OpenAI (DALL-E 3 do generowania obrazu na podstawie tekstu)
    $data = [
        "model" => "dall-e-3",
        "prompt" => $question, // Opis dla generowania obrazu
    ];

    // Utworzenie cURL do wysłania zapytania
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.openai.com/v1/images/generations");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ]);

    // Wykonanie zapytania
    $response = curl_exec($ch);

    // Sprawdzenie, czy wystąpił błąd cURL
    if (curl_errno($ch)) {
        echo 'Błąd cURL: ' . curl_error($ch);
    } else {
        // Wyświetl odpowiedź w surowej postaci dla debugowania
        echo "<pre>Odpowiedź API: " . htmlspecialchars($response) . "</pre>";

        // Zdekodowanie odpowiedzi
        $decodedResponse = json_decode($response, true);

        // Sprawdź, czy w odpowiedzi jest 'data'
        if (isset($decodedResponse['data'])) {
            $imageUrl = $decodedResponse['data'][0]['url'];
            echo "<h1>Wygenerowany obraz DALL·E:</h1>";
            echo "<img src='$imageUrl' alt='Wygenerowany obraz'>";
        } else {
            // Jeśli odpowiedź nie zawiera 'data', wyświetl błąd
            echo "<p>API nie zwróciło poprawnej odpowiedzi. Sprawdź szczegóły powyżej.</p>";
        }
    }

    // Zamknięcie cURL
    curl_close($ch);
} else {
    echo "Błąd przy przesyłaniu pliku!";
}
