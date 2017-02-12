#!/usr/bin/env node
'use strict';

const BuildConfigFromDist = require('../release/src/BuildConfigFromDist').BuildConfigFromDist;
const builDist = new BuildConfigFromDist();
const fs = require('fs');

var recursive = false;
var paths = [];
var argv = process.argv.slice(2);

argv.forEach(function (value) {
    value = value.trim();

    if (value.match('^--recursive$')) {
        recursive = true;
    } else if (value.match('^-r$')) {
        recursive = true;
    } else {
        paths.push(value);
    }
});

paths.forEach(function (path) {
    if (fs.existsSync(path)) {
        if (fs.lstatSync(path).isDirectory()) {
            fileWalk(path, buildFromListFile, recursive);
        } else {
            buildFromListFile(path);
        }
    }
});

function buildFromListFile(path) {
    if (builDist.isDist(path)) {
        console.log(`Build Dist File: ${path}`);
        builDist.merge(path);
    }
}

function fileWalk(dir, callback, recursive) {
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory() && recursive) {
            fileWalk(file, callback, recursive);
        }
        else {
            callback(file);
        }
    });
}

