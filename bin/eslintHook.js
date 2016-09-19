var pattern = 'git diff-index --name-only HEAD|grep "\\.js$"|grep -v "migrate*"'
var exec = require('child_process').exec;
var os = re
exec(pattern, function (error, stdout, stderr) {
    var files =  stdout.split('\n')
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

})
