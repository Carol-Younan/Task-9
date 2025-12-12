var addButton = document.getElementById("add");
var container = document.getElementById("modal");
var closeBtn = document.getElementById("close");
var cancelBtn = document.getElementById("cancel");
var totalContacts = document.getElementById("total");
var totalFavs = document.getElementById("fav");
var totalEmergs = document.getElementById("emerg");
var contactsTitle = document.getElementById("contactsTitle");
var noContacts = document.getElementById("noContacts");
var contactForm = document.getElementById("contactForm");
var saveBtn = document.getElementById("saveBtn");
var profile = document.getElementById("contactProfile");
var contactName = document.getElementById("contactName");
var number = document.getElementById("contactNum");
var email = document.getElementById("contactEmail");
var address = document.getElementById("contactAddress");
var group = document.getElementById("contactGroup");
var note = document.getElementById("contactNote");
var contactFav = document.getElementById("contactFavorite");
var contactEmerg = document.getElementById("contactEmergency");
var cardContact = document.getElementById("cardContact");
var favIcon = document.getElementById("favIcon");
var emergIcon = document.getElementById("emergIcon");
var noFav = document.getElementById("noFav");
var noEmerg = document.getElementById("noEmerg");
var searchBar = document.getElementById("searchBar");
var fullNameError = document.getElementById("fullNameError");
var phoneNumberError = document.getElementById("phoneNumberError");
var emailAddressError = document.getElementById("emailAddressError");
var avatarPreview = document.getElementById("avatarPreview");

var contacts = [];
var editIndex = -1;
topElements();

if (localStorage.getItem("contacts") == null) {
  contacts = [];
} else {
  contacts = JSON.parse(localStorage.getItem("contacts"));
  display();
}

profile.addEventListener("change", function () {
  if (!profile.files[0]) {
    avatarPreview.innerHTML = `
      <i class="fas fa-user"></i>
    `;
    return;
  }
  const fileName = profile.files[0].name;
  avatarPreview.classList.replace("rounded-circle", "rounded-4");
  avatarPreview.innerHTML = `
    <img id="previewImage" src="Images/${fileName}" class="preview-avatar rounded-4" />
  `;
});

//add,close,cancel
addButton.addEventListener("click", function () {
  container.classList.replace("d-none", "d-flex");
});
closeBtn.addEventListener("click", function () {
  container.classList.replace("d-flex", "d-none");
});
cancelBtn.addEventListener("click", function () {
  container.classList.replace("d-flex", "d-none");
});

//top elements
function topElements() {
  var favCount = 0;
  var emergCount = 0;

  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].isFavorite) favCount++;
    if (contacts[i].isEmergency) emergCount++;
  }

  totalContacts.innerHTML = `<p class="m-0 myText">TOTAL</p>
                  <p class="m-0 nextText">${contacts.length}</p>`;

  totalFavs.innerHTML = `<p class="m-0 myText">FAVORITES</p>
                  <p class="m-0 nextText">${favCount}</p>`;

  totalEmergs.innerHTML = `<p class="m-0 myText">EMERGENCY</p>
                  <p class="m-0 nextText">${emergCount}</p>`;

  contactsTitle.nextElementSibling.innerHTML = `<p class="subtitleContact">Manage and organize your ${contacts.length} contacts</p>`;
}

//noContact
if (contacts.length == 0) {
  noContacts.classList.replace("d-none", "d-flex");
}

//form
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
});

//save
function saveContact() {
  if (
    contactName.classList.contains("error") ||
    number.classList.contains("error") ||
    email.classList.contains("error") ||
    contactName.value == "" ||
    number.value == ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
    });
  } else {
    var contact = {
      contactName: contactName.value,
      contactNum: number.value,
      contactEmail: email.value,
      contactAddress: address.value,
      contactGroup: group.value,
      contactNote: note.value,
      isFavorite: contactFav.checked,
      isEmergency: contactEmerg.checked,
      image: `Images/${profile.files[0]?.name || "avatar-4.jpg"}`,
    };

    if (editIndex !== -1) {
      contacts[editIndex] = contact;
      editIndex = -1;
    } else {
      contacts.push(contact);
    }

    console.log(contact);

    display();

    localStorage.setItem("contacts", JSON.stringify(contacts));

    container.classList.replace("d-flex", "d-none");

    Swal.fire({
      title: "Good job!",
      text: "You clicked the button!",
      icon: "success",
    });

    if (contacts.length != 0) {
      noContacts.classList.replace("d-flex", "d-none");
    }
    clear();
  }
}

