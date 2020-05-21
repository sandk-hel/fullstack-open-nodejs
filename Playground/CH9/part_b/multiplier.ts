interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: Array<string>): MultiplyValues => {
  if (args.length < 4) throw new Error('No enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  const value1 = Number(args[2]);
  const value2 = Number(args[3]);
  if (!isNaN(value1) && !isNaN(value2)) {
    return {
      value1,
      value2
    };
  }
  throw new Error('Provided values were not numbers!');
};

// const multiplicator = (a, b, printText) => {
//   console.log(printText, a * b)
// }

// // multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is: ')

// // multiplicator('can we multiply', 4, 'Multiplied a string and four, the result is: ')

// const a: number = Number(process.argv[2])
// const b: number = Number(process.argv[3])

// multiplicator(a, b, `Multiplied ${a} and ${b}, the result is: `)


const multiplicator = (a: number, b: number, printText: string): MultiplyValues => {
  console.log(printText, a * b);
  return { value1: a, value2: b };
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  multiplicator(value1, value2, `Multiplied ${value1} and ${value2}, the result is: `);
} catch (e) {
  console.log('Error something bad happened, message: ', e.message);
}