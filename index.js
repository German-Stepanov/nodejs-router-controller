//Базовый класс контроллера
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

//Класс роутера
var Router = function (config) {
	//Базовый класс контроллера 
	this.Controller = Controller;
	
	//Формируем конфигурацию роутера
	this.config = config || {};
	//Папка с контроллерами
	this.config.dir = this.config.dir || '';
	//Список статических маршрутов {"/запрашиваемый url" : "/вызываемый url"}
	this.config.routes 	= this.config.routes || {};		
	//Отладочная информация в лог
	this.config.isDebug = this.config.isDebug==null ?	false : Boolean(this.config.isDebug);
	//Кэшировать контроллер
	this.config.noCache = this.config.noCache==null ? false : Boolean(this.config.noCache);

	if (!require('fs').existsSync(this.config.dir)) {
		console.error('ERROR ROUTER:', 'Папка с контроллерами не обнаружена');
	}

	this.getController = function (req, res) {
		var url = req.url;
		//Корректировка статики
		for (var route in this.config.routes) {
			var re_test		= new RegExp('^' + route + '(?:\/|$)');
			var re_replace 	= new RegExp('^' + route);
			if (re_test.test(req.url)) {
				url = url.replace(re_replace, this.config.routes[route]);
				break;
			};
		};
		url = '/' + url.replace(/^\/+/, '').replace(/\/+$/, '');
		
		//Удаляем параметры запроса и разбиваем на сегменты
		var url_array = url.replace(/\?.*$/, '').split('/');
		
		//Ищем контроллер
		var file = '';
		while (url_array.length>0) {
			
			//index.js предпочтительней
			file = this.config.dir + url_array.join('/') + '/index.js';
			if (this.config.isDebug) console.log('DEBUG ROUTER:', 'Проверка маршрута', file.replace(this.config.dir, ''));
			if (require('fs').existsSync(file)) {
				if (this.config.isDebug) console.log('DEBUG ROUTER:','Маршрут найден');
				break;
			} else {
				if (this.config.isDebug) console.log('DEBUG ROUTER:','Маршрут не найден');
				file = this.config.dir + url_array.join('/') + '.js';
				if (this.config.isDebug) console.log('DEBUG ROUTER:', 'Проверка маршрута', file.replace(this.config.dir, ''));
				if (require('fs').existsSync(file)) {
					if (this.config.isDebug) console.log('DEBUG ROUTER:','Маршрут найден');
					break;
				} else {
					if (this.config.isDebug) console.log('DEBUG ROUTER:','Маршрут не найден');
					file = '';
				}
			}
			url_array.pop();
		};
		//Удаляем путь если контроллер имеет _ (Предотвращаем запуск скрытых контроллеров)
		if (file && /^_.*$/.test(require('path').basename(file))) {
			if (this.config.isDebug) console.log('DEBUG ROUTER:','Маршрут запрещен к использованию');
			file = '';
		}
		
		if (!file && this.config.isDebug) console.log('DEBUG ROUTER:','Выбран маршрут к базоввому контроллеру');

		//Создаем контроллер
		var controller = new (file ? require(file) : this.Controller)(req, res);
		//Очистка кэша
		if (file && this.config.noCache) delete require.cache[require.resolve(file)]; // Почистили кэш
		//Свойства контроллера
		controller.uri = url_array.join('/');
		if (controller.uri=='') {
			controller.uri = '/';
			url = url.replace(/^\//, '');
		}
		controller.urn = url.replace(controller.uri, '');
		return controller;
	};
};

module.exports = {
	//Экземпляр роутера
	router 		: function (config) {
		return new Router(config);
	},
	//Базовый класс контроллера
	Controller 	: Controller,
}
