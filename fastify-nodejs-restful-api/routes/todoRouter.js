
const items = require('../items');
const {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem,
} = require('../controllers/todoController');

//Item schema. Diğer optionlarda kod tekrarını önlemek adına yaptık. Dönen tip sabit.
const Item = {
  type: 'object', // dönen datanın tipini belirledik
  properties: {
    // dönen datanın içindeki elementlerin tiplerini belirledik
    id: { type: 'string' },
    name: { type: 'string' },
  },
};

//options for get all items
//validation schema ile > we can format what is to be returned or responded with from each of these routes
const getItemsOpts = {
  schema: {
    response: {
      200: {
        //response'ın 200 olduğunda ne olacağını belirledilk.
        type: 'array', // dönen responseun tipini belirledik bu route için
        items: Item,
      },
    },
  },
  //handler ile controller yani ana fonksiyonları belirleyebiliriz.
  handler: getItems,
};

//options for get items
const getItemOpts = {
  schema: {
    response: {
      200: Item,
    },
  },
  handler: getItem,
};

//options for add items
const postItemOpts = {
  schema: {
    //ekleme yaparken body alanı için configler yaptık. tipin obje olduğunu ve name alanının zorunluğu olduğunu belirtik.
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      },
    },
    response: {
      201: Item,
    },
  },
  handler: addItem,
};

//options for delete items
const deleteItemOpts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: deleteItem,
};

// options for update items.
const updateItemOpts = {
  schema: {
    body: {
      // item eklerken yapılan ayarların aynısı. Update için body alanının obje olduğunu ve name alanının zorunlu olduğunu belirttik≈
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      },
    },
    response: {
      200: Item,
    },
  },
  handler: updateItem,
};

//ana bir fonksiyon içerisinde routelerı tanımlıyoruz. Burada option parametresi ile JSON Schema ile HTTP istekleri için yukarıda yer alan validasyon şemalarını oluşturuyoruz. 
function itemRoutes(fastify, options, done) {
  //Get All Items
  fastify.get('/items', getItemsOpts);

  // Get single item
  fastify.get('/items/:id', getItemOpts);

  //Add item
  fastify.post('/items', postItemOpts);

  //Delete item
  fastify.delete('/items/:id', deleteItemOpts);

  //Update item
  fastify.put('/items/:id', updateItemOpts);

  done();
}

module.exports = itemRoutes;