saveBtn.addEventListener("click", saveContact);

//favs
function displayfavs() {
  var output = "";
  var haveFav = false;

  output += `<div class="boxCard active">`;
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].isFavorite === true) {
      haveFav = true;
      output += `
            <div class="contact-card fav d-flex justify-content-between align-items-center w-100">
                <div class="d-flex gap-2">
                    <img src="${contacts[i].image}" class="myAvatar border-0">
                    <div class="contact-info">
                        <div class="contact-name text-start">${contacts[i].contactName}</div>
                        <div class="contact-number">${contacts[i].contactNum}</div>
                    </div>
                </div>

                <a href="tel:${contacts[i].contactNum}">
                    <i class="fa-solid fa-phone phoneicon rounded-3 green"></i>
                </a>
            </div>
      `;
    }
  }
  output += `</div>`;

  if (!haveFav) {
    noFav.innerHTML = `<p class="boxCard">No Favorites Yet</p>`;
  } else {
    noFav.innerHTML = output;
  }
}

//emerg
function displayemergs() {
  var output = "";
  var haveEmerg = false;

  output += `<div class="boxCard active">`;
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].isEmergency === true) {
      haveEmerg = true;
      output += `
            <div class="contact-card emergency d-flex justify-content-between align-items-center w-100">
                <div class="d-flex gap-2">
                    <img src="${contacts[i].image}" class="myAvatar border-0">
                    <div class="contact-info">
                        <div class="contact-name text-start">${contacts[i].contactName}</div>
                        <div class="contact-number">${contacts[i].contactNum}</div>
                    </div>
                </div>

                <a href="tel:${contacts[i].contactNum}">
                    <i class="fa-solid fa-phone phoneicon rounded-3 green"></i>
                </a>
            </div>
      `;
    }
  }
  output += `</div>`;

  if (!haveEmerg) {
    noEmerg.innerHTML = `<p class="boxCard">No Emergency Contacts</p>`;
  } else {
    noEmerg.innerHTML = output;
  }
}

//display
function display() {
  topElements();
  displayfavs();
  displayemergs();

  var contain = "";

  for (var i = 0; i < contacts.length; i++) {
    contain += `<div class="col-12 col-sm-6 col-xl-6 mb-2">
                  <div class="card p-3">
                  <div class="d-flex gap-3 mb-2">
                  <div class="imgContact position-relative" id="imgContact"><img src="${
                    contacts[i].image
                  }" class="w-100 rounded-3">
                   ${
                     contacts[i].isFavorite
                       ? `<span class="fav-icon"><i class="fa-solid fa-star"></i></span>`
                       : ""
                   }
                   ${
                     contacts[i].isEmergency
                       ? `<span class="emerg-icon"><i class="fa-solid fa-heart-pulse"></i></span>`
                       : ""
                   }
                  </div>
                  <div>
                  <p class="m-0 name">${contacts[i].contactName}</p>
                  <p class="d-flex m-0 gap-2 align-items-center fontnumber"><i class="fa-solid fa-phone phoneicon rounded-3"></i>${
                    contacts[i].contactNum
                  }</p>
                  </div>
                  </div> `;
    if (contacts[i].contactEmail !== "") {
      contain += `
                  <div class="d-flex align-items-center mb-2">
                    <p class="d-flex m-0 gap-2 align-items-center fontnumber"><i class="fa-solid fa-envelope mailicon rounded-3"></i>${contacts[i].contactEmail}</p>
                  </div>`;
    }
    if (contacts[i].contactAddress !== "") {
      contain += `<div class="d-flex align-items-center mb-2">
                    <p class="d-flex m-0 gap-2 align-items-center fontnumber"><i class="fa-solid fa-location-dot locationicon rounded-3"></i>${contacts[i].contactAddress}</p>
                  </div>`;
    }
    contain += `<div class="d-flex gap-2">`;
    if (contacts[i].contactGroup !== "") {
      contain += `<p class="group">${contacts[i].contactGroup}</p>`;
    }
    if (contacts[i].isEmergency === true) {
      contain += `
          <p class="emerg"><i class="fa-solid fa-heart-pulse"></i> Emergency</p>`;
    }
    contain += `</div>
    <div class="footer d-flex justify-content-between align-items-center">
      <div class="d-flex gap-2">
        <a href="tel:${contacts[i].contactNum}">
          <i class="fa-solid fa-phone phoneicon rounded-3 green"></i>
        </a>`;
    if (contacts[i].contactEmail !== "") {
      contain += `<a href="mailto:${contacts[i].contactEmail}">
          <i class="fa-solid fa-envelope mailicon rounded-3 purple"></i>
        </a>`;
    }
    contain += `</div>`;
    if (contacts[i].isFavorite == true) {
      contain += ` <div class="d-flex gap-2 align-items-center">
        <button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="toggleFavourite(${i})">
          <i class="fa-solid fa-star star active rounded-3"></i> </i>
        </button>`;
    } else {
      contain += ` <div class="d-flex gap-2 align-items-center">
      <button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="toggleFavourite(${i})">
        <i class="fa-regular fa-star rounded-3 star"></i>
      </button>
    `;
    }
    if (contacts[i].isEmergency == true) {
      contain += `<button class="bg-white border-0 d-flex align-items-center justify-content-center"  onClick="toggleEmergency(${i})">
        <i class="fa-solid fa-heart-pulse rounded-3 active heart"></i>
      </button>
    `;
    } else {
      contain += `<button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="toggleEmergency(${i})">
        <i class="fa-regular fa-heart rounded-3 heart"></i>
      </button>`;
    }
    contain += `<button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="edit(${i})">
          <i class="fa-solid fa-pen rounded-3 pen"></i>
        </button>

              <button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="deleteItem(${i})">
                <i class="fa-solid fa-trash rounded-3 trash"></i>
              </button>
            </div>
            </div>

        </div>
      </div>
      `;
  }
  cardContact.innerHTML = contain;
}

