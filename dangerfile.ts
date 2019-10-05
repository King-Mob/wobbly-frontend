import {message, danger, fail} from "danger"

// Setup
const github = danger.github;
const pr = github && github.pr;
const modified = danger.git.modified_files;
const bodyAndTitle = pr && (pr.body + pr.title).toLowerCase();

export default async () => {
  const modifiedMD = modified.join("\n- ")
  message("Changed Files in this PR: \n- " + modifiedMD)

  if (pr) {
    // Request a CHANGELOG entry if not declared #trivial
    const hasChangelog = modified.includes("CHANGELOG.md")
    const isTrivial = bodyAndTitle.includes("#trivial")
    const isUser = (pr && pr.user.type === "User")
    if (!hasChangelog && !isTrivial && isUser) {
      fail("Please add an entry to the changelog.")
    }
  }
}
