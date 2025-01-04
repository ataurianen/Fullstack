import axios from 'axios';
import { NewDiaryEntry } from './types';

const baseUrl = 'http://localhost:3000';

export const getAllDiaries = async () => {
  const response = await axios.get(`${baseUrl}/api/diaries`);
  return response.data;
};

export const addDiary = async (diary: NewDiaryEntry) => {
  const response = await axios.post(`${baseUrl}/api/diaries`, diary);
  return response.data;
};
