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
      file: "materials/lecture-notes/toc/turing_machine.pdf",
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
      meta: "YouTube Video",
      icon: "bi-youtube",
      file: "https://www.youtube.com/watch?v=ReY9fOrmQPU&t=353s",
    },
  ];

  let currentFilter = "all";

  // Check whether a URL is a YouTube URL
  function isYouTubeUrl(url) {
    return (
      url.includes("youtube.com/watch") ||
      url.includes("youtu.be/")
    );
  }

  // Get YouTube video ID
  function getYouTubeVideoId(url) {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      }

      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.substring(1);
      }
    } catch (error) {
      console.error("Invalid YouTube URL:", error);
    }

    return null;
  }

  // Get YouTube start time
  function getYouTubeStartTime(url) {
    try {
      const parsedUrl = new URL(url);
      const time = parsedUrl.searchParams.get("t");

      if (!time) {
        return 0;
      }

      // Handle formats such as:
      // 353
      // 353s
      // 5m53s
      // 1h5m20s

      if (/^\d+$/.test(time)) {
        return parseInt(time, 10);
      }

      if (/^\d+s$/.test(time)) {
        return parseInt(time, 10);
      }

      let seconds = 0;

      const hours = time.match(/(\d+)h/);
      const minutes = time.match(/(\d+)m/);
      const secs = time.match(/(\d+)s/);

      if (hours) {
        seconds += parseInt(hours[1], 10) * 3600;
      }

      if (minutes) {
        seconds += parseInt(minutes[1], 10) * 60;
      }

      if (secs) {
        seconds += parseInt(secs[1], 10);
      }

      return seconds;
    } catch (error) {
      return 0;
    }
  }

  // Render materials
  function renderMaterials() {
    const query = $("#materialSearch").val().toLowerCase().trim();

    const filtered = materials.filter(function (m) {
      const matchFilter =
        currentFilter === "all" || m.type === currentFilter;

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

    $("#noResults").toggleClass(
      "d-none",
      filtered.length !== 0
    );

    filtered.forEach(function (m) {
      const youtube = isYouTubeUrl(m.file);

      const actionButton = youtube
        ? `
          <a
            class="btn btn-sm btn-accent rounded-pill"
            href="${m.file}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube
          </a>
        `
        : `
          <a
            class="btn btn-sm btn-accent rounded-pill"
            href="${m.file}"
            download
          >
            Download
          </a>
        `;

      $grid.append(`
        <div class="col-sm-6 col-xl-4">
          <article class="material-card d-flex flex-column">

            <div class="material-icon mb-3">
              <i class="bi ${m.icon}"></i>
            </div>

            <span class="type">${m.label}</span>

            <h3 class="h5 mt-2">${m.title}</h3>

            <p>${m.description}</p>

            <small class="text-secondary mb-3">
              ${m.subject} • ${m.meta}
            </small>

            <div class="mt-auto d-flex gap-2">

              <button
                class="btn btn-sm btn-outline-secondary rounded-pill preview-btn"
                data-id="${m.id}"
              >
                Preview
              </button>

              ${actionButton}

            </div>

          </article>
        </div>
      `);
    });
  }

  // Initial render
  renderMaterials();

  // Filter buttons
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");

    $(this).addClass("active");

    currentFilter = $(this).data("filter");

    renderMaterials();
  });

  // Search
  $("#materialSearch").on("input", renderMaterials);

  // Preview button
  $(document).on("click", ".preview-btn", function () {
    const item = materials.find(
      (m) => m.id === Number($(this).data("id"))
    );

    if (!item) return;

    $("#previewTitle").text(item.title);

    $("#previewType").text(
      item.label + " • " + item.subject
    );

    const youtube = isYouTubeUrl(item.file);

    // Configure modal action button
    if (youtube) {
      $("#downloadPreview")
        .attr("href", item.file)
        .attr("target", "_blank")
        .attr("rel", "noopener noreferrer")
        .text("Watch on YouTube");
    } else {
      $("#downloadPreview")
        .attr("href", item.file)
        .removeAttr("target")
        .removeAttr("rel")
        .attr("download", "")
        .text("Download");
    }

    let body;

    // --------------------------------
    // YouTube
    // --------------------------------
    if (youtube) {
      const videoId = getYouTubeVideoId(item.file);
      const startTime = getYouTubeStartTime(item.file);

      if (videoId) {
        let embedUrl =
          `https://www.youtube.com/embed/${videoId}`;

        if (startTime > 0) {
          embedUrl += `?start=${startTime}`;
        }

        body = `
          <div class="ratio ratio-16x9">
            <iframe
              src="${embedUrl}"
              title="${item.title}"
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
                web-share
              "
              allowfullscreen
            ></iframe>
          </div>
        `;
      } else {
        body = `
          <div class="p-5 text-center text-secondary">
            Invalid YouTube URL.
          </div>
        `;
      }
    }

    // --------------------------------
    // Images
    // --------------------------------
    else {
      const ext = item.file
        .split(".")
        .pop()
        .toLowerCase();

      if (
        ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)
      ) {
        body = `
          <div class="p-3 bg-light">
            <img
              src="${item.file}"
              class="preview-image"
              alt="${item.title}"
            >
          </div>
        `;
      }

      // --------------------------------
      // PDF
      // --------------------------------
      else if (ext === "pdf") {
        body = `
    <iframe
      src="${item.file}"
      title="${item.title}"
      style="
        width: 100%;
        height: 70vh;
        border: none;
        display: block;
      "
    ></iframe>
  `;
      }

      // --------------------------------
      // Local Video
      // --------------------------------
      else if (["mp4", "webm"].includes(ext)) {
        const mimeType =
          ext === "mp4"
            ? "video/mp4"
            : "video/webm";

        body = `
          <div class="p-3 bg-dark">
            <video
              class="w-100"
              controls
              preload="metadata"
              playsinline
              style="max-height:70vh"
            >
              <source
                src="${item.file}"
                type="${mimeType}"
              >

              Your browser does not support HTML5 video.
            </video>
          </div>
        `;
      }

      // --------------------------------
      // Unsupported
      // --------------------------------
      else {
        body = `
          <div class="p-5 text-center text-secondary">
            Preview is not available for this file type.
            Use Download.
          </div>
        `;
      }
    }

    // Insert preview
    $("#previewBody").html(body);

    // Show modal
    bootstrap.Modal
      .getOrCreateInstance("#previewModal")
      .show();
  });

  // Current year
  $("#year").text(new Date().getFullYear());

  // Close mobile navbar after clicking a link
  $(".navbar .nav-link").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });
});