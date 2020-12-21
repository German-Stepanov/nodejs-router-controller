var Controller = function (req, res) {
	require('router-controller').Controller.call(this, req, res);

	var self = this;
	
	//Меняем метод для всех потомков
	this.start = function (next) {
		if (req.method!='GET') return this.error404(next);

		res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		res.end(
			req.output.view({
				file : '/page.php',
				data : {
					$title	: 'Страница контроллера',
					$uri 	: self.uri,
					$urn 	: self.urn,
				}
			})
		);
		next ();
	};
};
module.exports = Controller;
