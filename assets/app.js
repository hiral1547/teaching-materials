$(function () {
  const materials = [
    {
      id: 1,
      type: "notes",
      label: "Lecture Notes",
      title: "Turing Machine",
      subject: "Theory of Computation",
      description:
        "Solved question on Turing Machines, including concepts, constructions and problem-solving examples.",
      meta: "PDF • 13 pages",
      icon: "bi-file-earmark-text",
      file: "materials/lecture-notes/toc/Turing Machine (TM) solved Qs.pdf",
    },
    {
      id: 2,
      type: "notes",
      label: "Lecture Notes",
      title: "Github guide",
      subject: "Github",
      description:
        "Quick reference notes on GitHub, Git commands, repositories, branching, commits and collaboration.",
      meta: "PDF • 6 pages",
      icon: "bi-filetype-html",
      file: "materials/lecture-notes/github/1.github.pdf",
    },
    {
      id: 3,
      type: "video",
      label: "Video",
      title: "Moore to Mealy Machine Conversion",
      subject: "Theory of Computation",
      description:
        "Video tutorial on converting Moore machines to Mealy machines, covering state transitions, output mapping and solved examples.",
      meta: "Video",
      icon: "bi-play-btn",
      file: "materials/videos/moore-to-mealy-conversion.mp4",
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
