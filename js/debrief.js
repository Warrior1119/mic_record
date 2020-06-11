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
var recordbtn = document.getElementById("recordbtn");
var stopwatch = document.getElementById("stopwatch");
var breath_text = document.getElementById("breath-text");
var pause_text = document.getElementById("pause-text");
var social = document.getElementById("social");
var avatarPlayer = document.getElementById("avatarPlayer");
var publicField = document.getElementById("publicField");
var avatar = document.getElementById("avatar");

var url = document.location.origin;
var title = document.getElementById("debrief_title");

console.log(url);

// social.style.display = "none";
successMessage.style.display = "none";
mask.style.display = "none";

stopwatch.style.display = "none";
breath_text.style.display = "block";
pause_text.style.display = "none";

if (isServer == 1) {
  recordbtn.src = url + "/wp-content/uploads/media/gfx-soundportal.png";
} else {
  recordbtn.src = "assets/gfx-soundportal.png";
}

// audio autoplay
var isHear = false,
  isFirstAvatar = false;
var idx = 0;
var index = -1,
  firstAvatarIndex = -1;
var notes = [],
  firstAvatarData = [];

var player = document.getElementById("player");
var firstAvatarPlayer = document.getElementById("firstAvatarPlayer");

var playlist = document.getElementById("playlist");
playlist.style.display = "block";

var hearMurmers = document.getElementById("hearMurmers");
var audioControl = document.getElementById("audio-control");

var please_record = document.getElementById("please-record");
var fullname = document.getElementById("fullname");

var playallTime, firstTimeout;
fullname.style.display = "none";

var firstAvatarImg = document.getElementById("firstAvatarImg");

if (isServer == 1) {
  hearMurmers.src = url + "/wp-content/uploads/media/btn-play-voices.png";
  firstAvatarImg.src = url + "/wp-content/uploads/media/hero-erik-play.png";
} else {
  hearMurmers.src = "assets/btn-play-voices.png";
  firstAvatarImg.src = "assets/hero-erik-play.png";
}

var i = 0;
var length = 0;

jQuery('input[type="checkbox"]').click(function () {
  if (jQuery(this).prop("checked") == true) {
    console.log("true");
    fullname.style.display = "block";
    firstName.required = true;
    lastName.required = true;
  } else {
    console.log("false");
    fullname.style.display = "none";
    firstName.required = false;
    lastName.required = false;
  }
});

jQuery.ajax({
  url: url + "/wp-content/themes/load_debrief.php",
  // url: "php/load.php",
  type: "GET",
  success: function (result) {
    var data = JSON.parse(result);
    length = data.length;

    data.forEach((obj) => {
      if (obj.email == "erik@covidgilance.world") {
        if (isServer == 1) {
          firstAvatarData[i] = obj.timecapsule;
        } else {
          firstAvatarData[i] = obj.record;
        }
        i++;
      } else {
        if (isServer == 1) {
          notes[idx] = obj.timecapsule;
        } else {
          notes[idx] = obj.record;
        }
        idx++;
      }
    });

    console.log("notes", notes);
    console.log("firstAvatarData", firstAvatarData);
    //  playing in sequence
    player.addEventListener(
      "ended",
      function () {
        playNote(length, notes);
      },
      false
    );

    firstAvatarPlayer.addEventListener(
      "ended",
      function () {
        firstNote(i, firstAvatarData);
      },
      false
    );
  },
});

please_record.style.display = "none";
audioControl.style.display = "block";

function recordings() {
  isHear = !isHear;

  if (!firstAvatarPlayer.paused) {
    if (isServer == 1) {
      firstAvatarImg.src = url + "/wp-content/uploads/media/hero-erik-play.png";
    } else {
      firstAvatarImg.src = "assets/hero-erik-play.png";
    }
    isFirstAvatar = false;
    firstAvatarPlayer.autoplay = false;
    firstAvatarPlayer.pause();
  }

  if (isHear) {
    index = -1;
    playNote(index, notes);
    const playPromise = player.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        /* discard runtime error */
      });
    }
    player.autoplay = true;

    if (isServer == 1) {
      hearMurmers.src = url + "/wp-content/uploads/media/btn-pause-voices.png";
    } else {
      hearMurmers.src = "assets/btn-pause-voices.png";
    }
  } else {
    clearTimeout(playallTime);
    player.currentTime = 0;
    player.pause();
    player.autoplay = false;
    if (isServer == 1) {
      hearMurmers.src = url + "/wp-content/uploads/media/btn-play-voices.png";
    } else {
      hearMurmers.src = "assets/btn-play-voices.png";
    }
  }
}

