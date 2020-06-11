var isServer = 0;

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

// audio autoplay
var isFirstAvatar = false,
  isSecondAvatar = false,
  isThirdAvatar = false,
  isHear = false;
var idx = 0;
var index = -1,
  firstAvatarIndex = -1,
  secondAvatarIndex = -1,
  thirdAvatarIndex = -1;
var notes = [];
var firstAvatarData = [],
  secondAvatarData = [],
  thirdAvatarData = [];

var player = document.getElementById("player");
var firstAvatarPlayer = document.getElementById("firstAvatarPlayer");
var secondAvatarPlayer = document.getElementById("secondAvatarPlayer");
var thirdAvatarPlayer = document.getElementById("thirdAvatarPlayer");

var hearMurmers = document.getElementById("hearMurmers");
var audioControl = document.getElementById("audio-control");

var please_record = document.getElementById("please-record");
var fullname = document.getElementById("fullname");
var list = {
  playback: [],
};

var playallTime, firstTimeout, secondTimeout, thirdTimeout;
fullname.style.display = "none";

var firstAvatarImg = document.getElementById("firstAvatarImg");
var secondAvatarImg = document.getElementById("secondAvatarImg");
var thirdAvatarImg = document.getElementById("thirdAvatarImg");

if (isServer == 1) {
  hearMurmers.src = url + "/wp-content/uploads/media/btn-play-voices.png";
  firstAvatarImg.src = url + "/wp-content/uploads/media/avatar-emily-temp.png";
  secondAvatarImg.src = url + "/wp-content/uploads/media/avatar-dachelle.png";
  thirdAvatarImg.src = url + "/wp-content/uploads/media/avatar-richard.png";
} else {
  hearMurmers.src = "assets/btn-play-voices.png";
  firstAvatarImg.src = "assets/avatar-emily-temp.png";
  secondAvatarImg.src = "assets/avatar-dachelle.png";
  thirdAvatarImg.src = "assets/avatar-richard.png";
}

var i = 0,
  j = 0,
  k = 0;
