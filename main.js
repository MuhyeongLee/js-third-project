let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll('.menus button');
menus.forEach((menu) => {
  menu.addEventListener('click', (event) => {
    getNewsByTopic(event);
  });
});
let searchButton = document.getElementById('search-button');
let url;

const getNews = async () => {
  try {
    let header = new Headers({ 'x-api-key': 'r9KaKQI-XL-1PG3aVE-fitxCHU07pH5RHW_5Zs6p5zc' });
    url.searchParams.set('page', page);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status === 200) {
      if (data.total_hits === 0) {
        throw new Error('검색된 결과값이 없습니다.');
      }
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(news);
      render();
      pageNation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log('에러는', error.message);
    errorRender(error.message);
  }
};

const getLatestNews = () => {
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`);
  getNews();
};

const getNewsByTopic = (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
  getNews();
};

const getNewsByKeyword = () => {
  let keyword = document.getElementById('search-input').value;
  url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`);
  getNews();
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;
  document.getElementById('news-board').innerHTML = errorHTML;
};

const render = () => {
  let newsHTML = '';

  newsHTML = news
    .map((item) => {
      return `<div class="row news">
		<div class="col-lg-4">
			<img class="news-img-size" src="${item.media}"alt="" />
		</div>
		<div class="col-lg-8">
			<h2>${item.title}</h2>
			<p>${item.summary}</p>
			<div>${item.rights}</div>
			<div>${item.published_date}</div>
		</div>
	</div>`;
    })
    .join('');

  document.getElementById('news-board').innerHTML = newsHTML;
};

const pageNation = () => {
  let pagenationHTML = '';
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;
  pagenationHTML = `<li class="page-item">
	<a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
		<span aria-hidden="true">&lt;</span>
	</a>
</li>`;

  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${page === i ? 'active' : ''}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  pagenationHTML += `<li class="page-item">
	<a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
		<span aria-hidden="true">&gt;</span>
	</a>
</li>`;

  document.querySelector('.pagination').innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

getLatestNews();
searchButton.addEventListener('click', getNewsByKeyword);
