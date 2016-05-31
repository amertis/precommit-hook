var fs = require('fs')
var testDir = process.env.PWD + '/test';
var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file))
        }
        else {
            if(file.indexOf('.js') != -1)
                results.push(file)

        }

    })
    return results
}
var files = walk(testDir)
files.forEach(function (f) {
    var content = fs.readFileSync(f).toString()
    if (content.indexOf('describe.only') != -1 || content.indexOf('it.only') != -1) {
        process.exit(1)
    }
})
process.exit(0);