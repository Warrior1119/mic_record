var isServer = 1;
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
// var publicField = document.getElementById("publicField");

// social.style.display = "none";
successMessage.style.display = "none";

stopwatch.style.display = "none";
breath_text.style.display = "block";
pause_text.style.display = "none";

if (isServer == 1 ) {
  recordbtn.src = url + "/wp-content/uploads/media/anim-btn-mic-xloop.gif"; 
} else {
  recordbtn.src = "assets/anim-btn-mic-xloop.gif";
}


var isEmily = false, isDachelle = false, isSteven = false, isHear = false;
// audio autoplay
var idx = 0;
var index = 0, indexOfemily = 0, indexOfdacheele = 0, indexOfsteven = 0;
var notes = [];
var emilyData = [], dachelleData=[], stevenData=[];

var player = document.getElementById("player");
var emilyPlayer = document.getElementById("emilyPlayer");
var dachellePlayer = document.getElementById("dachellePlayer");
var stevenPlayer = document.getElementById("stevenPlayer");

var hearMurmers = document.getElementById("hearMurmers");
var audioControl = document.getElementById("audio-control");

var please_record = document.getElementById("please-record");
// var fullname = document.getElementById("fullname");
var list = {
  playback: []
};

// fullname.style.display = "none";

var emilyAvatar = document.getElementById("emilyAvatar");
var dachelleAvatar = document.getElementById("dachelleAvatar");
var stevenAvatar = document.getElementById("stevenAvatar");


if (isServer == 1) {
  hearMurmers.src = url + "/wp-content/uploads/media/btn-play-murmurs.png";
  emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily.png";
  dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle.png";
  stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven.png";
} else {
  hearMurmers.src = "assets/btn-play-murmurs.png";
  emilyAvatar.src = "assets/avatar-emily.png";
  dachelleAvatar.src = "assets/avatar-dachelle.png";
  stevenAvatar.src = "assets/avatar-steven.png";
}


