/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

router.post('/', (req, res) => {
  const { name, ssn, dateOfBirth, gender, occupation } = req.body;
  const newPatient = patientService.addPatient({
    name,
    ssn,
    dateOfBirth,
    gender,
    occupation,
  });
  res.json(newPatient);
});

export default router;
