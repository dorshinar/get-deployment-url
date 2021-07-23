import { getInput, setOutput, setFailed, debug } from "@actions/core";
import { getOctokit } from "@actions/github";
import mm from "micromatch";
import { get } from "lodash-es";
import query from "./query.gql";

async function getDeployment(args, retryInterval) {
  let environment = null;
  while (!environment) {
    environment = await tryGetResult(args);
    if (!environment)
      console.log(
        `environment is null, waiting ${retryInterval} milliseconds and trying again`
      );
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }
  return environment;
}

async function tryGetResult(args) {
  const octokit = getOctokit(getInput("token", { required: true }));
  const pattern = getInput("pattern");
  const result = await octokit.graphql(query, args);
  await waitForRateLimitReset(result);

  const edges = get(result, "repository.ref.target.deployments.edges");
  if (!edges) return null;

  return edges
    .map(edge => get(edge, `node.latestStatus.environmentUrl`, null))
    .find(url => {
      console.log(url, pattern, mm.isMatch(url, pattern))
      return url && mm.isMatch(url, pattern);
  });
}

async function waitForRateLimitReset(result) {
  const { cost, remaining, resetAt } = result.rateLimit;
  if (remaining >= cost) return;

  const timeToRateLimitReset =
    new Date(resetAt).getTime() - new Date().getTime();
  await new Promise((resolve) => setTimeout(resolve, timeToRateLimitReset));
}

async function run() {
  try {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    const branch =
      process.env.GITHUB_HEAD_REF ||
      process.env.GITHUB_REF.match(/(?<=refs\/heads\/).+/g)[0];
    const retryInterval = Number(getInput("retryInterval"));

    const args = { repo, owner, branch };
    console.log("Starting to run with following input:", args);

    const deployment = await getDeployment(args, retryInterval);
    setOutput("deployment", deployment);
    console.log("Deployment set: ", JSON.stringify(deployment));
  } catch (error) {
    setFailed(error.message);
  }
}

run();
