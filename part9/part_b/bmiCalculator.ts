
interface Inputs {
  weight: number 
  height: number
}

const parseInputs = (args: Array<String>): Inputs => {
  if (args.length < 4) {
    throw new Error('Insufficient parameters, pass weight and height')
  }

  if (args.length > 4) {
    throw new Error('Too many parameters') 
  }

  const height = Number(args[2])
  const weight = Number(args[3])

  if (isNaN(weight)) {
    throw new Error('Weight must be a valid number')
  }

  if (isNaN(height)) {
    throw new Error('Height must be a valid number')
  }

  return {
    height,
    weight
  }
}

/**
 * 
 * @param height height in cm
 * @param weight weight in kg
 */
const calculateBmi = (height: number, weight: number): String => {
  if (height === 0) {
    throw new Error('Zero division error, height must be greater than 0')
  }
  const heightInMeter = height / 100
  const bmi = weight / (heightInMeter * heightInMeter)
  
  if (bmi < 18.5) {
    return 'Underweight'
  }

  if (18.5 <= bmi && bmi <= 24.9) {
    return 'Normal (healthy weight)'
  }

  if (25 <= bmi && bmi <= 29.9) {
    return 'Overweight'
  }
  
  if (30 <= bmi && bmi <= 39.9) {
    return 'Obese'
  }

  throw Error(`Invalid bmi ${bmi}, could not determine the range`)
}

try {
  const { height, weight } = parseInputs(process.argv)
  console.log(calculateBmi(height, weight))
} catch (exception) {
  console.error('Error occurred:', exception.message)
}
