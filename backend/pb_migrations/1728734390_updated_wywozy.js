/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kbkdqawmouu59o3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3t6onyjp",
    "name": "timestamps_json",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kbkdqawmouu59o3")

  // remove
  collection.schema.removeField("3t6onyjp")

  return dao.saveCollection(collection)
})
