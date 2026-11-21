
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  loadSaved,
  saveJob,
  removeSaved
} from "../lib/saved.js";

// Create a temporary saved.json for each test
async function createTempFile(t) {
  const directory = await mkdtemp(join(tmpdir(), "job-board-test-"));
  const filePath = join(directory, "saved.json");

  await writeFile(filePath, "[]");

  t.after(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  return filePath;
}

// Test loading saved jobs
test("loads an empty saved jobs file", async (t) => {
  const file = await createTempFile(t);

  const saved = await loadSaved(file);

  assert.deepEqual(saved, []);
});

// Test saving a job
test("saves a new job ID", async (t) => {
  const file = await createTempFile(t);

  const saved = await saveJob("j1", file);

  assert.deepEqual(saved, ["j1"]);
});

// Test duplicate prevention
test("does not save duplicate job IDs", async (t) => {
  const file = await createTempFile(t);

  await saveJob("j1", file);
  const saved = await saveJob("j1", file);

  assert.deepEqual(saved, ["j1"]);
});

// Test persistence
test("saved jobs persist in the JSON file", async (t) => {
  const file = await createTempFile(t);

  await saveJob("j1", file);
  await saveJob("j2", file);

  const saved = await loadSaved(file);

  assert.deepEqual(saved, ["j1", "j2"]);
});

// Test removing a saved job
test("removes a saved job ID", async (t) => {
  const file = await createTempFile(t);

  await saveJob("j1", file);
  await saveJob("j2", file);

  const saved = await removeSaved("j1", file);

  assert.deepEqual(saved, ["j2"]);
});

// Test removing an ID that does not exist
test("does not change the list when removing an unknown ID", async (t) => {
  const file = await createTempFile(t);

  await saveJob("j1", file);

  const saved = await removeSaved("unknown", file);

  assert.deepEqual(saved, ["j1"]);
});
