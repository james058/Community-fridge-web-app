var file = require("fs");
const filePath = "public/js/comm-fridge-data.json";
const itemsPath = "public/js/comm-fridge-items.json";
var fridges = [];
var items = []

function readItems() {
    if (file.existsSync(itemsPath)) {
        return JSON.parse(file.readFileSync(itemsPath));
    }
    return undefined;
}

exports.getItems = function() {
    items = readItems();
    if (items == undefined) {
        console.log("ERROR: there was an error in reading the file: " + itemsPath);
        return undefined;
    }
    return items;
}

// intialize the application data on the server-side and save it in the ** global ** students variable
exports.initialize = function() {
        fridges = readFridges();
        if (fridges === undefined) {
            console.log("ERROR: there was an error in reading the file: " + filePath);
        }
    }
    // return the list of students
exports.getFridges = function() {
    return fridges;
}

exports.createnewFridge = function(newfridge) {
    fridges.push(newfridge);
    let result = writeFridges();
    return newfridge;
}

exports.updateFridge = function(fridge, newinfo) {
    if (newinfo.name != undefined) {
        fridge.name = newinfo.name
    }
    if (newinfo.accepted_types != undefined) {
        fridge.accepted_types = newinfo.accepted_types
    }
    if (newinfo.contact_person != undefined) {
        fridge.contact_person = newinfo.contact_person
    }
    if (newinfo.contact_phone != undefined) {
        fridge.contact_phone = newinfo.contact_phone
    }
    if (newinfo.can_accept_items != undefined) {
        fridge.can_accept_items = newinfo.can_accept_items
    }
    if (newinfo.address != undefined) {
        fridge.address = newinfo.address
    }

    let result = writeFridges();
    return fridge
}

function readFridges() {
    if (file.existsSync(filePath)) {
        return JSON.parse(file.readFileSync(filePath));
    }
    return undefined;
}

function writeFridges() {
    if (file.existsSync(filePath)) {
        return file.writeFileSync(filePath, JSON.stringify(fridges));
    }
    return undefined;
}
exports.getFridge = function(fridge_id) {
    let fridge = fridges.find(
        function findfridge(a_fridge) {
            return a_fridge.id == fridge_id;
        }
    );
    if (fridge == undefined) {
        return undefined
    }
    return fridge;
}
exports.createNewItem = function(fridge, newitem) {
    let items = readItems()
    let idexist;
    let keys = Object.keys(items)
    for (const i of keys) {
        if (items[i].id == newitem.id) {
            idexist = items[i]
        }
    }

    if (idexist) {
        newitem.id = "" + newitem.id
        fridge.items.push(newitem)
        let result = writeFridges();
        return newitem
    } else {
        return undefined
    }
}
exports.deleteAllItem = function(fridge) {
    let end = fridge.items.length
    fridge.items = []
    let result = writeFridges();
    return fridge
}

exports.deleteItem = function(fridge, itemid) {
        let item = fridge.items.find(
            function findItem(anItem) {
                return anItem.id === itemid;
            }
        );
        if (item == undefined) {
            return undefined
        }
        let itemIndex = fridge.items.indexOf(item);
        fridge.items.splice(itemIndex, 1);
        let result = writeFridges();
        return fridge
    }
    /*
        function writeStudents() {
            if (file.existsSync(filePath)) {
                return file.writeFileSync(filePath, JSON.stringify(students));
            }
            return undefined;
        }

        // check if a student with the studentId taking the course with courseId exists
        exports.updateStudent = function(studentId, courseId, data) {
            console.log("Checking if a student with id: " + studentId + " taking the course " + courseId + " exists...");

            let foundStudent = undefined;
            for (let student of students) {
                if (student.snum == studentId && student.course == courseId) {
                    foundStudent = student;
                }
            }

            // if the student exists, then let's update the information for the student
            if (foundStudent !== undefined) {
                foundStudent.agrade = data.agrade;
                foundStudent.tgrade = data.tgrade;
                foundStudent.egrade = data.egrade;

                let result = writeStudents();
                return foundStudent;
            }
            return undefined;
        }
            */
    // write students from memory to the students.json file