var i = 0, j = 0, k = 0;
var length = 0;
jQuery.ajax({
  // url: url + "/wp-content/themes/load.php",
  url: "php/load.php",
  type: "GET",
  success: function (result) {
    var data = JSON.parse(result);
    length = data.length;
        
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
    console.log("notes", notes);
    console.log("emilyData", emilyData);
    console.log("dachelleData",dachelleData)
    console.log("stevenData", stevenData);

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


please_record.style.display = "none";
audioControl.style.display = "block";

// playBtn.style.display = "block";
// pauseBtn.style.display = "none";

// playBtn.addEventListener("click", playRecordings);
// pauseBtn.addEventListener("click", pauseRecordings);

function recordings() {
  if (!emilyPlayer.paused) {
    if (isServer == 1) {
      emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily.png";
    } else {
      emilyAvatar.src = "assets/avatar-emily.png";
    }
    emilyPlayer.autoplay = false;
    emilyPlayer.pause();    
  }
  if (!dachellePlayer.paused) {
    dachellePlayer.pause();
    if (isServer == 1) {
      dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      dachelleAvatar.src = "assets/avatar-dachelle.png";
    }
    dachellePlayer.autoplay = false;
  }

  if (!stevenPlayer.paused) {
    stevenPlayer.pause();
    stevenPlayer.autoplay = false;
    if (isServer == 1) {
      stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven.png";
    } else {
      stevenAvatar.src = "assets/avatar-steven.png";
    }
  }
  isHear = !isHear;
  if (isHear) {
    index = 0;
    playNote(length, notes);
    player.play();
    player.autoplay = true;
    if (isServer == 1) {
      hearMurmers.src = url + "/wp-content/uploads/media/btn-pause-murmurs.png";
    } else {

    }
  } else {

  }
}

function pauseRecordings() {
  playNote(0, notes);
  player.currentTime = 0;
  player.pause();
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
}

// jQuery('input[type="checkbox"]').click(function(){
//   if(jQuery(this).prop("checked") == true){
//     console.log("true");
//     // fullname.style.display = "block";
//     firstName.required = true;
//     lastName.required = true;
//   } else {
//     console.log("false");
//     // fullname.style.display = "none";
//     firstName.required = false;
//     lastName.required = false;
//   }
// });

function playNote(length, notes) {
  console.log("index", index);
  if (index >= length) {
    setTimeout(function(){check(0);}, 3000);
  }
  console.log(index);
  var note = notes[index];
  console.log("note", note);
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
  if (!player.paused) {
    pauseRecordings();
  }
  if (!dachellePlayer.paused) {
    dachellePlayer.pause();
    if (isServer == 1) {
      dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      dachelleAvatar.src = "assets/avatar-dachelle.png";
    }
    dachellePlayer.autoplay = false;
  }
  if (!stevenPlayer.paused) {
    stevenPlayer.pause();
    stevenPlayer.autoplay = false;
    if (isServer == 1) {
      stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven.png";
    } else {
      stevenAvatar.src = "assets/avatar-steven.png";
    }
  }

  isEmily = !isEmily;
  console.log("emily: ", isEmily);
  if (isEmily) {
    indexOfemily = 0;
    emilyNote(i, emilyData);
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

function check(type) {
  if (type == 0) {
    index = 0;
    playNote(length, notes);
  } else if (type == 1){
    indexOfemily = 0;
    emilyNote(i, emilyData);
  } else if (type == 2) {
    indexOfdacheele = 0;
    dachelleNote(j, dachelleData);
  } else {
    indexOfsteven = 0;
    stevenNote(k, stevenData);
  }
}

function emilyNote(length, notes) {
  if (indexOfemily >= length) {
    console.log('1');
    setTimeout(function(){check(1);}, 3000);
  }

  var note = notes[indexOfemily];

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

}

function dachelle() {
  if (!player.paused) {
    pauseRecordings();
  }
  if (!emilyPlayer.paused) {
    if (isServer == 1) {
      emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily.png";
    } else {
      emilyAvatar.src = "assets/avatar-emily.png";
    }
    emilyPlayer.autoplay = false;
    emilyPlayer.pause();    
  }
  if (!stevenPlayer.paused) {
    stevenPlayer.pause();
    stevenPlayer.autoplay = false;
    if (isServer == 1) {
      stevenAvatar.src = url + "/wp-content/uploads/media/avatar-steven.png";
    } else {
      stevenAvatar.src = "assets/avatar-steven.png";
    }
  }
  isDachelle = !isDachelle;
  console.log("dachelle: ", isDachelle);
  if (isDachelle) {
    indexOfdacheele = 0;
    dachelleNote(j, dachelleData);
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
  if (indexOfdacheele >= length) {
    setTimeout(function(){check(2);}, 3000);
  }
  var note = notes[indexOfdacheele];

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

}


function steven() {
  if (!player.paused) {
    pauseRecordings();
  }
  if (!emilyPlayer.paused) {
    if (isServer == 1) {
      emilyAvatar.src = url + "/wp-content/uploads/media/avatar-emily.png";
    } else {
      emilyAvatar.src = "assets/avatar-emily.png";
    }
    emilyPlayer.autoplay = false;
    emilyPlayer.pause();    
  }
  if (!dachellePlayer.paused) {
    dachellePlayer.pause();
    if (isServer == 1) {
      dachelleAvatar.src = url + "/wp-content/uploads/media/avatar-dachelle.png";
    } else {
      dachelleAvatar.src = "assets/avatar-dachelle.png";
    }
    dachellePlayer.autoplay = false;
  }
  
  isSteven = !isSteven;
  if (isSteven) {
    indexOfsteven = 0;
    stevenNote(j, dachelleData);
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
    setTimeout(function(){check(3);}, 3000);
  }
  var note = notes[indexOfsteven];

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
var submitBtn = document.getElementById("submitBtn");
const search = document.getElementById("search");
const match = document.getElementById("match-list");
const limit = 10;

window.addEventListener('click', function(e) {
  if (document.getElementById('match-list').contains(e.target)) {

  } else {
    match.style.display = "none";
    // publicField.style.display = "block";
    submitBtn.style.display = "block";
  }
});
//search schools.json
const searchSchools = async (searchText) => {
  match.style.display = "block";
  // publicField.style.display = "none";
  submitBtn.style.display = "none";    //chronic-virtus
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
  // publicField.style.display = "block";
  submitBtn.style.display = "block";
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


function submitForm(e) {
  e.preventDefault();
  console.log("Submit!!");
  var myfile = document.getElementById("myfile").value;
  var email = document.getElementById("email").value;
  // var firstName = document.getElementById("firstName").value;
  // var lastName = document.getElementById("lastName").value;
  // var fullName = firstName + " " + lastName;

  var fullName = "";
  var schoolvalue = search.value;

  if (myfile.length == 0) {
    please_record.style.display = "block";
    return;
  }

  // console.log(myfile.length);

  console.log("url...", url);

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
      fullname: fullName
    },
    success: function (result) {
      console.log(result);
      myForm.style.display = "none";
      successMessage.style.display = "block";
      heartAnimation.style.display = "block";
      firstlabel.style.display = "none";
      title.style.display = "none";
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
