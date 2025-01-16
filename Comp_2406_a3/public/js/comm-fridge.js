var xhttp;
var xhttptwo

window.onload = function() {
    let pageId = document.getElementsByTagName("body")[0].id;
    if (pageId != null && pageId == "edit_a_fridge") {
        let urlParams = new URLSearchParams(window.location.search)
        let fridgeID = ""
        for (const [key, value] of urlParams) {
            fridgeID = value

        }
        if (fridgeID != "") {
            xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
                    let data = xhttp.responseText; // Data returned by the AJAX request
                    var fridge = JSON.parse(data); // Convert the JSON data to a JavaScript object
                    console.log(fridge); // print the object, so we can see the fields

                    let fridgeName = document.getElementById("fridgeName")
                    let numItemsAccepted = document.getElementById("numItemsAccepted")
                    let acceptedTypes = document.getElementById("acceptedTypes")
                    let contactPerson = document.getElementById("contactPerson")
                    let contactPhone = document.getElementById("contactPhone")
                    let streetName = document.getElementById("streetName")
                    let postalCode = document.getElementById("postalCode")
                    let city = document.getElementById("city")
                    let province = document.getElementById("province")

                    fridgeName.value = fridge.name
                    numItemsAccepted.value = fridge.can_accept_items
                    let types = fridge.accepted_types
                    for (let i = 0; i < types.length; i++) {
                        let option = document.createElement("option")
                        option.innerHTML = types[i]
                        option.value = types[i];
                        acceptedTypes.appendChild(option)
                    }
                    contactPerson.value = fridge.contact_person
                    contactPhone.value = fridge.contact_phone
                    let address = fridge.address
                    streetName.value = address.street
                    postalCode.value = address.postal_code
                    city.value = address.city
                    province.value = address.province

                    document.getElementById("fridgeName").addEventListener("input", validateNewFridge);
                    document.getElementById("numItemsAccepted").addEventListener("input", validateNewFridge);
                    document.getElementById("acceptedTypes").addEventListener("input", validateNewFridge);
                    document.getElementById("contactPerson").addEventListener("input", validateNewFridge);
                    document.getElementById("contactPhone").addEventListener("input", validateNewFridge);
                    document.getElementById("streetName").addEventListener("input", validateNewFridge);
                    document.getElementById("postalCode").addEventListener("input", validateNewFridge);
                    document.getElementById("city").addEventListener("input", validateNewFridge);
                    document.getElementById("province").addEventListener("input", validateNewFridge);
                    let btn = document.getElementById("submit_btn");
                    btn.className = fridgeID;
                    btn.addEventListener("click", updateFridge);

                } else {
                    console.log("There was a problem with the request.");
                }
            }
            xhttp.open("GET", "http://localhost:8000/fridges/editFridge/" + fridgeID, true); // open a connection to the server using the GET protocol
            xhttp.setRequestHeader("Accept", "application/json");
            // TODO: add an application/json Accept request header for the request
            xhttp.send(); // send the request to the server

        } else {
            xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
            xhttp.open("GET", "http://localhost:8000/fridges/editFridge", true); // open a connection to the server using the GET protocol
            // TODO: add an application/json Accept request header for the request
            xhttp.send(); // send the request to the server
        }

    } else {
        requestData("http://localhost:8000/fridges");
    }
}


function requestData(URL) {
    xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
    xhttp.onreadystatechange = processData; // specify what should happen when the server sends a response
    xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol

    // TODO: add an application/json Accept request header for the request
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send(); // send the request to the server
}


function processData() {
    if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        let data = xhttp.responseText; // Data returned by the AJAX request
        var fridges = JSON.parse(data); // Convert the JSON data to a JavaScript object
        console.log(fridges); // print the object, so we can see the fields
        let pageId = document.getElementsByTagName("body")[0].id;
        if (pageId != null && pageId == "view_items") {
            displayFridges(pageId, fridges);
        } else if (pageId != null && pageId == "add_items") {
            loadOptions();

        } else if (pageId != null && pageId == "add_new_items") {
            addNewItems();

        } else if (pageId != null && pageId == "add_new_fridges") {
            addNewFridges()
        }


    } else {
        console.log("There was a problem with the request.");
    }
}

