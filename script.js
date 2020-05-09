function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function setCookie(value, expiredays) {
  var exdate = new Date();
  var expireDate = new Date();
  expireDate.setFullYear(expireDate.getFullYear() + 1);
  document.cookie =
    "Score=" + value + "expires=" + expireDate.toGMTString() + ";";
}

function getCookie(c_name) {
  var search_cookie = c_name + "=";
  if (document.cookie.length > 0) {
    // Search for a cookie.
    var offset = document.cookie.indexOf(search_cookie);
    if (offset != -1) {
      offset += search_cookie.length;
      // set index of beginning of value
      var end = document.cookie.indexOf(";", offset);
      if (end == -1) {
        end = document.cookie.length;
      }
      return decodeURIComponent(document.cookie.substring(offset, end));
    }
  } else {
    return "";
  }
}

var storedscore = getCookie("Score");
var record = 0;
if (storedscore !== null && storedscore !== "") {
  record = parseInt(storedscore, 10);
}
var score = 0;
var pause = false;
var extra_speed = 0;
const canvas = document.getElementById("canvas");
const screen = document.getElementById("touchscreen");
canvas.style["background-color"] = "#393a40";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
context.fillStyle = "#393a40";
context.fillRect(0, 0, canvas.width, canvas.height);
const size = Math.round(canvas.height / 40);
const xEnd = Math.round(canvas.width / size) * size;
const yEnd = Math.round(canvas.height / size) * size;
let directionLock = false;

// States
const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
const apple = {};
let direction = "right";
let speed = 180;

