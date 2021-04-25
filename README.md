## create-harold-app

Static site and blog generator based on Handlebars and Markdown.

## Why another one?

Because I wanted to have a simple static site generator to build and host on Netlify. I know there are many of them. I built one to have better control over it. 

What is important, I equipped it with two themes that you can use and modify for your needs. I prepared the theme system for custom ones in the future. This is also added value. We don’t need to start every site/blog repeatedly from the ground.

## When to use it

- wehen you want to build static website/blog with simple search functionality (default theme)
- when you want to build small (maybe medium) site or blog
- when you don't want to use any big and complicated solution
- when you know how to use Handlebars template system

## When not to use it

- when you want to build something big (not tested with very big projects, tested with over 120 markdown files, works quite fast)
- when you don't want to use Scss (you can still write standard css in .scss files)
- when you want to rely on something which has its own community

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

As an option you can choose with which template it should init the project. Possible choices:
- default
- bare

If you want to init the project with `bare` template pass additional option `-t bare`. For example: `npm init harold-app my-app -t bare`

In the future there will be a possibility to pass custom templates.

Write `create-harold-app --help` in terminal to get the list of options.

### Starting the app

From newly created app's directory (in our case `my-app`). Run `npm start`. It will serve the app under `localhost:3000`. To change the port just add `PORT` env, like: `PORT=3002 npm start`.

### Documentation

WIP. Available soon.

### License

MIT

### Contact

julian.io
