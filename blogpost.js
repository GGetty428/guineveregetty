const buttonList = document.getElementById("blog-button-list");
const modalContainer = document.getElementById("blog-modals-container");

// Fetch the blog post information from the json file
fetch("blogpostinfo.json")
  .then(response => response.json())
  .then(data => {
    data.blogPosts.forEach((post, index) => {
      console.log(post.title);
      BlogPostFound(post, index, data.blogPosts);
    });
  })
  .catch(err => console.error("Failed to load blog posts:", err));


function BlogPostFound(post, index, arrayOfPosts)
{
  // Generate the modal id
  const modalId = `BLOG_${post.id}`

  /* Button Generation */
  const mostRecentIndex = arrayOfPosts.length - 1;
  const isMostRecent = index === mostRecentIndex;
  const buttonClass = isMostRecent ? "btn-active" : "btn-custom-blog";

  /* Card content: summary and thumbnail from post (or derived) */
  const firstParagraph = Object.values(post.bodyContents)[0] || "";
  const plainSummary = (firstParagraph || "").replace(/<[^>]*>/g, "").trim();
  const summary = post.summary != null ? post.summary : (plainSummary.slice(0, 140) + (plainSummary.length > 140 ? "…" : ""));
  const thumbnailSrc = post.thumbnail || (post.carousel && post.carousel.find((item) => item.type === "image"))?.src || "";
  const thumbnailAlt = post.title;

  /* Determine large tag based on buttonClass */
  const tagLarge = buttonClass === "btn-active" ? "blog-tag-metric--large-active" : "blog-tag-metric--large";

  /* Tags in RANK/MENTIONS style: use first two from tagsToUse */
  const tags = post.tags.tagsToUse || [];
  const tag1 = tags[0] || "";
  const tag2 = tags[1] || "";
  const tagsMetricsHtml = [
    tag1 && `
      <div class="blog-tag-metric">
        <span class="blog-tag-value">${tag1}</span>
      </div>
    `,
    tag2 && `
      <div class="blog-tag-metric ${tagLarge}">
        <span class="blog-tag-value">${tag2}</span>
      </div>
    `
  ].filter(Boolean).join("");

  /* Determine placeholder class based on buttonClass */
  const placeholderClass = buttonClass === "btn-active" ? "blog-card-thumb__placeholder-active" : "blog-card-thumb__placeholder";

  /* Determine summary text based on buttonClass */
  const summaryText = buttonClass === "btn-active" ? "text-body-secondary-active" : "text-body-secondary";

  /* Generate the card button for the blog post */
  const buttonHtml = `
    <button
      type="button"
      class="btn ${buttonClass} list-group-item list-group-item-action d-flex align-items-center text-start border-0 rounded-0 border-bottom"
      data-bs-toggle="modal"
      data-bs-target="#${modalId}">
      <div class="d-flex flex-grow-1 align-items-center gap-3 w-100 py-2">
        <div class="blog-card-thumb flex-shrink-0">
          ${thumbnailSrc ? `<img src="${thumbnailSrc}" alt="${thumbnailAlt}" class="blog-card-thumb__img">` : `<div class="${placeholderClass}"></div>`}
        </div>
        <div class="flex-grow-1 min-width-0">
          <h6 class="fw-bold mb-1 mb-md-0">${post.title}</h6>
          <p class="small ${summaryText} mb-0">${summary}</p>
        </div>
        <div class="d-flex flex-column gap-2 flex-shrink-0 blog-tag-metrics">
          ${tagsMetricsHtml}
        </div>
      </div>
    </button>
  `;

  buttonList.insertAdjacentHTML("afterbegin", buttonHtml);  
  
  /* Modal Generation */
  // Convert bodyContents object to array (it has numeric string keys like "0", "1", "2")
  const bodyContentsArray = Object.values(post.bodyContents);
  const bodyHtml = bodyContentsArray
    .map(text => `<p class="card-text mt-4">${text}</p>`)
    .join("");

  // Access tags.tagsToUse array from the tags object
  const tagsHtml = post.tags.tagsToUse
    .map(tag => `
        <span class="badge rounded-pill tag-custom mx-1 my-1">
          ${tag}
        </span>
    `)
    .join("");  
    
  /* Carousel Generation - only build carousel HTML if the post has a carousel with items */
  let carouselHtml = "";
  if (post.carousel && Array.isArray(post.carousel) && post.carousel.length > 0) {
    const carouselId = `carousel_${post.id}`;

    const carouselItemsHtml = post.carousel.map((item, idx) => {
      const isActive = idx === 0 ? "active" : "";
      switch (item.type) {
        case "image":
          return `
            <div class="carousel-item ${isActive}">
              <img src="${item.src}" class="d-block w-100 rounded" alt="${item.alt}">
            </div>
          `;
        case "video":
          return `
            <div class="carousel-item ${isActive}">
              <video autoplay loop muted playsinline class="d-block w-100 rounded" alt="${item.alt}">
                <source src="${item.src}" type="video/mp4">
              </video>
            </div>
          `;
        case "youtube":
          return `
            <div class="carousel-item ${isActive}">
              <div class="ratio ratio-16x9">
                <iframe
                  src="${item.src}"
                  title="${item.alt}"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen>
                </iframe>
              </div>
            </div>
          `;
        default:
          return "";
      }
    }).join("");

    const indicatorsHtml = post.carousel.map((item, idx) => `
      <button
        type="button"
        data-bs-target="#${carouselId}"
        data-bs-slide-to="${idx}"
        ${idx === 0 ? 'class="active" aria-current="true"' : ""}
        aria-label="${item.alt}">
      </button>
    `).join("");

    carouselHtml = `
      <div id="${carouselId}" class="carousel slide carousel-fade mb-4" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="mx-3 px-5">
            ${carouselItemsHtml}
          </div>
        </div>
        <div class="carousel-indicators">
          ${indicatorsHtml}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    `;
  }

  const modalHtml = `
      <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}_Title">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header" style="color: #cbb28e;">
              <h5 class="modal-title w-100 text-center" id="${modalId}_Title">
                ${post.title}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" area-label="Close"></button>
            </div>
            <div class="modal-body">
              ${carouselHtml}
              ${bodyHtml}
              <div class="d-flex flex-wrap mt-3">
                ${tagsHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

  modalContainer.insertAdjacentHTML("beforeend", modalHtml);
}