function loadOptions() {
    xhttptwo = new XMLHttpRequest(); // create a new XMLHttpRequest object
    xhttptwo.onreadystatechange = displayOptions; // specify what should happen when the server sends a response
    xhttptwo.open("GET", "http://localhost:8000/fridges/items", true);
    xhttptwo.setRequestHeader("Accept", "application/json");
    xhttptwo.send(); // send the request to the server
}

function newFridgeAcceptedTypes() {
    xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
    xhttp.onreadystatechange = displayOptionsAcceptedTypes; // specify what should happen when the server sends a response
    xhttp.open("GET", "http://localhost:8000/fridges/items", true); // open a connection to the server using the GET protocol

    // TODO: add an application/json Accept request header for the request
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send(); // send the request to the server
}

function displayOptionsAcceptedTypes() {
    if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        let data = xhttp.responseText; // Data returned by the AJAX request
        let items = JSON.parse(data);

        let itemsarr = Object.keys(items);
        let typearr = []
        let exist = false;
        for (let index = 0; index < itemsarr.length; index++) {
            let item = itemsarr[index]
            for (let index = 0; index < typearr.length; index++) {
                const element = typearr[index];
                if (element == items[item].type) {
                    exist = true;
                }
            }
            if (exist == false) {
                typearr.push(items[item].type)
            } else {
                exist = false
            }
        }
        for (let index = 0; index < typearr.length; index++) {
            const element = typearr[index];
            let options = document.createElement("option");
            options.innerHTML = element;
            options.id = element;

            document.getElementById("acceptedTypes").appendChild(options);
        }
    }
}


function addNewItems() {
    document.getElementById("item_name").addEventListener("input", validateNewItems);
    document.getElementById("item_type").addEventListener("input", validateNewItems);
    document.getElementById("item_image").addEventListener("input", validateNewItems);
    document.getElementById("submit_btn").addEventListener("click", submitNewItems);
}

function addNewFridges() {
    newFridgeAcceptedTypes()
    document.getElementById("fridgeName").addEventListener("input", validateNewFridge);
    document.getElementById("numItemsAccepted").addEventListener("input", validateNewFridge);
    document.getElementById("acceptedTypes").addEventListener("input", validateNewFridge);
    document.getElementById("contactPerson").addEventListener("input", validateNewFridge);
    document.getElementById("contactPhone").addEventListener("input", validateNewFridge);
    document.getElementById("streetName").addEventListener("input", validateNewFridge);
    document.getElementById("postalCode").addEventListener("input", validateNewFridge);
    document.getElementById("city").addEventListener("input", validateNewFridge);
    document.getElementById("province").addEventListener("input", validateNewFridge);
    document.getElementById("submit_btn").addEventListener("click", submitNewFridge);

}

function validateNewFridge() {
    let fridgeName = document.getElementById("fridgeName")
    let numItemsAccepted = document.getElementById("numItemsAccepted")
    let acceptedTypes = document.getElementById("acceptedTypes")
    let contactPerson = document.getElementById("contactPerson")
    let contactPhone = document.getElementById("contactPhone")
    let streetName = document.getElementById("streetName")
    let postalCode = document.getElementById("postalCode")
    let city = document.getElementById("city")
    let province = document.getElementById("province")
    let checknumItemsAccepted = (numItemsAccepted.value != "" && isNaN(numItemsAccepted.value) == false);
    let checkfridgeName = (fridgeName.value != "" && isNaN(fridgeName.value) == true)

    let optionspicked = [];
    let allOptions = document.getElementById("acceptedTypes").options
    for (let picked of allOptions) {
        if (picked.selected) {
            optionspicked.push(picked.value);
        }
    }

    if (checkfridgeName && checknumItemsAccepted && optionspicked.length > 0 && contactPerson.value != "" && contactPhone.value != "" && streetName.value != "" && postalCode.value != "" && city.value != "" && province.value != "") {
        document.getElementById("submit_btn").disabled = false;
        acceptedTypes.className = optionspicked;

    } else {
        document.getElementById("submit_btn").disabled = true;
    }
}


