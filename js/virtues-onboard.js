var isServer = 1;

var mask = document.getElementById("wait-text");
var gumStream;
var rec;
var input;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
var myForm = document.getElementById("myForm");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var recordingsList = document.getElementById("recordingsList");
var swIOS9 = document.getElementById("wave");
var successMessage = document.getElementById("successMessage");
var title = document.getElementById("chronicle_title");
var recordbtn = document.getElementById("recordbtn");
var stopwatch = document.getElementById("stopwatch");
var breath_text = document.getElementById("breath-text");
var pause_text = document.getElementById("pause-text");
var social = document.getElementById("social");
var avatarPlayer = document.getElementById("avatarPlayer");
var publicField = document.getElementById("publicField");
var avatar = document.getElementById("avatar");
var url = document.location.origin;
var please_record = document.getElementById("please-record");
console.log(url);

// social.style.display = "none";
successMessage.style.display = "none";
mask.style.display = "none";

stopwatch.style.display = "none";
breath_text.style.display = "block";
pause_text.style.display = "none";

if (isServer == 1) {
  recordbtn.src = url + "/wp-content/uploads/media/anim-btn-mic-xloop.gif";
} else {
  recordbtn.src = "assets/anim-btn-mic-xloop.gif";
}

// predetive search
const search = document.getElementById("search");
const match = document.getElementById("match-list");
const limit = 10;

window.addEventListener("click", function (e) {
  if (document.getElementById("match-list").contains(e.target)) {
  } else {
    match.style.display = "none";
    publicField.style.display = "block";
  }
});
//search schools.json
const searchSchools = async (searchText) => {
  match.style.display = "block";
  publicField.style.display = "none";
  if (isServer == 1) {
    var res = await fetch(url + "/wp-content/themes/schools.json");
  } else {
    var res = await fetch("assets/schools.json");
  }
  const schools = await res.json();
  //Get matches to current text input
  let matches = schools
    .filter((school) => {
      const regex = new RegExp(`^${searchText}`, "gi");
      return school.match(regex);
    })
    .slice(0, 100);
  if (searchText.length === 0) {
    matches = [];
    match.innerHTML = "";
  }
  outputHtml(matches);
};
const outputHtml = (matches) => {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) => `
          <div class = "card card-body search-matches" onclick="setValue('${match}')">
            <p class="match-label">
                ${match}
            </p>
          </div>
        `
      )
      .join("");
    match.innerHTML = html;
  }
};
search.addEventListener("input", () => {
  searchSchools(search.value);
  match.style.display = "block";
});

function setValue(value) {
  // console.log(value);
  search.value = value;
  match.style.display = "none";
  publicField.style.display = "block";
}

//end search

// heart animation
heartAnimation = document.getElementById("heart-animation");
heartAnimation.style.display = "none";

//Record something that matters to you in the chaos
if (isServer == 1) {
  var firstlabel = document.getElementById("firstlabel");
  firstlabel.style.display = "block";
}

// timer
var sw_time = document.getElementById("sw-time");
var seconds = 0,
  minutes = 0,
  t;

function add() {
  seconds++;
  if (seconds > 59) {
    seconds = 0;
    minutes++;
    if (minutes == 5) {
      minutes = 0;
      stopRecording();
      clearTimeout(t);
      return;
    }
  }
  sw_time.textContent =
    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
    ":" +
    (seconds > 9 ? seconds : "0" + seconds);

  timer();
}
function timer() {
  t = setTimeout(add, 1000);
}
// animation
var siriWaveIOS9 = new SiriWave({
  container: swIOS9,
  color: "#fff",
  cover: true,
  height: 100,
  speed: 0.03,
  amplitude: 0.5,
  style: "ios9",
});

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

stopButton.style.display = "none";

swIOS9.style.display = "none";

function startRecording() {
  swIOS9.style.display = "block";
  stopwatch.style.display = "block";
  breath_text.style.display = "none";
  pause_text.style.display = "none";
  please_record.style.display = "none";

  while (recordingsList.firstChild) {
    recordingsList.removeChild(recordingsList.firstChild);
  }

  var constraints = { audio: true, video: false };

  recordButton.disabled = true;
  stopButton.disabled = false;

  recordButton.style.display = "none";
  stopButton.style.display = "block";

  siriWaveIOS9.start();

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      console.log(
        "getUserMedia() success, stream created, initializing Recorder.js ..."
      );

      timer();

      audioContext = new AudioContext();
      gumStream = stream;
      input = audioContext.createMediaStreamSource(stream);
      rec = new Recorder(input, { numChannels: 1 });
      rec.record();

      console.log("Recording started");
    })
    .catch(function (err) {
      recordButton.disabled = false;
      stopButton.disabled = true;
    });
}

function stopRecording() {
  stopwatch.style.display = "none";
  pause_text.style.display = "block";
  breath_text.style.display = "none";

  sw_time.textContent = "00:00";
  clearTimeout(t);
  seconds = 0;

  stopButton.disabled = true;
  recordButton.disabled = false;

  siriWaveIOS9.stop();

  recordButton.style.display = "block";
  stopButton.style.display = "none";

  rec.stop();

  gumStream.getAudioTracks()[0].stop();

  rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement("audio");
  var li = document.createElement("li");
  var link = document.createElement("a");
  var filename = new Date().toISOString();

  var myfile = document.getElementById("myfile");

  const reader = new FileReader();

  var data;

  reader.addEventListener(
    "load",
    function () {
      data = reader.result;
      myfile.value = data;
      console.log(myfile.value);
    },
    false
  );

  if (blob) {
    reader.readAsDataURL(blob);
  }

  au.src = url;
  au.controls = true;
  au.id = "recordedfile";
  au.setAttribute("name", "recordfile");
  // au.setAttribute("controlList", "nodownload");

  li.appendChild(au);

  var upload = document.createElement("a");
  upload.href = "#";
  upload.innerHTML = "Upload";
  upload.addEventListener("click", function (event) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
      if (this.readyState === 4) {
        console.log("Server returned: ", e.target.responseText);
      }
    };
    var fd = new FormData();
    fd.append("audio_data", blob, filename);
    xhr.open("POST", "upload.php", true);
    xhr.send(fd);
  });
  li.appendChild(document.createTextNode(" "));
  recordingsList.appendChild(li);
}

var submitBtn = document.getElementById("submitBtn");
function submitForm(e) {
  e.preventDefault();
  console.log("Submit!!");
  mask.style.display = "block";
  var myfile = document.getElementById("myfile").value;
  var email = document.getElementById("email").value;
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var fullName = firstName + " " + lastName;

  var schoolvalue = search.value;
  submitBtn.disabled = true;

  if (myfile.length == 0) {
    please_record.style.display = "block";
    return;
  }

  // console.log(myfile.length);
  jQuery.ajax({
    type: "POST",
    url: url + "/wp-content/themes/action_page.php",
    // url: "action_page.php",
    contentType: "application/x-www-form-urlencoded",
    data: {
      myfile: myfile,
      email: email,
      school: schoolvalue,
      url: url,
      fullname: fullName,
    },
    success: function (result) {
      mask.style.display = "none";
      myForm.style.display = "none";
      successMessage.style.display = "block";
      heartAnimation.style.display = "block";
      firstlabel.style.display = "none";
      title.style.display = "none";
      submitBtn.disabled = false;
    },
  });
}
