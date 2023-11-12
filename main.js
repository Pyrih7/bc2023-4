const http = require("http");
const fs = require("fs");
const xmlParser = require("fast-xml-parser");
const xmlBuilder = require("fast-xml-parser");

const requestListener = function (req, res) {
  res.writeHead(200);

  const data = fs.readFileSync("data.xml", "utf-8");
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
  };

  const jsonData = xmlParser.parse(data, options);
  const minValue = findMinValue(jsonData);

  const xmlData = {
    data: {
      min_value: minValue,
    },
  };

  const builder = new xmlBuilder.j2xParser({ format: true });
  const xmlres = builder.parse(xmlData);

  fs.writeFileSync("res.xml", xmlres);
  res.end(xmlres);
};

function findMinValue(data) {
  let min = 10000;
  for (const res of data.indicators.res) {
    const value = parseFloat(res.value);
    if (!isNaN(value) && value < min) {
      min = value;
    }
  }
  return min;
}

const server = http.createServer(requestListener);
server.listen(8000, () => {
  console.log("Server is running on port 8000");
});