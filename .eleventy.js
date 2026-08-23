const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Add a year shortcode. Insert `{% year %}` in a page to get the current year.
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Add a shortcode for adding audio files with playback controls.
  eleventyConfig.addShortcode("audio", (title, mp3Link) =>
`
<span class="font-bold">${title}</span><audio controls><source src="${mp3Link}" type="audio/mpeg" /></audio>
`
);

  // Add a shortcode for adding embedded youtube vidoes.
  // Example: {% youtube "PSY - GANGNAM STYLE(강남스타일) M/V" "9bZkp7q19f0" %}
  eleventyConfig.addShortcode("youtube", function (caption, id) {
    return `<figure class="max-w-4xl mx-auto center mt-8 mb-8">
              <div class="aspect-w-16 aspect-h-9">
                   <iframe src="https://www.youtube.com/embed/${id}"
                     frameborder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowfullscreen
                    title="${caption}"></iframe>
                 </div>
            </figure>`;
  });

  // Emphasize some text using the theme color and strong text.
  eleventyConfig.addShortcode("emphasize", (text) => `<strong class="text-amber-500">${text}</strong>`);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
  });

  // Copy all media files to /_site
  eleventyConfig.addPassthroughCopy("./static/media");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Copy the CNAME file to /_site
  eleventyConfig.addPassthroughCopy("CNAME");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
