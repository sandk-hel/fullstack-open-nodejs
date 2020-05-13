import { v4 as uuidv4 } from 'uuid';
import { NonSensitivePatientEntry, Patient } from '../types';
import patients from '../../data/patients';

const getAll = (): Patient[] => {
  return patients;
};

const getNonSensitivePatientEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation  }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    })
  );
};

const addPatient = (name: string, dateOfBirth: string, ssn: string, gender: string, occupation: string): NonSensitivePatientEntry => {
  const id = uuidv4();
  const patient: Patient = { id, name, dateOfBirth, ssn, gender, occupation };
  patients.push(patient);
  return { id, name, dateOfBirth, ssn, gender, occupation };
};

export default { 
  getAll,
  getNonSensitivePatientEntries,
  addPatient
};
