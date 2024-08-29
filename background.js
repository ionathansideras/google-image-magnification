// Listen for updates to any tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the tab has finished loading
    if (changeInfo.status === "complete") {
        // Send a message to the content script in the updated tab with the tab's URL
        chrome.tabs.sendMessage(tab.id, { url: tab.url });
    }
});