//toggleFavorite
function toggleFavourite(index) {
  contacts[index].isFavorite = !contacts[index].isFavorite;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  display();
}

//toggleEmergency
function toggleEmergency(index) {
  contacts[index].isEmergency = !contacts[index].isEmergency;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  display();
}

//delete
function deleteItem(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      contacts.splice(index, 1);
      localStorage.setItem("contacts", JSON.stringify(contacts));
      display();
      if (contacts.length == 0) {
        noContacts.classList.replace("d-none", "d-flex");
      }
      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
      });
    }
  });
}

//clear
function clear() {
  profile.value = null;
  contactName.value = null;
  number.value = null;
  email.value = null;
  address.value = null;
  group.value = null;
  note.value = null;
  contactFav.checked = false;
  contactEmerg.checked = false;

  avatarPreview.innerHTML = `
      <i class="fas fa-user"></i>
    `;
  avatarPreview.classList.replace("rounded-4", "rounded-circle");

  contactName.classList.remove("error");
  number.classList.remove("error");
  email.classList.remove("error");
  fullNameError.classList.replace("d-flex", "d-none");
  phoneNumberError.classList.replace("d-flex", "d-none");
  emailAddressError.classList.replace("d-flex", "d-none");
}

//edit
function edit(index) {
  container.classList.replace("d-none", "d-flex");

  editIndex = index;

  contactName.value = contacts[index].contactName;
  number.value = contacts[index].contactNum;
  email.value = contacts[index].contactEmail;
  address.value = contacts[index].contactAddress;
  group.value = contacts[index].contactGroup;
  note.value = contacts[index].contactNote;
  contactFav.checked = contacts[index].isFavorite;
  contactEmerg.checked = contacts[index].isEmergency;

  avatarPreview.classList.replace("rounded-circle", "rounded-4");
  avatarPreview.innerHTML = `
    <img id="previewImage" src="${contacts[index].image}" class="preview-avatar rounded-4" />
  `;

  profile.value = null;
}

searchBar.addEventListener("input", search);

