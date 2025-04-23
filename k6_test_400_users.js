import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '15s', target: 400 },  // tăng dần đến 500 user trong 15s
        { duration: '30s', target: 400 },   // giữ mức 500 user trong 30 second 
        { duration: '15s', target: 0 },    // giảm về 0 user
      ],
};

export default function () {
  const url = 'http://localhost:3001/api/pipelines/search?tool=Git-leak&platform=gitlab&stage=Secret+Scanning&language=javascript'; // Replace with your API endpoint

  const res = http.get(url);

  // Validate response
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 3000ms': (r) => r.timings.duration < 3000, // Ensure response time is under 3 second
  });

  sleep(1); // Simulate user wait time
}