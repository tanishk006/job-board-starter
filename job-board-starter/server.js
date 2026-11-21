
// A small job board: a JSON API and one page. Run with `npm start`.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadJobs, searchJobs, findJob } from "./lib/jobs.js";
import { saveJob, removeSaved, loadSaved } from "./lib/saved.js";

const PORT = Number(process.env.PORT ?? 3000);

function sendJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(body));
}

// Read JSON request body
async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(rawBody);
}

export function createApp() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");

      // GET all jobs
      if (req.method === "GET" && url.pathname === "/api/jobs") {
        const jobs = await loadJobs();

        return sendJson(
          res,
          200,
          searchJobs(jobs, url.searchParams.get("q"))
        );
      }

      // GET saved jobs
      if (req.method === "GET" && url.pathname === "/api/saved") {
        const jobs = await loadJobs();
        const savedIds = await loadSaved();

        const savedJobs = savedIds
          .map((id) => findJob(jobs, id))
          .filter((job) => job !== null);

        return sendJson(res, 200, savedJobs);
      }

      // POST: Save a job
      if (req.method === "POST" && url.pathname === "/api/saved") {
        let body;

        try {
          body = await readJsonBody(req);
        } catch {
          return sendJson(res, 400, {
            error: "Invalid JSON request body"
          });
        }

        const { jobId } = body ?? {};

        if (typeof jobId !== "string" || !jobId.trim()) {
          return sendJson(res, 400, {
            error: "A valid jobId is required"
          });
        }

        const jobs = await loadJobs();
        const job = findJob(jobs, jobId);

        if (!job) {
          return sendJson(res, 404, {
            error: "Job not found"
          });
        }

        const savedIds = await loadSaved();

        if (savedIds.includes(jobId)) {
          return sendJson(res, 409, {
            error: "Job is already saved"
          });
        }

        await saveJob(jobId);

        return sendJson(res, 201, {
          message: "Job saved successfully",
          job
        });
      }

      // DELETE: Remove a saved job
      const deleteMatch = url.pathname.match(/^\/api\/saved\/([^/]+)$/);

      if (req.method === "DELETE" && deleteMatch) {
        let jobId;

        try {
          jobId = decodeURIComponent(deleteMatch[1]);
        } catch {
          return sendJson(res, 400, {
            error: "Invalid job ID"
          });
        }

        const savedIds = await loadSaved();

        if (!savedIds.includes(jobId)) {
          return sendJson(res, 404, {
            error: "Saved job not found"
          });
        }

        await removeSaved(jobId);

        return sendJson(res, 200, {
          message: "Job removed successfully",
          jobId
        });
      }

      // Serve frontend files
      if (
        req.method === "GET" &&
        (url.pathname === "/" || url.pathname === "/app.js")
      ) {
        const file = url.pathname === "/" ? "index.html" : "app.js";
        const type = file.endsWith(".html")
          ? "text/html"
          : "text/javascript";

        const body = await readFile(
          new URL(`./public/${file}`, import.meta.url)
        );

        res.writeHead(200, {
          "content-type": `${type}; charset=utf-8`
        });

        return res.end(body);
      }

      return sendJson(res, 404, {
        error: "Not found"
      });

    } catch (err) {
      console.error(err);

      if (!res.headersSent) {
        sendJson(res, 500, {
          error: "Something went wrong"
        });
      }
    }
  });
}

// Started directly (npm start), not imported by a test.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  createApp().listen(PORT, () =>
    console.log(`Job board on http://localhost:${PORT}`)
  );
}
