interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyExercise: Array<number>,
  target: number
): Result => {
  const periodLength = dailyExercise.length;
  const trainingDays = dailyExercise.filter((day) => day > 0).length;
  const average = dailyExercise.reduce((a, b) => a + b) / periodLength;
  const success = average >= target;
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
