const markdownItDefault = require("markdown-it");
const mila = require("markdown-it-link-attributes");


// you can use any plugins and configs you want
const markdownIt = markdownItDefault({
  html: true,
  breaks: true,
  linkify: true,
});

markdownIt.use(mila, {
  attrs: {
    target: "_blank",
  },
});

module.exports = markdownIt
