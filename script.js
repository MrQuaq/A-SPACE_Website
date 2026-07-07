const swup = new Swup({
    cache: false,

    resolveUrl: (url) => url 
});

// Main initialization hub
function init() {
    initProjects();
    initBlogs();
    initGallery();
    initProjectPage();
    initArticle();
}


document.addEventListener("DOMContentLoaded", init);


swup.hooks.on('content:replace', () => {
    init();
});


//----------------------------
// AUTOMATIC PROJECT SYSTEM
//----------------------------
async function loadProjects() {
    try {
        const res = await fetch('./data/projects.json');
        const data = await res.json();
        renderDevelopment(data.development);
        renderFinished(data.finished);
    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

function initProjects() {
    const devGrid = document.getElementById('devGrid');
    const finishedGrid = document.getElementById('finishedGrid');
    if (!devGrid && !finishedGrid) return;
    loadProjects();
}

function renderDevelopment(items) {
    const container = document.getElementById('devGrid');
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="dev_card">
            <div class="dev_image">
                <img src="${item.image}" alt="${item.title}">
                <div class="developing">Developing</div>
            </div>
            <div class="project_body">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="specs">
                    <div class="spec"><span>Year</span><strong>${item.year}</strong></div>
                    <div class="spec"><span>Duration</span><strong>${item.duration}</strong></div>
                    <div class="spec"><span>Platform</span><strong>${item.platform}</strong></div>
                    <div class="spec"><span>Status</span><strong>${item.status}</strong></div>
                </div>
                <!-- Added data-no-swup here -->
                <a
                    href="project.html?id=${item.id}"
                    data-no-swup
                    class="view_project">
                    View Mission →
                </a>
            </div>
            <div class="progress">
                <div class="progress_header"><span>Progress</span><span>${item.progress}%</span></div>
                <div class="progress_bar"><div class="progress_fill" style="width:${item.progress}%"></div></div>
            </div>
        </div>
    `).join('');
}

function renderFinished(items) {
    const container = document.getElementById('finishedGrid');
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="project_card">
            <div class="project_image">
                <img src="${item.image}" alt="${item.title}">
                <div class="completed">Completed</div>
            </div>
            <div class="project_body">
                <h3>${item.title}</h3>
                <p>${item.description}</p> 
                <!-- Fixed the closing bracket on the opening <a> tag and added data-no-swup -->
                <a
                    href="project.html?id=${item.id}"
                    data-no-swup
                    class="view_project">
                    View Mission →
                </a>
            </div>
        </div>
    `).join('');
}

//-------------------------------------------------
// AUTOMATIC BLOG SYSTEM
//-------------------------------------------------
let posts = [];
let currentSearch = "";
let currentCategory = "All";

async function loadBlogs(){
    try {
        const res = await fetch("./data/blogs.json");
        const data = await res.json();
        posts = data.posts;
        renderFeatured(data.featured);
        renderBlogs(posts);
        initCarousel();
        initFilters();
        initSearch();
    } catch (err) {
        console.error("Error loading blogs.json:", err);
    }
}

function initBlogs(){
    const carousel = document.getElementById("featuredCarousel");
    const grid = document.getElementById("blogGrid");
    if(!carousel && !grid) return;
    loadBlogs();
}

function renderFeatured(items){
    const container = document.getElementById("featuredCarousel");
    if (!container) return;
    container.innerHTML = items.map(item=>`
        <article class="blog_slide">
            <div class="blog_featured_card">
                <div class="blog_featured_image"><img src="${item.image}" alt="${item.title}"></div>
                <div class="blog_featured_content">
                    <div class="blog_category">${item.category}</div>
                    <h2>${item.title}</h2>
                    <p>${item.description}</p>
                    <div class="blog_meta">
                        <span>${item.date}</span>
                        <span>${item.readingTime}</span>
                    </div>
                    <a
                       href="article.html?id=${item.id}"
                       data-no-swup
                       class="view_project">
                       Read Article →
                    </a>
                </div>
            </div>
        </article>
    `).join("");
}

function renderBlogs(items){
    const container = document.getElementById("blogGrid");
    if (!container) return;
    container.innerHTML = items.map(item=>`
        <article class="blog_card">
            <div class="blog_image"><img src="${item.image}" alt="${item.title}"></div>
            <div class="blog_body">
                <div class="blog_category">${item.category}</div>
                <h3>${item.title}</h3>
                <p class="blog_excerpt">${item.excerpt || item.description}</p>
                <div class="blog_footer">
                    <span>${item.date} · ${item.readingTime}</span>
                    <a 
                        href="article.html?id=${item.id}" 
                        data-no-swup 
                        class="blog_read">
                        Read →
                    </a>
                </div>
            </div>
        </article>
    `).join("");
}

function initSearch(){
    const input = document.getElementById("searchInput");
    if(!input) return;
    input.addEventListener("input", () => {
        currentSearch = input.value.toLowerCase();
        updateBlogs();
    });
}

function initFilters(){
    const buttons = document.querySelectorAll(".filter");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            currentCategory = button.dataset.category;
            updateBlogs();
        });
    });
}

