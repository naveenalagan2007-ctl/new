
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const API_KEY = process.env.API_KEY;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/weather", async (req, res) => {
    try {
        const city = req.query.city;

        if (!city || !city.trim()) {
            return res.status(400).json({
                error: "Please enter a city name"
            });
        }

        if (!API_KEY) {
            return res.status(500).json({
                error: "API key is missing. Check your .env file."
            });
        }

        const url = new URL(
            "https://api.openweathermap.org/data/2.5/weather"
        );

        url.searchParams.set("q", city.trim());
        url.searchParams.set("appid", API_KEY);
        url.searchParams.set("units", "metric");

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                return res.status(502).json({
                    error: "Invalid API key or key not activated. Check OpenWeatherMap."
                });
            }

            return res.status(response.status).json({
                error: data.message || "Weather not found"
            });
        }

        res.json({
            city: data.name,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            error: "Unable to connect to the weather service"
        });
    }
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
