import express from 'express'
import { calculateBmi, parseBmiQueries } from './bmiCalculator'

const app = express()

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => { 
  try {
    const { height, weight } = parseBmiQueries(req.query)
    const bmi = calculateBmi(height, weight)
    res.json({ height, weight, bmi })
  } catch (exception) {
    res.status(400).json({ error: exception.message })
  }
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
