document.addEventListener('DOMContentLoaded', () => {
    // Ciblage des ID spécifiques à la page française
    const container = document.getElementById('blog-articles-container-fr');
    const noArticlesMessage = document.getElementById('no-articles-message-fr');
    const lang = 'fr'; 

    if (typeof blogArticles === 'undefined') {
        console.error("Erreur : Le tableau 'blogArticles' n'est pas défini. Vérifiez le chargement de blog-data.js.");
        return;
    }

    // --- Fonctions utilitaires ---

    // Formatage de la date en FR
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Filtre pour n'afficher que les articles dont la date est passée ou égale à aujourd'hui
    const getPublishedArticles = (articles) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const published = articles.filter(article => {
            const articleDate = new Date(article.date);
            articleDate.setHours(0, 0, 0, 0);
            return articleDate <= today;
        });

        // Tri par date (du plus récent au plus ancien)
        return published.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const renderBlogCard = (article) => {
        const dateFormatted = formatDate(article.date);
        // Récupération du contenu en FR
        const title = article.title[lang] || article.title.fr;
        const summary = article.summary[lang] || article.summary.fr;
        
        // Lien vers la page de détail en Français (avec le paramètre lang=fr)
        const detailLink = `article-detail.html?slug=${article.slug}&lang=fr`;

        return `
            <div class="blog-card">
                <img src="${article.image}" alt="${title}" class="blog-image">
                <div class="card-content">
                    <span class="blog-metadata">${dateFormatted} | ${article.category.fr}</span>
                    <h3>${title}</h3>
                    <p>${summary}</p>
                    <a href="${detailLink}" class="read-more-link">
                        Lire la suite →
                    </a>
                </div>
            </div>
        `;
    };

    // --- Logique principale ---

    const publishedArticles = getPublishedArticles(blogArticles);

    if (publishedArticles.length > 0) {
        container.innerHTML = publishedArticles.map(renderBlogCard).join('');
        // Masquer le message d'absence de contenu
        if (noArticlesMessage) {
            noArticlesMessage.classList.add('hidden');
        }
    } else {
        container.innerHTML = '';
        // Afficher le message d'absence de contenu
        if (noArticlesMessage) {
            noArticlesMessage.classList.remove('hidden');
        }
    }
});