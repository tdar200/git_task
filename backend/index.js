const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/query", async (req, res) => {
  try {
    const { type, search, page } = req.body;

    const URL = `https://api.github.com/search/${type}?q=${search}&page=${page}`;

    const { data } = await axios.get(URL, {
      headers: {
        auth: process.env.TOKEN,
      },
    });

    res.json(data);
  } catch (error) {
    console.error(error.message);
    if (error.response) {
      res.send({
        "Error Response Status ": error.response.status,
        "Error Response Data": error.response.data,
        "Error Message": error.message,
      });
    } else {
      res.send({ "No Response Received": error.request });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
