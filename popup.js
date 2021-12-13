const newsArea = document.getElementById('news-content');
const news = document.querySelectorAll('news');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

const loadNewsContent = async (url) => {
  try {
    const jsonResponse = await fetch(url);
    const response = await jsonResponse.json();

    response.details.map((item) => {
      newsArea.innerHTML += `<a href='${
        item.url
      }' target='blank'><div class='news'>${
        item.image === '' || !item.image ? '' : `<img src='${item.image}' />`
      }<div class='content'><h3>${item.title} </h3><p>${
        item.snippet
      }</p></div></div></a>`;
    });
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadNewsContent('https://news.joshuadaniel.me/');
});

searchButton.addEventListener('click', () => {
  const inputValue = searchInput.value;
  if (inputValue !== '') {
    newsArea.innerHTML = '';
    loadNewsContent(`https://news.joshuadaniel.me/search/${inputValue}`);
  } else {
    alert('Enter value');
  }
});
