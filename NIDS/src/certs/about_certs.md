Para conseguir HTTPS ha sido necesario instalar certificados. Para ello se ha usado OpenSSL:
openssl req -nodes -new -x509 -keyout server.key -out server.cert
Viene aquí explicado:
https://flaviocopes.com/express-https-self-signed-certificate/

Una vez tenemos HTTPS tanto en el server de frontend como en el de NIDS, nos vamos a encontrar con problemas de confianza, sobre todo en firefox. Una vez aceptemos el certificado untrusted del frontend, veremos que la página no funciona y aparece un CORS error. Esto es un bug de firefox (en chrome debería funcionar). Es necesario entrar a la url del servidor de NIDS https://localhost:8080 y aceptar el certificado (aunque no cargue ninguna página despueś). A partir de este momento, la aplicación funcionará con SSL entre los nodos, y desde nuestro navegador.
