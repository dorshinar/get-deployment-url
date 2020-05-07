const core = require("@actions/core");
const github = require("@actions/github");
const query = require("./query.gql");

const token = core.getInput("token");
const octokit = new github.GitHub(token);
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const branch = process.env.GITHUB_REF.match(/(?<=refs\/heads\/).+/g)[0];

console.log({ repo, owner, branch });

async function getDeployment(args) {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  let result = await octokit.graphql(query, args);

  while (
    !result.repository.ref.target.deployments.edges[0].node.latestStatus
      .environmentUrl
  ) {
    console.log("environmentUrl is null, waiting 10 seconds and trying again");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    result = await octokit.graphql(query, args);
  }
  return result;
}

async function run() {
  try {
    const deployment = await getDeployment({ repo, owner, branch });
    core.setOutput(
      "deployment",
      deployment.repository.ref.target.deployments.edges[0].node.latestStatus
        .environmentUrl
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
