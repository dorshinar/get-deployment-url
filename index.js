import { getInput, setOutput, setFailed } from "@actions/core";
import { GitHub } from "@actions/github";
import query from "./query.gql";
import { get } from "lodash-es";

let token, octokit, branch, repo, owner, retryInterval;

async function getDeployment(args) {
  environment = null
  while (!environment) {
    environment = await tryGetResult(args)
    if (!environment) {
      console.log(`environment is null, waiting ${retryInterval} milliseconds and trying again`)
    }
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }
  return result;
}

async function tryGetResult() {
  result = await octokit.graphql(query, args);
  edges = get(result, "repository.ref.target.deployments.edges")
  if (!edges) return null
  return get(edges, `[0].node.latestStatus.environmentUr`, null);
}

async function run() {
  try {
    token = getInput("token", { required: true });
    octokit = new GitHub(token);
    [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    branch = process.env.GITHUB_REF.match(/(?<=refs\/heads\/).+/g)[0];
    retryInterval = getInput("retryInterval");

    console.log("Starting to run with following input:", {
      repo,
      owner,
      branch,
    });

    const deployment = await getDeployment({ repo, owner, branch });
    setOutput(
      "deployment",
      deployment.repository.ref.target.deployments.edges[0].node.latestStatus
        .environmentUrl
    );
    console.log(
      "Deployment set: ",
      JSON.stringify(
        deployment.repository.ref.target.deployments.edges[0].node.latestStatus
          .environmentUrl
      )
    );
  } catch (error) {
    setFailed(error.message);
  }
}

run();
