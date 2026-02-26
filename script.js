const announcementsContainer = document.getElementById("announcements");
const currentTimeDisplay = document.getElementById("currentTime");

async function loadAnnouncements() {
    try {
        const response = await fetch("announcements.json?t=" + new Date().getTime());
        const data = await response.json();
        displayAnnouncements(data);
    } catch (error) {
        announcementsContainer.innerHTML = "<p>Error loading announcements.</p>";
        console.error(error);
    }
}

function displayAnnouncements(announcements) {
    const now = new Date();
    announcementsContainer.innerHTML = "";

    const visibleAnnouncements = announcements.filter(item => {
        const releaseTime = new Date(item.timestamp);
        return now >= releaseTime;
    });

    if (visibleAnnouncements.length === 0) {
        announcementsContainer.innerHTML = "<p>No announcements yet. Stay tuned!</p>";
        return;
    }

    visibleAnnouncements
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .forEach(item => {
            const card = document.createElement("div");
            card.className = "announcement";

            card.innerHTML = `
                <h2>${item.title}</h2>
                <p>${item.content}</p>
                <small>Released: ${new Date(item.timestamp).toLocaleString()}</small>
            `;

            announcementsContainer.appendChild(card);
        });
}

function updateTime() {
    const now = new Date();
    currentTimeDisplay.textContent = "Current Time: " + now.toLocaleString();
}

function refresh() {
    updateTime();
    loadAnnouncements();
}

// Initial load
refresh();

setInterval(refresh, 1000);

async function checkEmergency() {
    try {
        const response = await fetch("emergency.json?t=" + Date.now());
        const data = await response.json();

        const banner = document.getElementById("emergencyBanner");

        // Get all active emergencies
        const activeEmergencies = data.filter(item => item.active === true);

        if (activeEmergencies.length > 0) {
            // Combine all active messages
            const combinedMessage = activeEmergencies
                .map(item => item.message)
                .join(" | ");

            banner.textContent = combinedMessage;
            banner.classList.remove("hidden");
        } else {
            banner.classList.add("hidden");
        }

    } catch (error) {
        console.error("Emergency check failed:", error);
    }
}

// Check every second
setInterval(checkEmergency, 1000);
checkEmergency();