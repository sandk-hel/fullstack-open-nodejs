import express from 'express';
import diaryService from '../services/diagnoseService';

const diagnoseRouter = express.Router();

diagnoseRouter.get('/', (_req, res) => {
  const diagnoses = diaryService.getAll();
  res.send(diagnoses);
});

export default diagnoseRouter;
