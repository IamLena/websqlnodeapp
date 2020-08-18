const mysql = require( 'mysql' );
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

class Database {
	constructor() {
		this.connection = mysql.createConnection({
			host		: process.env.DATABASE_HOST,
			user		: process.env.DATABASE_USER,
			password	: process.env.DATABASE_PASSWORD,
			database	: process.env.DATABASE_NAME
		})
	}

	// constructor( config ) {
	// 	this.connection = mysql.createConnection( config );
	// }

	query( sql, args ) {
		return new Promise( ( resolve, reject ) => {
			this.connection.query( sql, args, ( err, rows ) => {
				if ( err )
					return reject( err );
				resolve( rows );
			} );
		} );
	}
	close() {
		return new Promise( ( resolve, reject ) => {
			this.connection.end( err => {
				if ( err )
					return reject( err );
				resolve();
			} );
		} );
	}
}

module.exports = Database;
