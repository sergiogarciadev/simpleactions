import * as core from '@actions/core'
import { context, getOctokit } from '@actions/github'

async function run(): Promise<void> {
  try {
    const token = (core.getInput('github_token') ||
      process.env.GITHUB_TOKEN) as string

    const octokit = getOctokit(token)

    const ref = core.getInput('ref') || context.ref

    await octokit.git.deleteRef({
      ...context.repo,
      ref
    })
  } catch (error) {
    // already deleted, just ignore it
  }
}

run()
