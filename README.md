# List Pull Requests Action

This GitHub Action lists all pull requests targeting a specific branch or tag.

## Inputs

- `ref`: The branch or tag to list pull requests for (default: 'main')
- `github-token`: GitHub token for authentication (default: ${{ github.token }})
- `state`: The state of the pull requests to list (default: 'open')
- `hours_old`: Filter out PRs that are at least this many hours old (default: '0', meaning no filtering)

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
    "hours_old": 48.5
  }
  ```
- `count`: Number of pull requests found

## Usage

```yaml
name: List Pull Requests
on:
  workflow_dispatch:
    inputs:
      ref:
        description: 'Branch or tag to check'
        required: true
        default: 'main'
      hours:
        description: 'Maximum age in hours (PRs older than this will be filtered out)'
        required: false
        default: '0'

jobs:
  list-prs:
    runs-on: ubuntu-latest
    steps:
      - name: List Pull Requests
        id: list-prs
        uses: your-username/list-pr-action@v1
        with:
          ref: ${{ github.event.inputs.ref }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          hours_old: ${{ github.event.inputs.hours }}
          
      # Example: Use the outputs in subsequent steps
      - name: Use PR Data
        run: |
          echo "Found ${{ steps.list-prs.outputs.count }} pull requests"
          echo "Pull Requests Data:"
          echo "${{ steps.list-prs.outputs.pull_requests_json }}" | jq '.'
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
      "labels": ["enhancement"]
    }
  ],
  "count": 1
}
```

The logs will also show:
```
Filtering out PRs that are 24 hours old or older
Found 1 pull request(s) for ref: main

#123 - Add new feature
Author: octocat
URL: https://github.com/owner/repo/pull/123
Age: 5.5 hours
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

Test