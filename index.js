'use strict';

var Promise = require('bluebird');
var fs = require('fs');
var exifReader = require('exif-reader');

var open = Promise.promisify(fs.open);
var read = Promise.promisify(fs.read);
var close = Promise.promisify(fs.close);

module.exports = {
	read: readExif
};

function readExif (filename) {
	return open(filename, 'r').then(function (fd) {
		var buffer = new Buffer(512);
		return searchExif(fd, buffer, 0)
			.then(exifReader)
			.tap(function () {
				return close(fd);
			});
	});
}

function searchExif (fd, buffer, fileOffset) {
	var offset = 0, length = buffer.length;
	return read(fd, buffer, 0, length, null).then(function () {
		while (offset < length) {
			if (buffer[offset++] == 0xFF && buffer[offset++] == 0xE1) {
				var exifBuffer = new Buffer(buffer.readUInt16BE(offset));
				return read(fd, exifBuffer, 0, exifBuffer.length, fileOffset + offset + 2).return(exifBuffer);
			}
		}
		return searchExif(fd, buffer, fileOffset + length);
	});
}