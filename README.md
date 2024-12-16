# List Pull Requests Action

This GitHub Action lists all pull requests targeting a specific branch or tag.

## Inputs

- `base`: The base branch to list pull requests for (default: 'master')
- `github-token`: GitHub token for authentication (default: ${{ github.token }})
- `state`: The state of the pull requests to list (default: 'open')
- `hours_old`: Filter out PRs that are more than this many hours old (default: '0', meaning no filtering)

## Outputs

- `pull_requests_json`: JSON array containing the pull request data with the following structure:
  ```json
  {
    "number": 123,
    "title": "PR Title",
    "author": "username",
    "url": "https://github.com/owner/repo/pull/123",
    "created_at": "2023-12-16T00:00:00Z",
    "updated_at": "2023-12-16T00:00:00Z",
    "state": "open",
    "draft": false,
    "labels": ["bug", "enhancement"],
    "reviewers": {
      "users": ["reviewer1", "reviewer2"],
      "teams": ["team-reviewers"]
    }
  }
  ```
- `count`: Number of pull requests found

## Usage

```yaml
name: List Pull Requests
on:
  workflow_dispatch:
    inputs:
      base:
        description: 'Base branch to check'
        required: true
        default: 'main'
      hours:
        description: 'Age limit in hours (PRs older than this will be filtered out)'
        required: false
        default: '0'

jobs:
  list-prs:
    runs-on: ubuntu-latest
    steps:
      - name: Get list of pull requests
        id: list-prs
        uses: magebitcom/list-pr-action@v1
        with:
          base: ${{ github.event.inputs.base }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          hours_old: ${{ github.event.inputs.hours }}
          
      # Example: Use the outputs in subsequent steps
      - name: Use PR Data
        run: |
          echo "Found ${{ steps.list-prs.outputs.count }} pull requests"
          echo "Pull Requests Data:"
          echo "$JSON" | jq '.[].url'
        env:
          JSON: ${{ steps.list-prs.outputs.pull_requests_json }}
```

## Example Output

The action will output information about each pull request found both in the logs and as structured data:

```json
{
  "pull_requests_json": [
    {
      "number": 123,
      "title": "Add new feature",
      "author": "octocat",
      "url": "https://github.com/owner/repo/pull/123",
      "created_at": "2023-12-16T00:00:00Z",
      "updated_at": "2023-12-16T00:00:00Z",
      "state": "open",
      "draft": false,
      "labels": ["enhancement"],
      "reviewers": {
        "users": ["reviewer1", "reviewer2"],
        "teams": ["team-reviewers"]
      }
    }
  ],
  "count": 1
}
```

The logs will also show:
```
Found 1 pull request(s) for base: main

#123 - Add new feature
Author: octocat
URL: https://github.com/owner/repo/pull/123
Reviewers: reviewer1, reviewer2
Team Reviewers: team-reviewers
---
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the action:
   ```bash
   npm run build
   ```

## License

MIT