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
            // Added cache busting for local dev
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
        // Extract unique categories
        const categories = ['All', ...new Set(allDocs.map(doc => doc.category))];
        
        filtersContainer.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        // Add event listeners to filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Set current category and filter
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

    function editDistance(first, second) {
        const distances = Array.from(
            { length: first.length + 1 },
            () => Array(second.length + 1).fill(0)
        );

        for (let i = 0; i <= first.length; i++) distances[i][0] = i;
        for (let j = 0; j <= second.length; j++) distances[0][j] = j;

        for (let i = 1; i <= first.length; i++) {
            for (let j = 1; j <= second.length; j++) {
                const substitutionCost = first[i - 1] === second[j - 1] ? 0 : 1;
                distances[i][j] = Math.min(
                    distances[i - 1][j] + 1,
                    distances[i][j - 1] + 1,
                    distances[i - 1][j - 1] + substitutionCost
                );

                if (
                    i > 1 &&
                    j > 1 &&
                    first[i - 1] === second[j - 2] &&
                    first[i - 2] === second[j - 1]
                ) {
                    distances[i][j] = Math.min(distances[i][j], distances[i - 2][j - 2] + 1);
                }
            }
        }

        return distances[first.length][second.length];
    }

    function matchesSearch(doc, searchTerm) {
        const searchableText = [
            doc.title,
            doc.description,
            ...doc.tags
        ].join(' ').toLowerCase();

        if (searchableText.includes(searchTerm)) return true;

        const searchWords = searchTerm.split(/\s+/);
        const searchableWords = searchableText.match(/[a-z0-9]+/g) || [];

        return searchWords.every(searchWord => {
            const maxDistance = searchWord.length >= 8 ? 2 : 1;
            return searchableWords.some(searchableWord =>
                Math.abs(searchableWord.length - searchWord.length) <= maxDistance &&
                editDistance(searchWord, searchableWord) <= maxDistance
            );
        });
    }

    // 4. Combined Filter and Search Logic
    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        const filteredDocs = allDocs.filter(doc => {
            // Category match
            const matchesCategory = currentCategory === 'All' || doc.category === currentCategory;
            
            // Search match (title, description, tags)
            const searchMatches = !searchTerm || matchesSearch(doc, searchTerm);
                
            return matchesCategory && searchMatches;
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
