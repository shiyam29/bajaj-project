const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Storage setup for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Sample user data
const userId = "john_doe_17091999";
const email = "john@xyz.com";
const rollNumber = "ABCD123";

// Helper function to process 'data' array
function processData(data) {
  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => isNaN(item));
  const highestLowercase = alphabets
    .filter((char) => char === char.toLowerCase())
    .sort()
    .slice(-1);
  return { numbers, alphabets, highestLowercase };
}

// POST endpoint
app.post("/bfhl", upload.single("file_b64"), (req, res) => {
  const { data } = req.body;
  const file = req.file;

  // Validation check for the 'data' array
  if (!data || !Array.isArray(data)) {
    return res
      .status(400)
      .json({ is_success: false, error: "Invalid input data" });
  }

  // Process the data array
  const { numbers, alphabets, highestLowercase } = processData(data);

  // File validation
  const fileValid = file ? true : false;
  const fileMimeType = file ? file.mimetype : null;
  const fileSizeKb = file ? (file.size / 1024).toFixed(2) : null;

  res.json({
    is_success: true,
    user_id: userId,
    email: email,
    roll_number: rollNumber,
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercase,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKb,
  });
});

// GET endpoint
app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
