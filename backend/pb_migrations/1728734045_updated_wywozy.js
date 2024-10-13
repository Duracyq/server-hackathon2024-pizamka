/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kbkdqawmouu59o3")

  // remove
  collection.schema.removeField("opjcx7s2")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wcw4pclu",
    "name": "timestamp",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("kbkdqawmouu59o3")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "opjcx7s2",
    "name": "timestamps",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // remove
  collection.schema.removeField("wcw4pclu")

  return dao.saveCollection(collection)
})
