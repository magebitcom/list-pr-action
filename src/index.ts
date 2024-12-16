import * as core from "@actions/core";
import * as github from "@actions/github";

function isOlderThanHours(date: string, hours: number): boolean {
  const prDate = new Date(date);
  const now = new Date();
  core.debug(`PR Date: ${prDate}`);
  core.debug(`Now: ${now}`);
  const diffInHours = (now.getTime() - prDate.getTime()) / (1000 * 60 * 60);
  core.debug(`Diff in hours: ${diffInHours}`);
  return diffInHours > hours;
}

async function run(): Promise<void> {
  try {
    // Get inputs
    const base = core.getInput("base", { required: true });
    const state = core.getInput("state", { required: false }) ?? "open";
    const token = core.getInput("github-token", { required: true });
    const hoursOld = parseInt(core.getInput("hours_old", { required: false }) ?? "0", 10);

    // Create octokit client
    const octokit = github.getOctokit(token);
    const context = github.context;

    // Get pull requests
    const response = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: state as "open" | "closed" | "all",
      base,
    });

    // Format and output the results
    let pulls = response.data;

    // Filter by age if hours_old is specified
    if (hoursOld > 0) {
      pulls = pulls.filter(pr => !isOlderThanHours(pr.created_at, hoursOld));
      core.info(`Filtering out PRs that are more than ${hoursOld} hours old`);
    }

    if (pulls.length === 0) {
      core.info(`No pull requests found for base: ${base}`);
      // Set empty outputs
      core.setOutput("pull_requests_json", "[]");
      core.setOutput("count", "0");
      return;
    }

    core.info(`Found ${pulls.length} pull request(s) for base: ${base}\n`);

    // Create a simplified array of PR data for output
    const pullRequestsData = pulls.map(pr => ({
      number: pr.number,
      title: pr.title,
      author: pr.user?.login || '',
      url: pr.html_url,
      created_at: pr.created_at,
      updated_at: pr.updated_at,
      state: pr.state,
      draft: pr.draft,
      labels: pr.labels.map(label => label.name)
    }));

    // Set outputs
    core.setOutput("pull_requests_json", JSON.stringify(pullRequestsData));
    core.setOutput("count", pulls.length.toString());

    // Logging
    pulls.forEach((pr) => {
      core.info(`#${pr.number} - ${pr.title}`);
      core.info(`Author: ${pr.user?.login}`);
      core.info(`URL: ${pr.html_url}`);
      core.info("---");
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unexpected error occurred");
    }
  }
}

run();