function validate() {
    if (document.getElementById("grocery_items").value != "" && document.getElementById("number_items").value != "") {
        if (isNaN(document.getElementById("number_items").value) == false) {
            document.getElementById("submit_btn").disabled = false;
        } else {
            document.getElementById("submit_btn").disabled = true;
        }

    } else {
        document.getElementById("submit_btn").disabled = true;
    }
}

function displayOptions() {
    if (xhttptwo.readyState === XMLHttpRequest.DONE && xhttptwo.status === 200) {
        let data = xhttptwo.responseText; // Data returned by the AJAX request
        let items = JSON.parse(data);
        console.log(items.length)
        let itemsarr = Object.keys(items);
        console.log(itemsarr)
        for (let index = 0; index < itemsarr.length; index++) {
            let item = itemsarr[index]
            let options = document.createElement("option");
            options.innerHTML = items[item].name;
            console.log(item.name)
            options.id = item.name;
            document.getElementById("grocery_items").appendChild(options);
        }
        document.getElementById("number_items").addEventListener("input", validate);
        document.getElementById("grocery_items").addEventListener("input", validate);
        document.getElementById("submit_btn").addEventListener("click", submitItem);
    }
}

function submitNewFridge() {
    let URL = "http://localhost:8000/fridges";
    let fridgeName = document.getElementById("fridgeName")
    let numItemsAccepted = document.getElementById("numItemsAccepted")
    let acceptedTypes = document.getElementById("acceptedTypes")
    let contactPerson = document.getElementById("contactPerson")
    let contactPhone = document.getElementById("contactPhone")
    let streetName = document.getElementById("streetName")
    let postalCode = document.getElementById("postalCode")
    let city = document.getElementById("city")
    let province = document.getElementById("province")


    document.getElementById("respArea").className = "";
    let address = { street: streetName.value, postal_code: postalCode.value, city: city.value, province: province.value }
    let accepted = acceptedTypes.className.split(",")
    let data = {
        name: fridgeName.value,
        can_accept_items: numItemsAccepted.value,
        accepted_types: accepted,
        contact_person: contactPerson.value,
        contact_phone: contactPhone.value,
        address: address
    };

    sendNewFridge(URL, data);

}

function submitNewItems() {
    let type = document.getElementById("item_type").value;
    let name = document.getElementById("item_name").value;
    let image = document.getElementById("item_image").value;
    let data = "?=&name=" + name;
    data += "&type=" + type;
    data += "&img=" + image;
    let URL = "http://localhost:8000/add_item.html";
    document.getElementById("respArea").innerHTML = name + " has been successfully added to the items list"
    document.getElementById("respArea").className = "";
    sendData(URL, data);
}

function validateNewItems() {
    if (document.getElementById("item_name").value != "" && document.getElementById("item_type").value != "" && document.getElementById("item_image").value != "") {
        document.getElementById("submit_btn").disabled = false;

    } else {
        document.getElementById("submit_btn").disabled = true;
    }
}

