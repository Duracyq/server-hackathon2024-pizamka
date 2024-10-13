<?php
require 'vendor/autoload.php';

use Google\Cloud\Vision\V1\ImageAnnotatorClient;

// Sprawdzenie, czy plik został przesłany
if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $imagePath = $_FILES['file']['tmp_name'];

    // Użyj klienta Vision API
    $imageAnnotator = new ImageAnnotatorClient([
        'credentials' => './credentials-kolabop.json' // Ścieżka do pliku z kluczami API
    ]);

    // Załaduj obraz
    $imageData = file_get_contents($imagePath);

    // Wykonaj analizę obrazu (rozpoznawanie obiektów)
    $response = $imageAnnotator->labelDetection($imageData);
    $labels = $response->getLabelAnnotations();

    if ($labels) {
        // Zbierz wszystkie rozpoznane etykiety w jedną zmienną
        $objects = [];
        foreach ($labels as $label) {
            $objects[] = $label->getDescription();
        }

        // Połącz wszystkie etykiety w jeden ciąg tekstowy
        $objectDescriptions = implode(", ", $objects);

        // Wyświetl rozpoznane obiekty
        echo "<h1>Rozpoznane obiekty:</h1>";
        echo '<p>' . htmlspecialchars($objectDescriptions) . '</p>';

        // Zadaj pytanie do OpenAI, gdzie należy wyrzucić te obiekty
        $answer = askOpenAI($objectDescriptions);
        echo '<p><strong>Do jakiego kosza wyrzucić:</strong> ' . htmlspecialchars($answer) . '</p>';
    } else {
        echo '<p>Nie znaleziono żadnych obiektów.</p>';
    }

    $imageAnnotator->close();
} else {
    echo "Błąd przy przesyłaniu pliku!";
}

// Funkcja do zadawania pytania OpenAI
function askOpenAI($objectDescriptions)
{
    $apiKey = 'API=KEY'
    $question = "Z podanego zestawu przedmiotów wybierz ten, który jest najbardziej precyzyjnym opisem obiektu. Następnie w krótkiej formie odpowiedz na pytanie: do jakiego kosza należy wrzucić. Szablon odpowiedzi: Przedmiot nalezy wyrzucic do -> [nazwa kosza]. Tutaj są przedmioty: " . $objectDescriptions . "?";

    // Przygotowanie żądania do OpenAI
    $data = [
        "model" => "gpt-4",
        "messages" => [
            [
                "role" => "user",
                "content" => $question
            ]
        ],
    ];

    // Utworzenie cURL do wysłania zapytania
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.openai.com/v1/chat/completions");
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
        return 'Błąd cURL: ' . curl_error($ch);
    }

    // Zdekodowanie odpowiedzi
    $decodedResponse = json_decode($response, true);

    // Sprawdź, czy w odpowiedzi jest 'choices'
    if (isset($decodedResponse['choices'])) {
        return $decodedResponse['choices'][0]['message']['content'];
    } else {
        return "Brak odpowiedzi od OpenAI.";
    }

    // Zamknięcie cURL
    curl_close($ch);
}
