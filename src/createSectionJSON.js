var cheerio = require("cheerio");
var fs = require("fs");
var config = require("./config");

var results = [];

var initialPages = ["getting-started.html", "activityindicator.html"];

initialPages.forEach(page => {
  var path =
    __dirname +
    "/../Contents/Resources/Documents/" +
    config.name +
    `/docs/${page}`;
  var src = fs.readFileSync(path, "utf8");

  var $ = cheerio.load(src);
  $("div.navGroup").each(function(index, elem) {
    var sectionHeader = $(elem)
      .find("h3")
      .text();

    $(elem)
      .find("li")
      .each(function(i, li) {
        var page = {};

        page.name = $(li)
          .find("a")
          .attr("href")
          .replace(/\.html$/, "")
          .split("/")
          .pop();
        switch (sectionHeader) {
          case "Components":
            page.type = "Components";
            page.toc = "Property";
            break;
          case "APIs":
            page.type = "Library";
            page.toc = "Property";
            break;
          case "Polyfills":
            page.type = "Extension";
            page.toc = "Property";
            break;
          default:
            page.type = config.defaultPageType;
            page.toc = config.defaultPageTOC;
        }

        results.push(page);
      });
  });
});

var indexedFilesPath = "./src/indexedFiles.json";
fs.writeFileSync(indexedFilesPath, JSON.stringify(results), "utf-8");
