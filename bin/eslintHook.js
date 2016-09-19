var spawnSync = require('child_process').spawnSync;
var os = require('os')
var cmd = 'git'

var allArgs = ['diff-index', '--name-only','HEAD']
var options ={};
if (os.platform() === 'win32') {
    cmd = process.env.comspec || 'cmd.exe'
    allArgs = ['/s', '/c', '"', "git diff-index --name-only HEAD",'"']
    options ={encoding: 'utf-8', windowsVerbatimArguments: true}
}

var out = spawnSync(cmd, allArgs, options)
if(out.error) {
    console.log(out.error)
    process.exit(1)
}
if(out.stderr) {
    console.log(out.stderr.toString('utf-8'))
    process.exit(1)
}
var files =  out.stdout.split("\n")
files = files.filter(function (f) {
    return f!=null
})
if (!files || files.length == 0) {
    process.exit(0)
}
files = files.filter(function (f) {
    return f.endsWith('.js') && !f.startsWith('migrate')
})
if(files.length == 0) {
    process.exit(0)
}
console.log(files)
var CLIEngine = require('eslint').CLIEngine;
var configFile = process.cwd()
if (os.platform() === 'win32') {
    configFile += '\\.eslintrc.js'
} else {
    configFile += '/.eslintrc.js'
}
var engine = new CLIEngine({
    fix: false,
    useEslintrc: true,
    configFile: configFile
});
var report = engine.executeOnFiles(files);
var hasErrors = report.errorCount > 0 || report.warningCount > 0;
if (hasErrors) {
    process.exit(1)
}
process.exit(0)