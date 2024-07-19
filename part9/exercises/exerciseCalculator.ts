interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  dailyExercise: number[],
  target: number
): Result => {
  const periodLength: number = dailyExercise.length;
  const trainingDays: number = dailyExercise.filter((day) => day > 0).length;
  const average: number =
    dailyExercise.reduce((a, b) => a + b, 0) / periodLength;
  const success: boolean = average >= target;
  let rating = 1;
  if (trainingDays > 0) {
    rating = success ? 3 : 2;
  }
  let ratingDescription = 'bad';
  if (rating > 1) {
    ratingDescription = success ? 'good' : 'not too bad but could be better';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const target = Number(process.argv[2]);
const dailyExercise = process.argv
  .slice(3)
  .map((day) => Number(day))
  .filter((day) => !isNaN(day));
console.log(calculateExercises(dailyExercise, target));