function playNote(length, notes) {
  index++;
  if (index >= length) {
    setTimeout(function () {
      check(0);
      return;
    }, 3000);
  } else {
    var note = notes[index];
    console.log("index, note", index, note);

    var timeInterval = 0;

    if (index == 0) {
      timeInterval = 0;
    } else if (index % 3 == 2) {
      timeInterval = 10000;
    } else {
      timeInterval = 3000;
    }

    playallTime = setTimeout(function () {
      player.src = note;
    }, timeInterval);
  }

  // player.play();
}

function check(type) {
  if (type == 0) {
    index = -1;
    playNote(length, notes);
  } else {
    firstAvatarIndex = -1;
    firstNote(i, firstAvatarData);
  }
}

function ClickFirstAvatar() {
  isFirstAvatar = !isFirstAvatar;

  if (!player.paused) {
    isHear = false;
    player.autoplay = false;
    player.pause();
    if (isServer == 1) {
      hearMurmers.src = url + "/wp-content/uploads/media/btn-play-voices.png";
    } else {
      hearMurmers.src = "assets/btn-play-voices.png";
    }
  }

  console.log("isFirstAvatar: ", isFirstAvatar);
  if (isFirstAvatar) {
    firstAvatarIndex = -1;
    firstNote(i, firstAvatarData);
    const playPromise = firstAvatarPlayer.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        /* discard runtime error */
      });
    }
    firstAvatarPlayer.autoplay = true;

    if (isServer == 1) {
      firstAvatarImg.src =
        url + "/wp-content/uploads/media/hero-erik-pause.png";
    } else {
      firstAvatarImg.src = "assets/hero-erik-pause.png";
    }
  } else {
    if (isServer == 1) {
      firstAvatarImg.src = url + "/wp-content/uploads/media/hero-erik-play.png";
    } else {
      firstAvatarImg.src = "assets/hero-erik-play.png";
    }
    clearTimeout(firstTimeout);
    firstAvatarPlayer.currentTime = 0;
    firstAvatarPlayer.autoplay = false;
    firstAvatarPlayer.pause();
  }
}

function firstNote(length, notes) {
  firstAvatarIndex++;
  if (firstAvatarIndex >= length) {
    setTimeout(function () {
      check(1);
      return;
    }, 3000);
  } else {
    var note = notes[firstAvatarIndex];
    console.log("firstAvatarIndex, note", firstAvatarIndex, note);

    var timeInterval = 0;
    if (firstAvatarIndex == 0) {
      timeInterval = 0;
    } else if (firstAvatarIndex % 3 == 2) {
      timeInterval = 10000;
    } else {
      timeInterval = 3000;
    }

    firstTimeout = setTimeout(function () {
      firstAvatarPlayer.src = note;
    }, timeInterval);
  }
}
// end audio autoplay

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
    stopRecording();
    clearTimeout(t);
    return;
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

function submitForm(e) {
  e.preventDefault();
  console.log("Submit!!");
  var submitBtn = document.getElementById("submitBtn");
  var affiliation = document.getElementById("affiliation");
  var myfile = document.getElementById("myfile").value;
  var email = document.getElementById("email").value;
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var fullName = firstName + " " + lastName;

  var schoolvalue = affiliation.value;

  mask.style.display = "block";
  submitBtn.disabled = true;

  if (myfile.length == 0) {
    please_record.style.display = "block";
    return;
  }

  // console.log(myfile.length);
  jQuery.ajax({
    type: "POST",
    url: url + "/wp-content/themes/action_page_debrief.php",
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
      console.log(result);
      mask.style.display = "none";
      window.scrollTo(0, 0);
      myForm.style.display = "none";
      successMessage.style.display = "block";
      heartAnimation.style.display = "block";
      firstlabel.style.display = "none";
      title.style.display = "none";
      player.style.display = "none";
      playlist.style.display = "none";
      audioControl.style.display = "none";

      recordButton.style.display = "none";
      swIOS9.style.display = "none";

      console.log("success");

      jQuery("#share").jsSocials({
        url: `https://evermind.online/debrief-share/?email=${email}`,
        text: "Share your thoughts from the Chronicle with others.",
        showCount: false,
        showLabel: false,
        shares: ["facebook"],
      });

      social.style.display = "block";
      submitBtn.disabled = false;
    },
  });
}
