import * as core from "@actions/core";
import * as github from "@actions/github";

async function run(): Promise<void> {
  try {
    // Get inputs
    const ref = core.getInput("ref", { required: true });
    const state = core.getInput("state", { required: false }) ?? "open";
    const token = core.getInput("github-token", { required: true });

    // Create octokit client
    const octokit = github.getOctokit(token);
    const context = github.context;

    // Get pull requests
    const response = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: state as "open" | "closed" | "all",
      base: ref,
    });

    // Format and output the results
    const pulls = response.data;

    if (pulls.length === 0) {
      core.info(`No open pull requests found for ref: ${ref}`);
      return;
    }

    core.info(`Found ${pulls.length} open pull request(s) for ref: ${ref}\n`);

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
