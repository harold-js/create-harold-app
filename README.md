## create-harold-app

Harold is a static site and blog generator based on Handlebars and Markdown. With a built-in search engine and ready-to-use responsive templates.

![harold js image](https://www.haroldjs.com/assets/images/harold-start.png)

## Intro 

[Static sites and blogs with HaroldJS](https://youtu.be/DG0T1Fg0mq0)

### Documentation

[www.haroldjs.com](https://www.haroldjs.com/)

### Articles

- [Personal blog for free](https://www.julian.io/articles/blog-for-free.html)

### Demo

- [Default template](https://cocky-leakey-9ad1bc.netlify.app/)
- [Bare template](https://elegant-volhard-48a4d1.netlify.app/)

### Creating an app

##### npx
```
npx create-harold-app my-app
```
(npx is a package runner tool that comes with npm 5.2+ and higher, see instructions for older npm versions)

##### npm
```
npm init harold-app my-app
```
npm init <initializer> is available in npm 6+

##### Yarn
```
yarn create harold-app my-app
```
yarn create <starter-kit-package> is available in Yarn 0.25+

It will create a directory called my-app inside the current folder.
Inside that directory, it will generate the initial project structure and install the transitive dependencies.

As an option, you can choose with which template it should init the project. Possible choices:
- default
- bare

If you want to init the project with `bare` template, pass additional option `-t bare`. For example: `npm init harold-app my-app -t bare`

In the future, there will be a possibility to pass custom templates.

Write `create-harold-app --help` in a terminal to get the list of options.

### Starting the app

From the newly created app's directory (in our case, `my-app`), run `npm start`. It will serve the app under `localhost:3000`. To change the port, just add `PORT` env, like: `PORT=3002 npm start`.

### Configuration

Harold will search up the directory tree for configuration in the following places:

- a `harold` property in package.json
- a `.haroldrc` file in JSON or YAML format
- a `.haroldrc.json`, `.haroldrc.yaml`, `.haroldrc.yml`, `.haroldrc.js`, or `.haroldrc.cjs` file
- a `harold.config.js` or `harold.config.cjs` CommonJS module exporting an object

You can configure the directory for md files (by default `posts`) and the directory for md files layouts (by default `blog-layouts`). Quite helpful because these names are also used in urls. For example, by default, `/posts/name-of-the-post` (name of the .md file), but you might want to build the docs website and have `/docs/name-of-the-doc` (name of the .md file).

You can also configure the name for output directory using `outputDirName` and if you want to host your site in subdirectory you would also need to add `hostDirName`.

Example of `.haroldrc` (placed in the root of your harold app):

```
{
  mdFilesDirName: 'docs',
  mdFilesLayoutsDirName: 'docs-layouts',
  outputDirName: 'dist',
  hostDirName: 'subfolder-name'
}
```

Remember to change these directories' names after you init your app.
If you are using the search system, change `postsPath` in `harold-search.js`.

### Updating harold-scripts

1. Check if there are any breaking changes in the `CHANGELOG.md`
2. In your project, update the version of `harold-scripts` package

## Some of the recipes

Below are ready-to-use recipes. You can take them as inspiration or copy it as it is and use in your custom template. See more at [www.haroldjs.com](https://www.haroldjs.com/docs/recipes)

#### Posts categories

You can use `postsList` Handlebars helper with `perPageLimit` param. You can use tags as categories. Posts will be divided into sections and listed by tag name.

```handlebars
<div class="homepage-section homepage-section-bg">
  <div class="container">
    <h1 class="homepage-header">Coding</h1>
    {{postsList
    perPageLimit=3
    currentPage=1
    className="post-list-items"
    dateFormat="dd mmmm yyyy"
    byTagName="coding"
    readMoreButtonLabel="&#8674;"
    }}
  </div>
</div>

<div class="homepage-section">
  <div class="container">
    <h1 class="homepage-header">Art and Design</h1>
    {{postsList
    perPageLimit=3
    currentPage=1
    className="post-list-items"
    dateFormat="dd mmmm yyyy"
    byTagName="art"
    readMoreButtonLabel="&#8674;"
    }}
  </div>
</div>
```

#### Similar posts

You can use the `postsList` with `byTagName`, which you should set up the same as the current post tag or tags. This way, you will be able to display a similar posts list. Remember to do this in the layout hbs file, not in Markdown files.

```handlebars
{{postsList
  className="docs-articles-list"
  byTagName=tags.[0]
}}
```

#### Featured post

```handlebars
{{postsList
  perPageLimit=1
  currentPage=1
  className="homepage-featured-post"
  dateFormat="dd mmmm yyyy"
  noTags=true
  noExcerpt=true
  noDate=true
  byTagName="featured"
  readMoreButtonLabel="Lets dive in!"
}}
```

#### Hosting: GitHub Pages

If you want to host Harold's website under your main username (username.github.io), you would need to rename your output directory to supported by Github. It is the `docs` directory. You would need to create a `.haroldrc` file and put the output directory name there.

```bash
{
  outputDirName: 'docs',
}
```

Build your Harold app and push it to the repo. Remember to add the `.gitignore` file, and exclude `node_modules` but keep the output directory (`docs`).

Configure  your Github Pages to take the source from the `docs` directory.

Here is the quick walk-through video on how to do that: 

- [youtu.be/VjCWn3qeZnY](https://youtu.be/VjCWn3qeZnY)

If you want to host Harold's website under the repository subdirectory name (username.github.io/my-blog), you need to add `hostDirName` and remember to keep your paths in order. You can use the `relativePath` handlebars helper. The default template (from v0.4.0) is already using it, so it should work as-is.

```bash
{
  outputDirName: 'docs',
  hostDirName: 'my-blog'
}
```

#### Hosting: Netlify

With Netlify, it is a little bit simpler. You just need to point to the Git branch and directory you want to deploy your site. You don't even need the source in the repo because Netlify will run the build scripts for you.

Here is the quick walk-through video on how to do that:

- [youtu.be/ZjeYgAgiHRE](https://youtu.be/ZjeYgAgiHRE)

### Why another one?

I wanted to have a simple static site generator to build and host on Netlify. There are many such solutions, but I wanted to have complete control.

What is essential, I equipped it with two templates that you can use and modify for your needs. I prepared the templates system for custom ones in the future. Templates are great because we don’t need to start every site/blog repeatedly from the ground.

### When to use it

- when you want to build a static website/blog with simple search functionality (default theme)
- when you want to build a small (maybe medium) site or blog
- when you don't want to use any big and complicated solution
- when you know how to use the Handlebars template system

### When not to use it

- when you want to build bigger projects (not tested with big projects, tested with over 120 markdown files, works quite fast)
- when you don't want to use Scss (you can still write standard CSS in .scss files) or Handlebars
- when you want to rely on something which has big community

### License

MIT

### Harold is built upon these excellent tools:

- [unified](https://unifiedjs.com/)
- [Handlebars](https://handlebarsjs.com/)
- [Sass](https://sass-lang.com/)

### Contact

julian.io
