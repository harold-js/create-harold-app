---
layout: 'blog-post'
title: 'Harold is alive!'
excerpt: "Excerpt of the featured example post."
coverImage: 'https://picsum.photos/id/82/1500/600'
tags:
  - tag7
  - featured
publicationDate: '2021-04-18'
ogTitle: 'Harold is alive!'
ogDescription: 'Harold is a static site generator based on Handlebars templating system and markdown'
ogUrl: ''
ogImage: ''
twitterTitle: 'Harold is alive!'
twitterDescription: 'Harold is a static site generator based on Handlebars templating system and markdown'
twitterUrl: ''
twitterImage: ''
---

Harold is a static site and blog generator based on Handlebars templating system and Markdown.
There are two types of presentation possibilities (Page and Post) and couple of helpers. 
Here are some of the features:

### - Search system based on pre-generated JSON data, indexed with Lunr 

### - Configurable posts lists with Handlebars helper

```
{{postsList
  perPageLimit=6,
  byTagName='javascript',
  currentPage=1,
  className='hrld-post-list',
  noImage=false,
  noExcerpt=false,
  noTags=false,
  noDate=false,
  noReadMoreButton=false,
  readMoreButtonLabel='Read more',
  dateFormat='yyyy-mm-dd',
}}
```

### - Scss support

### - Wide images:

<div class="wide-content"><img src="https://picsum.photos/1000/400" alt="alt text" /></div>

### - Embeded media:

<div class="embeded-media-container">
  <iframe height="224" style="width: 100%;" scrolling="no" title="Confirmation Button" src="https://codepen.io/rubenasanchez/embed/preview/mdRqqbN?height=224&theme-id=dark&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/rubenasanchez/pen/mdRqqbN'>Confirmation Button</a> by Ruben A Sanchez
    (<a href='https://codepen.io/rubenasanchez'>@rubenasanchez</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
</div>

### - Code highlighter:

```javascript
const test = 'test';
console.log(test);
```

### - Markdown Front Matter support

```markdown
---
layout: 'blog-post'
title: 'Harold is alive!'
excerpt: "Excerpt of the featured example post."
coverImage: 'https://picsum.photos/id/82/1500/600'
tags:
  - tag7
  - featured
publicationDate: '2021-04-18'

---
```

### - Support for social media meta tags

In markdown files (for blog posts):

```markdown
ogTitle: 'Harold is alive!'
ogDescription: 'Harold is a static site generator based on Handlebars templating system and markdown'
ogUrl: ''
ogImage: ''
twitterTitle: 'Harold is alive!'
twitterDescription: 'Harold is a static site generator based on Handlebars templating system and markdown'
twitterUrl: ''
twitterImage: ''
```

Using Handlebars head partial (for subpages): 

```
{{> head
  title="Homepage"
  description="Harold app default theme"
  ogTitle="Harold Homepage"
  ogDescription="Harold Description"
  ogImage=""
  twitterTitle="Harold Homepage"
  twitterDescription="Harold Description"
  twitterImage=""
}}
```

These are just examples. It can be configured as you need.

### - Handlebars support

### - Date formatter helper

```
{{formatDate date=publicationDate format='dd mmmm yyyy'}}
```

You can customize it as you want. This theme is just an example. It is simple to learn such tools looking into real code example.
