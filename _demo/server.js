//Устанавливаем конфигурацию
myConfig = {};
//Конфигурация пользователя (глобальная)
myConfig.data = {
	port		: 2020,
	isDebug		: true,		//Сообшения сервера
};
//Конфигурация модуля "output-static"
myConfig.static = {
	//Запрет лоступа
	forbidden		: [ /*'/server.js',*/ '/node_modules/', '/controllers/'/*, 'views'*/ ],
	//Очищаемые от комментариев файлы js или css
	clear			: [],	
	//Список mime						
	mime			: require('output-static-mime'),	
	//Режим отладки (добавлять ошибки заппросов в лог)
	isDebug			: true,
};
//Корректировка mime
myConfig.static.mime['.php'] = 'text/html, text/plain';
//Модуль фильтрации разрешенных статических ресурсов
var static = require('output-static')(myConfig.static);

//Конфигурация модуля "output-view"
myConfig.output = {
	//Папка отображений
	dir 		: __dirname + '/views',
	//Очищать код		
	clear 		: false,
	//Режим отладки
	isDebug		: false,						
};
//Модуль фильтрации разрешенных статических ресурсов
var output = require('output-view')(myConfig.output);

//Конфигурация модуля "router-controller"
myConfig.router = {
	//Папка контроллеров (Абсолюьный адрес)
	dir				: __dirname + '/controllers',
	//Статичныее маршруты
	routes 			: {						
		//Вариант1
		'/users/blogs/article' 	: '/article',
		//Запрос / обрабатывает контроллер /index.js
		'/'						: '/home',
/*		
		//Вариант2
		//Все запросы /article/... обрабатывает контроллер /users/blogs/article/index.js или /users/blogs/article.js
		'/article' 	: '/users/blogs/article',
		//Все запросы /home/... обрабатывает контроллер /index.js
		'/home'		: '/',
*/		
	},
	//Режим отладки (добавлять отладочную информацию ы лог)
	isDebug			: true,
	//Не кэшировать
	noCache			: true,
};
//Модуль 
var router = require('router-controller').router(myConfig.router);


var http = require('http');
//Формируем задачу
var app = function(req, res) {
	//Фильтруем запросы статичных файлов
	static.filter (req, res, function (err) {
		if (!err) return;

		if (err.code>1) {
			//Запрашиваемый ресурс не существует, не найдено mime или запрещен к нему доступ
			if (myConfig.static.isDebug) console.log('ERROR:', static.errors[err.code], req.url);
			res.writeHead(404);
			res.end();
			return;
		}
		
		//Обработка динамичных запросов
		if (myConfig.data.isDebug) {
			console.log('\nПолучен запрос req.url', req.url);
			console.time('app');//Установим метку времени
		}
		
		//Шаблонизатор
		req.output = output;

		//Ищем и запускаем контроллер
		var controller = router.getController(req, res);
		controller.start(function () {
			//Выводим общее время выполнения
			if (myConfig.data.isDebug) console.timeEnd('app');
		});
	});
};
//Создаем и запускаем сервер для задачи
var server = http.createServer(app);
server.listen(myConfig.data.port);
//Отображаем информацию о старте сервера
if (myConfig.data.isDebug) console.log('Server start on port ' + myConfig.data.port + ' ...');
