const Image = require("@11ty/eleventy-img");
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const markdownIt = require("./src/markdown.js");
const outdent = require("outdent");
const path = require("node:path");

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image(`./src${src}`, {
    widths: [300, 800, null],
    formats: ["avif", "jpeg"],
    urlPath: "/images/",
    outputDir: "./public/images/",
  });

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

  return outdent`<div class="github-button"><a href=${path.join(base, this.page.filePathStem +"." + this.page.inputPath.split(".")[2])
  }>${text}</a></div>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/css/");
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addPassthroughCopy("./src/images/");
  eleventyConfig.addPassthroughCopy({ "./src/favicons": "/" }); //favicons remap to root
  eleventyConfig.addPassthroughCopy("./src/scripts/*.js");

  //shortcodes
  eleventyConfig.addShortcode("github", editOnGithubShortcode);
  eleventyConfig.addShortcode("date", () => `${new Date().getUTCDate}`);
  eleventyConfig.addPairedShortcode("tag", markdownToHtmlShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("EleventyImage", imageShortcode);

  //filters
  eleventyConfig.addNunjucksFilter("isLongerThan", (content, threshold) => {
    return content.length > threshold;
  });

  //plugins
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(emojiReadTime, { showEmoji: false });
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.setLibrary("md", markdownIt);
  return {
    dir: {
      input: "src",
      output: "public",
      markdownTemplateEngine: "njk",
    },
  };
};
