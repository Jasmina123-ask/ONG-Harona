document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('article-content-container');
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        container.innerHTML = '<h1>Erreur 404</h1><p>Article non spécifié.</p>';
        document.getElementById('article-page-title').textContent = 'Erreur';
        return;
    }

    const article = blogArticles.find(a => a.slug === slug);

    if (!article || !isArticlePublished(article)) {
        container.innerHTML = '<h1>Erreur 404</h1><p>L\'article que vous recherchez n\'existe pas ou n\'est pas encore publié.</p>';
        document.getElementById('article-page-title').textContent = 'Article non trouvé';
        return;
    }

    // --- Fonctions utilitaires ---
    
    // Vérification de la publication (copie de blog-renderer.js pour la sécurité)
    function isArticlePublished(article) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const articleDate = new Date(article.date);
        articleDate.setHours(0, 0, 0, 0);
        return articleDate <= today;
    }

    // Formatage de la date en FR
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Remplacement des sauts de ligne par des balises <p>
    const contentHtml = article.content.fr
        .split('\n')
        .filter(p => p.trim() !== '')
        .map(p => {
            // Gère les titres (par exemple, ###) ou un formatage de base
            if (p.trim().startsWith('###')) {
                return `<h3>${p.replace('###', '').trim()}</h3>`;
            }
            if (p.trim().startsWith('##')) {
                return `<h2>${p.replace('##', '').trim()}</h2>`;
            }
            if (p.trim().startsWith('1.') || p.trim().startsWith('2.') || p.trim().startsWith('3.')) {
                 // Pour les listes numérotées du blog 5
                 return `<p class="numbered-point"><strong>${p.trim()}</strong></p>`;
            }
            return `<p>${p.trim()}</p>`;
        })
        .join('');


    // --- Rendu final ---

    document.getElementById('article-page-title').textContent = article.title.fr;

    container.innerHTML = `
        <span class="article-metadata">
            ${formatDate(article.date)} | ${article.category}
        </span>
        <h1>${article.title.fr}</h1>
        <p class="article-summary">${article.summary.fr}</p>

        <img 
            src="${article.image}" 
            alt="${article.title.fr}" 
            class="article-cover-image" 
        />
        
        <div class="article-body">
            ${contentHtml}
        </div>
        
        <a href="blog-fr.html" class="back-link">← Retour aux actualités</a>
    `;
});