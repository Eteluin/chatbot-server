const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const REPLICATE_API_TOKEN = "r8_F6L************************"; // Вставь сюда свой API токен

// Функция для вызова модели Replicate
async function callReplicateModel(prompt) {
  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version: "4b9f801a167b1f6cc2db6ba7ffdeb307630bf41184d1d441c01267b40f79a0bc", // Версия модели
        input: { text: prompt },
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Вернуть результат модели
    return response.data.output;
  } catch (error) {
    console.error("Ошибка при вызове Replicate:", error.response.data);
    return "Извините, произошла ошибка при обработке запроса.";
  }
}

// Основной маршрут для вебхука Dialogflow
app.post("/webhook", async (req, res) => {
  const userMessage = req.body.queryResult.queryText;

  console.log("Сообщение от пользователя:", userMessage);

  // Вызов модели Replicate
  const botResponse = await callReplicateModel(userMessage);

  // Ответ для Dialogflow
  res.json({
    fulfillmentText: botResponse,
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
