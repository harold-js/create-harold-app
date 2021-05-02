const harold = (function () {
  let searchIndex;
  let postsJSON;
  const postsJsonDataPath = '/jsonData/posts.json';

  // Loads data for search index
  const fetchPostsJsonData = () => {
    return fetch(postsJsonDataPath)
      .then((response) => response.json())
      .then((data) => {
        postsJSON = data;
        return data;
      });
  };

  // Builds search index using json data and lunr library
  const buildSearchIndexWithLunr = () => {
    fetchPostsJsonData().then((data) => {
      searchIndex = lunr(function () {
        this.ref('fileName');
        this.field('title');
        this.field('body');
        this.field('excerpt');
        this.field('tags');
        data.forEach((doc) => {
          this.add(
            Object.assign(doc, {
              tags: doc.tags.join(' '),
              body: doc.body.replace(/(<([^>]+)>)/gi, ''),
            })
          );
        }, this);
      });
    });
  };

  // Search function
  const search = (phrase) => {
    if (searchIndex) {
      const searchResults = searchIndex.search(phrase);
      const refs = searchResults.map((result) => result.ref);
      return postsJSON.filter((item) => refs.includes(item.fileName));
    } else {
      console.error('Search index is not ready!');
    }
  };

  // Initialize whole harold app javascript logic
  const init = () => {
    buildSearchIndexWithLunr();
  };

  return {
    init,
    search,
  };
})();

harold.init();
