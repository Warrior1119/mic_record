var isServer = 0;
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

var first_avatar = document.getElementById("first-avatar");
var url = document.location.origin;

var social = document.getElementById("social");
var avatarPlayer = document.getElementById("avatarPlayer");

social.style.display = "none";
successMessage.style.display = "none";

stopwatch.style.display = "none";
breath_text.style.display = "block";
pause_text.style.display = "none";

if (isServer == 1 ) {
  recordbtn.src = url + "/wp-content/uploads/media/anim-btn-mic-xloop.gif"; 
} else {
  recordbtn.src = "assets/anim-btn-mic-xloop.gif";
}


var isEmily = false, isDachelle = false, isSteven = false;
// audio autoplay
var idx = 0;
var index = 0, indexOfemily = 0, indexOfdacheele = 0, indexOfsteven = 0;
var notes = [];
var emilyData = [], dachelleData=[], stevenData=[];
var player = document.getElementById("player");
var playBtn = document.getElementById("playBtn");
var pauseBtn = document.getElementById("pauseBtn");
var audioControl = document.getElementById("audio-control");

var please_record = document.getElementById("please-record");
var fullname = document.getElementById("fullname");
var list = {
  playback: []
};

fullname.style.display = "none";

var emilyAvatar = document.getElementById("emilyAvatar");
var dachelleAvatar = document.getElementById("dachelleAvatar");
var stevenAvatar = document.getElementById("stevenAvatar");


if (isServer == 1) {
  emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily.png";
  dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle.png"
  stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven.png"
} else {
  emilyAvatar.src = "assets/avatar-emily.png";
  dachelleAvatar.src = "assets/avatar-dachelle.png"
  stevenAvatar.src = "assets/avatar-steven.png"
}



please_record.style.display = "none";

if (isServer == 1) {
  playBtn.src = url + "/wp-content/uploads/media/btn-play-murmurs.png";
  pauseBtn.src = url + "/wp-content/uploads/media/btn-pause-murmurs.png";
} else {
  playBtn.src = "assets/btn-play-murmurs.png";
  pauseBtn.src = "assets/btn-pause-murmurs.png";
}

audioControl.style.display = "block";

playBtn.style.display = "block";
pauseBtn.style.display = "none";

playBtn.addEventListener("click", playRecordings);
pauseBtn.addEventListener("click", pauseRecordings);

function playRecordings() {
  // var playPromise = player.play();
  player.play();
  player.autoplay = true;
  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
}

function pauseRecordings() {
  player.pause();
  playNote(0, notes);
  player.currentTime = 0;
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
}

