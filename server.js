'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var OpenCC = require('opencc');

// 支持转换类型
var cTypes = {
	's2t': 'Simplified Chinese to Traditional Chinese 簡體到繁體',
	't2s': 'Traditional Chinese to Simplified Chinese 繁體到簡體',
	's2tw': 'Simplified Chinese to Traditional Chinese (Taiwan Standard) 簡體到臺灣正體',
	'tw2s': 'Traditional Chinese (Taiwan Standard) to Simplified Chinese 臺灣正體到簡體',
	's2hk': 'Simplified Chinese to Traditional Chinese (Hong Kong Standard) 簡體到香港繁體（香港小學學習字詞表標準）',
	'hk2s': 'Traditional Chinese (Hong Kong Standard) to Simplified Chinese 香港繁體（香港小學學習字詞表標準）到簡體',
	's2twp': 'Simplified Chinese to Traditional Chinese (Taiwan Standard) with Taiwanese idiom 簡體到繁體（臺灣正體標準）並轉換爲臺灣常用詞彙',
	'tw2sp': 'Traditional Chinese (Taiwan Standard) to Simplified Chinese with Mainland Chinese idiom 繁體（臺灣正體標準）到簡體並轉換爲中國大陸常用詞彙',
	't2tw': 'Traditional Chinese (OpenCC Standard) to Taiwan Standard 繁體（OpenCC 標準）到臺灣正體',
	't2hk': 'Traditional Chinese (OpenCC Standard) to Hong Kong Standard 繁體（OpenCC 標準）到香港繁體（香港小學學習字詞表標準）'
}

var coverters = {}

var getConverter = function(type){
	if(coverters[type] == null){
		coverters[type] = new OpenCC(type + '.json');
	}
	return coverters[type];
}

var PORT = 8888
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
	var type = req.query.type;
	// Async API
	if(cTypes[type] == null){
		res.send('不支持的转换类型：' + type);
	}else{
		res.send(cTypes[type]);
	}
});

app.post('/', function(req, res){
	var input = req.body.input;
	var type = req.body.type;

	if(cTypes[type] == null){
		res.send('不支持的转换类型：' + type);
	}else{
		// Async API
		getConverter(type).convert(input, function(err, converted){
			res.send(converted)
		});
	}
});

app.listen(PORT);

console.log('Running on http://localhost:' + PORT);