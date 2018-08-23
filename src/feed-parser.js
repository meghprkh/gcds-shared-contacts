var parseString = require('xml2js').parseString;

const findEditLink = links => {
  for (let i = 0; i < links.length; i++) {
    if (links[i]["$"].rel === "edit") return links[i]["$"].href
  }
  return undefined;
}

module.exports = function (feed, cb) {
  parseString(feed, function (err, result) {
    result = result.feed.entry
    result = result.map(e => ({
      email: e["gd:email"] ? e["gd:email"][0]["$"]["address"] : "undefined@iiit.ac.in",
      name: e.title[0]["_"],
      link: findEditLink(e.link)
    }))
    cb(result);
  });
}
