"use strict";

var appRoot = require('app-root-path');

//~ https://stackoverflow.com/questions/28835512/rethinkdb-create-index-on-field-in-nested-array-running-into-big-data-scenario
//~ https://stackoverflow.com/questions/43562475/rethinkdbs-multi-indexes-on-nested-field
//~ Create index:
//~ r.db('moli').table('keyholder')
//~ .indexCreate('rfid', r.row('cards')('id'), {multi:true});
//~ Query:
//~ r.db('moli').table('keyholder')
//~ .get('1234567890', {index:'rfid'});

//~ Struct:
//~ {
	//~ "name": "",
	//~ "phone": "",
	//~ "email": "",
	//~ "telegram": "",
	//~ "cards": [
		//~ {
			//~ "id": "",
			//~ "title": ""
		//~ }
	//~ ]
//~ }

function keyholder(args) {
	var self = this;
	var rdb_dbname = args.rdb_dbname || 'moli';
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
	
	self.r.table('keyholder').getAll(id, {index:'rfid'}).run()
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
