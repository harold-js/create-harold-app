## create-harold-app

Harold is a static site and blog generator based on Handlebars and Markdown.

## Intro 

[Static sites and blogs with HaroldJS](https://youtu.be/DG0T1Fg0mq0)

## Why another one?

I wanted to have a simple static site generator to build and host on Netlify. There are many such solutions, but I wanted to have complete control.

What is essential, I equipped it with two templates that you can use and modify for your needs. I prepared the templates system for custom ones in the future. Templates are great because we don’t need to start every site/blog repeatedly from the ground.

## When to use it

- when you want to build a static website/blog with simple search functionality (default theme)
- when you want to build a small (maybe medium) site or blog
- when you don't want to use any big and complicated solution
- when you know how to use the Handlebars template system

## When not to use it

- when you want to build something significant (not tested with big projects, tested with over 120 markdown files, works quite fast)
- when you don't want to use Scss (you can still write standard CSS in .scss files)
- when you want to rely on something which has its community

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

For now, there isn't much to configure, but you can configure the directory for md files (by default `posts`) and the directory for md files layouts (by default `blog-layouts`). Quite helpful because these names are also used in urls. For example, by default, `/posts/name-of-the-post` (name of the .md file), but you might want to build the docs website and have `/docs/name-of-the-doc` (name of the .md file).

Example of `.haroldrc` (placed in the root of your harold app):

```
{
  mdFilesDirName: 'docs',
  mdFilesLayoutsDirName: 'docs-layouts'
}
```

Remember to change these directories' names after you init your app.
If you are using the search system, change `postsPath` in `harold-search.js`.

### Updating harold-scripts

1. Check if there are any breaking changes in the `CHANGELOG.md`
2. In your project, update the version of `harold-scripts` package

### Documentation

WIP. Available soon.

### License

MIT

### Contact

julian.io
