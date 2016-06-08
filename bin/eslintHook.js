var pattern = 'git diff-index --name-only HEAD'
var exec = require('child_process').exec;
exec(pattern, function (error, stdout, stderr) {
    var files =  stdout.split('\n')
    files = files.filter(function (f) {
        return f.endsWith('.js') && !f.startsWith('migrate')
    })
    files.pop()
    if(files.length == 0) {
        process.exit(0)
    }
    console.log(files)
    var CLIEngine = require('eslint').CLIEngine;
    var engine = new CLIEngine({
        fix: true,
        useEslintrc: true,
        configFile: '.eslintrc.js'
    });
    var report = engine.executeOnFiles(files);
    var hasErrors = report.errorCount > 0 || report.warningCount > 0;
    if (hasErrors) {
        console.log(JSON.stringify(report))
        process.exit(1)
    }
})
