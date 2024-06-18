import axios from 'axios';

export async function getFitnessData(accessToken) {
  try {
    const response = await axios.post(
      'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
      {
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
          },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: Date.now() - 7 * 86400000,
        endTimeMillis: Date.now(),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const stepCount = response.data.bucket.reduce((acc, bucket) => {
      const steps = bucket.dataset[0]?.point[0]?.value[0]?.intVal || 0;
      return acc + steps;
    }, 0);
    return stepCount;
  } catch (error) {
    console.error('Failed to fetch the step count data', error);
    throw new Error('Failed to fetch the step count data');
  }
}