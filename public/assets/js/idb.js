// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt'
const request = indexedDB.open('pizza_hunt', 1);

// emit if the database verision changes
request.onupgradeneeded = function(event) {
    // save a reference to the database
    const db = event.target.result;
    // create object store
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function(event) {
    // save reference to variable
    db = event.target.result;

    // if online run uploadPizza()
    if (navigator.online) {
        uploadPizza();
    }
};

// on error
request.onerror = function(event) {
    // log error
    console.log(event.target.errorCode);
};

// execute if we attempt to submit a new pizza offline
function saveRecord(record) {
    // open a new transaction with read and write permissions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access the object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // add record to store
    pizzaObjectStore.add(record);
};

function uploadPizza() {
    // open a transaction
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    // access object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');

    // get all records from store and set to a variable 
    const getAll = pizzaObjectStore.getAll();

    // upon successful getAll
    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_pizza'], 'readwrite');

                const pizzaObjectStore = transaction.objectStore('new_pizza');
                pizzaObjectStore.clear();

                alert('All saved pizza has been submitted');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
};

// listen for app coming back online
window.addEventListener('online', uploadPizza);