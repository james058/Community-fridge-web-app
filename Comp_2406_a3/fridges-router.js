// This module is cached as it has already been loaded
const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
let router = express.Router();
const app = express();

app.use(express.json()); // body-parser middleware

const fridgesMod = require("./fridges-module.js"); // custom catalog module

router.get("/", function(req, res, next) {
    console.log("Inside the GET /fridges request...");

    //TODO: If the client requested an HTML file, then respond with the index.html file
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '/public/view_pickup.html'));
    } else if (req.accepts('json')) {
        let fridges = fridgesMod.getFridges();
        if (fridges != undefined) {
            res.status(200).set("Content-Type", "application/json").json(fridges);
        } else if (fridges == undefined) {
            res.status(404).send();
        } else {
            res.status(500).send();
        }
    }
});

router.get("/addFridge", function(req, res, next) {
    console.log("Inside the GET /fridges/addFridge request...");
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '/public/addFridges.html'), function(err) {
            res.status(404).send();
        })
    }
});

router.post("/", express.json(), function(req, res, next) {
    console.log("Inside the POST /fridges request...");
    console.log(req.body);
    let nm = req.body.name;
    let canAcceptItems = req.body.can_accept_items;
    let acceptedTypes = req.body.accepted_types
    let contactPerson = req.body.contact_person;
    let contactPhone = req.body.contact_phone;
    let add = req.body.address;

    if (nm == undefined || canAcceptItems == undefined || acceptedTypes == undefined || contactPerson == undefined || contactPhone == undefined || add == undefined) {
        res.status(400).send("The fridge info is not correctly formatted.");
    }
    if (acceptedTypes.length == 0 || add.street == undefined || add.postal_code == undefined | add.city == undefined | add.province == undefined) {
        res.status(400).send("The fridge info is not correctly formatted.");
    }
    let fridges = fridgesMod.getFridges();
    let newid = fridges.length + 1;
    newid = "fg-" + newid
    let newfridge = {
        id: newid,
        name: nm,
        num_items_accepted: 0,
        can_accept_items: canAcceptItems,
        accepted_types: acceptedTypes,
        contact_person: contactPerson,
        contact_phone: contactPhone,
        address: { street: add.street, postal_code: add.postal_code, city: add.city, province: add.province, country: "Canada" },
        items: []
    }
    let addedfridge = fridgesMod.createnewFridge(newfridge)
    if (addedfridge) {
        res.status(200).set("Content-Type", "application/json").json(addedfridge);
    } else {
        res.status(500).send("Error, The fridge could not be added");
    }

    // TODO: If the client requested JSON format, then response with the JSON data for all the students. To retrieve the data associated with all of the students, use the getStudents() method of the students.js module.
});

router.get("/editFridge", function(req, res, next) {
    console.log("Inside the GET /fridges/editFridge request...");

    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '/public/editFridges.html'), function(err) {
            res.status(404).send();
        })
    }
});

router.get("/editFridge/:fridgeID", function(req, res, next) {
    console.log("Inside the GET /fridges/editFridge/:fridgeID request...");
    let fridgeid = req.params.fridgeID;
    console.log(fridgeid)
    if (req.accepts('json')) {
        let got_fridge = fridgesMod.getFridge(fridgeid)
        res.status(200).set("Content-Type", "application/json").json(got_fridge);
    }
});

router.get("/items", function(req, res, next) {
    console.log("Inside the GET /fridges/items request...");
    let items = fridgesMod.getItems()
    if (items) {
        res.status(200).set("Content-Type", "application/json").json(items);
    } else if (items == undefined) {
        res.status(404).send();
    } else {
        res.status(500).send();
    }
});

router.get("/:fridgeID", function(req, res, next) {
    console.log("Inside the GET /fridges/:fridgeID request...");

    let fridgeid = req.params.fridgeID;

    if (fridgeid == undefined) {
        res.status(400).send()
    }
    let got_fridge = fridgesMod.getFridge(fridgeid)
    if (got_fridge == undefined) {
        res.status(404).send();
    } else if (got_fridge != undefined) {
        res.status(200).set("Content-Type", "application/json").json(got_fridge);
    } else {
        res.status(500).send();
    }
});