function drawScore() {
  context.font = "26px Arial";
  context.fillStyle = "#fff";
  if (score > record) {
    context.fillText("Score: " + score, canvas.width - 180, 50);
    context.fillText("Highscore: " + score, 80, 50);
  } else {
    context.fillText("Score: " + score, canvas.width - 180, 50);
    context.fillText("Highscore: " + record, 80, 50);
  }
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function setApple() {
  do {
    apple.x =
      Math.round(random(2 * size, canvas.width - 2 * size) / size) * size;
    apple.y =
      Math.round(random(2 * size, canvas.height - 2 * size) / size) * size;
    var included = false;
    if (snake.length > 2) {
      for (let i = 0; i < snake.length; i += 1) {
        const s = snake[i];
        if (s.x === apple.x && s.y === apple.y) {
          included = true;
        }
      }
    }
  } while (included === true);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (score > 0 && (score + 1) % 10 == 0) {
    context.fillStyle = "#3f8c26";
  } else if (score > 0 && score % 10 == 0) {
    context.fillStyle = "#3f8c26";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
  } else {
    context.fillStyle = "red";
  }
  context.fillRect(apple.x, apple.y, size, size);
  drawScore();
  for (let i = 0; i < snake.length; i += 1) {
    const s = snake[i];
    if (score > 0 && (score + 0) % 10 == 0) {
      context.fillStyle = "black";
    } else {
      context.fillStyle = "#fff";
    }
    context.fillRect(s.x, s.y, size, size);
  }

  window.requestAnimationFrame(draw);
}

function tick() {
  for (let i = snake.length - 1; i >= 0; i--) {
    if (i === 0 && snake[i].x === apple.x && snake[i].y === apple.y) {
      snake.push({});
      if (score > 0 && (score + 1) % 10 == 0) {
        score += 1;
        speed *= 0.7;
      } else if (score > 0 && (score + 0) % 10 == 0) {
        score += 1;
        speed *= 1.45;
      } else {
        score += 1;
        speed *= 0.99;
      }

      setApple();
    }
    if (pause === false) {
      const s = snake[i];
      if (i == 0) {
        switch (direction) {
          case "right":
            if (s.x >= canvas.width - size) s.x = 0;
            else s.x += size;
            break;
          case "down":
            if (s.y > canvas.height - size / 2) s.y = 0;
            else s.y += size;
            break;
          case "left":
            if (s.x <= size / 2) s.x = xEnd - size;
            else s.x -= size;
            break;
          case "up":
            if (s.y <= size / 2) s.y = yEnd;
            else s.y -= size;
            break;
          default:
            break;
        }

        for (let j = 1; j < snake.length; j += 1) {
          if (snake[0].x === snake[j].x && snake[0].y === snake[j].y) {
            if (score > record) {
              record = score;
              setCookie(record, 365);
            }
            sleep(600);
            alert("GAME OVER");
            pause = true;
            window.location.reload();
          }
        }
      } else {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
      }
    }
  }
  window.setTimeout(tick, speed - extra_speed);
  directionLock = false;
}

function onKeyDown(e) {
  if (!directionLock) {
    directionLock = true;
    if (e.code === "Space") {
      extra_speed += 5;
    }
    if (e.code === "KeyE") {
      if (extra_speed >= 5) {
        extra_speed -= 5;
      }
    }
    if (e.code === "KeyP") {
      if (pause === false) {
        pause = true;
      } else {
        pause = false;
      }
    }
    if (e.code === "KeyQ") {
      alert("QUITTED");
      window.location.reload();
    }
    const newDirection = e.key.substr(5).toLowerCase();
    if (
      newDirection === "up" ||
      newDirection === "left" ||
      newDirection === "down" ||
      newDirection === "right"
    ) {
      if (direction === "left" && newDirection !== "right")
        direction = newDirection;
      if (direction === "up" && newDirection !== "down")
        direction = newDirection;
      if (direction === "down" && newDirection !== "up")
        direction = newDirection;
      if (direction === "right" && newDirection !== "left")
        direction = newDirection;
    }
  }
}

function swipe_detection(screen) {
  var touchsurface = screen;
  var swipedir, startX, startY, distX, distY;
  // The less the threshhold, the higher the sensitivity
  var threshold = 50; //required min distance traveled to be considered swipe
  var restraint = 100; // maximum distance allowed at the same time in perpendicular direction
  var allowedTime = 200; // maximum time allowed to travel that distance
  var elapsedTime, startTime;
  var handleswipe = function(swipedir) {
    if (
      swipedir === "up" ||
      swipedir === "left" ||
      swipedir === "down" ||
      swipedir === "right"
    ) {
      if (direction === "left" && swipedir !== "right") direction = swipedir;
      if (direction === "up" && swipedir !== "down") direction = swipedir;
      if (direction === "down" && swipedir !== "up") direction = swipedir;
      if (direction === "right" && swipedir !== "left") direction = swipedir;
    } else {
      if (swipedir === "pause") {
        if (pause === false) {
          pause = true;
        } else {
          pause = false;
        }
      }
    }
  };

  touchsurface.addEventListener(
    "touchstart",
    function(e) {
      var touchobj = e.changedTouches[0];
      swipedir = "none";
      var dist = 0;
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = new Date().getTime(); // record time when finger first makes contact with surface
      e.preventDefault();
    },
    false
  );

  touchsurface.addEventListener(
    "touchmove",
    function(e) {
      e.preventDefault(); // prevent scrolling when inside DIV
    },
    false
  );

  touchsurface.addEventListener(
    "touchend",
    function(e) {
      var touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
      distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
      elapsedTime = new Date().getTime() - startTime; // get time elapsed
      if (elapsedTime <= allowedTime) {
        // first condition for swipe met
        if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
          pause = false;
          // 2nd condition for horizontal swipe met
          swipedir = distX < 0 ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
        } else if (
          Math.abs(distY) >= threshold &&
          Math.abs(distX) <= restraint
        ) {
          pause = false;
          // 2nd condition for vertical swipe met
          swipedir = distY < 0 ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
        }
      } else {
        if (Math.abs(distY) <= 5 && Math.abs(distY) <= 5 && elapsedTime > 3) {
          swipedir = "pause";
        }
      }
      handleswipe(swipedir);
      e.preventDefault();
    },
    false
  );
}

window.setTimeout(tick, speed - extra_speed);

//For mobile phones
swipe_detection(screen);

window.addEventListener("keydown", onKeyDown);

window.requestAnimationFrame(draw);
setApple();
