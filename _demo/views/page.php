<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title><?=$title?></title>
    <style>
		body {
			font-size:18px;
		}
		b {
			color:blue;
		}
		h2 {
			padding:0;
			margin:0
		}
	</style>
</head>
<body>
	<div>URI: <b>"<?=$uri?>"</b> URN: <b>"<?=$urn?>"</b></div>
    <br />
    <br />
    <h2>Переход к контроллеру /home.js по переназначенному в конфигурации маршруту</h2>
    <div><a href="/">/</a></div>

    <h2>Переходы к контроллеру /home.js</h2>
    <div><a href="/home">/home</a> или <a href="/home/">/home/</div>
    <div><a href="/home/test">/home/test</a></div>
    
    <h2>Переходы к контроллеру /users/index.js</h2>
    <div><a href="/users">/users</a> или <a href="/users/">/users/</a></div>
    <div><a href="/users/id">/users/id</a> или <a href="/users/id/">/users/id/</a></div>
    <div><a href="/users/id/5">/users/id/5</a></div>
    
    <h2>Переходы к контроллеру /users/blogs/index.js</h2>
    <div><a href="/users/blogs">/users/blogs</a> или <a href="/users/blogs/">/users/blogs/</a></div>
    <div><a href="/users/blogs/id">/users/blogs/id</a> или <a href="/users/blogs/id/">/users/blogs/id/</a></div>
    <div><a href="/users/blogs/id/2"/users/blogs/id/2></a></div>

    <h2>Переходы к контроллеру /article.js</h2>
    <div><a href="/article">/article</a> или <a href="/article/">/article/</a></div>
    <div><a href="/article/id">/article/id</a> или <a href="/article/id/">/article/id/</a></div>
    <div><a href="/article/id/10">/article/id/10</a> или <a href="/article/id/10/">/article/id/10/</a></div>

    <h2>Переходы к контроллеру /article.js по переназначенному в конфигурации маршруту</h2>
    <div><a href="/users/blogs/article">/users/blogs/article</a> или <a href="/users/blogs/article/">/users/blogs/article/</a></div>
    <div><a href="/users/blogs/article/id">/users/blogs/article/id</a> или <a href="/users/blogs/article/id/">/users/blogs/article/id/</a></div>
    <div><a href="/users/blogs/article/id/10">/users/blogs/article/id/10</a></div>
    
    <h2>Переход к несуществующему контроллеру /test.js или /test/index.js (404)</h2>
    <div><a href="/test">/test</a></div>

    <h2>Переход к существующему скрытому контроллеру /_MyController.js (404)</h2>
    <div><a href="/_MyController">/_MyController</a></div>
	    
    <h2>Попытка чтения существующих файлов с незапрещенным доступом в модуле "output-static"</h2>
    <div><a href="/server.js">/server.js</a></div>
    <div><a href="/views/page.php">/views/page.php</a></div>

    <h2>Попытка чтения существующих файлов с запрещенным доступом в модуле "output-static" (404)</h2>
    <div><a href="/controllers/_MyController.js">/controllers/_MyController.js</a></div>
    <div><a href="/controllers/home.js">/controllers/home.js</a> (404)</div>

    <h2>Попытка чтения несуществующего файла (404)</h2>
    <div><a href="/controllers/Controller.js">/controllers/Controller.js</a></div>
</body>
</html>