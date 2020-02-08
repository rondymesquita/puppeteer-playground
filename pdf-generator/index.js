"use strict";

const path = require("path");
const puppeteer = require("puppeteer");
const cheerio = require('cheerio')

var fs = require('fs');

const readImage = (file) => {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

const readFile = (file) => {
  return fs.readFileSync(file, 'utf8')
}

const createImageTag = ($, imageBase64) => {
  return $(`<img src="data:image/jpg;base64,${imageBase64}"/>`)
}

const generatePdf = async (name) => {
  const html = readFile(__dirname + "/page.html")
  // console.log('test', html);
  const $ = cheerio.load(html)
  const imageBase64 = readImage(path.resolve(__dirname + "/image.jpg"))
  const imageTag = createImageTag($, imageBase64)
  $('#content').append(imageTag)
  // console.log('test', $.html());

  const browser = await puppeteer.launch();
  let page = await browser.newPage();
  page.setContent($.html())
  const page2 = await browser.newPage();
  page2.setContent($.html())
  await page.pdf({
    path: __dirname + "/sample.pdf",
    format: "A4",
    margin: 0
  });
  await browser.close();
};

console.time('generate')
generatePdf().then(() => {
  console.timeEnd('generate')
  console.log('Done')
}).catch((err) => {
  console.error(err)
})