function submitItem() {
    document.getElementById("view_results").innerHTML = "";
    document.getElementById("view_results").className = "";
    let head = document.createElement("h2")
    head.innerHTML = "Available fridges"
    document.getElementById("view_results").appendChild(head);
    let item_name;
    let amount = document.getElementById("number_items").value;
    let itemsubmitted = document.getElementById("grocery_items").value;
    let itemtype;
    for (let index = 0; index < fridges.length; index++) {
        const element = fridges[index];
        for (let producetype in element.items) {
            let tocheck = element.items[producetype].name;
            if (tocheck == itemsubmitted) {
                item_name = producetype;
                itemtype = element.items[producetype].type;
            }
        }
        break;
    }
    let smallest_of_item;
    let capacity_of_smallest_of_item;
    let name_of_highlighted_fridge;
    for (let index = 0; index < fridges.length; index++) {
        const fridge = fridges[index];

        if (fridge.capacity < 100 && fridge.can_accept_items > amount) {
            for (let acceptable in fridge.accepted_types) {
                if (itemtype == fridge.accepted_types[acceptable]) {
                    let qualifiedfridge = document.createElement("div");
                    console.log(fridge.items[item_name].quantity);
                    if (smallest_of_item == undefined) {
                        smallest_of_item = fridge.items[item_name].quantity
                        capacity_of_smallest_of_item = fridge.capacity;
                        name_of_highlighted_fridge = fridge.name;

                    } else {
                        if (fridge.items[item_name].quantity < smallest_of_item) {
                            smallest_of_item = fridge.items[item_name].quantity
                            capacity_of_smallest_of_item = fridge.capacity;
                            name_of_highlighted_fridge = fridge.name;

                        } else if (fridge.items[item_name].quantity == smallest_of_item && fridge.capacity < capacity_of_smallest_of_item) {
                            capacity_of_smallest_of_item = fridge.capacity;
                            name_of_highlighted_fridge = fridge.name;
                        }
                    }
                    let fridgeimg = document.createElement("img");
                    fridgeimg.src = "images/fridge.svg";
                    let name = document.createElement("span");
                    name.innerHTML = fridge.name;
                    let address = document.createElement("span");
                    address.innerHTML = fridge.address.street;
                    let phone = document.createElement("span");
                    phone.innerHTML = fridge.contact_phone;
                    let capacity = document.createElement("span");
                    capacity.innerHTML = "Capacity: " + fridge.capacity + "%";
                    let spaceleft = document.createElement("span");
                    spaceleft.innerHTML = "Can accept # of items: " + fridge.can_accept_items;

                    qualifiedfridge.appendChild(fridgeimg)
                    qualifiedfridge.appendChild(name)
                    qualifiedfridge.appendChild(address)
                    qualifiedfridge.appendChild(phone)
                    qualifiedfridge.appendChild(capacity)
                    qualifiedfridge.appendChild(spaceleft)
                    qualifiedfridge.addEventListener("click", chosenFridge);
                    qualifiedfridge.id = name.innerHTML;
                    document.getElementById("view_results").appendChild(qualifiedfridge)
                }
            }
        }
    }
    const element = document.getElementById("view_results");
    let inner_fridges = element.querySelectorAll("div");
    let number_of_fridges = inner_fridges.length;
    for (let index = 0; index < number_of_fridges; index++) {
        let fridge = inner_fridges[index];
        if (fridge.children[1].innerHTML == name_of_highlighted_fridge) {
            fridge.className = "recommended"
            break;
        }
    }
}

function sendData(URL, data) {
    xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
    xhttp.onreadystatechange = processData; // specify what should happen when the server sends a response
    xhttp.open("POST", URL, true); // open a connection to the server using the GET prot

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(data); // send the request to the server
}

function sendNewFridge(URL, data) {
    xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            document.getElementById("respArea").innerHTML = " The fridge has been successfully added"
        } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 400) {
            document.getElementById("respArea").innerHTML = xhttp.responseText;
        } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 500) {
            document.getElementById("respArea").innerHTML = xhttp.responseText;
        }
    };
    // specify what should happen when the server sends a response
    xhttp.open("POST", URL, true); // open a connection to the server using the GET prot

    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data)); // send the request to the server
}

