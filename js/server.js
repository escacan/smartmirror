/* Magic Mirror
 * Server
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var url = require("url");
var express = require("express");
var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var path = require("path");
var ipfilter = require("express-ipfilter").IpFilter;
var fs = require("fs");
var helmet = require("helmet");

var Server = function(config, callback) {
	console.log("Starting server on port " + config.port + " ... ");

	var port = config.port;
	if (process.env.MM_PORT) {
		port = process.env.MM_PORT;
	}

	console.log("Starting server op port " + port + " ... ");

	server.listen(port, config.address ? config.address : null);

	if (config.ipWhitelist instanceof Array && config.ipWhitelist.length == 0) {
		console.info("You're using a full whitelist configuration to allow for all IPs")
	}

	app.use(function(req, res, next) {
		var result = ipfilter(config.ipWhitelist, {mode: "allow", log: false})(req, res, function(err) {
			if (err === undefined) {
				return next();
			}
			console.log(err.message);
			res.status(403).send("This device is not allowed to access your mirror. <br> Please check your config.js or config.js.sample to change this.");
		});
	});
	app.use(helmet());

	app.use("/js", express.static(__dirname));
	var directories = ["/config", "/css", "/fonts", "/modules", "/vendor", "/translations", "/tests/configs"];
	var directory;
	for (i in directories) {
		directory = directories[i];
		app.use(directory, express.static(path.resolve(global.root_path + directory)));
	}

	app.get("/version", function(req,res) {
		res.send(global.version);
	});
/*
	app.get("/data", function(req,res) {
		var inputData = req.url;
		console.log(inputData);
		fs.writeFile('test.txt', inputData.search, (err) => {
				  if (err) throw err;
				  console.log('The file has been saved!');
				});
		return;
	});
*/
	<!-- 시작 화면 -->
	app.get("/", function(req, res) {
		var html = fs.readFileSync(path.resolve(global.root_path + "/index.html"), {encoding: "utf8"});
		html = html.replace("#VERSION#", global.version);

		var contents = fs.readFileSync(path.resolve(global.root_path + "/test.txt"), {encoding: "utf8"});
		var diseaseContents = fs.readFileSync(path.resolve(global.root_path + "/disease.txt"), {encoding: "utf8"});
		configFile = "config/config.js";
		if (typeof(global.configuration_file) !== "undefined") {
		    configFile = global.configuration_file;
		}
		html = html.replace("#CONFIG_FILE#", configFile);
		html = html.replace("#CONTENTS#", contents);
		html = html.replace("#CONTENTS2#", contents);
		html = html.replace("#DISEASECONTENTS#", diseaseContents);

		res.send(html);
	});

	<!-- 전원이 켜진 화면 -->
	app.get("/firstView", function(req, res) {
	 	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
		console.log(fullUrl);

		var temp= fullUrl.split("?");
		var morning, afternoon, night;
		var temp2= temp[1].split(":");
		morning= temp2[0];
		afternoon= temp2[1];
		night= temp2[2];

		console.log(temp2[0] + "," + temp2[1] + "," + temp2[2]);
		fs.writeFile('test.txt', temp2[0] + ":" + temp2[1] + ":" + temp2[2], (err) => {
				  if (err) throw err;
				  console.log('The file has been saved!');
					});

		fs.writeFile('disease.txt', decodeURI(temp[2]), (err) => {
				  if (err) throw err;
				  console.log('The file has been saved!');
					});
		<!-- 예방.txt의 정보로 comple.txt를 초기화 -->
		var prevention = fs.readFileSync(path.resolve(global.root_path + "/예방.txt"), {encoding: "utf8"});
		fs.writeFile('comple.txt', prevention, (err) => {
					if (err) throw err;
					console.log('The file has been saved!');
					});

		var keyWord = decodeURI(temp[2]).split(",");
//		console.log(keyWord.length);
//		var keyNum = Math.floor(Math.random() * ( keyWord.length - 1)) + 1;

//		console.log(keyWord[keyNum]);

		<!-- 키워드의 첫 두글자를 잘라냄 -->
		for(var i= 1; i< keyWord.length; i++){
			keyWord[i]= keyWord[i].substr(0,2);
		}

		<!-- 키워드에 해당하는 파일명 탐색 -->
		for(var i= 1; i< keyWord.length; i++){
			var str = keyWord[i] + ".txt";
			fs.readFile(str, 'utf8', function(err, data) {
				if(err) {
						// 파일 읽기 실패
						console.log("file not exist");
				}
				else {
						// 파일 읽기 성공
						fs.appendFile('comple.txt', data, (err) => {
						  if (err) throw err;
						  console.log('The data was appended to file!');
						});
				}
			});
		}

		var html = fs.readFileSync(path.resolve(global.root_path + "/view/firstView.html"), {encoding: "utf8"});
		html = html.replace("#VERSION#", global.version);

		configFile = "config/config.js";
		if (typeof(global.configuration_file) !== "undefined") {
		    configFile = global.configuration_file;
		}
		html = html.replace("#CONFIG_FILE#", configFile);

		<!-- comple.txt의 정보를 firstView로 전달 -->
		fs.readFile('comple.txt', 'utf8', function(err, data) {
			if(err) {
					// 파일 읽기 실패
					console.log("file not exist");
			}
			else {
					// 파일 읽기 성공
					var content = data.split("\n");
					var compleNum = Math.floor(Math.random() * ( content.length - 1));
					console.log(content[compleNum]);
					document.write(content[compleNum]);
			}
		});
		res.send(html);
	});

	<!-- 약 입력 화면 -->
	app.get("/medi", function(req, res) {
		var html = fs.readFileSync(path.resolve(global.root_path + "/view/medicine.html"), {encoding: "utf8"});
		html = html.replace("#VERSION#", global.version);

		var contents = fs.readFileSync(path.resolve(global.root_path + "/test.txt"), {encoding: "utf8"});
		var diseaseContents = fs.readFileSync(path.resolve(global.root_path + "/disease.txt"), {encoding: "utf8"});
		html = html.replace("#CONTENTS#", contents);
		html = html.replace("#DISEASECONTENTS#", diseaseContents);

		res.send(html);
	});

	<!-- 약 종류 입력 화면 -->
	app.get("/dise", function(req, res) {
		var html = fs.readFileSync(path.resolve(global.root_path + "/view/disease.html"), {encoding: "utf8"});
		html = html.replace("#VERSION#", global.version);
		/*
		configFile = "config/config.js";
		if (typeof(global.configuration_file) !== "undefined") {
		    configFile = global.configuration_file;
		}
		html = html.replace("#CONFIG_FILE#", configFile);
    */

		res.send(html);
	});

	if (typeof callback === "function") {
		callback(app, io);
	}
};

module.exports = Server;
