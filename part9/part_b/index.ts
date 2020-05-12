import express, { json } from 'express';
import { calculateBmi, parseBmiQueries } from './bmiCalculator';
import { calculateExercises } from  './exerciseCalculator';

interface ExercisesRequestBody {
  target: number;
  daily_exercises: Array<number>;
}

const app = express();
app.use(json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => { 
  try {
    const { height, weight } = parseBmiQueries(req.query);
    const bmi = calculateBmi(height, weight);
    res.json({ height, weight, bmi });
  } catch (exception) {
    res.status(400).json({ error: exception.message });
  }
});

app.post('/exercises', (req, res) => {
  type exercisesRequestBody = ExercisesRequestBody;
  const exercisesRequestBody = req.body;
  const target = exercisesRequestBody.target;
  const dailyExercises = exercisesRequestBody.daily_exercises;

  if (!target || !dailyExercises) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  const result = calculateExercises(dailyExercises, target);
  res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
