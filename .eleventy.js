const Image = require("@11ty/eleventy-img");
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");

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

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/css/");
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addPassthroughCopy("./src/images/");
  eleventyConfig.addPassthroughCopy({ "./src/favicons": "/" }); //favicons in root
  eleventyConfig.addPassthroughCopy("./src/scripts/*.js");

  eleventyConfig.addShortcode("date", () => `${new Date().getUTCDate}`);

  eleventyConfig.addNunjucksAsyncShortcode("EleventyImage", imageShortcode);

  eleventyConfig.addNunjucksFilter("isLongerThan", (content, threshold) => {
    return content.length > threshold;
   
  });
  
  eleventyConfig.addPlugin(eleventySass);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(emojiReadTime, { showEmoji: false });

  return {
    dir: {
      input: "src",
      output: "public",
      markdownTemplateEngine: "njk",
    },
  };
};