function updateFridge() {
    let fridgeID = this.className;

    let URL = "http://localhost:8000/fridges/" + fridgeID;
    let fridgeName = document.getElementById("fridgeName")
    let numItemsAccepted = document.getElementById("numItemsAccepted")
    let acceptedTypes = document.getElementById("acceptedTypes")
    let contactPerson = document.getElementById("contactPerson")
    let contactPhone = document.getElementById("contactPhone")
    let streetName = document.getElementById("streetName")
    let postalCode = document.getElementById("postalCode")
    let city = document.getElementById("city")
    let province = document.getElementById("province")


    document.getElementById("respArea").className = "";
    let address = { street: streetName.value, postal_code: postalCode.value, city: city.value, province: province.value }
    let accepted = acceptedTypes.className.split(",")
    let data = {
        name: fridgeName.value,
        can_accept_items: numItemsAccepted.value,
        accepted_types: accepted,
        contact_person: contactPerson.value,
        contact_phone: contactPhone.value,
        address: address
    };
    xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            document.getElementById("respArea").innerHTML = " The fridge has been successfully updated"
        } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 400) {
            document.getElementById("respArea").innerHTML = xhttp.responseText;
        } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 500) {
            document.getElementById("respArea").innerHTML = xhttp.responseText;
        }
    };
    // specify what should happen when the server sends a response
    xhttp.open("PUT", URL, true); // open a connection to the server using the GET prot

    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data)); // send the request to the server

}

function chosenFridge() {
    let amount = document.getElementById("number_items").value;
    let item = document.getElementById("grocery_items").value;
    let fridge_name = this.id;
    let data = "?=&name=" + fridge_name;
    data += "&amount=" + amount;
    data += "&item=" + item;
    let URL = "http://localhost:8000/drop.html";
    document.getElementById("respArea").innerHTML = "The item has been successfully added to the fridge"
    document.getElementById("respArea").className = "";
    sendData(URL, data);
}

function displayFridges(pageId, fridges) {

    let fridgesSection = document.getElementById("fridges");
    let header = document.createElement("h1");
    let btndiv = document.createElement("p");

    header.textContent = "Available fridges";
    fridgesSection.appendChild(header);
    let addBtn = document.createElement("a")
    addBtn.innerHTML = "Add a fridge"
    addBtn.id = "addBtn"
    addBtn.href = "http://localhost:8000/fridges/addFridge"

    btndiv.style.marginTop = "50px"
    btndiv.appendChild(addBtn)

    for (let i = 0; i < fridges.length; i++) {
        let editlink = document.createElement("a");
        editlink.href = "http://localhost:8000/fridges/editFridge" + "?fridgeID=" + fridges[i].id;
        let fridgeData = document.createElement("div");
        fridgeData.id = "fridge_" + i;

        editlink.innerHTML = "Edit " + fridges[i].name
        editlink.className = "editBtn"
        editlink.id = i;

        // editlink.addEventListener("click", fillInfoForEdit(i))
        let fridgeContent = "<img src='images/fridge.svg'></span>";
        fridgeContent += "<span><strong>" + fridges[i].name + "</strong></span>";
        fridgeContent += "<span>" + fridges[i].address.street + "</span>";
        fridgeContent += "<span>" + fridges[i].contact_phone + "</span>"

        fridgeData.innerHTML = fridgeContent;
        fridgeData.addEventListener("click", function(event) {
            let fridgeID = event.currentTarget.id.split("_")[1];
            displayFridgeContents(parseInt(fridgeID), fridges);
        });


        fridgesSection.appendChild(fridgeData);
        fridgesSection.appendChild(editlink)
    }
    fridgesSection.appendChild(btndiv)


}

