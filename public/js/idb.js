let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function (event) {};
request.onsucess = function (event) {};
request.onerror = function (event) {};

function saveRecord(record) {}
function uploadBalance() {}

window.addEventListener('online', uploadBalance);