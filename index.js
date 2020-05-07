const core = require("@actions/core");
const github = require("@actions/github");
const query = require("./query.gql");

let token, octokit, branch, repo, owner, retryInterval;

async function getDeployment(args) {
  await new Promise((resolve) => setTimeout(resolve, retryInterval));
  let result = await octokit.graphql(query, args);

  while (
    !result.repository.ref.target.deployments.edges[0].node.latestStatus
      .environmentUrl
  ) {
    console.log(
      `environmentUrl is null, waiting ${retryInterval} milliseconds and trying again`
    );
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
    result = await octokit.graphql(query, args);
  }
  return result;
}

async function run() {
  try {
    token = core.getInput("token", { required: true });
    octokit = new github.GitHub(token);
    [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
    branch = process.env.GITHUB_REF.match(/(?<=refs\/heads\/).+/g)[0];
    retryInterval = core.getInput("timeout");

    console.log("Starting to run with following input:", {
      repo,
      owner,
      branch,
    });

    const deployment = await getDeployment({ repo, owner, branch });
    core.setOutput(
      "deployment",
      deployment.repository.ref.target.deployments.edges[0].node.latestStatus
        .environmentUrl
    );
    console.log("Deployment set", deployment);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
