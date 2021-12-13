const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { PORT, BING_URL } = require('./constants.js');

const app = express();
app.use(express.json());
app.use(cors());
const commonUrl = 'https://www.bing.com/news/search?q=';

const getInitialData = async (res, url) => {
  const { data } = await axios(url);
  const $ = cheerio.load(data);
  const responseData = {
    info: [],
    details: [],
  };

  $('.news-card-body').each(function () {
    const url = $(this).find('.image').find('a').attr('href');
    const image = $(this).find('.image').find('a').find('img').attr('src');
    const title = $(this)
      .find('.caption')
      .find('.t_s')
      .find('.t_t')
      .find('a')
      .text();
    const sourceImage = $(this)
      .find('.caption')
      .find('.source')
      .find('.publogo')
      .find('img')
      .attr('src');
    const sourceText = $(this).find('.caption').find('.source').text();
    const snippet = $(this).find('.caption').find('.snippet').text();
    if (
      (!url && !image && !title) ||
      (!image && !title) ||
      (!image && !url) ||
      (!title && !url)
    )
      return;

    responseData.details.push({
      url,
      image,
      title,
      snippet,
      source: {
        image: sourceImage,
        source: sourceText,
      },
    });
  });

  responseData.info.push({
    date: new Date().toLocaleString(),
    total: responseData.details.length,
    status: responseData.details.length > 0 ? 'success' : 'failed',
  });

  res.json(responseData);
};

app.get('/', (req, res) => {
  getInitialData(res, BING_URL);
});

app.get('/india', (req, res) => {
  getInitialData(res, commonUrl + 'India');
});

app.get('/world', (req, res) => {
  getInitialData(res, commonUrl + 'World');
});

app.get('/entertainment', (req, res) => {
  getInitialData(res, commonUrl + 'Entertainment');
});

app.get('/sci-tech', (req, res) => {
  getInitialData(res, commonUrl + 'Sci%2fTech');
});

app.get('/business', (req, res) => {
  getInitialData(res, commonUrl + 'Business');
});

app.get('/politics', (req, res) => {
  getInitialData(res, commonUrl + 'Politics');
});

app.get('/sports', (req, res) => {
  getInitialData(res, commonUrl + 'Sports');
});

app.get('/lifestyle', (req, res) => {
  getInitialData(res, commonUrl + 'Lifestyle');
});

app.get('/search/:searchData', (req, res) => {
  const { searchData } = req.params;
  getInitialData(res, commonUrl + searchData);
});

app.get('*', (req, res) => {
  getInitialData(res, commonUrl + 'Top+stories');
});

app.listen(PORT);
