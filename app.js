const dropzoneinp = document.querySelector(".dropzone__input");
const dropzoneEl = dropzoneinp.closest(".dropzone");

dropzoneEl.addEventListener("dragover", (e) => {
  e.preventDefault();

  dropzoneEl.classList.add("dropzone__over");
});
dropzoneEl.addEventListener("dragleave", (e) => {
  e.preventDefault();

  dropzoneEl.classList.remove("dropzone__over");
});
dropzoneEl.addEventListener("drop", (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length) {
    dropzoneinp.files = e.dataTransfer.files;
    updateThumbnail(dropzoneEl, e.dataTransfer.files[0]);
  }
  dropzoneEl.classList.remove("dropzone__over");
});

const label = document.querySelector("label");
label.addEventListener("click", () => {
  dropzoneinp.addEventListener("change", (e) => {
    updateThumbnail(dropzoneEl, e.target.files[0]);
  });
});

async function updateThumbnail(dropzoneEl, file) {
  const thumbnailEl = document.querySelector(".thumb");
  dropzoneEl.classList.add("hidden");
  //   thumbnailEl.classList.remove("hidden");
  uploadImage(thumbnailEl, file);
}

var cl = new cloudinary.Cloudinary({ cloud_name: "codermj", secure: true });
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/codermj/upload";
const CLOUDINARY_UPLOAD_PRESET = "n8hb45ip";

function uploadImage(thumbnailEl, file) {
  const linkbox = document.querySelector(".link");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  let imgUrl;
  loading(thumbnailEl, true);
  axios({
    url: CLOUDINARY_URL,
    method: "POST",
    data: formData,
  })
    .then((res) => {
      imgUrl = res.data.secure_url;
      linkbox.value = res.data.secure_url;
      thumbnailEl.style.background = `url('${imgUrl}')`;
      thumbnailEl.style.backgroundSize = "cover";
      thumbnailEl.style.backgroundPosition = "center";
      loading(thumbnailEl, false);
      copyToClipboard(res.data.secure_url);
    })
    .catch((err) => console.log(err));
}
function loading(thumbnailEl, status) {
  const loadingEl = document.querySelector(".loading");
  const card = document.querySelector(".card");
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
  const copyBtn = document.querySelector(".copy-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const el = document.createElement("textarea");
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
  }
}
