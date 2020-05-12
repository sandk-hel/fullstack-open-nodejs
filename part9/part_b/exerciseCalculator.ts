interface ExerciseInputs {
  target: number;
  exerciseHours: Array<number>;
}

const parseExerciseInputs = (argv: Array<string>): ExerciseInputs => {
  if (argv.length < 4) {
    throw Error('Pass exercise hours separated by spaces');
  }
  
  const [,, targetString, ...exerciseHourStrings ] = argv;

  const target = Number(targetString);

  if (isNaN(target)) {
    throw new Error('target must be a valid number');
  }
  
  const exerciseHours = exerciseHourStrings.map(a => Number(a));
  if (exerciseHours.find(a => isNaN(a)) !== undefined) {
    throw Error('Invalid input, exercise hours must be numbers separated by space');
  }
  return {
    target,
    exerciseHours
  };
};

interface Result {
  periodLength: number;
  trainingDays: number; 
  success: boolean;
  rating: number; 
  ratingDescription: string;
  target: number;
  average: number;
}

const ratingText = (rating: number): string => {
  if (rating >= 1 && rating < 2) {
    return 'you need to try harder';
  }

  if (rating >= 2 && rating < 3) {
    return 'not too bad but could be better';
  }

  return 'excellent, keep up the good work!';
};

const calculateExercises = (dailyExercises: Array<number>, target: number): Result => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(a => a > 0).length;
  const average = dailyExercises.reduce((sum, daily) => sum + daily , 0) / dailyExercises.length;
  const success = dailyExercises.every(daily => daily >= 2);

  const roundedAverage = Math.round(average);

  // value between the range 3 >= rating >= 1
  const rating = Math.max(1, Math.min(roundedAverage, 3));
  const ratingDescription = ratingText(rating);

  return { 
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average 
  };
};

try {
  const { target, exerciseHours } = parseExerciseInputs(process.argv);
  const result = calculateExercises(exerciseHours, target);
  console.log(result);
} catch (exception) {
  console.log('Error occurred: ', exception.message);
}
