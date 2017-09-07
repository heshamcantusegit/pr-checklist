function onClick() {
  console.log('Made it');
  chrome.tabs.getCurrent(function (tab) {
    console.log(tab);
  });
}

console.log('Lyes');
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  console.log('michael mao is gay');  
  if (message.popupOpen) { 
    console.log('michael mao is gay');
   }
});
