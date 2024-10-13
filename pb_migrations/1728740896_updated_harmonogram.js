/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pbc_3222106587")

  // remove field
  collection.fields.removeById("date1929719690")

  // add field
  collection.fields.add(new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1929719690",
    "max": 0,
    "min": 0,
    "name": "data_wywozu",
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

  // remove field
  collection.fields.removeById("text1929719690")

  return app.save(collection)
})
