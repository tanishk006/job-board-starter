# Job board starter

A small job board for an insiderOne work sample. It is made up: the jobs and
companies are not real.

## Run it

You need Node 20 or newer. There are no packages to install.

```
npm start      # then open http://localhost:3000
npm test       # runs the tests in test/
```

## What is here

- `server.js`: the web server. `GET /api/jobs?q=` lists jobs, `GET /` serves the page.
- `lib/jobs.js`: reading and searching the jobs. Pure functions.
- `jobs.json`: the jobs.
- `public/`: the page and its script.
- `test/`: tests, using Node's built-in test runner.

## Your task

See the work sample brief on insiderOne: add saved jobs (save, list, remove),
with tests, and add a short section to this README about what you built.

## My  Additions
I extended the existing job board by adding a Saved Jobs feature. Users can now save jobs they're interested in, view them in a separate Saved Jobs section, and remove them whenever they want. I also added API endpoints to handle these operations and used a separate saved.json file to store job IDs, so saved jobs remain available even after refreshing the page or restarting the server. On the frontend, I added Save and Remove buttons and made sure both sections update automatically after an action.

## My takeways 
While working on this feature, I got a better understanding of how the frontend and backend communicate through API requests. I also learned more about handling JSON data, working with Node.js file operations, validating user input, and managing HTTP status codes for different situations. One thing I found particularly useful was understanding why it's better to store saved job IDs separately instead of duplicating the entire job information. It also helped me appreciate how small details, such as preventing duplicate saves and handling invalid job IDs, make a feature more reliable.

## Test I wrote
I used Node.js's built-in test runner (node:test) and assertion module (node:assert/strict) to test the functionality without installing any additional packages. I added tests for loading saved jobs, saving new IDs, preventing duplicates, checking persistence, and removing jobs. I also wrote an API integration test to verify the GET, POST, and DELETE endpoints, including cases such as duplicate requests, unknown job IDs, and malformed JSON. All 10 tests passed when I ran npm test.


## final outcomes
The Saved Jobs feature is implemented and working as expected. Users can save jobs, view them separately, and remove them without refreshing the page. The saved data persists through the JSON file, and the API handles the main validation and error cases. I also verified the implementation using automated tests, with all 10 tests passing. Overall, this task gave me practical experience in taking an existing application, understanding its structure, and extending it with a complete backend-connected feature.

