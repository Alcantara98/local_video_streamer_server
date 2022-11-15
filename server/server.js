import express from "express";
import fs from "fs";
import path from "path";

import React from "react";
import ReactDOMServer from "react-dom/server";

import App from "../src/App";
import logger from "./logger";

const app = express();

console.log = logger;

app.use((req, res, next) => {
  console.log(`Request Header: ${JSON.stringify(req.headers)}`);
  console.log(`Request URL: ${JSON.stringify(req.url)}`);
  next();
});

app.use("^/$", (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Some error happened");
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
      )
    );
  });
});

app.get("/video", function (req, res) {
  const range = req.headers.range.replace("bytes=", "");
  console.log(`Range: ${range}`);

  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoPath = "test_video.mp4";
  const videoSize = fs.statSync(videoPath).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.substring(0, range.indexOf("-")));
  var end = null;
  if (range.length - 1 === range.indexOf("-")) {
    end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  } else {
    end = Math.min(Number(range.substring(range.indexOf("-") + 1)), videoSize - 1);
  }
  console.log(`start: ${start}, end: ${end}`);

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });

  videoStream.pipe(res);
});

app.use(express.static(path.resolve(__dirname, "..", "build")));
app.listen(80, "192.168.0.191", () => {
  console.log("Listening on port 80!");
});
