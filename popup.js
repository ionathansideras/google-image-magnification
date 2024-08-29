document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("checkbox-is-active");

    // Load the saved state from chrome.storage
    chrome.storage.sync.get(["isActive"], (result) => {
        checkbox.checked = result.isActive || false;
    });

    // Save the state when the checkbox is clicked
    checkbox.addEventListener("change", () => {
        chrome.storage.sync.set({ isActive: checkbox.checked });
    });
});
