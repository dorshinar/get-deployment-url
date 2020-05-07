# Run against deploy action

This action wait for a branch to be deployed, and outputs the deployment URL.

## Inputs

### `token`

**Required** A GitHub access token to query the GraphQL API.

### `retryInterval`

Time to wait (in ms) between attempts to fetch deployment URL. defaults to 10000.

## Outputs

### `deployment`

The deployment URL, if one is found.

## Example Usage

```yaml
- name: Get deployment URL
  id: deployment
  uses: dorshinar/run-against-deploy-action@v2
  timeout-minutes: 5
  with:
    token: ${{ secrets.GITHUB_TOKEN }}

- name: Run end-to-end tests
  run: npm run test:e2e
  env:
    deployment: ${{ steps.deployment.outputs.deployment }}
```
