"use strict";

var dropzoneinp = document.querySelector(".dropzone__input");
var dropzoneEl = dropzoneinp.closest(".dropzone");
dropzoneEl.addEventListener("dragover", function (e) {
  e.preventDefault();
  dropzoneEl.classList.add("dropzone__over");
});
dropzoneEl.addEventListener("dragleave", function (e) {
  e.preventDefault();
  dropzoneEl.classList.remove("dropzone__over");
});
dropzoneEl.addEventListener("drop", function (e) {
  e.preventDefault();

  if (e.dataTransfer.files.length) {
    dropzoneinp.files = e.dataTransfer.files;
    updateThumbnail(dropzoneEl, e.dataTransfer.files[0]);
  }

  dropzoneEl.classList.remove("dropzone__over");
});
var label = document.querySelector("label");
label.addEventListener("click", function () {
  dropzoneinp.addEventListener("change", function (e) {
    updateThumbnail(dropzoneEl, e.target.files[0]);
  });
});

function updateThumbnail(dropzoneEl, file) {
  var thumbnailEl;
  return regeneratorRuntime.async(function updateThumbnail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          thumbnailEl = document.querySelector(".thumb");
          dropzoneEl.classList.add("hidden"); //   thumbnailEl.classList.remove("hidden");

          uploadImage(thumbnailEl, file);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}

var cl = new cloudinary.Cloudinary({
  cloud_name: "codermj",
  secure: true
});
var CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/codermj/upload";
var CLOUDINARY_UPLOAD_PRESET = "n8hb45ip";

function uploadImage(thumbnailEl, file) {
  var linkbox = document.querySelector(".link");
  var formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  var imgUrl;
  loading(thumbnailEl, true);
  axios({
    url: CLOUDINARY_URL,
    method: "POST",
    data: formData
  }).then(function (res) {
    imgUrl = res.data.secure_url;
    linkbox.value = res.data.secure_url;
    thumbnailEl.style.background = "url('".concat(imgUrl, "')");
    thumbnailEl.style.backgroundSize = "cover";
    thumbnailEl.style.backgroundPosition = "center";
    loading(thumbnailEl, false);
    copyToClipboard(res.data.secure_url);
  })["catch"](function (err) {
    return console.log(err);
  });
}

function loading(thumbnailEl, status) {
  var loadingEl = document.querySelector(".loading");
  var card = document.querySelector(".card");
  document.querySelector("label").classList.add("hidden");
  document.querySelector(".copy").style.display = "flex";

  if (status === true) {
    loadingEl.classList.remove("hidden");
    card.classList.add("hidden");
  } else {
    loadingEl.classList.add("hidden");
    card.classList.remove("hidden");
    thumbnailEl.classList.remove("hidden");
  }
}

function copyToClipboard(str) {
  var copyBtn = document.querySelector(".copy-btn");

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var el = document.createElement("textarea");
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
  }
}