function removeItems(event) {
    let ids = "?item"
    let queryformat = "&item"
    let fridgeID = event.target.className

    let rightdisplay = document.getElementById("items_picked")
    let list = rightdisplay.querySelectorAll("li")
    for (let i = 0; i < list.length; i++) {
        let formatid = list[i].id.split("pk-item-")
        if (i == 0) {
            ids += i + "=" + formatid[1]
        } else {
            let q = queryformat + i + "=" + formatid[1]
            ids += q
        }
    }
    console.log(ids)

    let URL = "http://localhost:8000/fridges/" + fridgeID + "/items/" + ids

    xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            document.getElementById("respArea").innerHTML = " The item was successfully picked up"
            document.getElementById("respArea").className = "";
            document.getElementById("respArea").style.marginBottom = "20px"
        } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 400) {
            document.getElementById("respArea").innerHTML = xhttp.responseText;
        } else if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 500) {
            document.getElementById("respArea").innerHTML = xhttp.responseText;
        }
    };
    // specify what should happen when the server sends a response
    xhttp.open("DELETE", URL, true); // open a connection to the server using the DELETE prot
    xhttp.send(); // send the request to the server


}

function displayFridgeContents(fridgeID, fridges) {
    let pickBtn = document.getElementById("pickupBtn")
    pickBtn.className = fridges[fridgeID].id
    pickBtn.addEventListener("click", removeItems)
    document.getElementById("frigeHeading").innerHTML = "Items in the " + fridges[fridgeID].name;
    let bioInformation = "<span id='fridge_name'>" + fridges[fridgeID].name + "</span><br />" + fridges[fridgeID].address.street + "<br />" + fridges[fridgeID].contact_phone;

    document.getElementById("left-column").firstElementChild.innerHTML = bioInformation;
    let capacity = ((fridges[fridgeID].items.length) / (parseInt(fridges[fridgeID].can_accept_items)));
    capacity = Math.round(capacity * 100);

    document.getElementById("meter").innerHTML = "<span style='width: " + (capacity + 14.2) + "%'>" + capacity + "%</span>";
    var items;
    xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            let data = xhttp.responseText; // Data returned by the AJAX request
            items = JSON.parse(data); // Convert the JSON data to a JavaScript object
            console.log(items); // 
            populateLeftMenu(fridgeID, fridges);

            let middleColumn = document.getElementById("middle-column");
            console.log(fridgeID);

            for (let element of fridges[fridgeID].items) {
                let itemID = parseInt(element.id);
                let item = items[itemID];

                let mdItem = document.createElement("div");
                mdItem.className = "item " + item.type;
                mdItem.id = "item-" + itemID;
                mdItem.innerHTML = "<img src='" + item.img + "' width='100px' height='100px'; />";

                let itemDetails = document.createElement("div");
                itemDetails.id = "item_details";
                itemDetails.innerHTML = "<p id='nm-" + itemID + "'>" + item.name + "</p><p>Quantity: <span id='qt-" + itemID + "'>" + element.quantity + "</span></p><p>Pickup item:</p>";

                let buttonsArea = document.createElement("div");
                buttonsArea.className = "pick_button";
                buttonsArea.id = "pickbtn-" + itemID;

                let increaseButton = document.createElement("button");
                increaseButton.className = "button-plus";
                increaseButton.innerHTML = "<i class='fas fa-plus'></i>";
                increaseButton.addEventListener("click", processIncrease);

                let decreaseButton = document.createElement("button");
                decreaseButton.className = "button-minus";
                decreaseButton.innerHTML = "<i class='fas fa-minus'></i>";
                decreaseButton.addEventListener("click", processDecrease);

                let amount = document.createElement("span");
                amount.className = "amount";
                amount.id = "amount-" + itemID;
                amount.textContent = "0";

                buttonsArea.appendChild(increaseButton);
                buttonsArea.appendChild(amount);
                buttonsArea.appendChild(decreaseButton);

                itemDetails.appendChild(buttonsArea);
                mdItem.appendChild(itemDetails);
                middleColumn.appendChild(mdItem);
            }
            document.getElementById("fridges").classList.add("hidden");
            document.getElementById("fridge_details").classList.remove("hidden");
        }
    }; // specify what should happen when the server sends a response
    xhttp.open("GET", "http://localhost:8000/fridges/items", true); // open a connection to the server using the GET protocol

    // TODO: add an application/json Accept request header for the request
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send(); // send the request to the server


}

