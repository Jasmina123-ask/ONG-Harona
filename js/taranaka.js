(function () {
    "use strict";
    const POPUP_HTML = `
<div id="taranakaBackdrop" class="taranaka-backdrop" aria-hidden="true" hidden></div>
<!---->
<div id="taranakaPopup" class="taranaka-overlay" hidden role="dialog" aria-modal="true" aria-labelledby="taranakaTitle">
    <div class="taranaka-dialog">
        <div class="taranaka">
            <article class="taranaka-card taranaka-slide-down">
                <header class="taranaka-header">
                    <div class="taranaka-header-brand">
                        <div class="taranaka-logo-wrap">
                            <img data-src="asset/image/taranaka/logo_madarom.png" alt="Logo Madarom" class="taranaka-logo">
                            <span class="taranaka-logo-text">Harona NGO</span>
                        </div>
                        <span class="taranaka-presents">presents</span>
                    </div>

                    <button type="button" id="taranakaClose" class="taranaka-close" aria-label="Fermer">
                        <span class="taranaka-icon taranaka-icon--x" aria-hidden="true"></span>
                    </button>
                </header>
                <img data-src="asset/image/taranaka/deco.jpeg" alt="Mère et enfant" class="taranaka-deco">
                <div class="taranaka-brand">
                    <img data-src="asset/image/taranaka/person.png" alt="Icône mère et enfant" class="taranaka-brand-img">
                    <img data-src="asset/image/taranaka/word.png" alt="Taranaka" class="taranaka-brand-img taranaka-word">
                </div>
                <div class="taranaka-text">
                    <h2 id="taranakaTitle" class="taranaka-title">Empowering Women, Nurturing Healthier Generations</h2>
                    <p class="taranaka-subtitle">A digital health initiative by Mad'arom</p>
                </div>
                <ul class="taranaka-features">
                    <li class="taranaka-feature">
                        <div class="taranaka-feature-icon">
                            <span class="taranaka-icon taranaka-icon--droplet" aria-hidden="true"></span>
                        </div>
                        <span class="taranaka-feature-label">Menstrual health</span>
                    </li>

                    <li class="taranaka-feature">
                        <div class="taranaka-feature-icon">
                            <span class="taranaka-icon taranaka-icon--pregnant" aria-hidden="true"></span>
                        </div>
                        <span class="taranaka-feature-label">Pregnancy</span>
                    </li>

                    <li class="taranaka-feature">
                        <div class="taranaka-feature-icon">
                            <span class="taranaka-icon taranaka-icon--baby" aria-hidden="true"></span>
                        </div>
                        <span class="taranaka-feature-label">Child health</span>
                    </li>

                    <li class="taranaka-feature">
                        <div class="taranaka-feature-icon">
                            <span class="taranaka-icon taranaka-icon--bowl-food" aria-hidden="true"></span>
                        </div>
                        <span class="taranaka-feature-label">Nutrition</span>
                    </li>
                </ul>
                <div class="taranaka-actions">
                    <div class="taranaka-action-card taranaka-action-card--mobile">
                        <span class="taranaka-icon taranaka-icon--mobile taranaka-action-icon" aria-hidden="true"></span>
                        <p class="taranaka-action-title">Taranaka mobile App</p>
                        <p>for girls, mothers &amp; families</p>
                        <button type="button" id="taranakaDownload" class="taranaka-action-btn"
                                title="Télécharger l'application (APK)" aria-label="Télécharger l'application (APK)">
                            <span>Download App</span>
                            <span id="taranakaDownloadIcon" class="taranaka-btn-icon jump">
                                <span class="taranaka-icon taranaka-icon--download" aria-hidden="true"></span>
                            </span>
                        </button>
                    </div>
                    <a href="https://taranaka-web-production.up.railway.app"
                       class="taranaka-action-card taranaka-action-card--web">
                        <span class="taranaka-icon taranaka-icon--laptop-medical taranaka-action-icon" aria-hidden="true"></span>
                        <p class="taranaka-action-title">Taranaka web platform</p>
                        <p>For CSB, CRENI &amp; health professionals</p>
                        <span class="taranaka-action-btn">
                            <span>Access Web</span>
                            <span class="taranaka-icon taranaka-icon--external-link" aria-hidden="true"></span>
                        </span>
                    </a>

                </div>
            </article>
        </div>
    </div>
</div>
<button type="button" id="taranakaOpen" class="taranaka-reopen" hidden>
    <span>Discover Taranaka</span>
    <span class="taranaka-icon taranaka-icon--arrow-right" aria-hidden="true"></span>
</button>
`;
    const APK_URL = "https://www.madarom.net/download/Taranaka.apk";
    const DANCE_DURATION = 1500;
    const MAX_ATTEMPTS = 3;
    const SEEN_KEY = "taranaka_popup_seen";
    function hasSeenPopup() {
        try {
            return localStorage.getItem(SEEN_KEY) === "true";
        } catch (error) {
            return false;
        }
    }
    function markPopupSeen() {
        try {
            localStorage.setItem(SEEN_KEY, "true");
        } catch (error) {
            /* stockage indisponible : rien à faire */
        }
    }
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
        initTaranaka(container.dataset.taranakaAutoopen !== "false" && !hasSeenPopup());
    });
    async function loadFragment() {
        return POPUP_HTML;
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
            const LIFT = 0.5 * 96 / 2.54; // 0.5 cm
            const cardTop = Math.max(zoneTop, centeredTop - RAISE) - LIFT;

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
                markPopupSeen();
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