//search
function search() {
  var word = searchBar.value;
  var contain = "";

  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].contactName.toLowerCase().includes(word.toLowerCase())) {
      contain += `<div class="col-12 col-sm-6 col-xl-6 mb-2">
                  <div class="card p-3">
                  <div class="d-flex gap-3 mb-2">
                  <div class="imgContact position-relative" id="imgContact"><img src="${
                    contacts[i].image
                  }" class="w-100 rounded-3">
                   ${
                     contacts[i].isFavorite
                       ? `<span class="fav-icon"><i class="fa-solid fa-star"></i></span>`
                       : ""
                   }
                   ${
                     contacts[i].isEmergency
                       ? `<span class="emerg-icon"><i class="fa-solid fa-heart-pulse"></i></span>`
                       : ""
                   }
                  </div>
                  <div>
                  <p class="m-0 name">${contacts[i].contactName}</p>
                  <p class="d-flex m-0 gap-2 align-items-center fontnumber"><i class="fa-solid fa-phone phoneicon rounded-3"></i>${
                    contacts[i].contactNum
                  }</p>
                  </div>
                  </div> `;
      if (contacts[i].contactEmail !== "") {
        contain += `
                  <div class="d-flex align-items-center mb-2">
                    <p class="d-flex m-0 gap-2 align-items-center fontnumber"><i class="fa-solid fa-envelope mailicon rounded-3"></i>${contacts[i].contactEmail}</p>
                  </div>`;
      }
      if (contacts[i].contactAddress !== "") {
        contain += `<div class="d-flex align-items-center mb-2">
                    <p class="d-flex m-0 gap-2 align-items-center fontnumber"><i class="fa-solid fa-location-dot locationicon rounded-3"></i>${contacts[i].contactAddress}</p>
                  </div>`;
      }
      contain += `<div class="d-flex gap-2">`;
      if (contacts[i].contactGroup !== "") {
        contain += `<p class="group">${contacts[i].contactGroup}</p>`;
      }
      if (contacts[i].isEmergency === true) {
        contain += `
          <p class="emerg"><i class="fa-solid fa-heart-pulse"></i> Emergency</p>`;
      }
      contain += `</div>
    <div class="footer d-flex justify-content-between align-items-center">
      <div class="d-flex gap-2">
        <a href="tel:${contacts[i].contactNum}">
          <i class="fa-solid fa-phone phoneicon rounded-3 green"></i>
        </a>`;
      if (contacts[i].contactEmail !== "") {
        contain += `<a href="mailto:${contacts[i].contactEmail}">
          <i class="fa-solid fa-envelope mailicon rounded-3 purple"></i>
        </a>`;
      }
      contain += `</div>`;
      if (contacts[i].isFavorite == true) {
        contain += ` <div class="d-flex gap-2 align-items-center">
        <button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="toggleFavourite(${i})">
          <i class="fa-solid fa-star star active rounded-3"></i> </i>
        </button>`;
      } else {
        contain += ` <div class="d-flex gap-2 align-items-center">
      <button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="toggleFavourite(${i})">
        <i class="fa-regular fa-star rounded-3 star"></i>
      </button>
    `;
      }
      if (contacts[i].isEmergency == true) {
        contain += `<button class="bg-white border-0 d-flex align-items-center justify-content-center"  onClick="toggleEmergency(${i})">
        <i class="fa-solid fa-heart-pulse rounded-3 active heart"></i>
      </button>
    `;
      } else {
        contain += `<button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="toggleEmergency(${i})">
        <i class="fa-regular fa-heart rounded-3 heart"></i>
      </button>`;
      }
      contain += `<button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="edit(${i})">
          <i class="fa-solid fa-pen rounded-3 pen"></i>
        </button>

              <button class="bg-white border-0 d-flex align-items-center justify-content-center" onClick="deleteItem(${i})">
                <i class="fa-solid fa-trash rounded-3 trash"></i>
              </button>
            </div>
            </div>

        </div>
      </div>
      `;
    }
  }
  if (contain === "") {
    noContacts.classList.replace("d-none", "d-flex");
    cardContact.innerHTML = "";
  } else {
    noContacts.classList.replace("d-flex", "d-none");
    cardContact.innerHTML = contain;
  }
}

contactName.addEventListener("input", function () {
  validateForm(this);
});
number.addEventListener("input", function () {
  validateForm(this);
});
email.addEventListener("input", function () {
  validateForm(this);
});

//validation
function validateForm(element) {
  var regex = {
    contactName: /^[A-Z]\w{1,10}$/i,
    contactNum: /^(\+2)?01(0|1|2|5)[0-9]{8}$/,
    contactEmail: /^[a-z]{1,10}@(gmail|yahoo|example)\.com$/,
  };

  if (element.id === "contactEmail") {
    if (element.value.trim() === "") {
      element.classList.remove("error");
      element.nextElementSibling.classList.replace("d-flex", "d-none");
      return;
    }
  }

  if (regex[element.id].test(element.value) == false) {
    element.classList.add("error");
    element.nextElementSibling.classList.replace("d-none", "d-flex");
  } else {
    element.classList.remove("error");
    element.nextElementSibling.classList.replace("d-flex", "d-none");
  }
}
