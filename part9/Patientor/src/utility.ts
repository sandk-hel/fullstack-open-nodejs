/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender, NewPatient, Entry, HealthCheckRating, NewEntry } from "./types";

const isGender = (text: any): text is Gender => {
  if (!Object.values(Gender).includes(text)) {
    return false;
  } 
  return text;
};

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (text: any): boolean => {
  return Boolean(Date.parse(text));
};

const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const parseSSN = (ssn: any): string => {
   if(!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseDescription = (description: any): string => {
  if (!description || !isString(description)) {
    throw new Error('Invalid or missing description');
  }
  return description;
};

const parseSpecialist = (text: any): string => {
  if (!text || !isString(text)) {
    throw new Error('Invalid or missing specialist');
  }
  return text;
};

const parseEntryType = (type: any): string => {
  if (!type || !isString(type)) {
    throw new Error('Invalid or Missing type');
  }
  
  const types = ["Hospital", "HealthCheck", "OccupationalHealthcare"];
  if (!types.includes(type)) {
    throw new Error('Invalid type');
  }
  return type;
};

const parseDiagnosisCodes = (codes: any): string[] | undefined => {
  if (!codes) {
    return undefined;
  }
  
  if (!(codes instanceof Array)) {
    throw new Error('Invalid diagnosis codes');
  }

  const containsInvalidType = codes.find(c => !isString(c));
  if(containsInvalidType) {
    throw new Error('Invalid diagnosis code type');
  }
  
  return codes as string[];
};

const parseHospitalSpecificEntry = (object: any): { discharge: { date: string; criteria: string }} => {
  const discharge = object.discharge;
  if (!discharge) {
    throw new Error('Invalid or missing discharge');
  }

  const date = discharge.date;
  const criteria = discharge.criteria;
  if (!date || !isString(date) || !isDate(date) || !criteria || !isString(criteria) ) {
    throw new Error('Invalid or missing discharge details');
  }
  return { discharge: { date, criteria } };
};

const parseHealthCheckSpecificEntry = (object: any): { healthCheckRating: HealthCheckRating } => {
  if (object.healthCheckRating === undefined) {
    throw new Error('Missing health check rating');
  }

  const healthCheckRating = Number(object.healthCheckRating);
  if (isNaN(healthCheckRating) 
    || !Object.values(HealthCheckRating).includes(healthCheckRating)) {
      throw new Error('Invalid health check rating');
  }
  return { healthCheckRating };
};

const parseOccupationalHealthcareSpecificEntries = (object: any): 
{ employerName: string; sickLeave?: { startDate: string; endDate: string } } => {

  if (!object.employerName || !isString(object.employerName)) {
    throw new Error('Invalid or missing employer name');
  }

  const employerName = object.employerName;
  
  if (!object.sickLeave) {
    return { employerName };
  }

  const { startDate, endDate } = object.sickLeave;
  if (!startDate 
    || !isString(startDate) 
    || !isDate(startDate)
    || !endDate 
    || !isString(endDate)
    || !isDate(endDate)) {
      throw new Error('Invalid or missing sick leave start or end date');
    }
    return { employerName, sickLeave: { startDate, endDate } };
};

const toNewEntry = (object: any): NewEntry => {
  const basicDetail = {
    description: parseDescription(object.description),
    specialist: parseSpecialist(object.specialist),
    date: parseDate(object.date),
    type: parseEntryType(object.type),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes)
  };


  switch (basicDetail.type) {
    case "Hospital":
      const hospitalEntries = parseHospitalSpecificEntry(object);
      return { ...basicDetail, ...hospitalEntries, type: 'Hospital' };
    case "HealthCheck":
      const healhCheckEntries = parseHealthCheckSpecificEntry(object);
      return { ...basicDetail, ...healhCheckEntries, type: "HealthCheck" };
    case "OccupationalHealthcare":
      const occupationalCheckEntries = parseOccupationalHealthcareSpecificEntries(object);
      return { ...basicDetail, ...occupationalCheckEntries, type: "OccupationalHealthcare" };
    default: 
    throw new Error('Invalid or missing type');
  }
};

const toNewPatient = (object: any): NewPatient => {
  return {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSSN(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: []
  };
};

export {
  toNewPatient,
  toNewEntry
};
