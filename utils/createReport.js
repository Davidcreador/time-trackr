const fs = require('fs');
const FILENAME = 'time.json';

function createFile(file) {
  fs.writeFile(FILENAME, file, 'utf8', err => {
    if (err) return console.log(err);
    console.log('File saved!');
    // exit after saving file
    process.exit(0);
  });
}

const newProject = {
  table: [],
};

module.exports = {
  createJsonReport: function(content) {
    fs.stat(FILENAME, (err, stat) => {
      if (err === null) {
        let report = fs.readFileSync(FILENAME, 'utf8');
        report = JSON.parse(report);

        report.table.push(content);
        report = JSON.stringify(report, null, 2);
        createFile(report);
      } else if (err.code == 'ENOENT') {
        let contentReport = {
          table: [],
        };
        contentReport.table.push(content);
        contentReport = JSON.stringify(contentReport, null, 2);
        createFile(contentReport);
      }
    });
  },
};
