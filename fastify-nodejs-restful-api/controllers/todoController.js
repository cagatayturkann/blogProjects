//ilgili dosyaları ve modülleri çağırıyoruz
let items = require('../items');
const { v4: uuidv4 } = require('uuid');

//tüm todo listesini çekiyoruz
const getItems = (req, reply) => {
  reply.send(items);
};

//sorgu yapılan idye ait todoyu çekiyoruz
const getItem = (req, reply) => {
  const { id } = req.params;
  const item = items.find((item) => item.id === id);
  reply.send(item);
};

//yeni bir todo ekliyoruz
const addItem = (req, reply) => {
  const { name } = req.body;
  const item = {
    id: uuidv4(),
    name,
  };

  items = [...items, item];
  reply.code(201).send(item);
};

//belirtilen idye ait todoyu siliyoruz
const deleteItem = (req, reply) => {
  const { id } = req.params;
  items = items.filter((item) => item.id !== id);
  reply.send({ message: `Item ${id} has been removed!` });
};

//belirtilen idye ait todoyu güncelliyoruz. 
const updateItem = (req, reply) => {
    const { id } = req.params;
    const {name } = req.body;

    items = items.map(item=>(item.id === id ? {id,name} : item)) //items.id mevcut id'ye eşit ise id ve name güncelle değilse eskiyi döndür.
    // const item = items.find((item) => item.id === id); //yukarı ile aynı işlem farklı yazım.
    reply.send(item);
  };

//methodları diğer dosyalarda kullanabilmek için toplu şekilde export ediyoruz
module.exports = {
  getItems,
  getItem,
  addItem,
  deleteItem,
  updateItem
};