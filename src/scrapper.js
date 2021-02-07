const Promise = require('bluebird');
const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');
const _ = require('lodash');

const urls = require('../sources.json');
const existingUrls = require('../dist/generated/articles.json');

Promise.all(urls.map(async blog => {
  const content = await got.get({
    url: blog.url,
  });
  const $ = cheerio.load(content.body);
  const selected = $(blog.selectors.article);
  const metaDatas = []; 
  selected.each((i, article) => {
    const article$ = $(article);
    function getMetadata(element, metadataConfig) {
      const foundElements = element.find(metadataConfig.selector);
      if (!foundElements.length) {
        return "";
      }
      return metadataConfig.attribute ? 
        foundElements[0].attribs[metadataConfig.attribute] || ""
        : $(foundElements[0]).text();
    }
    const articleMetaData = {
      title: getMetadata(article$, blog.selectors.articleTitle),
      link: getMetadata(article$, blog.selectors.articleLink),
      date: new Date()
    };
    return metaDatas.push(articleMetaData);
  });
  return metaDatas;
}))
.then(metadatas => _.flatten(metadatas))
.then(metadatas => metadatas.filter(el => el.link))
.then(metadatas => mergeArticles(existingUrls, metadatas))
.then((metaDatas) => {
  fs.writeFileSync(`${__dirname}/../dist/generated/articles.json`, JSON.stringify(metaDatas));
});

function mergeArticles(source, fetched) {
  return _.uniqBy(source.concat(fetched), 'link');
}
