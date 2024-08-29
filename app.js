(() => {
    // Flag to check if we are on the Google search page
    let areWeOnGoogleSearchPage = false;

    // Load the saved state from chrome.storage to check if the extension is active
    chrome.storage.sync.get(["isActive"], (result) => {
        if (!result.isActive) {
            return; // Exit if the extension is not active
        }

        // Listen for messages from the background script
        chrome.runtime.onMessage.addListener(
            (message, sender, sendResponse) => {
                // Check if the URL is a Google search page and we haven't already set up the listener
                if (
                    message.url &&
                    message.url.includes("google.com/search") &&
                    !areWeOnGoogleSearchPage
                ) {
                    areWeOnGoogleSearchPage = true;

                    // Add a click event listener to the document body
                    document.body.addEventListener("click", (e) => {
                        // Check if the clicked element is an image with the specific class and id pattern
                        if (
                            e.target.id.includes("dimg_") &&
                            e.target.className === "YQ4gaf"
                        ) {
                            handleShowImage();
                        }
                    });
                }
            }
        );
    });
})();

// Styles for the new image element
const imageStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0)",
    maxWidth: "80%",
    maxHeight: "80%",
    objectFit: "contain",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    border: "2px solid white",
    borderRadius: "8px",
    zIndex: "9999",
    transition: "transform 0.3s ease",
};

// Styles for the cover element
const coverStyles = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: "9998",
    opacity: "0",
    transition: "opacity 0.3s ease",
};

// Styles for the loading skeleton
const loadingStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    fontSize: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "50px 100px",
    borderRadius: "5px",
    zIndex: "9999",
};

function handleShowImage() {
    const checkInterval = 100; // Interval in milliseconds to check for the element
    const maxAttempts = 50; // Maximum number of attempts before giving up

    let attempts = 0;

    // Create and display the loading skeleton
    const loadingSkeleton = createLoadingSkeleton();

    const intervalId = setInterval(() => {
        const imgElement = document.querySelector(".sFlh5c.FyHeAf.iPVvYb");

        if (imgElement) {
            clearInterval(intervalId);
            loadingSkeleton.remove();

            // Create and display the zoomed image and cover
            const { newImg, cover } = createImageAndCover(imgElement.src);
            document.body.appendChild(cover);
            document.body.appendChild(newImg);

            // Trigger the animations to show the image
            triggerAnimations(newImg, cover);
        } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            handleImageNotFound(loadingSkeleton);
        }

        attempts++;
    }, checkInterval);
}

// Helper function to create the loading skeleton element
function createLoadingSkeleton() {
    const loadingSkeleton = document.createElement("div");
    loadingSkeleton.textContent = "Loading...";
    Object.assign(loadingSkeleton.style, loadingStyles);
    document.body.appendChild(loadingSkeleton);
    return loadingSkeleton;
}

// Helper function to create the zoomed image and cover elements
function createImageAndCover(src) {
    const newImg = new Image();
    newImg.src = src;
    newImg.id = "zoomed-image";
    Object.assign(newImg.style, imageStyles);

    const cover = document.createElement("div");
    Object.assign(cover.style, coverStyles);
    cover.addEventListener("click", () => closeImageAndCover(newImg, cover));

    return { newImg, cover };
}

// Helper function to handle closing the image and cover
function closeImageAndCover(newImg, cover) {
    newImg.style.transform = "translate(-50%, -50%) scale(0)";
    cover.style.opacity = "0";
    setTimeout(() => {
        cover.remove();
        newImg.remove();
    }, 300); // Match the transition duration
}

// Helper function to trigger the animations for showing the image
function triggerAnimations(newImg, cover) {
    setTimeout(() => {
        newImg.style.transform = "translate(-50%, -50%) scale(1)";
        cover.style.opacity = "1";
    }, 10); // Small delay to ensure the styles are applied
}

// Helper function to handle the case when the image is not found
function handleImageNotFound(loadingSkeleton) {
    loadingSkeleton.textContent = "Image not found after maximum attempts";
    setTimeout(() => loadingSkeleton.remove(), 2000); // Remove skeleton after displaying the error
    console.error("Image element not found after maximum attempts");
}
