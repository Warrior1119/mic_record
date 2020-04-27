(function () {
  //

  // Siri Wave iOS9 Style curve

  function SiriWave9Curve(opt) {
    this.controller = opt.controller;
    this.definition = opt.definition;
    this.tick = 0;

    this._respawn();
  }

  SiriWave9Curve.prototype._respawn = function () {
    this.amplitude = 0.3 + Math.random() * 0.7;
    this.seed = Math.random();
    this.openClass = (2 + Math.random() * 3) | 0;
  };

  SiriWave9Curve.prototype._ypos = function (i) {
    var p = this.tick;
    var y =
      -1 *
      Math.abs(Math.sin(p)) *
      this.controller.amplitude *
      this.amplitude *
      this.controller.cache.heightMax *
      Math.pow(1 / (1 + Math.pow(this.openClass * i, 2)), 2);

    if (Math.abs(y) < 0.001) {
      this._respawn();
    }

    return y;
  };

  SiriWave9Curve.prototype._draw = function (sign) {
    var ctx = this.controller.ctx;

    this.tick +=
      this.controller.speed * (1 - 0.5 * Math.sin(this.seed * Math.PI));

    ctx.beginPath();

    var xBase =
      this.controller.cache.width2 +
      (-this.controller.cache.width4 +
        this.seed * this.controller.cache.width2);
    var yBase = this.controller.cache.height2;

    var x, y;
    var xInit = null;

    for (var i = -3; i <= 3; i += 0.01) {
      x = xBase + i * this.controller.cache.width4;
      y = yBase + (sign || 1) * this._ypos(i);

      xInit = xInit || x;

      ctx.lineTo(x, y);
    }

    var height = Math.abs(this._ypos(0));

    var gradient = ctx.createRadialGradient(
      xBase,
      yBase,
      height * 1.15,
      xBase,
      yBase,
      height * 0.3
    );
    gradient.addColorStop(0, "rgba(" + this.definition.color + ", 0.4)");
    gradient.addColorStop(1, "rgba(" + this.definition.color + ", 0.2)");
    ctx.fillStyle = gradient;

    ctx.lineTo(xInit, yBase);
    ctx.closePath();

    ctx.fill();
  };

  SiriWave9Curve.prototype.draw = function () {
    this._draw(-1);
    this._draw(1);
  };

  SiriWave9Curve.prototype.definition = [
    { color: "32,133,252" },
    { color: "94,252,169" },
    { color: "253,71,103" },
  ];

  // Standard Curve

  function SiriWaveCurve(opt) {
    this.controller = opt.controller;
    this.definition = opt.definition;
  }

  SiriWaveCurve.prototype._globAttenuationEquation = function (x) {
    if (SiriWaveCurve.prototype._globAttenuationEquation.cache[x] == null) {
      SiriWaveCurve.prototype._globAttenuationEquation.cache[x] = Math.pow(
        4 / (4 + Math.pow(x, 4)),
        4
      );
    }
    return SiriWaveCurve.prototype._globAttenuationEquation.cache[x];
  };
  SiriWaveCurve.prototype._globAttenuationEquation.cache = {};

  SiriWaveCurve.prototype._xpos = function (i) {
    return this.controller.cache.width2 + i * this.controller.cache.width4;
  };

  SiriWaveCurve.prototype._ypos = function (i) {
    var att =
      (this.controller.cache.heightMax * this.controller.amplitude) /
      this.definition.attenuation;
    return (
      this.controller.cache.height2 +
      this._globAttenuationEquation(i) *
        att *
        Math.sin(this.controller.frequency * i - this.controller.phase)
    );
  };

  SiriWaveCurve.prototype.draw = function () {
    var ctx = this.controller.ctx;

    ctx.moveTo(0, 0);
    ctx.beginPath();
    ctx.strokeStyle =
      "rgba(" + this.controller.color + "," + this.definition.opacity + ")";
    ctx.lineWidth = this.definition.lineWidth;

    for (var i = -2; i <= 2; i += 0.01) {
      var y = this._ypos(i);

      if (Math.abs(i) >= 1.9) y = this.controller.cache.height2;

      ctx.lineTo(this._xpos(i), y);
    }

    ctx.stroke();
  };

  SiriWaveCurve.prototype.definition = [
    { attenuation: -2, lineWidth: 1, opacity: 0.1 },
    { attenuation: -6, lineWidth: 1, opacity: 0.2 },
    { attenuation: 4, lineWidth: 1, opacity: 0.4 },
    { attenuation: 2, lineWidth: 1, opacity: 0.6 },
    { attenuation: 1, lineWidth: 1.5, opacity: 1 },
  ];

  // Expose API

  function SiriWave(opt) {
    opt = opt || {};

    this.phase = 0;
    this.run = false;
    this.cache = {};

    if (opt.container == null) {
      console.warn("SiriWaveJS: no container defined, using body");
      opt.container = document.body;
    }

    this.style = opt.style || "ios";

    this.container = opt.container;

    this.width =
      opt.width ||
      window.getComputedStyle(this.container).width.replace("px", "");
    this.height =
      opt.height ||
      window.getComputedStyle(this.container).height.replace("px", "");
    this.ratio = opt.ratio || window.devicePixelRatio || 1;

    this.cache.width = this.ratio * this.width;
    this.cache.height = this.ratio * this.height;
    this.cache.height2 = this.cache.height / 2;
    this.cache.width2 = this.cache.width / 2;
    this.cache.width4 = this.cache.width / 4;
    this.cache.heightMax = this.cache.height2 - 4;

    // Constructor opt

    this.amplitude = opt.amplitude == undefined ? 1 : opt.amplitude;
    this.speed = opt.speed == undefined ? 0.2 : opt.speed;
    this.frequency = opt.frequency == undefined ? 6 : opt.frequency;
    this.color = this._hex2rgb(opt.color || "#fff");

    // Interpolation

    this.speedInterpolationSpeed = opt.speedInterpolationSpeed || 0.005;
    this.amplitudeInterpolationSpeed = opt.amplitudeInterpolationSpeed || 0.05;

    this.cache.interpolation = {
      speed: this.speed,
      amplitude: this.amplitude,
    };

    // Canvas

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.cache.width;
    this.canvas.height = this.cache.height;

    if (opt.cover) {
      this.canvas.style.width = this.canvas.style.height = "100%";
    } else {
      this.canvas.style.width = this.cache.width / this.ratio + "px";
      this.canvas.style.height = this.cache.height / this.ratio + "px";
    }

    this.curves = [];

    var i = 0,
      j = 0;
    if (this.style === "ios9") {
      for (; i < SiriWave9Curve.prototype.definition.length; i++) {
        for (j = 0; (j < 3 * Math.random()) | 0; j++) {
          this.curves.push(
            new SiriWave9Curve({
              controller: this,
              definition: SiriWave9Curve.prototype.definition[i],
            })
          );
        }
      }
    } else {
      for (; i < SiriWaveCurve.prototype.definition.length; i++) {
        this.curves.push(
          new SiriWaveCurve({
            controller: this,
            definition: SiriWaveCurve.prototype.definition[i],
          })
        );
      }
    }

    // Start
    this.container.appendChild(this.canvas);
    if (opt.autostart) {
      this.start();
    }
  }

  SiriWave.prototype._hex2rgb = function (hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? parseInt(result[1], 16).toString() +
          "," +
          parseInt(result[2], 16).toString() +
          "," +
          parseInt(result[3], 16).toString()
      : null;
  };

  SiriWave.prototype._interpolate = function (propertyStr) {
    increment = this[propertyStr + "InterpolationSpeed"];

    if (
      Math.abs(this.cache.interpolation[propertyStr] - this[propertyStr]) <=
      increment
    ) {
      this[propertyStr] = this.cache.interpolation[propertyStr];
    } else {
      if (this.cache.interpolation[propertyStr] > this[propertyStr]) {
        this[propertyStr] += increment;
      } else {
        this[propertyStr] -= increment;
      }
    }
  };

  SiriWave.prototype._clear = function () {
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillRect(0, 0, this.cache.width, this.cache.height);
    this.ctx.globalCompositeOperation = "source-over";
  };

  SiriWave.prototype._draw = function () {
    for (var i = 0, len = this.curves.length; i < len; i++) {
      this.curves[i].draw();
    }
  };

  SiriWave.prototype._startDrawCycle = function () {
    if (this.run === false) return;
    this._clear();

    // Interpolate values
    this._interpolate("amplitude");
    this._interpolate("speed");

    this._draw();
    this.phase = (this.phase + Math.PI * this.speed) % (2 * Math.PI);

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this._startDrawCycle.bind(this));
    } else {
      setTimeout(this._startDrawCycle.bind(this), 20);
    }
  };

  /* API */

  SiriWave.prototype.start = function () {
    this.phase = 0;
    this.run = true;
    this._startDrawCycle();
  };

  SiriWave.prototype.stop = function () {
    this.phase = 0;
    this.run = false;
  };

  SiriWave.prototype.setSpeed = function (v, increment) {
    this.cache.interpolation.speed = v;
  };

  SiriWave.prototype.setAmplitude = function (v) {
    this.cache.interpolation.amplitude = Math.max(Math.min(v, 1), 0);
  };

  if (typeof define === "function" && define.amd) {
    define(function () {
      return SiriWave;
    });
  } else {
    window.SiriWave = SiriWave;
  }

  //
})();

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
var videoBgContainer = document.getElementById("bgVideo");

