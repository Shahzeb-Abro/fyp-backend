import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World! hehe");
});

app.listen(3009, () => {
  console.log("Server is running on port 3009 test again");
});
