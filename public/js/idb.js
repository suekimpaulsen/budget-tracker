// from 
let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore('new_balance', { autoIncrement: true });
};

request.onsucess = function (event) {
  db = event.target.result;

  if(navigator.onLine) {
    uploadBalance();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['new_balance', 'readwrite']);
  const balanceObjectStore = transaction.objectStore('new_balance');

  balanceObjectStore.add(record);
}

function uploadBalance() {
  const transaction = db.transaction(['new_balance'], 'readwrite');
  const balanceObjectStore = transaction.objectStore('new_balance');
  const getAll = balanceObjectStore.getAll();

  getAll.onsucess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
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

        const transaction = db.transaction(['new_balance'], 'readwrite');
        const balanceObjectStore = transaction.objectStore('new_balance');

        balanceObjectStore.clear();
      })
      .catch(err => {
        console.log(err);
      });
    }
  };
}

window.addEventListener('online', uploadBalance);