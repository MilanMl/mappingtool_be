const config = {
	LOCAL: {
		DB: {
			DBNAME: 'localhost/local', // ds121461.mlab.com:21461/mappingtool // localhost/local
			USERNAME: '', //appdb
			PASSWORD: '' //heslo123
		},
		ALLOWED_CORS: {
			URL: 'http://localhost:3003'
		},
		PORT: 3002,
		HOST: 'http://localhost'
	}
}

export default config


//mongodb:<dbuser>:<dbpassword>@ds121461.mlab.com:21461/mappingtool