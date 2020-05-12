
/**
 * 
 * @param query express request
 */
export const parseBmiQueries = (query: any): { weight: number, height: number } => {
  const weight = Number(query.weight)
  const height = Number(query.height)
  
  if (isNaN(weight) || isNaN(height)) {
    throw new Error('malformatted parameters')
  }

  return {
    weight,
    height
  }
}

/**
 * 
 * @param height height in cm
 * @param weight weight in kg
 */
export const calculateBmi = (height: number, weight: number): String => {
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
