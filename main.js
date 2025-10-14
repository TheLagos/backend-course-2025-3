import fs from 'fs';
import { program } from 'commander';

program.option('-i, --input <path>', 'шлях до вхідного json файлу');
program.option('-o, --output [path]', 'шлях для збереження результату');
program.option('-d, --display', 'виведення результату в консоль');
program.option('-h, --humidity', 'вивести вологість');
program.option('-r, --rainfall <number>', 'фільтрувати за кількістю опадів');

program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}

let data;

try {
  const fileContent = fs.readFileSync(options.input, 'utf8');
  data = JSON.parse(fileContent);
} catch (error) {
  console.error("Cannot find input file");
  process.exit(1);
}

let processedData = data;

if (options.rainfall) {
  const rainLevel = parseFloat(options.rainfall);
  processedData = processedData.filter(item => {
    return item.Rainfall > rainLevel;
  });
}

const resultLines = processedData.map(item => {
  let line = `rainfall: ${item.Rainfall}, pressure: ${item.Pressure3pm}`;
  if (options.humidity) {
    line += `, humadity: ${item.Humidity3pm}`;
  }
  return line;
})

const outputString = resultLines.join('\n');

if (options.display) {
  console.log(outputString);
}

if (options.output) {
  try {
    fs.writeFileSync(options.output, outputString);
    console.log('Результат успішно записано в файл:', options.output);
  } catch (error) {
    console.error('Помилка при збереженні файлу:', error);
  }
}