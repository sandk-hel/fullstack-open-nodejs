import { v4 as uuidv4 } from 'uuid';
import { NonSensitivePatientEntry, Patient, NewPatient } from '../types';
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

const addPatient = (newPatient: NewPatient): NonSensitivePatientEntry => {
  const patient = {
    ...newPatient,
    id: uuidv4()
  };
  patients.push(patient);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssn,
     ...nonSensitivePatientEntry } = patient;
  return nonSensitivePatientEntry;
};

export default { 
  getAll,
  getNonSensitivePatientEntries,
  addPatient
};
