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

patientsRouter.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  if (!patient) {
    res.status(400).json({ error: 'Patient could not be found'} );
    return;
  }
  res.json(patient);
});

export default patientsRouter;
