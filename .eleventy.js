const Image = require("@11ty/eleventy-img");
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const faviconsPlugin = require("eleventy-plugin-gen-favicons");

const simpleGit = require("simple-git");
const moment = require('moment');
const markdownIt = require("./src/markdown.js");
const outdent = require("outdent");
const path = require("node:path");

function extract(html, regex) {
  // Use parentheses to capture the content inside <p> tags

  var regexObj = new RegExp(regex, "g");
  const matches = [];

  let match;
  while ((match = regexObj.exec(html)) !== null) {
    // Access the first captured group (index 1) to get the content inside <p> tags
    matches.push(match[1]);
  }

  return matches;
}

async function imageShortcode(src, alt, sizes, subdir = "") {
  var metadata = [];
  if (process.env.INTERNAUTICA_ENV.toLowerCase() === "deploy") {
    metadata = await Image(`./src${src}`, {
      widths: [300, 800, null],
      formats: ["avif", "jpeg"],
      urlPath: "/images/" + subdir,
      outputDir: "./public/images/" + subdir,
    });
  } else {
    metadata = await Image(`./src${src}`, {
      widths: [100],
      formats: ["jpeg"],
      urlPath: "/images/" + subdir,
      outputDir: "./public/images/" + subdir,
    });
  }

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };
  return Image.generateHTML(metadata, imageAttributes);
}

function markdownToHtmlShortcode(children, tag, class_ = false, id = false) {
  const content = markdownIt.render(children);
  return outdent`<${tag} ${class_ ? `class="${class_}"` : ""} ${
    id ? `id="${id}"` : ""
  }>${content}</${tag}>`;
}

function editOnGithubShortcode() {
  const base = "https://github.com/emlos/internautica.online/tree/master/src";
  const text = "Edit this page on github!";

  return outdent`<div class="github-button"><a href=${
    base +
    path.join(this.page.filePathStem + "." + this.page.inputPath.split(".")[2])
  }>${text}</a></div>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/css/");
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addPassthroughCopy("./src/images/blinkies");
  eleventyConfig.addPassthroughCopy("./src/images/buttons");
  eleventyConfig.addPassthroughCopy("./src/images/generated");
  eleventyConfig.addPassthroughCopy({ "./src/favicons": "/" }); //favicons remap to root
  eleventyConfig.addPassthroughCopy("./src/scripts/*.js");
  eleventyConfig.addPassthroughCopy("./src/fonts/");

  //shortcodes
  eleventyConfig.addShortcode("github", editOnGithubShortcode);
  eleventyConfig.addShortcode("date", () => `${new Date().getUTCDate}`);
  eleventyConfig.addPairedShortcode("tag", markdownToHtmlShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("EleventyImage", imageShortcode);

  const git = simpleGit({multiLine: true});
  eleventyConfig.addNunjucksAsyncShortcode(
    "commitMessages",
    async function () {
      

      var content='';

      const  latest  = await git.log({});
    
      latest.all.forEach(commit => {
        content = content + `<li class="git-commit"><div class="git-date"><b>${moment(new Date(commit.date)).format('DD-MM-YYYY HH:mm')}</b> - </div><div class="git-message">${commit.message}</div></li>\n`
        //console.log(commit)
      });

      return content

    }
  );

  //filters
  eleventyConfig.addNunjucksFilter("countlinesregex", extract);
  eleventyConfig.addNunjucksFilter("length", (content) => {
    return content.length;
  });
  eleventyConfig.addNunjucksFilter("countlines", (content) => {
    return content.split("\n").length;
  });
  eleventyConfig.addFilter("split", function (content, separator) {
    return content.split(separator).filter((entry) => entry != "");
  });

  //plugins
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(emojiReadTime, { showEmoji: false });
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(faviconsPlugin, { outputDir: "./public" });

  eleventyConfig.setLibrary("md", markdownIt);

  return {
    dir: {
      input: "src",
      output: "public",
      markdownTemplateEngine: "njk",
    },
  };
};
