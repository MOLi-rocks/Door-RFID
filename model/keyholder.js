"use strict";

var appRoot = require('app-root-path');

function keyholder(args) {
	var self = this;
	var rdb_dbname = args.rdb_dbname || 'moli_keyholder';
	var rdb_hostname = args.rdb_hostname || 'localhost';
	
	//~ this.stats = {};
	
	delete args.rdb_dbname;
	delete args.rdb_hostname;
	
	//~ this.vsphere = new vsphere_easy(args);
	this.r = require('rethinkdbdash')({
		db: rdb_dbname,
		host: rdb_hostname
	});
	
	return this;
};


status.prototype.withRFID = function (rfid, cb) {
	var self = this;
	
	self.r.table('moli_keyholder').getAll(id, {index:'rfid'}).run()
	.then(function(result) {
		if (typeof cb === 'function') {
			cb(undefined, result);
		}
	})
	.catch(function (err) {
		if (typeof cb === 'function') {
			cb(err);
		} else {
			throw new Error("vsphere error: ", err);
		}
	});
}

module.exports = keyholder;
