document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Correction de l'ID du formulaire pour correspondre au HTML
    const form = document.getElementById("contact-form");
    // Correction de l'ID du message de réponse pour correspondre au HTML
    const responseMessage = document.getElementById("response-message");

    // 1. DÉTECTION DE LA LANGUE
    // Vérifie si l'URL contient '-en.html' pour déterminer la langue.
    const isEnglish = window.location.pathname.includes('-en.html');

    // Messages de confirmation bilingues
    const successMessage = isEnglish
        ? "✅ Your message has been sent successfully! We will get back to you soon."
        : "✅ Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.";

    const failureMessagePrefix = isEnglish
        ? "❌ Message sending failed. Please try again or contact us directly: "
        : "❌ L'envoi du message a échoué. Veuillez réessayer ou nous contacter directement : ";

    // Vérifie que le formulaire existe avant d'ajouter l'écouteur d'événement
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault(); // Empêche l'envoi HTML standard du formulaire

            // Récupère l'ID du service et du template depuis EmailJS
            const serviceID = "service_dgdf2cq";
            const templateID = "template_jgo2mor"; 
            
            // Initialisation du message de réponse (facultatif mais donne un feedback)
            responseMessage.textContent = isEnglish ? "Sending message..." : "Envoi du message...";
            responseMessage.style.color = "blue";


            // Envoi du formulaire via EmailJS
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    // Succès de l'envoi
                    responseMessage.textContent = successMessage;
                    responseMessage.style.color = "green";
                    form.reset(); // Vide les champs du formulaire
                }, (err) => {
                    // Échec de l'envoi
                    responseMessage.textContent = failureMessagePrefix + JSON.stringify(err);
                    responseMessage.style.color = "red";
                });
        });
    }
});

   
