
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

import { createApp } from "../server.js";

test("saved jobs API works correctly", async (t) => {
  const savedFile = new URL("../saved.json", import.meta.url);

  // Back up the actual saved jobs file
  const originalSaved = await readFile(savedFile, "utf8");

  // Start with an empty saved jobs list
  await writeFile(savedFile, "[]");

  const server = createApp();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  // Restore the file and close the server after testing
  t.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    await writeFile(savedFile, originalSaved);
  });

  // 1. GET: Initially, no jobs should be saved
  const initialResponse = await fetch(`${baseUrl}/api/saved`);

  assert.equal(initialResponse.status, 200);
  assert.deepEqual(await initialResponse.json(), []);

  // 2. POST: Save a valid job
  const saveResponse = await fetch(`${baseUrl}/api/saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ jobId: "j3" })
  });

  assert.equal(saveResponse.status, 201);

  // 3. POST: Duplicate saving should be rejected
  const duplicateResponse = await fetch(`${baseUrl}/api/saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ jobId: "j3" })
  });

  assert.equal(duplicateResponse.status, 409);

  // 4. POST: Unknown job IDs should be rejected
  const invalidResponse = await fetch(`${baseUrl}/api/saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ jobId: "unknown" })
  });

  assert.equal(invalidResponse.status, 404);

  // 5. POST: Malformed JSON should be rejected
  const malformedResponse = await fetch(`${baseUrl}/api/saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: "{"
  });

  assert.equal(malformedResponse.status, 400);

  // 6. GET: Verify the saved job exists
  const savedResponse = await fetch(`${baseUrl}/api/saved`);

  const savedJobs = await savedResponse.json();

  assert.equal(savedJobs.length, 1);
  assert.equal(savedJobs[0].id, "j3");

  // 7. DELETE: Remove the saved job
  const deleteResponse = await fetch(`${baseUrl}/api/saved/j3`, {
    method: "DELETE"
  });

  assert.equal(deleteResponse.status, 200);

  // 8. GET: Verify the job has been removed
  const finalResponse = await fetch(`${baseUrl}/api/saved`);

  assert.deepEqual(await finalResponse.json(), []);
});
