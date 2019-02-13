/*
 * grunt-js2html
 * https://github.com/sachindrasingh/grunt-js2html
 *
 * Copyright (c) 2019 Sachindra Singh
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    var vm = require('vm'),
    pretty = require('pretty');
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('js2html', 'The best Grunt plugin ever.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({

        });

        // Iterate over all specified file groups.
        console.log("possessing task...");
        this.files.forEach(function(f) {
            f.src.forEach(function(filePath) {
                var content = grunt.file.read(filePath);
                if(!validateContent(content)){
                    return;
                }
                var htmlContent = content.replace(/\\n"[ ]{1,1000}\+/gm, '');
                htmlContent = htmlContent.replace(/\\"/gm, '"');
                htmlContent = htmlContent.replace(/\n[ ]{0,1000}"/gm, '');
                htmlContent = htmlContent.replace(/angular\.module\((.*?)\)/gm, '');
                htmlContent = htmlContent.replace(/\.run\(\[(.*?),(.*?)function[ ]{0,1000}/gm, '');
                htmlContent = htmlContent.replace(/\(\$templateCache\)[ ]{0,10}\{[ ]{0,1000}/g, '');
                htmlContent = htmlContent.replace(/[  \n]\$templateCache\.put\((.*?),/gm, '');
                htmlContent = htmlContent.replace("\");", '').replace("}]);", "");
                grunt.file.write(filePath + ".html", pretty(htmlContent));
                grunt.log.writeln('HTML file "' + filePath + '.html" created.');
            })
        });
    });

    function validateContent(content) {
        var script;
        try {
            script = new vm.Script(content);
            return true;
         } catch (error){
            grunt.log.writeln(error);
            return false;
         }
    }

};