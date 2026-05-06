const buildVersion = process.env.CF_PAGES_COMMIT_SHA || `${Date.now()}`

process.stdout.write(JSON.stringify({ version: buildVersion }))
