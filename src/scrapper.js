const Promise = require('bluebird');
const got = require('got');
const cheerio = require('cheerio');

const urls = require('../sources.json');

Promise.all(urls.map(async blog => {
  const content = await got.get({
    url: blog.url,
  });
  const $ = cheerio.load(content.body);
  const selected = $(blog.selectors.article);
  const metaDatas = []; 
  selected.each((i, article) => {
    const tmp = $(article)
    const articleMetaData = {
      title: tmp.find('.db-article-card__cover-action')[0].attribs['title'],
      link: tmp.find('.db-article-card__cover-action')[0].attribs['href']
    };
    console.log(articleMetaData)
    return metaDatas.push(articleMetaData);
  });
}))
.then(() => process.exit(0));