var h1 = document.getElementsByTagName("h1");
var h4 = document.getElementsByTagName("h4");
var recordbtn = document.getElementById("recordbtn");

var url = document.location.origin;
recordbtn.src = url + "/wp-content/themes/anim-btn-mic-xloop.gif";
// recordbtn.src = "assets/anim-btn-mic-xloop.gif";
// audio autoplay
var idx = 0;
var index = 0;
var notes = [];
var player = document.getElementById("player");
var playBtn = document.getElementById("playBtn");
var pauseBtn = document.getElementById("pauseBtn");
var audioControl = document.getElementById("audio-control");

playBtn.src = url + "/wp-content/themes/btn-play-murmurs.png";
pauseBtn.src = url + "/wp-content/themes/btn-pause-murmurs.png";
// playBtn.src = "assets/btn-play-murmurs.png";
// pauseBtn.src = "assets/btn-pause-murmurs.png";

audioControl.style.display = "block";

playBtn.style.display = "block";
pauseBtn.style.display = "none";

playBtn.addEventListener("click", playRecordings);
pauseBtn.addEventListener("click", pauseRecordings);

function playRecordings() {
  player.play();
  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
}

function pauseRecordings() {
  player.pause();
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
}

jQuery.ajax({
  url: url + "/wp-content/themes/load.php",
  // url: "load.php",
  type: "GET",
  success: function (result) {
    var data = JSON.parse(result);
    var length = data.length;
    data.forEach((obj) => {
      // console.log(obj);
      notes[idx] = obj.record;
      idx++;
    });

    //  playing in sequence
    console.log("notes.....", notes);
    console.log("length......", length);
    player.addEventListener(
      "ended",
      function () {
        playNote(length, notes);
      },
      false
    );
    playNote(length, notes);
  },
});

