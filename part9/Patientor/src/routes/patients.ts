import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient } from '../utility';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res) => {
  const patients = patientService.getNonSensitivePatientEntries();
  res.send(patients);
});

patientsRouter.post('/', (req, res) => {
  const newPatient = toNewPatient(req.body);
  const addedPatient = patientService.addPatient(newPatient);
  res.json(addedPatient);
});

export default patientsRouter;
