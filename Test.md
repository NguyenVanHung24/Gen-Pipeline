
         /\      Grafana   /‾‾/  
    /\  /  \     |\  __   /  /   
   /  \/    \    | |/ /  /   ‾‾\ 
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/ 

     execution: local
        script: scripts/test-script.js
        output: -

     scenarios: (100.00%) 1 scenario, 400 max VUs, 1m30s max duration (incl. graceful stop):
              * default: Up to 400 looping VUs for 1m0s over 3 stages (gracefulRampDown: 30s, gracefulStop: 30s)



  █ TOTAL RESULTS 

    checks_total.......................: 26002  428.353822/s
    checks_succeeded...................: 99.93% 25986 out of 26002
    checks_failed......................: 0.06%  16 out of 26002

    ✓ status is 200
    ✗ response time < 3000ms
      ↳  99% — ✓ 12985 / ✗ 16

    HTTP
    http_req_duration.......................................................: avg=401.73ms min=7.22ms med=455.19ms max=3.85s p(90)=643.98ms p(95)=665.88ms
      { expected_response:true }............................................: avg=401.73ms min=7.22ms med=455.19ms max=3.85s p(90)=643.98ms p(95)=665.88ms
    http_req_failed.........................................................: 0.00%  0 out of 13001
    http_reqs...............................................................: 13001  214.176911/s

    EXECUTION
    iteration_duration......................................................: avg=1.4s     min=1s     med=1.45s    max=4.85s p(90)=1.64s    p(95)=1.66s   
    iterations..............................................................: 13001  214.176911/s
    vus.....................................................................: 15     min=15         max=400
    vus_max.................................................................: 400    min=400        max=400

    NETWORK
    data_received...........................................................: 35 MB  578 kB/s
    data_sent...............................................................: 2.3 MB 38 kB/s




running (1m00.7s), 000/400 VUs, 13001 complete and 0 interrupted iterations
default ✓ [======================================] 000/400 VUs  1m0s