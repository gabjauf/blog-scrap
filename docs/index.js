$.getJSON('./generated/articles.json').then((articles) => {
  console.log(articles);
  articles.forEach(article => {
    $('body').append(`
      <a href="${article.link}">
        <h2>${article.title}</h2>
        <img src="${article.image}">
      </a>`
    );
  });
})