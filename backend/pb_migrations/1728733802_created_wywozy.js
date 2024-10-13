/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "kbkdqawmouu59o3",
    "created": "2024-10-12 11:50:02.728Z",
    "updated": "2024-10-12 11:50:02.728Z",
    "name": "wywozy",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "uvkuzp5z",
        "name": "ulica",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "miqnzw9z",
        "name": "rodzaj",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("kbkdqawmouu59o3");

  return dao.deleteCollection(collection);
})
