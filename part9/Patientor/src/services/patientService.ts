import { v4 as uuidv4 } from 'uuid';
import { PublicPatient, Patient, NewPatient, SinglePublicPatient } from '../types';
import patients from '../../data/patients';

const getAll = (): Patient[] => {
  return patients;
};

const getNonSensitivePatientEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation  }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );
};

const addPatient = (newPatient: NewPatient): PublicPatient => {
  const patient = {
    ...newPatient,
    id: uuidv4(),
    entries: []
  };
  patients.push(patient);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssn,
     ...nonSensitivePatientEntry } = patient;
  return nonSensitivePatientEntry;
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patient;
};

export default { 
  getAll,
  getPatient,
  getNonSensitivePatientEntries,
  addPatient,
};
