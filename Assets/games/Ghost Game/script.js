/* I made this as a part of Codepen challenge using Vue.js, anime.js and illuminated. The attic and ghosts positions are randomly generated. Use your mouse or tap on the screen to light a section of the attic up. Click or tap the ghosts to bust them. Hope you enjoy it.💡 */

new Vue({
  el: '#app',
  data: {
    gameOver: false,
    message: 'Game Over',
    position: {
      x: 500,
      y: 100 },

    flashLightAngle: 0,
    score: 0,
    inGame: false,
    timer: null,
    timelineParameters: null,
    timeLimit: 30,
    PIXEL_SIZE_X: Math.floor(window.innerWidth / 50),
    PIXEL_SIZE_Y: Math.floor(window.innerHeight / 20),
    PIXEL_COUNT: Math.floor(window.innerWidth * window.innerHeight / 3000),
    GHOSTS_COUNT: Math.floor(window.innerWidth * window.innerHeight / 55000),
    GHOSTS_RADIUS: 14,
    ghostsArr: [],
    taggedGhostsArr: [] },

  watch: {
    score(val, newVal) {
      if (val === this.GHOSTS_COUNT && !this.gameOver) {
        this.gameOver = true;
        this.message = 'YOU WIN!';
        clearInterval(this.timer);
      }
    },
    timeLimit(val) {
      if (val <= 0) {
        clearInterval(this.timer);
        this.gameOver = true;
        this.message = 'TIME OUT!';
      }
    } },

  methods: {
    restartGame() {
      this.timelineParameters.loop = false;
      this.timelineParameters.autoplay = false;
      this.timelineParameters.pause();
      this.inGame = true;
      this.gameOver = false;
      this.ghostsArr = [];
      this.taggedGhostsArr = [];
      this.timeLimit = 30;
      this.score = 0;
      this.initGame();
      this.timer = setInterval(() => {
        this.timeLimit -= 1;
      }, 1000);
    },
    startGame() {
      this.restartGame();
    },
    getRndInteger(axis, max) {
      if (axis === 'x') {
        return this.PIXEL_SIZE_X + this.PIXEL_SIZE_X * Math.floor(Math.random() * (max / this.PIXEL_SIZE_X));
      } else {
        return this.PIXEL_SIZE_Y + this.PIXEL_SIZE_Y * Math.floor(Math.random() * (max / this.PIXEL_SIZE_Y));
      }
    },
    dist(a, b) {
      return Math.abs(a - b);
    },
    initDemo() {
      this.timelineParameters = anime.timeline({
        direction: 'alternate',
        loop: true });


      this.timelineParameters.
      add({
        targets: this.position,
        x: [this.getRndInteger('x', window.innerWidth), this.getRndInteger('x', window.innerWidth), this.getRndInteger('x', window.innerWidth), this.getRndInteger('x', window.innerWidth)],
        y: [this.getRndInteger('y', window.innerHeight), this.getRndInteger('y', window.innerHeight), this.getRndInteger('y', window.innerHeight), this.getRndInteger('y', window.innerHeight)],
        duration: 10000,
        easing: 'easeInOutQuad' });

    },
    initGame() {
      let _this = this;
      const Lamp = illuminated.Lamp,
      RectangleObject = illuminated.RectangleObject,
      DiscObject = illuminated.DiscObject,
      Vec2 = illuminated.Vec2,
      Lighting = illuminated.Lighting,
      DarkMask = illuminated.DarkMask;

      const wood = document.getElementById("wood");
      const ghost = document.getElementById("ghost");
      const ghost_tagged = document.getElementById("ghost_tagged");
      const canvas = document.querySelector("#canvas_container canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");

      const light2 = new Lamp({
        position: new Vec2(parseInt(_this.position.x), parseInt(_this.position.y)),
        color: '#d66a00',
        distance: 180,
        radius: 5,
        samples: 3
        // angle: _this.flashLightAngle,
        // roughness: .9
      });

      if (_this.inGame) {
        document.addEventListener('touchmove', event => {
          event.preventDefault();
          var touch = event.touches[0];
          _this.position.x = touch.clientX;
          _this.position.y = touch.clientY;
        });
        document.addEventListener('mousemove', event => {
          _this.position.x = event.clientX;
          _this.position.y = event.clientY;
        });
      }
      var objArr = [];
      var maskArr = [];
      for (let x = 0; x <= _this.PIXEL_COUNT; x++) {
        let randX = _this.getRndInteger('x', window.innerWidth - _this.PIXEL_SIZE_X);
        let randY = _this.getRndInteger('y', window.innerHeight - _this.PIXEL_SIZE_Y);
        maskArr.push({
          x: randX,
          y: randY });

        objArr.push(new RectangleObject({
          topleft: new Vec2(randX, randY),
          bottomright: new Vec2(randX + _this.PIXEL_SIZE_X, randY + _this.PIXEL_SIZE_Y) }));

      }
      let randX, randY;
      for (let y = 0; y <= _this.GHOSTS_COUNT; y++) {
        if (_this.ghostsArr.length < _this.GHOSTS_COUNT) {
          do {
            randX = _this.getRndInteger('x', window.innerWidth - _this.PIXEL_SIZE_X * 2);
            randY = _this.getRndInteger('y', window.innerHeight - _this.PIXEL_SIZE_Y * 2);
          } while (_this.ghostsArr.filter(e => {
            return e.center.x === randX && e.center.y === randY;
          }).length > 0 || maskArr.filter(e => {
            return e.x == randX && e.y == randY;
          }).length > 0 || maskArr.filter(e => {
            return e.x + _this.PIXEL_SIZE_X == randX && e.y + _this.PIXEL_SIZE_Y == randY;
          }).length > 0);
          _this.ghostsArr.push(new DiscObject({
            center: new Vec2(Math.floor(randX + _this.PIXEL_SIZE_X / 2), Math.floor(randY + _this.PIXEL_SIZE_Y / 2)),
            radius: _this.GHOSTS_RADIUS }));

          _this.taggedGhostsArr.push(new DiscObject({
            center: new Vec2(-100, -100),
            radius: _this.GHOSTS_RADIUS }));

        }
      }

      const lighting2 = new Lighting({
        light: light2,
        objects: [..._this.ghostsArr, ...objArr] });


      const darkmask = new DarkMask({
        lights: [light2],
        color: 'rgba(0,0,0,1)' });


      if (!_this.inGame) {
        _this.initDemo();
      }

      function render() {
        light2.position = new Vec2(parseInt(_this.position.x), parseInt(_this.position.y));
        light2.angle = parseInt(_this.flashLightAngle);

        lighting2.compute(canvas.width, canvas.height);
        darkmask.compute(canvas.width, canvas.height);

        ctx.fillStyle = "#1e1308";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(wood, 0, 0, window.innerWidth, window.innerHeight);

        for (let x = 0; x < _this.ghostsArr.length; x++) {
          ctx.beginPath();
          _this.ghostsArr[x].path(ctx);
          if (_this.taggedGhostsArr[x].center.x === _this.ghostsArr[x].center.x && _this.taggedGhostsArr[x].center.y === _this.ghostsArr[x].center.y) {
            ctx.drawImage(ghost_tagged, _this.ghostsArr[x].center.x - _this.GHOSTS_RADIUS, _this.ghostsArr[x].center.y - _this.GHOSTS_RADIUS, _this.GHOSTS_RADIUS * 2, _this.GHOSTS_RADIUS * 2);
          } else {
            ctx.drawImage(ghost, _this.ghostsArr[x].center.x - _this.GHOSTS_RADIUS, _this.ghostsArr[x].center.y - _this.GHOSTS_RADIUS, _this.GHOSTS_RADIUS * 2, _this.GHOSTS_RADIUS * 2);
          }
        }
        ctx.globalCompositeOperation = "lighter";
        lighting2.render(ctx);
        ctx.globalCompositeOperation = "source-over";
        darkmask.render(ctx);
        for (let x = 0; x < objArr.length; x++) {
          ctx.fillStyle = "#1e1308";
          ctx.fillRect(maskArr[x].x, maskArr[x].y, _this.PIXEL_SIZE_X, _this.PIXEL_SIZE_Y);
        }
        ctx.fillStyle = "#1e1308";
        ctx.fillRect(0, 0, window.innerWidth, 6);
        ctx.fillRect(0, window.innerHeight - 6, window.innerWidth, 6);
        ctx.fillRect(window.innerWidth - 6, 0, 6, window.innerHeight);
        ctx.fillRect(0, 0, 6, window.innerHeight);
      }
      document.addEventListener('click', e => {
        if (!_this.inGame || _this.gameOver) return false;
        for (let x = 0; x < _this.ghostsArr.length; x++) {
          let distX = _this.dist(e.clientX, _this.ghostsArr[x].center.x);
          let distY = _this.dist(e.clientY, _this.ghostsArr[x].center.y);
          if (distX <= _this.GHOSTS_RADIUS - 2 && distY <= _this.GHOSTS_RADIUS - 2) {
            if (_this.taggedGhostsArr[x].center.x !== _this.ghostsArr[x].center.x && _this.taggedGhostsArr[x].center.y !== _this.ghostsArr[x].center.y) {
              _this.score += 1;
            }
            _this.taggedGhostsArr[x].center.x = _this.ghostsArr[x].center.x;
            _this.taggedGhostsArr[x].center.y = _this.ghostsArr[x].center.y;
          }
        }
      });

      requestAnimFrame(function loop() {
        requestAnimFrame(loop, canvas);
        render();
      }, canvas);
    } },

  mounted() {
    this.initGame();
  } });