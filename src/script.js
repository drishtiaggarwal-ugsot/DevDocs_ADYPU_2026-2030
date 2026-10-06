document.addEventListener('DOMContentLoaded', () => {
    const docsGrid = document.getElementById('docsGrid');
    const loading = document.getElementById('loading');
    const searchInput = document.getElementById('searchInput');
    const filtersContainer = document.getElementById('filters');
    const noResults = document.getElementById('noResults');

    let allDocs = [];
    let currentCategory = 'All';

    // 1. Fetch the data from data.json
    async function fetchDocs() {
        try {
            const response = await fetch('data.json?t=' + new Date().getTime());
            if (!response.ok) throw new Error('Failed to fetch data');
            
            allDocs = await response.json();
            
            // Initial Render
            loading.classList.add('hidden');
            setupFilters();
            renderDocs(allDocs);
        } catch (error) {
            console.error('Error fetching docs:', error);
            loading.innerHTML = `<span style="color: #ef4444;">Failed to load documentation data. Please ensure you are running this via a local server.</span>`;
        }
    }

    // 2. Setup Category Filters dynamically based on data
    function setupFilters() {
        const categories = ['All', ...new Set(allDocs.map(doc => doc.category))];
        
        filtersContainer.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                currentCategory = e.target.getAttribute('data-category');
                filterAndRender();
            });
        });
    }

    // 3. Render function
    function renderDocs(docs) {
        if (docs.length === 0) {
            docsGrid.innerHTML = '';
            noResults.classList.remove('hidden');
            return;
        }

        noResults.classList.add('hidden');
        
        docsGrid.innerHTML = docs.map(doc => `
            <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="card">
                <div class="card-category">${doc.category}</div>
                <h3 class="card-title">${doc.title}</h3>
                <p class="card-desc">${doc.description}</p>
                <div class="card-tags">
                    ${doc.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </a>
        `).join('');
    }

    // Levenshtein Distance Helper for Fuzzy Search
    function getLevenshteinDistance(a, b) {
        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(
                            matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1  // deletion
                        )
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    // Check if a text or any word within it matches the search term closely
    function isCloseMatch(text, searchTerm) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        
        // Exact substring match (handles normal searches instantly)
        if (lowerText.includes(searchTerm)) return true;

        // Fuzzy match on individual words
        const words = lowerText.split(/\s+/);
        const maxDistance = searchTerm.length > 5 ? 2 : 1;

        return words.some(word => {
            if (Math.abs(word.length - searchTerm.length) > maxDistance) return false;
            return getLevenshteinDistance(word, searchTerm) <= maxDistance;
        });
    }

    // 4. Combined Filter and Search Logic with Fuzzy Matching
    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        const filteredDocs = allDocs.filter(doc => {
            // Category match
            const matchesCategory = currentCategory === 'All' || doc.category === currentCategory;
            
            // Search match across title, description, and tags with typo support
            const matchesSearch = 
                !searchTerm ||
                isCloseMatch(doc.title, searchTerm) || 
                isCloseMatch(doc.description, searchTerm) ||
                doc.tags.some(tag => isCloseMatch(tag, searchTerm));
                
            return matchesCategory && matchesSearch;
        });

        renderDocs(filteredDocs);
    }

    // 5. Search Event Listener (with debounce for performance)
    let timeoutId;
    searchInput.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            filterAndRender();
        }, 300); // 300ms delay
    });

    // Initialize App
    fetchDocs();
});
