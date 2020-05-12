import express from 'express';
import patientService from '../services/patientService';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
  const patients = patientService.getNonSensitivePatientEntries();
  res.send(patients);
});

export default patientsRouter;
