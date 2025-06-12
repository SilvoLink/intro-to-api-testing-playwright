
| # | Scenario name                                                         | Test data                               |
|---|-----------------------------------------------------------------------|-----------------------------------------|
| 1 | PUT order: returns correct status code with correct api key. RC = 200 | api_key: '1234567898765432'             |
| 2 | PUT order: updates correct order with incorrect API key. RC = 401     | api_key: '112233'                       |
| 3 | DELETE order: deletes correct order with correct order ID. RC 204     | ID = 1                                  |
| 4 | DELETE order: deletes correct order with incorrect order ID. RC = 400 | ID = 0                                  |
| 5 | GET order: logs authenticated user in correctly. RC = 200             | username=My Name, password=12qw34er56ty |
| 6 | GET order: missing password user authentication. RC = 500             | username=My Name, password=             |