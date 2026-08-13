$(function () {
  const materials = [
    {
      id: 1,
      type: "notes",
      label: "Lecture Notes",
      title: "Introduction to Web Technologies",
      subject: "Web Technologies",
      description:
        "Client-server architecture, browsers, URLs, HTTP and web fundamentals.",
      meta: "PDF • 32 pages",
      icon: "bi-file-earmark-text",
      file: "materials/lecture-notes/web-technologies.pdf",
    },
    {
      id: 2,
      type: "notes",
      label: "Lecture Notes",
      title: "HTML5 Fundamentals",
      subject: "Web Technologies",
      description:
        "Semantic elements, forms, multimedia, accessibility and modern HTML.",
      meta: "PDF • 28 pages",
      icon: "bi-filetype-html",
      file: "materials/lecture-notes/html5-fundamentals.pdf",
    },
    {
      id: 3,
      type: "pdf",
      label: "PDF Notes",
      title: "JavaScript Programming — Unit I",
      subject: "JavaScript",
      description:
        "Variables, data types, operators, functions and programming basics.",
      meta: "PDF • 41 pages",
      icon: "bi-file-earmark-pdf",
      file: "materials/pdfs/javascript-unit-1.pdf",
    },
    {
      id: 4,
      type: "pdf",
      label: "PDF Notes",
      title: "Database Systems — SQL",
      subject: "Database Systems",
      description:
        "SQL syntax, queries, joins, aggregation and database design.",
      meta: "PDF • 36 pages",
      icon: "bi-file-earmark-pdf",
      file: "materials/pdfs/sql-notes.pdf",
    },
    {
      id: 5,
      type: "lab",
      label: "Lab Manual",
      title: "Web Technology Laboratory",
      subject: "Laboratory",
      description:
        "Practical experiments covering HTML, CSS, JavaScript, jQuery and Bootstrap.",
      meta: "12 Experiments",
      icon: "bi-journal-code",
      file: "materials/lab-manuals/web-technology-lab.pdf",
    },
    {
      id: 6,
      type: "lab",
      label: "Lab Manual",
      title: "Programming Laboratory",
      subject: "Laboratory",
      description:
        "Programming exercises focused on algorithms, problem-solving and implementation.",
      meta: "15 Experiments",
      icon: "bi-terminal",
      file: "materials/lab-manuals/programming-lab.pdf",
    },
    {
      id: 7,
      type: "image",
      label: "Image",
      title: "Web Architecture — Visual Summary",
      subject: "Web Technologies",
      description:
        "Browser, server, HTTP request-response and application layers.",
      meta: "PNG Image",
      icon: "bi-image",
      file: "materials/images/web-architecture.png",
    },
    {
      id: 8,
      type: "image",
      label: "Image",
      title: "Database Normalization Chart",
      subject: "Database Systems",
      description:
        "Quick visual reference for 1NF, 2NF, 3NF and normalization.",
      meta: "PNG Image",
      icon: "bi-image",
      file: "materials/images/normalization-chart.png",
    },
    {
      id: 9,
      type: "video",
      label: "Video",
      title: "Introduction to JavaScript",
      subject: "JavaScript",
      description:
        "Recorded explanation of JavaScript fundamentals and examples.",
      meta: "Video • 35 min",
      icon: "bi-play-btn",
      file: "materials/videos/javascript-introduction.mp4",
    },
    {
      id: 10,
      type: "video",
      label: "Video",
      title: "DOM Manipulation with jQuery",
      subject: "jQuery",
      description: "Selectors, events, DOM manipulation and effects.",
      meta: "Video • 31 min",
      icon: "bi-play-btn",
      file: "materials/videos/jquery-dom.mp4",
    },
  ];

  let currentFilter = "all";

  function renderMaterials() {
    const query = $("#materialSearch").val().toLowerCase().trim();
    const filtered = materials.filter(function (m) {
      const matchFilter = currentFilter === "all" || m.type === currentFilter;
      const text = (
        m.title +
        " " +
        m.subject +
        " " +
        m.label +
        " " +
        m.description
      ).toLowerCase();
      return matchFilter && text.includes(query);
    });

    const $grid = $("#materialsGrid").empty();
    $("#noResults").toggleClass("d-none", filtered.length !== 0);

    filtered.forEach(function (m) {
      $grid.append(`
        <div class="col-sm-6 col-xl-4">
          <article class="material-card d-flex flex-column">
            <div class="material-icon mb-3"><i class="bi ${m.icon}"></i></div>
            <span class="type">${m.label}</span>
            <h3 class="h5 mt-2">${m.title}</h3>
            <p>${m.description}</p>
            <small class="text-secondary mb-3">${m.subject} • ${m.meta}</small>
            <div class="mt-auto d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary rounded-pill preview-btn" data-id="${m.id}">Preview</button>
              <a class="btn btn-sm btn-accent rounded-pill" href="${m.file}" download>Download</a>
            </div>
          </article>
        </div>
      `);
    });
  }

  renderMaterials();

  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentFilter = $(this).data("filter");
    renderMaterials();
  });

  $("#materialSearch").on("input", renderMaterials);

  $(document).on("click", ".preview-btn", function () {
    const item = materials.find((m) => m.id === Number($(this).data("id")));
    if (!item) return;

    $("#previewTitle").text(item.title);
    $("#previewType").text(item.label + " • " + item.subject);
    $("#downloadPreview").attr("href", item.file);

    const ext = item.file.split(".").pop().toLowerCase();
    let body;

    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
      body = `<div class="p-3 bg-light"><img src="${item.file}" class="preview-image" alt="${item.title}"></div>`;
    } else if (ext === "pdf") {
      body = `<iframe class="preview-frame" src="${item.file}#toolbar=0" title="${item.title}"></iframe>`;
    } else if (["mp4", "webm"].includes(ext)) {
      body = `<div class="p-3 bg-dark"><video class="w-100" controls style="max-height:70vh"><source src="${item.file}"></video></div>`;
    } else {
      body = `<div class="p-5 text-center text-secondary">Preview is not available for this file type. Use Download.</div>`;
    }

    $("#previewBody").html(body);
    bootstrap.Modal.getOrCreateInstance("#previewModal").show();
  });

  $("#year").text(new Date().getFullYear());

  $(".navbar .nav-link").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });
});
