import * as core from '@actions/core'
import * as github from '@actions/github'
import * as Webhooks from '@octokit/webhooks'

async function run(): Promise<void> {
  try {
    const token: string = (core.getInput('github_token') ||
      process.env.GITHUB_TOKEN) as string
    const body: string = core.getInput('body')

    const octokit = new github.GitHub(token)
    const context = github.context

    let issue_number = parseInt(core.getInput('issue_number'))

    if (context.eventName === 'pull_request') {
      const payload = context.payload as Webhooks.WebhookPayloadPullRequest
      if (!issue_number) {
        issue_number = payload.number
      }
    }

    const request = await octokit.issues.createComment({
      ...context.repo,
      issue_number,
      body
    })

    const comment = request.data
    core.setOutput('comment_id', comment.id.toString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
