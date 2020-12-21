# nodejs-router-controller
Маршрутизация и запуск контроллеров - модулей, название которых и их расположение в папке контроллеров соответствует обрабатываемому запросу.
Вместе с модулем "output-view" и "model-for-mysql" позволяет разделить серверный код на принципах MVC (model-view-controller).

## Получение и настройка роутера
```JS
var config = {
	dir		: __dirname + '/controllers',	//Абсолюьный адрес папки контроллеров
	routes	: {},		//Статичныее маршруты, если требуются
	isDebug	: false,	//Режим отладки (вывод отладочной информации)
	noCache	: false,	//Кэшировать
};
var router = require('router-controller').router(config);
```
### Параметр "config.dir" определяет абсолюьный адрес папки контроллеров
Пример: 
```
	__dirname + '/controllers'
```
### Параметр "config.routes" определяет статичные маршруты. По-умолчанию {} - нет.
Пример 1: Чтобы все запросы "/users/blogs/article..." обрабатывал контроллер /article.js или /article/index.js
```
	'/users/blogs/article' 	: '/article',
```

Пример 2: Чтобы запрос "/" обрабатывал контроллер /home.js или /home/index.js
```
	'/'	: '/home',
```
Пример 3: Чтобы все запросы "/article/..." обрабатывал контроллер /users/blogs/article/index.js или /users/blogs/article.js
```
	'/article'	: '/users/blogs/article',
```
Пример 4: Чтобы все запросы "/home/..." обрабатывал контроллер /index.js
```
	'/home'		: '/',
```
### Параметр "config.isDebug" определяет режим отладки. По-умолчанию false.
Пример вывода отладочной информации 
```
	isDebug	: true,
```
### Параметр "config.noCache" определяет режим кэширования запросов. По-умолчанию false.
Пример отключения кэширования
```
	noCache	: true,
```
## Пример использования роутера
```JS
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
	forbidden		: [ '/server.js', '/node_modules/', '/controllers/', 'views' ],
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
	routes 			: {},
	//Режим отладки (добавлять отладочную информацию ы лог)
	isDebug			: true,
	//Не кэшировать
	noCache			: true,
};
//Модуль 
var router = require('router-controller').router(myConfig.router);
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
		//Ищем и запускаем контроллер
		var controller = router.getController(req, res);
		controller.start(function () {
			//Выводим общее время выполнения
			if (myConfig.data.isDebug) console.timeEnd('app');
		});
	});
};
//Создаем и запускаем сервер для задачи
var server = require('http').createServer(app);
server.listen(myConfig.data.port);
//Отображаем информацию о старте сервера
if (myConfig.data.isDebug) console.log('Server start on port ' + myConfig.data.port + ' ...');
```

## Контроллеры

### Получение класса базового контроллера
```JS
var Controller = require('router-controller').Controller;
```

### Класс базового контроллера 
```JS
var Controller = function(req, res) {
	//Параметры, определяемые роутером
	this.uri = null;
	this.urn = null;

	//Текущий объект
	var self = this;

	this.error404 = function(next) {
		res.writeHead(404);
		res.end();
		next();
	};

	//Запуск контроллера (наследуется всеми контроллерами)
	this.start = function (next) {
		this.error404(next);
	};
};
```

### Новый контроллер
Используя класс базового контроллера можно создать контроллер обработки любого запроса.
```
var Controller = function (req, res) {
	require('router-controller').Controller.call(this, req, res);

	var self = this;
	
	//Меняем метод запуска
	this.start = function (next) {
		if (req.method!='GET') return this.error404(next);

		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		res.end('Контроллер "' + this.uri + '" Параметры контроллера "' + this.urn + '"');
		next ();
	};
};
module.exports = Controller;
```

Если назвать этот файл "users.js" и расположить его в папке контроллеров, этот контроллер можно запустить следующим запросом
```
localhost:2020/users 
```
или 
```
localhost:2020/users/id/1
```
В последнем случае /id/1 - это параметры котроллера.

Примечание. Аналогичный результат можно достигнуть переименовав этот файл в index.js и поместив его в папку "users"

Если расположить тот же файл в папке "local" папки контроллеров, этот контроллер можно запустить следующим запросом
```
localhost:2020/local/users 
```
или 
```
localhost:2020/local/users/id/1
```

Примечание. Аналогичный результат можно достигнуть переименовав этот контроллер в index.js и поместив его в папку "/users/local"

### Скрытый контроллер
Чтобы добавить всем контроллерам свойства и методы, можно создать в папке контроллеров промежуточный контроллер, например MyController.js. Добавив в него все необходимые свойста и методы, можно использовать его в качестве родителя для других контроллеров.
Чтобы запретить вызов контроллера, первый символ его названия должен быть знаком подчеркивания, например _MyController.js.

## Тестирование
```
Пример серверного кода для проверки работоспособности расположен в директории "_demo"
```
### Запуск тестов
```
node server
```
### Результат
```
http://localhost:2020
```
