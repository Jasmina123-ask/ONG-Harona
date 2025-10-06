// js/blog-renderer.js

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('blog-articles-container');
    const noArticlesMessage = document.getElementById('no-articles-message');
    const lang = 'en'; // Langue par défaut pour cette page (index-en.html utilise cette structure)

    if (typeof blogArticles === 'undefined') {
        console.error("Erreur: Le tableau 'blogArticles' n'est pas défini.");
        return;
    }

    // --- Fonctions utilitaires ---

    // Formatage de la date en EN
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

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
        const title = article.title[lang] || article.title.en;
        const summary = article.summary[lang] || article.summary.en;
        
        // Lien vers la page de détail (qui utilisera le slug)
        const detailLink = `article-detail.html?slug=${article.slug}&lang=${lang}`;

        return `
            <div class="blog-card">
                <img src="${article.image}" alt="${title}" class="blog-image">
                <div class="card-content">
                    <span class="blog-metadata">${dateFormatted} | ${article.category}</span>
                    <h3>${title}</h3>
                    <p>${summary}</p>
                    <a href="${detailLink}" class="read-more-link">
                        Read More →
                    </a>
                </div>
            </div>
        `;
    };

    // --- Logique principale ---

    const publishedArticles = getPublishedArticles(blogArticles);

    if (publishedArticles.length > 0) {
        container.innerHTML = publishedArticles.map(renderBlogCard).join('');
        noArticlesMessage.classList.add('hidden');
    } else {
        container.innerHTML = '';
        noArticlesMessage.classList.remove('hidden');
    }
});