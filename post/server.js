
const express = require("express");
const Joi = require("joi");

const app = express();
const PORT = 3000;

app.use(express.json());

let weather = [
  { id: 1, books: "Chennai", price: 32, author: "Sunny" },
  { id: 2, books: "Madurai", price: 30, author: "Cloudy" }
];

const weatherSchema = Joi.object({
  books: Joi.string().trim().required(),
  price: Joi.number().required(),
  author: Joi.string().trim().required()
});

app.get("/", (req, res) => {
  res.send("Weather REST API is running!");
});

// GET all weather records
app.get("/weather", (req, res) => {
  res.json(weather);
});

// GET one weather record
app.get("/weather/:id", (req, res) => {
  const id = Number(req.params.id);
  const record = weather.find(w => w.id === id);

  if (!record) {
    return res.status(404).json({ message: "Weather data not found" });
  }

  res.json(record);
});

// CREATE a weather record
app.post("/weather", (req, res) => {
  const { error, value } = weatherSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newWeather = {
    id: weather.length
      ? Math.max(...weather.map(w => w.id)) + 1
      : 1,
    ...value
  };

  weather.push(newWeather);

  res.status(201).json({
    message: "Weather data added successfully",
    data: newWeather
  });
});

// UPDATE a weather record
app.put("/weather/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = weather.findIndex(w => w.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Weather data not found" });
  }

  const { error, value } = weatherSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  weather[index] = { id, ...value };

  res.json({
    message: "Weather data updated successfully",
    data: weather[index]
  });
});

// DELETE a weather record
app.delete("/weather/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = weather.findIndex(w => w.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Weather data not found" });
  }

  const deletedWeather = weather.splice(index, 1)[0];

  res.json({
    message: "Weather data deleted successfully",
    data: deletedWeather
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