var length = 0;
var tmpIndex = -1;

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
  // url: url + "/wp-content/themes/load.php",
  url: "php/load.php",
  type: "GET",
  success: function (result) {
    var data = JSON.parse(result);
    length = data.length;

    data.forEach((obj) => {
      if (obj.email == "emilyjbach@gmail.com") {
        if (isServer == 1) {
          firstAvatarData[i] = obj.timecapsule;
        } else {
          firstAvatarData[i] = obj.record;
        }
        i++;
      } else if (obj.email == "dachelledainn@gmail.com") {
        if (isServer == 1) {
          secondAvatarData[j] = obj.timecapsule;
        } else {
          secondAvatarData[j] = obj.record;
        }
        j++;
      } else if (obj.email == "richardyhz@gmail.com") {
        if (isServer == 1) {
          thirdAvatarData[k] = obj.timecapsule;
        } else {
          thirdAvatarData[k] = obj.record;
        }
        k++;
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
    console.log("secondAvatarData", secondAvatarData);
    console.log("thirdAvatarData", thirdAvatarData);

    //  playing in sequence
    player.addEventListener(
      "ended",
      function () {
        playNote(length, notes);
      },
      false
    );

    // avatar
    firstAvatarPlayer.addEventListener(
      "ended",
      function () {
        firstNote(i, firstAvatarData);
      },
      false
    );

    secondAvatarPlayer.addEventListener(
      "ended",
      function () {
        secondNote(j, secondAvatarData);
      },
      false
    );

    thirdAvatarPlayer.addEventListener(
      "ended",
      function () {
        thirdNote(k, thirdAvatarData);
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
      firstAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-emily-temp.png";
    } else {
      firstAvatarImg.src = "assets/avatar-emily-temp.png";
    }
    isFirstAvatar = false;
    firstAvatarPlayer.autoplay = false;
    firstAvatarPlayer.pause();
  }
  if (!secondAvatarPlayer.paused) {
    isSecondAvatar = false;
    secondAvatarPlayer.pause();
    if (isServer == 1) {
      secondAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      secondAvatarImg.src = "assets/avatar-dachelle.png";
    }
    secondAvatarPlayer.autoplay = false;
  }

  if (!thirdAvatarPlayer.paused) {
    isThirdAvatar = false;
    thirdAvatarPlayer.pause();
    thirdAvatarPlayer.autoplay = false;
    if (isServer == 1) {
      thirdAvatarImg.src = url + "/wp-content/uploads/media/avatar-richard.png";
    } else {
      thirdAvatarImg.src = "assets/avatar-richard.png";
    }
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
  if (!secondAvatarPlayer.paused) {
    isSecondAvatar = false;
    secondAvatarPlayer.pause();
    if (isServer == 1) {
      secondAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      secondAvatarImg.src = "assets/avatar-dachelle.png";
    }
    secondAvatarPlayer.autoplay = false;
  }
  if (!thirdAvatarPlayer.paused) {
    isThirdAvatar = false;
    thirdAvatarPlayer.pause();
    thirdAvatarPlayer.autoplay = false;
    if (isServer == 1) {
      thirdAvatarImg.src = url + "/wp-content/uploads/media/avatar-richard.png";
    } else {
      thirdAvatarImg.src = "assets/avatar-richard.png";
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
        url + "/wp-content/uploads/media/avatar-emily-pause.png";
    } else {
      firstAvatarImg.src = "assets/avatar-emily-pause.png";
    }
  } else {
    if (isServer == 1) {
      firstAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-emily-temp.png";
    } else {
      firstAvatarImg.src = "assets/avatar-emily-temp.png";
    }
    clearTimeout(firstTimeout);
    firstAvatarPlayer.currentTime = 0;
    firstAvatarPlayer.autoplay = false;
    firstAvatarPlayer.pause();
  }
}

function check(type) {
  if (type == 0) {
    index = -1;
    playNote(length, notes);
  } else if (type == 1) {
    firstAvatarIndex = -1;
    firstNote(i, firstAvatarData);
  } else if (type == 2) {
    secondAvatarIndex = -1;
    secondNote(j, secondAvatarData);
  } else {
    thirdAvatarIndex = -1;
    thirdNote(k, thirdAvatarData);
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

function ClickSecondAvatar() {
  isSecondAvatar = !isSecondAvatar;

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
  if (!firstAvatarPlayer.paused) {
    if (isServer == 1) {
      firstAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-emily-temp.png";
    } else {
      firstAvatarImg.src = "assets/avatar-emily-temp.png";
    }
    isFirstAvatar = false;
    firstAvatarPlayer.autoplay = false;
    firstAvatarPlayer.pause();
  }
  if (!thirdAvatarPlayer.paused) {
    isThirdAvatar = false;
    thirdAvatarPlayer.pause();
    thirdAvatarPlayer.autoplay = false;
    if (isServer == 1) {
      thirdAvatarImg.src = url + "/wp-content/uploads/media/avatar-richard.png";
    } else {
      thirdAvatarImg.src = "assets/avatar-richard.png";
    }
  }
  console.log("isSecondAvatar: ", isSecondAvatar);
  if (isSecondAvatar) {
    secondAvatarIndex = -1;
    secondNote(j, secondAvatarData);
    const playPromise = secondAvatarPlayer.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        /* discard runtime error */
      });
    }
    secondAvatarPlayer.autoplay = true;

    if (isServer == 1) {
      secondAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-dachelle-pause.png";
    } else {
      secondAvatarImg.src = "assets/avatar-dachelle-pause.png";
    }
  } else {
    clearTimeout(secondTimeout);
    secondAvatarPlayer.currentTime = 0;
    secondAvatarPlayer.pause();
    if (isServer == 1) {
      secondAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      secondAvatarImg.src = "assets/avatar-dachelle.png";
    }
    secondAvatarPlayer.autoplay = false;
  }
}

function secondNote(length, notes) {
  secondAvatarIndex++;

  if (secondAvatarIndex >= length) {
    setTimeout(function () {
      check(2);
      return;
    }, 3000);
  } else {
    var note = notes[secondAvatarIndex];
    console.log("secondAvatarIndex, note: ", secondAvatarIndex, note);
    var timeInterval = 0;

    if (secondAvatarIndex == 0) {
      timeInterval = 0;
    } else if (secondAvatarIndex % 3 == 2) {
      timeInterval = 10000;
    } else {
      timeInterval = 3000;
    }

    secondTimeout = setTimeout(function () {
      secondAvatarPlayer.src = note;
    }, timeInterval);
  }
}

function ClickThirdAvatar() {
  isThirdAvatar = !isThirdAvatar;

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
  if (!firstAvatarPlayer.paused) {
    if (isServer == 1) {
      firstAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-emily-temp.png";
    } else {
      firstAvatarImg.src = "assets/avatar-emily-temp.png";
    }
    isFirstAvatar = false;
    firstAvatarPlayer.autoplay = false;
    firstAvatarPlayer.pause();
  }
  if (!secondAvatarPlayer.paused) {
    isFirstAvatar = false;
    secondAvatarPlayer.pause();
    if (isServer == 1) {
      secondAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      secondAvatarImg.src = "assets/avatar-dachelle.png";
    }
    secondAvatarPlayer.autoplay = false;
  }

  if (isThirdAvatar) {
    thirdAvatarIndex = -1;
    thirdNote(k, thirdAvatarData);
    const playPromise = thirdAvatarPlayer.play();

    if (playPromise !== null) {
      playPromise.catch(() => {
        /* discard runtime error */
      });
    }

    thirdAvatarPlayer.autoplay = true;

    if (isServer == 1) {
      thirdAvatarImg.src =
        url + "/wp-content/uploads/media/avatar-richard-pause.png";
    } else {
      thirdAvatarImg.src = "assets/avatar-richard-pause.png";
    }
  } else {
    clearTimeout(thirdTimeout);
    thirdAvatarPlayer.currentTime = 0;
    thirdAvatarPlayer.pause();
    thirdAvatarPlayer.autoplay = false;
    if (isServer == 1) {
      thirdAvatarImg.src = url + "/wp-content/uploads/media/avatar-richard.png";
    } else {
      thirdAvatarImg.src = "assets/avatar-richard.png";
    }
  }
}

function thirdNote(length, notes) {
  thirdAvatarIndex++;

  if (thirdAvatarIndex >= length) {
    setTimeout(function () {
      check(3);
      return;
    }, 3000);
  } else {
    var note = notes[thirdAvatarIndex];
    console.log("thirdAvatarIndex, note", thirdAvatarIndex, note);
    var timeInterval = 0;

    if (thirdAvatarIndex == 0) {
      timeInterval = 0;
    } else if (thirdAvatarIndex % 3 == 2) {
      timeInterval = 10000;
    } else {
      timeInterval = 3000;
    }

    thirdTimeout = setTimeout(function () {
      thirdAvatarPlayer.src = note;
    }, timeInterval);
  }
}
// end audio autoplay

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
    // url: url + "/wp-content/themes/action_page.php",
    url: "action_page.php",
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
      // firstlabel.style.display = "none";
      // title.style.display = "none";
      player.style.display = "none";
      audioControl.style.display = "none";
      avatar.style.display = "none";

      jQuery("#share").jsSocials({
        url: `https://evermind.online/chronicle-share/?email=${email}`,
        text: "Share your thoughts from the Chronicle with others.",
        showCount: false,
        showLabel: false,
        shares: ["facebook"],
      });

      social.style.display = "block";
      submitBtn.disabled = false;

      jQuery.ajax({
        type: "POST",
        // url: url + "/wp-content/themes/campaign.php",
        url: "php/campaign.php",
        contentType: "application/x-www-form-urlencoded",
        data: {
          email: email,
          fullname: fullName,
        },
        success: function (result) {
          console.log(result);
        },
      });
    },
  });
}
