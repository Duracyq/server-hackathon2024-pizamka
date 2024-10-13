/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pbc_3222106587")

  // add field
  collection.fields.add(new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1355270894",
    "max": 0,
    "min": 0,
    "name": "adres",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.add(new Field({
    "hidden": false,
    "id": "date1929719690",
    "max": "",
    "min": "",
    "name": "data_wywozu",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.add(new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3504976519",
    "max": 0,
    "min": 0,
    "name": "rodzaj",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pbc_3222106587")

  // remove field
  collection.fields.removeById("text1355270894")

  // remove field
  collection.fields.removeById("date1929719690")

  // remove field
  collection.fields.removeById("text3504976519")

  return app.save(collection)
})
