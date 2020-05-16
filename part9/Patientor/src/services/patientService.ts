import { v4 as uuidv4 } from "uuid";
import { PublicPatient, Patient, NewPatient, NewEntry, Entry } from "../types";
import patients from "../../data/patients";

const getAll = (): Patient[] => {
  return patients;
};

const getNonSensitivePatientEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (newPatient: NewPatient): PublicPatient => {
  const patient = {
    ...newPatient,
    id: uuidv4(),
    entries: [],
  };
  patients.push(patient);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ssn, ...nonSensitivePatientEntry } = patient;
  return nonSensitivePatientEntry;
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  if (!patient) {
    return undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return patient;
};

const addEntry = (
  patientId: string,
  newEntry: NewEntry
): Patient | undefined => {
  const patient = getPatient(patientId);
  if (!patient) {
    return undefined;
  }

  const savedEntry = { ...newEntry, id: uuidv4() } as Entry;
  patient.entries = [...patient.entries, savedEntry];
  return patient;
};

export default {
  getAll,
  getPatient,
  getNonSensitivePatientEntries,
  addPatient,
  addEntry
};