function processIncrease(event) {
    let elementId = event.currentTarget.parentElement.id;
    let numID = elementId.split("-")[1];
    let amount = parseInt(document.getElementById("amount-" + numID).textContent);
    let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
    let name = document.getElementById("nm-" + numID).textContent;

    let elementExists = document.getElementById("pk-item-" + numID);

    if (amount < quantity) {
        document.getElementById("amount-" + numID).innerHTML = amount + 1;

        if (elementExists == null) {
            let li = document.createElement("li");
            li.setAttribute("id", "pk-item-" + numID);
            li.innerHTML = "<span>" + (amount + 1) + "</span> x " + name;
            document.getElementById("items_picked").appendChild(li);
        } else {
            document.getElementById("pk-item-" + numID).innerHTML = "<span>" + (amount + 1) + "</span> x " + name;
        }
    }
    let rightdisplay = document.getElementById("items_picked")
    let list = rightdisplay.querySelectorAll("li")
    let pickBtn = document.getElementById("pickupBtn")
    if (list.length == 0) {
        pickBtn.style.visibility = "hidden"
    } else {
        pickBtn.style.visibility = "visible"
    }

}

function processDecrease(event) {
    let elementId = event.currentTarget.parentElement.id;
    let numID = elementId.split("-")[1];

    let amount = parseInt(document.getElementById("amount-" + numID).textContent);
    let quantity = parseInt(document.getElementById("qt-" + numID).textContent);
    let elementExists = document.getElementById("pk-item-" + numID);
    let name = document.getElementById("nm-" + numID).textContent;

    if (amount > 0) {
        document.getElementById("amount-" + numID).innerHTML = parseInt(amount) - 1;
        if (elementExists == null) {
            let li = document.createElement("li");
            li.setAttribute("id", "pk-item-" + numID);
            li.innerHTML = "<span>" + parseInt(amount) - 1 + "</span> x " + name;
            document.getElementById("items_picked").appendChild(li);
        } else {
            if (amount == 1) {
                let item = document.getElementById("pk-item-" + numID);
                console.log("item-" + numID)
                item.remove();
            } else {
                document.getElementById("pk-item-" + numID).innerHTML = "<span>" + (amount - 1) + "</span> x " + name;
            }
        }
    }
    let rightdisplay = document.getElementById("items_picked")
    let list = rightdisplay.querySelectorAll("li")
    let pickBtn = document.getElementById("pickupBtn")
    if (list.length == 0) {
        pickBtn.style.visibility = "hidden"
    } else {

        pickBtn.style.visibility = "visible"
    }
}


function populateLeftMenu(fridgeID, fridges) {
    let categories = {};

    for (const [key, value] of Object.entries(fridges[fridgeID].items)) {
        let type = value.type;
        if (type in categories == false) {
            categories[type] = 1;
        } else {
            categories[type]++;
        }
    }

    let leftMenu = document.getElementById("categories");
    for (const [key, value] of Object.entries(categories)) {
        let label = key.charAt(0).toUpperCase() + key.slice(1);
        let listItem = document.createElement("li");
        listItem.id = key;
        listItem.className = "category";
        listItem.textContent = label + " (" + value + ")";

        listItem.addEventListener("click", filterMiddleView);
        leftMenu.appendChild(listItem);
    }
}

function filterMiddleView(event) {
    let elements = document.getElementById("middle-column").children;
    let category = event.target.id;

    for (let i = 0; i < elements.length; i++) {
        let item = elements[i];
        if (!item.classList.contains(category)) {
            item.classList.add("hidden");
        } else {
            item.classList.remove("hidden");
        }
    }
}