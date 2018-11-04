// future improvement: 1. after submiting the the base and target, close the popup html
// 2.sync the selcted option the storage
let submit = document.querySelector("input");
let base = document.querySelector("#base");
let target = document.querySelector("#target");

submit.onclick = (event) => {
  event.preventDefault();
  chrome.storage.sync.set({base: base.value, target: target.value}, function() {
    console.log("storage reset:" + base.value + " " + target.value);
  });
}