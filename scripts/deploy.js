import ghpages from "gh-pages"
import {execSync} from "child_process"

const commitHash = execSync("git rev-parse HEAD").toString().trim()

console.log(`Deploying at commit: ${commitHash}`)

ghpages
    .publish(
        "dist",
        {
            branch: "gh-pages",
            message: `${commitHash}`,
        },
        function (err) {
            if (err) {
                console.error("Deploy Fail:", err)
                process.exit(1)
            } else {
                console.log("Success")
            }
        },
    )
    .then(() => {
        console.log("Done")
    })