router.put("/:fridgeID", express.json(), function(req, res, next) {
    console.log("Inside the PUT /fridges/:fridgeID request...");
    let fridgeid = req.params.fridgeID;
    if (fridgeid == undefined) {
        res.status(400).send()
    }
    if (req.body == undefined) {
        res.status(400).send()
    }
    let got_fridge = fridgesMod.getFridge(fridgeid)
    if (got_fridge == undefined) {
        res.status(404).send();
    } else if (got_fridge != undefined) {
        let updateFridge = fridgesMod.updateFridge(got_fridge, req.body)
        console.log(updateFridge)
        if (updateFridge) {
            res.status(200).set("Content-Type", "application/json").json(updateFridge);
        } else {
            res.status(500).send();
        }
    }
});

router.post("/:fridgeID/items", express.json(), function(req, res, next) {
    console.log("Inside the POST /fridges/:fridgeID/items request...");
    let fridgeid = req.params.fridgeID;
    let rqb = (req.body)
    let keys = Object.keys(rqb)

    if (keys.length != 2) {
        res.status(400).send()

    }
    if (rqb.id == undefined || rqb.quantity == undefined) {
        res.status(400).send()
    }
    if (fridgeid == undefined) {
        res.status(400).send()
    }
    let got_fridge = fridgesMod.getFridge(fridgeid)

    if (got_fridge == undefined) {
        res.status(404).send();
    } else if (got_fridge != undefined) {
        let newFridge = fridgesMod.createNewItem(got_fridge, rqb)
        console.log(newFridge)
        if (newFridge) {
            res.status(200).set("Content-Type", "application/json").json(newFridge);
        } else {
            res.status(404).send();
        }
    } else {
        res.status(500).send();
    }
});
router.delete("/:fridgeID/items/", express.json(), function(req, res, next) {
    console.log("Inside the DELETE /fridges/:fridgeID/items/ request...");
    let fridgeid = req.params.fridgeID;
    let queryObject = req.query
    let ids = Object.values(queryObject)
    console.log(queryObject)

    if (ids.length == 0) {
        let got_fridge = fridgesMod.getFridge(fridgeid)
        if (got_fridge == undefined) {
            res.status(404).send();
        }
        console.log(queryObject)
        let newFridge = fridgesMod.deleteAllItem(got_fridge);
        if (newFridge.items.length == 0) {
            res.status(200).send();
        } else {
            res.status(500).send();
        }

    } else {

        let got_fridge = fridgesMod.getFridge(fridgeid)
        if (got_fridge == undefined) {
            res.status(404).send();
        }
        console.log(ids)
        for (let item of ids) {
            let newFridge = fridgesMod.deleteItem(got_fridge, item)
            if (newFridge != undefined) {
                continue
            } else if (newFridge == undefined) {
                res.status(404).send();
            } else {
                res.status(500).send()
            }
        }
        res.status(200).send()
    }

});

router.delete("/:fridgeID/:itemID", express.json(), function(req, res, next) {
    console.log("Inside the DELETE /fridges/:fridgeID/itemsID request...");
    let fridgeid = req.params.fridgeID;
    let itemid = req.params.itemID;
    if (fridgeid == undefined) {
        res.status(400).send()
    }
    if (req.body == undefined) {
        res.status(400).send()
    }

    let got_fridge = fridgesMod.getFridge(fridgeid)
    if (got_fridge == undefined) {
        res.status(404).send();
    } else if (got_fridge != undefined) {
        let newFridge = fridgesMod.deleteItem(got_fridge, itemid)
        console.log(newFridge)
        if (newFridge != undefined) {
            res.status(200).send();
        } else {
            res.status(404).send();
        }
    } else {
        res.status(500).send();
    }
});

module.exports = router;