jQuery('input[type="checkbox"]').click(function(){
  if(jQuery(this).prop("checked") == true){
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

var i = 0, j = 0, k = 0;

jQuery.ajax({
  // url: url + "/wp-content/themes/load.php",
  url: "php/load.php",
  type: "GET",
  success: function (result) {
    var data = JSON.parse(result);
    var length = data.length;
    console.log(data);
    
    data.forEach((obj) => {
      if (isServer == 1) {
        notes[idx] = obj.timecapsule;
      } else {
        notes[idx] = obj.record;
      }
      idx++;
      if ((obj.email == "warriorjhs@outlook.com")) {
        if (isServer == 1) {
          emilyData[i] = obj.timecapsule;
        } else {
          emilyData[i] = obj.record;
        }
        i++;
      }
      if ((obj.email == "hi@ivymahsciao.com")) {
        if (isServer == 1) {
          dachelleData[j] = obj.timecapsule;
        } else {
          dachelleData[j] = obj.record;
        }
        j++;
      }
      if ((obj.email == "tjeng831@berkeley.edu")) {
        if (isServer == 1) {
          stevenData[k] = obj.timecapsule;
        } else {
          stevenData[k] = obj.record;
        }
        k++;
      }
    });
    console.log(stevenData);
    console.log(notes);

    //  playing in sequence
    player.addEventListener(
      "ended",
      function () {
        playNote(length, notes);
      },
      false
    );
    playNote(length, notes);


    // avatar
    emilyPlayer.addEventListener(
      "ended",
      function () {
        emilyNote(i, emilyData);
      },
      false
    );
    emilyNote(i, emilyData);

    dachellePlayer.addEventListener(
      "ended",
      function () {
        dachelleNote(j, dachelleData);
      },
      false
    );
    dachelleNote(j, dachelleData);

    stevenPlayer.addEventListener(
      "ended",
      function () {
        stevenNote(k, stevenData);
      },
      false
    );
    stevenNote(k, stevenData);
  },
});


function playNote(length, notes) {
  // console.log(length, notes);
  if (index >= length) {
    player.pause();
    return;
  }
  var note = notes[index];
  if (!note) {
    return;
  }

  index++;

  var timeInterval = 0;

  if (index == 1) {
    timeInterval = 0;
  } else if (index % 3 == 1) {
    timeInterval = 10000;
  } else {
    timeInterval = 3000;
  }

  setTimeout(function () {
    player.src = note;
  }, timeInterval);

  // player.play();
}


function emily() {
  isEmily = !isEmily;
  console.log("emily: ", isEmily);
  if (isEmily) {
    emilyPlayer.play();
    if (isServer == 1) {
      emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily-pause.png";
    } else {
      emilyAvatar.src = "assets/avatar-emily-pause.png";
    }
    emilyPlayer.autoplay = true;
  } else {
    if (isServer == 1) {
      emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily.png";
    } else {
      emilyAvatar.src = "assets/avatar-emily.png";
    }
    emilyPlayer.autoplay = false;
    emilyPlayer.pause();
  }
}

function emilyNote(length, notes) {
  // console.log(length, notes);
  if (indexOfemily >= length) {
    isEmily = false;
    emilyPlayer.pause();
    if (isServer == 1) {
      emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily.png";
    } else {
      emilyAvatar.src = "assets/avatar-emily.png";
    }
    return;
  }
  var note = notes[indexOfemily];
  if (!note) {
    isEmily = false;
    emilyPlayer.pause();
    if (isServer == 1) {
      emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily.png";
    } else {
      emilyAvatar.src = "assets/avatar-emily.png";
    }
    return;
  }

  indexOfemily++;

  var timeInterval = 0;

  if (indexOfemily == 1) {
    timeInterval = 0;
  } else if (indexOfemily % 3 == 1) {
    timeInterval = 10000;
  } else {
    timeInterval = 3000;
  }

  setTimeout(function () {
    emilyPlayer.src = note;
  }, timeInterval);

  // player.play();
}

function dachelle() {
  isDachelle = !isDachelle;
  console.log("dachelle");
  if (isDachelle) {
    dachellePlayer.play();
    dachellePlayer.autoplay = true;
    if (isServer == 1) {
      dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle-pause.png";
    } else {
      dachelleAvatar.src = "assets/avatar-dachelle-pause.png";
    }
  } else {
    dachellePlayer.pause();
    if (isServer == 1) {
      dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      dachelleAvatar.src = "assets/avatar-dachelle.png";
    }
    dachellePlayer.autoplay = false;
  }
}

function dachelleNote(length, notes) {
  // console.log(length, notes);
  if (indexOfdacheele >= length) {
    isDachelle = false;
    dachellePlayer.pause();
    if (isServer == 1) {
      dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      dachelleAvatar.src = "assets/avatar-dachelle.png";
    }
    return;
  }
  var note = notes[indexOfdacheele];
  if (!note) {
    isDachelle = false;
    if (isServer == 1) {
      dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      dachelleAvatar.src = "assets/avatar-dachelle.png";
    }
    return;
  }

  indexOfdacheele++;

  var timeInterval = 0;

  if (indexOfdacheele == 1) {
    timeInterval = 0;
  } else if (indexOfdacheele % 3 == 1) {
    timeInterval = 10000;
  } else {
    timeInterval = 3000;
  }

  setTimeout(function () {
    dachellePlayer.src = note;
  }, timeInterval);

  // player.play();
}


function steven() {
  isSteven = !isSteven;
  if (isSteven) {
    stevenPlayer.play();
    stevenPlayer.autoplay = true;
    if (isServer == 1) {
      stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven-pause.png";
    } else {
      stevenAvatar.src = "assets/avatar-steven-pause.png";
    }
  } else {
    stevenPlayer.pause();
    stevenPlayer.autoplay = false;
    if (isServer == 1) {
      stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven.png";
    } else {
      stevenAvatar.src = "assets/avatar-steven.png";
    }
  }
}

function stevenNote(length, notes) {
  if (indexOfsteven >= length) {
    isSteven = false;
    stevenPlayer.pause();
    if (isServer == 1) {
      stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven-pause.png";
    } else {
      stevenAvatar.src = "assets/avatar-steven.png";
    }
    return;
  }
  var note = notes[indexOfsteven];
  if (!note) {
    isSteven = false;
    if (isServer == 1) {
      stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven-pause.png";
    } else {
      stevenAvatar.src = "assets/avatar-steven.png";
    }
    return;
  }

  indexOfsteven++;

  var timeInterval = 0;

  if (indexOfsteven == 1) {
    timeInterval = 0;
  } else if (indexOfsteven % 3 == 1) {
    timeInterval = 10000;
  } else {
    timeInterval = 3000;
  }

  setTimeout(function () {
    stevenPlayer.src = note;
  }, timeInterval);
}
// end audio autoplay

// predetive search
const search = document.getElementById("search");
const match = document.getElementById("match-list");
const limit = 10;
//search schools.json
const searchSchools = async (searchText) => {
  match.style.display = "block";
  if (isServer == 1) {
    const res = await fetch(url + "/wp-content/themes/schools.json");
  } else {
    const res = await fetch("assets/schools.json");
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
  if (seconds > 30) {
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

  au.controls = true;
  au.src = url;

  au.id = "recordedfile";
  au.setAttribute("name", "recordfile");
  au.setAttribute("controlList", "nodownload");

  link.href = url;
  link.download = filename + ".wav";
  link.innerHTML = "Save to disk";

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
  var myfile = document.getElementById("myfile").value;
  var email = document.getElementById("email").value;
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var fullName = firstName + " " + lastName;

  var schoolvalue = search.value;

  if (myfile.length == 0) {
    please_record.style.display = "block";
    return;
  }

  console.log(myfile.length);

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
      fullname: fullName
    },
    success: function (result) {
      console.log(result);
      myForm.style.display = "none";
      successMessage.style.display = "block";
      heartAnimation.style.display = "block";
      // firstlabel.style.display = "none";
      // title.style.display = "none";
      player.style.display = "none";
      audioControl.style.display = "none";
      first_avatar.style.display = "none";

      console.log("success");

      jQuery("#share").jsSocials({
        url: result,
        text: "Share your thoughts from the Chronicle with others.",
        showCount: false,
        showLabel: false,
        shares: ["facebook"],
      });

      social.style.display = "block";
    },
  });
}
