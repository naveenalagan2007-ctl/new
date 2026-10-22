
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Replace with your actual MongoDB Atlas connection string
const uri = "mongodb://nai:nai@ac-t0fdpv6-shard-00-00.ab26bqm.mongodb.net:27017,ac-t0fdpv6-shard-00-01.ab26bqm.mongodb.net:27017,ac-t0fdpv6-shard-00-02.ab26bqm.mongodb.net:27017/?ssl=true&replicaSet=atlas-m47vhu-shard-0&authSource=admin";

const client = new MongoClient(uri);
let students;

app.get("/api/students", async (req, res) => {
  try {
    const data = await students.find({}).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { name, course } = req.body;

    if (!name?.trim() || !course?.trim()) {
      return res.status(400).json({
        error: "Enter name and course"
      });
    }

    const result = await students.insertOne({
      name: name.trim(),
      course: course.trim()
    });

    res.json({
      message: "Student added successfully",
      id: result.insertedId
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, course } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    if (!name?.trim() || !course?.trim()) {
      return res.status(400).json({
        error: "Enter name and course"
      });
    }

    const result = await students.updateOne(
      { _id: new ObjectId(id) },
      { $set: {
        name: name.trim(),
        course: course.trim()
      }}
    );

    res.json({
      message: result.matchedCount
        ? "Student updated successfully"
        : "Student not found"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const result = await students.deleteOne({
      _id: new ObjectId(id)
    });

    res.json({
      message: result.deletedCount
        ? "Student deleted successfully"
        : "Student not found"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  try {
    await client.connect();

    students = client.db("thiru").collection("students");

    console.log("MongoDB Atlas connected successfully!");

    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

start();
