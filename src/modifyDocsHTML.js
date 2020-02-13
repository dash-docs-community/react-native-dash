var cheerio = require("cheerio");
var fs = require("fs");
var config = require("./config");
var indexedFiles = require("./indexedFiles.json");

// remove the left column and the nav bar so that it fits dash's usually small
// browser screen
indexedFiles.forEach(function(array, index) {
  var path =
    __dirname +
    "/../Contents/Resources/Documents/" +
    config.name +
    "/docs/" +
    array.name +
    ".html";
  var src = fs.readFileSync(path, "utf8");
  var $ = cheerio.load(src);

  $(config.pageSectionHeader).each(function(index, elem) {
    $(".edit-github").remove();
    var name = $(elem).text();

    // TODO: Change "array.toc to somehting more relevant on a page-by-page basis in indexedFiles.js"
    $(elem).prepend(
      '<a name="//apple_ref/cpp/' +
        "Section" +
        "/" +
        encodeURIComponent(name) +
        '" class="dashAnchor"></a>'
    );
    $.html();
  });

  $(config.pagePropHeader).each(function(index, elem) {
    $(".edit-github").remove();
    var name =
      $(elem)
        .children("code")
        .text() || $(elem).text();

    // TODO: Change "array.toc to somehting more relevant on a page-by-page basis in indexedFiles.js"
    $(elem).prepend(
      '<a name="//apple_ref/cpp/' +
        array.toc +
        "/" +
        encodeURIComponent(name) +
        '" class="dashAnchor"></a>'
    );
    $.html();
  });

  // Update cdn url to display iframes.
  $("iframe[data-src*='//cdn.rawgit.com']").each(function() {
    $(this).attr(
      "data-src",
      $(this)
        .attr("data-src")
        .replace("//cdn.rawgit.com", "http://cdn.rawgit.com")
    );
  });

  $(".fixedHeaderContainer").remove();
  $(".navGroup").remove();
  $(".docsNavContainer").remove();
  $(".docs-prevnext").remove();
  $(".nav-footer").remove();

  $(".navPusher").attr("style", "padding-top:0");

  fs.writeFileSync(path, $.html(), "utf8");
});
