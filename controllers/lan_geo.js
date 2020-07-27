data ia already in db - 152 rows

const csvParser = require('csv-parser');
const fs = require('fs');

fs.createReadStream('./csvdata/languages_countries_codes.csv')
  .pipe(csvParser())
  .on('data', (row) => {
	if (row.Name.includes("(")) {
		console.log(`option(value="${row.Code}") row.Name`)
	}
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
