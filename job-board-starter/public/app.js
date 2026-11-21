
const list = document.getElementById("jobs");
const search = document.getElementById("search");
const savedList = document.getElementById("saved-jobs");


async function show(query = "") {
  const res = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`);
  const jobs = await res.json();


  const savedRes = await fetch("/api/saved");
  const savedJobs = await savedRes.json();

  const savedIds = savedJobs.map((job) => job.id);

  list.innerHTML = "";

  for (const job of jobs) {
    const li = document.createElement("li");

    const details = document.createElement("p");
    details.textContent = `${job.title} at ${job.company}, ${job.location}. Rs ${job.stipend.toLocaleString("en-IN")} a month.`;

    const saveButton = document.createElement("button");

    if (savedIds.includes(job.id)) {
      saveButton.textContent = "Saved";
      saveButton.disabled = true;
    } else {
      saveButton.textContent = "Save";

      saveButton.addEventListener("click", async () => {
        try {
          const response = await fetch("/api/saved", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ jobId: job.id })
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error);
          }

          await show(search.value);
          await showSaved();

        } catch (error) {
          alert(error.message);
        }
      });
    }

    li.append(details, saveButton);
    list.append(li);
  }
}


async function showSaved() {
  const res = await fetch("/api/saved");
  const jobs = await res.json();

  savedList.innerHTML = "";

  for (const job of jobs) {
    const li = document.createElement("li");

    const details = document.createElement("p");
    details.textContent = `${job.title} at ${job.company}, ${job.location}. Rs ${job.stipend.toLocaleString("en-IN")} a month.`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `/api/saved/${encodeURIComponent(job.id)}`,
          {
            method: "DELETE"
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error);
        }

        await show(search.value);
        await showSaved();

      } catch (error) {
        alert(error.message);
      }
    });

    li.append(details, removeButton);
    savedList.append(li);
  }
}

// Search jobs when the user types
search.addEventListener("input", () => show(search.value));

// Initial page loading
show();
showSaved();
