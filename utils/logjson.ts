const c = {
    reset: '\x1b[0m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    gray: '\x1b[90m',
}

export const logJSON = (label: any = "LOG JSON", data: any) => {
    const json = JSON.stringify(data, null, 2)
        .replace(/"(\w+)":/g, `${c.cyan}"$1":${c.reset}`)
        .replace(/: "(.+?)"/g, `: ${c.green}"$1"${c.reset}`)
        .replace(/: (-?\d+\.?\d*)/g, `: ${c.yellow}$1${c.reset}`)
        .replace(/: (true|false)/g, `: ${c.red}$1${c.reset}`)
        .replace(/: (null)/g, `: ${c.gray}$1${c.reset}`)

    console.log(`${c.blue}▶ ${label} ${c.gray}----------------------${c.reset}\n${json}`)
}