function updateBlogs(){
    let filtered = posts;
    if(currentCategory !== "All"){
        filtered = filtered.filter(post => post.category === currentCategory);
    }
    if(currentSearch){
        filtered = filtered.filter(post => 
            post.title.toLowerCase().includes(currentSearch) || 
            (post.excerpt && post.excerpt.toLowerCase().includes(currentSearch))
        );
    }
    renderBlogs(filtered);
}

let currentSlide = 0;
let carouselInterval;

function initCarousel(){
    const slides = document.querySelectorAll(".blog_slide");
    if(slides.length === 0) return;
    showSlide(0);

    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");

    if(prevBtn) prevBtn.onclick = () => showSlide(currentSlide - 1);
    if(nextBtn) nextBtn.onclick = () => showSlide(currentSlide + 1);

    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 7000);
}

function showSlide(index){
    const track = document.querySelector(".carousel_container");
    const slides = document.querySelectorAll(".blog_slide");
    if(!track || slides.length === 0) return;
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

//-------------------------------------------------
// AUTOMATIC GALLERY SYSTEM
//-------------------------------------------------
let galleryImages = [];

async function loadGallery(){
    try {
        const res = await fetch("./data/gallery.json");
        const data = await res.json();
        galleryImages = data.images;
        renderGallery(galleryImages);
    } catch(err) {
        console.error("Error loading gallery:", err);
    }
}

function initGallery(){
    const grid = document.getElementById("galleryGrid");
    if(!grid) return;
    loadGallery();
}

function renderGallery(images){
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = images.map(image => `
        <div class="gallery_item">
            <img src="${image.image}" alt="${image.alt}" loading="lazy">
        </div>
    `).join("");
}

//-------------------------------------------------
// PROJECT PAGE
//-------------------------------------------------

async function initProjectPage(){

    const content =
        document.getElementById("projectContent");

    if(!content) return;

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    if(!id){

        content.innerHTML="<h2>Project not found.</h2>";

        return;

    }

    loadProject(id);

}

async function loadProject(id){

    const res =
        await fetch("./data/projects.json");

    const data =
        await res.json();

    const projects = [

        ...data.development,

        ...data.finished

    ];

    const project =
        projects.find(p=>p.id===id);

    if(!project){

        document.getElementById("projectContent")
            .innerHTML="<h2>Project not found.</h2>";

        return;

    }

    renderProjectInfo(project);

    loadProjectMarkdown(project.markdown);

}

function renderProjectInfo(project){

    projectTitle.textContent =
        project.title;

    projectDescription.textContent =
        project.description;

    projectYear.textContent =
        project.year;

    projectDuration.textContent =
        project.duration;

    projectPlatform.textContent =
        project.platform;

    projectStatus.textContent =
        project.status;

    projectProgress.textContent =
        project.progress;

    projectHeroImage.src =
        project.image;

}

async function loadProjectMarkdown(path){

    const res = await fetch(path);

    const markdown =
        await res.text();

    projectContent.innerHTML =
        marked.parse(markdown);

}

//-------------------------------------------------
// ARTICLE PAGE
//-------------------------------------------------
async function initArticle() {
    const articleContainer = document.getElementById("articleContent");
    if (!articleContainer) return;

    // Grab the URL parameters directly from the browser bar safely
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        articleContainer.innerHTML = "<h2>Article ID parameter missing.</h2>";
        return;
    }

    try {
        const response = await fetch("./data/blogs.json");
        const data = await response.json();
        const articles = [...data.featured, ...data.posts];
        const articleData = articles.find(a => a.id === id);

        if (!articleData) {
            articleContainer.innerHTML = "<h2>Article not found inside database.</h2>";
            return;
        }

        renderArticleInfo(articleData);
        await loadMarkdown(articleData.markdown);
    } catch (err) {
        console.error("Error handling article parsing pipeline:", err);
        articleContainer.innerHTML = "<h2>Failed loading content files.</h2>";
    }
}

function renderArticleInfo(article){
    const cat = document.getElementById("articleCategory");
    const title = document.getElementById("articleTitle");
    const desc = document.getElementById("articleDescription");
    const date = document.getElementById("articleDate");
    const time = document.getElementById("articleReadingTime");

    if(cat) cat.textContent = article.category;
    if(title) title.textContent = article.title;
    if(desc) desc.textContent = article.description;
    if(date) date.textContent = article.date;
    if(time) time.textContent = article.readingTime;
}

async function loadMarkdown(path){
    const articleContainer = document.getElementById("articleContent");
    if (!articleContainer) return;

    const response = await fetch(path);
    const rawMarkdown = await response.text();
    
    // Strip away FrontMatter metadata blocks cleanly
    const cleanContent = parseFrontMatter(rawMarkdown);
    
    // Render HTML directly inside container
    articleContainer.innerHTML = marked.parse(cleanContent.content);
}

function parseFrontMatter(text) {
    const match = text.match(/^---([\s\S]*?)---/);
    if (!match) {
        return { metadata: {}, content: text };
    }

    const metadata = {};
    match[1].trim().split("\n").forEach(line => {
        const index = line.indexOf(":");
        if (index === -1) return;
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        metadata[key] = value;
    });

    return {
        metadata,
        content: text.replace(match[0], "")
    };
}