interface Result {
  periodLength: number 
  trainingDays: number 
  success: boolean
  rating: number 
  ratingDescription: string 
  target: number
  average: number
}

const ratingText = (rating: number): string => {
  if (rating >= 1 && rating < 2) {
    return 'you need to try harder'
  }

  if (rating >= 2 && rating < 3) {
    return 'not too bad but could be better'
  }

  return 'excellent, keep up the good work!'
}

const calculateExercises = (dailyExercises: Array<number>, target: number): Result => {
  const periodLength = dailyExercises.length
  const trainingDays = dailyExercises.filter(a => a > 0).length
  const average = dailyExercises.reduce((sum, daily) => sum + daily , 0) / dailyExercises.length
  const success = dailyExercises.every(daily => daily >= 2)

  const roundedAverage = Math.round(average)

  // value between the range 3 >= rating >= 1
  const rating = Math.max(1, Math.min(roundedAverage, 3))
  const ratingDescription = ratingText(rating)

  return { 
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average 
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))