(function () {
    "use strict";

    const POPUP_URL = "popup/taranaka.html";
    const APK_URL = "https://www.madarom.net/download/Taranaka.apk";
    const DANCE_DURATION = 1500;
    const MAX_ATTEMPTS = 3;
    const REQUIRED_IDS = [
        "taranakaPopup",
        "taranakaClose",
        "taranakaDownload",
        "taranakaDownloadIcon",
        "taranakaOpen"
    ];
    document.addEventListener("DOMContentLoaded", async function () {
        const container = document.getElementById("popup-container");
        if (!container) {
            console.error("Taranaka : conteneur #popup-container introuvable.");
            return;
        }
        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                container.innerHTML = await loadFragment(attempt === 1 ? "no-cache" : "reload");
            } catch (error) {
                console.error("Taranaka : erreur lors du chargement du popup :", error);
                continue;
            }
            if (isComplete()) {break;}
            console.warn("Taranaka : fragment incomplet (tentative " + attempt + ").");
        }
        initTaranaka(container.dataset.taranakaAutoopen !== "false");
    });
    async function loadFragment(cacheMode) {
        const response = await fetch(POPUP_URL, { cache: cacheMode });

        if (!response.ok) {
            throw new Error("Impossible de charger " + POPUP_URL + " (HTTP " + response.status + ")");
        }
        return response.text();
    }
    function isComplete() {
        return REQUIRED_IDS.every(function (id) {
            return document.getElementById(id) !== null;
        });
    }
    function placeOpenButtonInNav(openBtn) {
        // Menu français (contact.html) ou anglais (contact-en.html)
        const contactLink = document.querySelector('.nav a[href="contact.html"], .nav a[href="contact-en.html"]');
        const contactItem = contactLink ? contactLink.closest("li") : null;

        if (!openBtn || !contactItem) {
            return false;
        }

        const item = document.createElement("li");
        item.className = "taranaka-nav-item";
        item.appendChild(openBtn);
        contactItem.after(item);

        openBtn.classList.add("taranaka-reopen--nav");
        openBtn.hidden = false;

        return true;
    }

    function initTaranaka(autoOpen) {
        const popup = document.getElementById("taranakaPopup");
        const closeBtn = document.getElementById("taranakaClose");
        const openBtn = document.getElementById("taranakaOpen");
        const downloadBtn = document.getElementById("taranakaDownload");
        const downloadIcon = document.getElementById("taranakaDownloadIcon");

        if (!popup) {
            console.error("Taranaka : popup introuvable dans le fragment chargé.");
            return;
        }
        const dialog = popup.querySelector(".taranaka-dialog");
        const inNav = placeOpenButtonInNav(openBtn);
        const openButtons = openBtn ? [openBtn] : [];

        if (inNav) {
            const floatBtn = openBtn.cloneNode(true);
            floatBtn.removeAttribute("id");
            floatBtn.classList.remove("taranaka-reopen--nav");
            floatBtn.classList.add("taranaka-reopen--float");
            floatBtn.hidden = false;
            document.body.appendChild(floatBtn);
            openButtons.push(floatBtn);
        }
        const header = document.querySelector(".header");

        function isOnScreen(rect) {
            return rect.width > 0 && rect.left >= 0 && rect.right <= window.innerWidth + 1;
        }

        function positionPopup() {
            if (popup.hidden) {
                return;
            }
          if (smallScreen.matches) {
                centerPopup();
                return;
            }

            const btnRect = inNav ? openBtn.getBoundingClientRect() : null;

            if (btnRect && isOnScreen(btnRect)) {
                popup.dataset.anchor = "button";
                popup.style.setProperty("--taranaka-anchor-top", btnRect.bottom + "px");
                popup.style.setProperty("--taranaka-anchor-right", (window.innerWidth - btnRect.right) + "px");
            } else if (header) {
                popup.dataset.anchor = "header";
                popup.style.setProperty("--taranaka-anchor-top", header.getBoundingClientRect().bottom + "px");
            } else {
                popup.classList.remove("taranaka-overlay--anchored");
                return;
            }
            popup.classList.add("taranaka-overlay--anchored");
            applyShift();
        }
        const SHIFT_PX = 3 * 96 / 2.54;
        const smallScreen = window.matchMedia("(max-width: 768px)");
        smallScreen.addEventListener("change", schedulePosition);
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", schedulePosition);
        }

        function centerPopup() {
            const MARGIN = 8;
            const pad = parseFloat(getComputedStyle(dialog.firstElementChild).paddingBottom) || 0;
            const zoneTop = (header ? Math.max(0, header.getBoundingClientRect().bottom) : 0) + MARGIN;
            const floatBtn = document.querySelector(".taranaka-reopen--float");
            const floatRect = floatBtn ? floatBtn.getBoundingClientRect() : null;
            const viewHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            const zoneBottom = Math.min(viewHeight, floatRect && floatRect.height > 0 ? floatRect.top : viewHeight);
            const zoneHeight = zoneBottom - MARGIN - zoneTop;
            const cardHeight = dialog.offsetHeight - 2 * pad;
            const RAISE = 96 / 2.54; // 1 cm
            const fit = Math.max(0.1, Math.min(1, (zoneHeight - RAISE) / cardHeight));
            const centeredTop = zoneTop + Math.max(0, (zoneHeight - cardHeight * fit) / 2);
            const cardTop = Math.max(zoneTop, centeredTop - RAISE);

            popup.dataset.anchor = "center";
            popup.classList.add("taranaka-overlay--anchored");
            popup.style.setProperty("--taranaka-shift", "0px");
            popup.style.setProperty("--taranaka-fit", fit);
            popup.style.setProperty("--taranaka-center-top", (cardTop - pad) + "px");
        }

        function applyShift() {
            if (!dialog) {
                return;
            }
            const pad = parseFloat(getComputedStyle(dialog.firstElementChild).paddingRight) || 0;
            const freeRight = window.innerWidth - (dialog.offsetLeft + dialog.offsetWidth) + pad;
            const shift = Math.max(0, Math.min(SHIFT_PX, freeRight));
            popup.style.setProperty("--taranaka-shift", shift + "px");
            fitToScreen();
        }
        function fitToScreen() {
            const pad = parseFloat(getComputedStyle(dialog.firstElementChild).paddingBottom) || 0;
            const MARGIN = 8; // px laissés sous le popup
            const cardTop = dialog.offsetTop + pad;
            const cardHeight = dialog.offsetHeight - 2 * pad;
            const fit = Math.min(1, (window.innerHeight - MARGIN - cardTop) / cardHeight);
            popup.style.setProperty("--taranaka-fit", fit > 0 ? fit : 1);
        }
        let positionFrame = 0;
        function schedulePosition() {
            cancelAnimationFrame(positionFrame);
            positionFrame = requestAnimationFrame(positionPopup);
        }
        window.addEventListener("resize", schedulePosition);
        window.addEventListener("scroll", schedulePosition, { passive: true });
        if (header) {
            header.addEventListener("transitionend", schedulePosition);
        }
        if ("ResizeObserver" in window) {
            const observer = new ResizeObserver(schedulePosition);
            if (header) {
                observer.observe(header);
            }
            if (inNav) {
                observer.observe(openBtn);
            }
        }
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(schedulePosition);
        }
        const backdrop = document.getElementById("taranakaBackdrop");
        function loadImages() {
            popup.querySelectorAll("img[data-src]").forEach(function (img) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
            });
        }

        function showPopup(visible) {
            if (visible) {loadImages();}
            popup.hidden = !visible;
            if (backdrop) {backdrop.hidden = !visible;}
            positionPopup();
            if (openBtn && !inNav) {openBtn.hidden = visible;}
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                showPopup(false);
            });
        }
        openButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                showPopup(true);
            });
        });
        let danceTimer = null;
        function setClicked(clicked) {
            if (!downloadIcon) {
                return;
            }
            downloadIcon.classList.toggle("dance", clicked);
            downloadIcon.classList.toggle("jump", !clicked);
        }
        downloadBtn?.addEventListener("click", function () {
            setClicked(true);
            const link = document.createElement("a");
            link.href = APK_URL;
            link.download = "Taranaka.apk";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            clearTimeout(danceTimer);
            danceTimer = setTimeout(function () {
                setClicked(false);
            }, DANCE_DURATION);
        });
        showPopup(autoOpen);
    }
})();
