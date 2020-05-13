import { Diagnose } from '../../types';
import diagnoses from '../../data/diagnose';

const getAll = (): Diagnose[] => {
  return diagnoses;
};

export default {
  getAll
};
