import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utility';

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

patientsRouter.post('/:id/entries', (req, res) => { 
  try {  
    const newEntry = toNewEntry(req.body);
    const patient = patientService.addEntry(req.params.id, newEntry);
    res.json(patient);
  } catch (exception) {
    res.status(400).json({ error: exception.message });
  }
});


export default patientsRouter;
