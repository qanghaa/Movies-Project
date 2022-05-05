# Movies Back-end 

# Description

**Movies Back-end API, follows Restful API standard with features similar to real movies website.**	

**Features:** Routing, Middleware, Sending responses, Authentication, CRUD operations, Security, Sending email and Uploading files

**Document:** [here](https://documenter.getpostman.com/view/15522883/UyrBkGai)

## Usage
- Git clone repository

	```bash
	git clone https://github.com/qanghaa/Netflix-Backend-Clone
	```
- Dependencies Installation

	```bash
	npm install
	```
- Configuration Server

	create `config.env` file
	
	add your secret variables below
	```
	DATABASE=your cloud connection (mongodb+srv://example:<password>@sandbox.39xcg.mongodb.net/example)
	DATABASE_LOCAL=mongodb://localhost:27017
	DATABASE_PASSWORD=your database password
	PORT=3000
	NODE_ENV=development
	EMAIL_FROM=example@example.com
	EMAIL_USERNAME=your username
	EMAIL_PASSWORD=your password
	EMAIL_HOST=smtp.mailtrap.io
	EMAIL_PORT=2525
	JWT_SECRET=your jwt secret string
	JWT_EXPIRES_IN=90d
	JWT_COOKIE_EXPIRES_IN=90
	```
- Run server

	```bash
	npm start
	```

