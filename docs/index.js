$.getJSON('./generated/articles.json').then((articles) => {
  articles.forEach(article => {
    $('#content').append(`
      <a href="${article.link}" class="card">
        <img src="${article.image}">
        <h2>${article.title}</h2>
      </a>`
    );
  });
})