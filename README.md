# Job Board Starter

A small job board built for an InsiderOne work sample. The jobs and companies used in this project are fictional.

## Run It

You need Node.js 20 or newer. No external packages are required.

```bash
npm start      # Starts the server at http://localhost:3000
npm test       # Runs the automated tests
```

## Project Structure

- `server.js`: HTTP server and API routes.
- `lib/jobs.js`: Loading and searching jobs.
- `lib/saved.js`: Saving, loading and removing saved job IDs.
- `jobs.json`: Stores the available jobs.
- `saved.json`: Stores saved job IDs.
- `public/`: Frontend HTML and JavaScript.
- `test/`: Automated tests using Node.js's built-in test runner.

## My Additions

I extended the existing job board by adding a Saved Jobs feature. Users can now save jobs they're interested in, view them in a separate Saved Jobs section, and remove them whenever they want.

I added API endpoints to handle these operations and used a separate `saved.json` file to store job IDs. This allows saved jobs to remain available even after refreshing the page or restarting the server. On the frontend, I added Save and Remove buttons and made sure both sections update automatically after an action.

### API Endpoints

- **GET `/api/saved`** – Retrieves the list of all saved jobs along with their details.

- **POST `/api/saved`** – Saves a job using its `jobId`, while preventing duplicate entries and validating whether the job exists.

- **DELETE `/api/saved/:jobId`** – Removes a previously saved job using its ID.

## My Takeaways

While working on this feature, I got a better understanding of how the frontend and backend communicate through API requests. I also learned more about handling JSON data, working with Node.js file operations, validating user input, and managing HTTP status codes for different situations.

One thing I found particularly useful was understanding why it's better to store saved job IDs separately instead of duplicating the entire job information. It also helped me appreciate how small details, such as preventing duplicate saves and handling invalid job IDs, make a feature more reliable.

## Tests I Wrote

I used Node.js's built-in test runner (`node:test`) and assertion module (`node:assert/strict`) to test the functionality without installing any additional packages.

I added tests for loading saved jobs, saving new IDs, preventing duplicates, checking persistence, and removing jobs. I also wrote an API integration test to verify the GET, POST, and DELETE endpoints, including cases such as duplicate requests, unknown job IDs, and malformed JSON.

All 10 tests passed when I ran `npm test`.

## Final Outcomes

The Saved Jobs feature is implemented and working as expected. Users can save jobs, view them separately, and remove them without refreshing the page. The saved data persists through the JSON file, and the API handles the main validation and error cases.

Overall, this task gave me practical experience in taking an existing application, understanding its structure, and extending it with a complete backend-connected feature.