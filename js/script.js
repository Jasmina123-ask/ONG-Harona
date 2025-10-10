document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
});

document.addEventListener("DOMContentLoaded", () => { 
    const form = document.getElementById("contactForm"); 
    const confirmation = document.getElementById("confirmationMessage"); 
    
    form.addEventListener("submit", (e) => { 
        e.preventDefault(); // Empêche le rechargement 
        confirmation.style.display = "block"; 
        form.reset(); // Vide les champs 
        }); 
    });


    service_dgdf2cq
