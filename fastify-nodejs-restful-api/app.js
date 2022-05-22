//fastify'ı çağırdık ve loglamayı aktif ettik
const fastify = require('fastify')({ logger: true });

//fastifya ait olan swagger pluginini çağırdık
fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs', //hangi adres ile swagger'a bağlanacağımızı belirttik. Bu durumda http://localhost/docs olacak.
  swagger: {
    info: { title: 'fastify-api' }, //sayfaya ait title belirttik
  },
});

//Tanımlanan routeları fastify ile ilişkilendirdik
fastify.register(require('./routes/todoRouter'));


//server bağlantısını sağladık
const PORT = 5000;
const start = async () => {
  try {
    await fastify.listen(PORT);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();