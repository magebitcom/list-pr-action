# List Pull Requests Action

This GitHub Action lists all open pull requests targeting a specific branch or tag.

## Inputs

- `ref`: The branch or tag to list pull requests for (default: 'main')
- `github-token`: GitHub token for authentication (default: ${{ github.token }})
- `state`: The state of the pull requests to list (default: 'open')