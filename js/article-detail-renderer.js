document.addEventListener('DOMContentLoaded', () => {
        // Note : Cette version est pour article-detail.html, 
        // qui affichera le contenu en ANGLAIS.
        const container = document.getElementById('article-content-container');
        const pageTitleElement = document.getElementById('article-page-title');
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        const lang = 'en'; // FORCER la langue ANGLAISE pour cette page
    
        if (!slug) {
            container.innerHTML = '<h1>Error 404</h1><p>Article not specified.</p>';
            pageTitleElement.textContent = 'Error';
            return;
        }
    
        const article = blogArticles.find(a => a.slug === slug);
    
        // --- Fonctions utilitaires ---
    
        // Vérification de la publication
        function isArticlePublished(article) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const articleDate = new Date(article.date);
            articleDate.setHours(0, 0, 0, 0);
            return articleDate <= today;
        }
    
        if (!article || !isArticlePublished(article)) {
            container.innerHTML = '<h1>Error 404</h1><p>The article you are looking for does not exist or has not been published yet.</p>';
            pageTitleElement.textContent = 'Article Not Found';
            return;
        }
    
        // Formatage de la date en EN
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            // Utilise 'en-US' pour le format Anglais
            return new Date(dateString).toLocaleDateString('en-US', options); 
        };
    
        let contentToProcess = article.content[lang] || article.content.en;
    
        // --- LOGIQUE AJOUTÉE POUR LA GALERIE ---
        if (article.gallery) {
            for (let i = 1; i <= 4; i++) {
                const imgKey = `img${i}`;
                const placeholder = `<img-${i}>`;
                
                if (contentToProcess.includes(placeholder) && article.gallery[imgKey]) {
                    const imgData = article.gallery[imgKey];
                    const altText = imgData.alt[lang] || imgData.alt.en; 
                    
                    const imgHtml = `
                        <figure class="article-inner-image">
                            <img src="${imgData.src}" alt="${altText}" loading="lazy" />
                            <figcaption>${altText}</figcaption>
                        </figure>
                    `;
                    
                    // Remplacement de <img-x> par le code HTML de l'image
                    contentToProcess = contentToProcess.replace(placeholder, imgHtml);
                }
            }
        }
        // --- FIN LOGIQUE GALERIE ---
    
    
        // Remplacement des sauts de ligne (similaire au traitement FR)
        const contentHtml = contentToProcess
            .split('\n')
            .filter(p => p.trim() !== '')
            .map(p => {
                if (p.trim().startsWith('###')) {
                    return `<h3>${p.replace('###', '').trim()}</h3>`;
                }
                if (p.trim().startsWith('##')) {
                    return `<h2>${p.replace('##', '').trim()}</h2>`;
                }
                // La logique pour les points numérotés reste correcte
                if (p.trim().startsWith('1.') || p.trim().startsWith('2.') || p.trim().startsWith('3.')) {
                     return `<p class="numbered-point"><strong>${p.trim()}</strong></p>`;
                }
                return `<p>${p.trim()}</p>`;
            })
            .join('');
    
    
        // --- Rendu final ---
    
        pageTitleElement.textContent = article.title.en;
    
        container.innerHTML = `
            <span class="article-metadata">
                ${formatDate(article.date)} | ${article.category}
            </span>
            <h1>${article.title.en}</h1>
            <p class="article-summary">${article.summary.en}</p>
    
            <img 
                src="${article.image}" 
                alt="${article.title.en}" 
                class="article-cover-image" 
            />
            
            <div class="article-body">
                ${contentHtml}
            </div>
            
            <a href="blog.html" class="back-link">← Back to News</a>
        `;
    });