import { getInput, setOutput, setFailed } from "@actions/core";
import { GitHub } from "@actions/github";
import query from "./query.gql";
import { get } from "lodash-es";

let token, octokit, branch, repo, owner, retryInterval;

async function getDeployment(args) {
  let environment = null
  while (!environment) {
    environment = await tryGetResult(args)
    if (!environment) 
      console.log(`environment is null, waiting ${retryInterval} milliseconds and trying again`)
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }
  return environment;
}

async function tryGetResult(args) {
  result = await octokit.graphql(query, args);
  edges = get(result, "repository.ref.target.deployments.edges")
  if (!edges) return null
  return get(edges, `[0].node.latestStatus.environmentUrl`, null);
}

async function run() {
  try {
    token = getInput("token", { required: true });
    octokit = new GitHub(token)
    [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    branch = process.env.GITHUB_REF.match(/(?<=refs\/heads\/).+/g)[0];
    retryInterval = getInput("retryInterval");

    const args = { repo, owner, branch };
    console.log("Starting to run with following input:", args);

    const deployment = await getDeployment(args);
    setOutput("deployment", deployment);
    console.log("Deployment set: ", JSON.stringify(deployment));
  } catch (error) {
    setFailed(error.message);
  }
}

run();
