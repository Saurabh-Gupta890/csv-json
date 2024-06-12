const fs = require('fs');
const csv = require('csv-parser');

const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3];

if (!inputFilePath || !outputFilePath) {
  console.error('Please provide input and output file paths as command-line arguments.');
  process.exit(1);
}

const results = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    try {
      const transformedData = results.map((product) => {
        if (!product.productID || !product.name || !product.price) {
          throw new Error('Invalid data format');
        }

        return {
          id: product.productID,
          name: product.name,
          price: parseFloat(product.price),
         
        };
      });

      fs.writeFile(outputFilePath, JSON.stringify({ products: transformedData }, null, 2), (err) => {
        if (err) {
          console.error('Error writing to output file:', err);
          process.exit(1);
        }
        console.log('Data successfully transformed and saved to', outputFilePath);
      });
    } catch (error) {
      console.error('Error processing data:', error);
      process.exit(1);
    }
  })
  .on('error', (error) => {
    console.error('Error reading input file:', error);
    process.exit(1);
  });