function playNote(length, notes) {
  console.log("playNote function......");
  console.log(length, notes);
  if (index >= length) {
    stop();
    return;
  }
  var note = notes[index];
  if (!note) {
    stop();
    return;
  }
  index++;
  player.src = note;
  // player.play();
}

function stop() {
  player.removeEventListener("ended", playNote);
}
// end audio autoplay

// predetive search
console.log("abc");
const search = document.getElementById("search");
const match = document.getElementById("match-list");
const limit = 10;
//search schools.json
const searchSchools = async (searchText) => {
  match.style.display = "block";
  const res = await fetch(url + "/wp-content/themes/schools.json");
  // const res = await fetch("schools.json");
  const schools = await res.json();
  //Get matches to current text input
  let matches = schools
    .filter((school) => {
      const regex = new RegExp(`^${searchText}`, "gi");
      return school.match(regex);
    })
    .slice(0, 10);
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
            <div class = "card card-body mb-1" onclick="setValue('${match}')">
                <h4 style="color: black">
                    ${match}
                </h4>
            </div>
        `
      )
      .join("");
    match.innerHTML = html;
  }
};
search.addEventListener("input", () => searchSchools(search.value));

function setValue(value) {
  console.log(value);
  search.value = value;
  match.style.display = "none";
}

//end search

var sucessVideo = document.getElementById("sucessVideo");
var sourceTag = document.createElement("source");
sourceTag.setAttribute(
  "src",
  url + "/wp-content/themes/salient/video/evermind-chronicle-anim-heart.mp4"
  // "evermind-chronicle-anim-heart.mp4"
);
console.log("src........", sourceTag.src);
sucessVideo.appendChild(sourceTag);
sucessVideo.play();

successMessage.style.display = "none";
videoBgContainer.style.display = "none";
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
  //   autostart: isRunning9,
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

function startRecording() {
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

  // var file = new File([blob], filename);
  // console.log(file);
  const reader = new FileReader();

  var data;

  reader.addEventListener(
    "load",
    function () {
      data = reader.result;
      // console.log(data);
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

  link.href = url;
  link.download = filename + ".wav";
  link.innerHTML = "Save to disk";

  li.appendChild(au);

  //   li.appendChild(document.createTextNode(filename + ".wav "));

  //   li.appendChild(link);

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
  //   li.appendChild(upload);

  recordingsList.appendChild(li);
}

function submitForm(e) {
  e.preventDefault();
  console.log("Submit!!");
  var myfile = document.getElementById("myfile").value;
  var email = document.getElementById("email").value;
  var schoolvalue = search.value;

  var xhr = new XMLHttpRequest();
  // var fd = new FormData();
  // fd.append(myfile, email, school);
  // xhr.send(fd);

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
    },
    success: function (result) {
      myForm.style.display = "none";
      successMessage.style.display = "block";
      videoBgContainer.style.display = "block";
      player.style.display = "none";
      h1[0].style.display = "none";
      h4[0].style.display = "none";
      audioControl.style.display = "none";
      console.log("success");
    },
  });
}
