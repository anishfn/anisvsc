// ██████ Integrations █████████████████████████████████████████████████████████
require("dotenv").config();

const { WakaTime } = require("wakatime");
const { Octokit } = require("@octokit/core");

void (async function main() {
  try {
    const waka = new WakaTime(process.env.WAKATIMETOKEN);
    const wakaData = await waka.stats("last_7_days");

    const lastUpdate = new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const output = [
      "```console",
      "$ curl -s https://raw.githubusercontent.com/anisvsc/anisvsc/master/hello.sh | sh",
      "",
      " _____     _     _   ",
      "|  _  |___|_|___| |_ ",
      "|     |   | |_ -|   |",
      "|__|__|_|_|_|___|_|_|",
      "├── From India.",
      "├── Born on 2005.02.05",
      "└── Joined Github on 2017.02.17",
      "",
      "$ ls anisvsc",
      "├── README.md",
      "│",
      "├── Languages",
      "│   ├── HTML        CSS         TypeScript      NodeJS",
      "│   └── C           C++         Python",
      "│",
      "├── Frameworks",
      "│   └── NextJs      React       TailwindCSS     Vite",
      "│",
      "├── Tools",
      "│   ├── VSCode      Cursor      Httpie          Docker",
      "│   ├── Git         GitHub      Vercel          Postman",
      "│   └── TLDraw      Figma       Discord",
      "│",
      "└── Databases",
      "    └── MySQL       SQLite      MongoDB         Redis",
      "```",
    ];

    // ── Update README.md using GitHub API
    const octokit = new Octokit({
      auth: process.env.GITHUBTOKEN,
    });

    const {
      data: { sha },
    } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "anisvsc",
        repo: "anisvsc",
        path: "README.md",
      }
    );

    const base64 = Buffer.from(output.join("\n")).toString("base64");

    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: "anisvsc",
      repo: "anisvsc",
      path: "README.md",
      message: "update",
      content: base64,
      sha: sha,
    });

    console.log("✅ Successfully updated the README.md");
  } catch (error) {
    console.error("❌ Error updating README.md:", error.message);
  }
})();
