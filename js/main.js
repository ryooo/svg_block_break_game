(function() {
  var Ball, Bar, Block, CELL_BK, CELL_KEEP, CELL_X, CELL_Y, Map, POW_1, POW_2, block, el, id, map, pw, r, sc, score,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  el = document.getElementById('mainsvg');

  sc = document.getElementById('score');

  pw = document.getElementById('power');

  r = Raphael(el, 750, 400);

  CELL_X = 20;

  CELL_Y = 10;

  CELL_BK = 'gray';

  CELL_KEEP = 'blue';

  score = 0;

  POW_1 = 'いくぜ!!';

  POW_2 = 'どりゃぁぁぁあ！';

  Map = (function() {

    function Map(x, y, width, height) {
      var i, j, _base;
      this.arr = [];
      this.arrWk = [];
      this.currentBlock = null;
      this.x = x;
      this.y = y;
      for (i = 0; 0 <= height ? i < height : i > height; 0 <= height ? i++ : i--) {
        (_base = this.arr)[i] || (_base[i] = []);
        for (j = 0; 0 <= width ? j < width : j > width; 0 <= width ? j++ : j--) {
          this.arr[i][j] = r.rect(this.x + CELL_X * i, this.y + CELL_Y * j, CELL_X, CELL_Y).attr({
            fill: CELL_BK,
            stroke: '#888888'
          });
        }
      }
      this.initBlocks();
      this.bar = new Bar();
      this.ball = new Ball();
    }

    Map.prototype.initBlocks = function() {
      var i, j, _base, _results;
      _results = [];
      for (i = 3; i < 27; i++) {
        (_base = this.arrWk)[i] || (_base[i] = []);
        _results.push((function() {
          var _results2;
          _results2 = [];
          for (j = 3; j < 8; j++) {
            _results2.push(this.arrWk[i][j] = new Block(i, j));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    Map.prototype.render = function() {
      var ball, pow;
      sc.innerText = score;
      pow = this.bar.pow === false ? 'まだだ...' : this.bar.pow;
      pw.innerText = pow;
      this.ball.update();
      ball = this.ball.get_tile();
      if (this.arrWk[ball.x] && this.arrWk[ball.x][ball.y]) {
        this.arrWk[ball.x][ball.y].remove();
        if (this.bar.pow !== POW_2) this.ball.turn(ball.direction);
      }
      if (this.bar.hit(ball)) {
        this.ball.turn('|');
        if (this.bar.pow === POW_1) {
          this.ball.enpower();
          return this.bar.usepower();
        }
      }
    };

    Map.prototype.die = function() {
      sc.innerText = score + ' (You dead...)';
      return clearInterval(id);
    };

    return Map;

  })();

  Block = (function() {

    function Block(x, y, color) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      if (color == null) color = CELL_KEEP;
      this.x = x;
      this.y = y;
      this.length || (this.length = 1);
      this.color = color;
      this.block = r.rect(CELL_X * x, CELL_Y * y, CELL_X * this.length, CELL_Y).attr({
        fill: this.color,
        stroke: '#888888'
      });
    }

    Block.prototype.remove = function() {
      score++;
      return this.block.remove();
    };

    return Block;

  })();

  Bar = (function(_super) {

    __extends(Bar, _super);

    function Bar(x, y, color) {
      if (x == null) x = 14;
      if (y == null) y = 28;
      if (color == null) color = '#f00';
      this.length = 2;
      this.color = color;
      this.pow = false;
      Bar.__super__.constructor.call(this, x, y, color);
    }

    Bar.prototype.left = function() {
      var tmp_x;
      tmp_x = this.block.attr('x') - CELL_X;
      tmp_x = Math.max(tmp_x, 0);
      return this.block.attr({
        x: tmp_x
      });
    };

    Bar.prototype.right = function() {
      var tmp_x;
      tmp_x = this.block.attr('x') + CELL_X;
      tmp_x = Math.min(tmp_x, (30 - this.length) * CELL_X);
      return this.block.attr({
        x: tmp_x
      });
    };

    Bar.prototype.hit = function(ball) {
      var x, y;
      x = this.block.attr('x');
      y = this.block.attr('y');
      x = parseInt(x / CELL_X);
      y = parseInt(y / CELL_Y);
      if (x <= ball.x && ball.x <= x + this.length && y === ball.y) return true;
      return false;
    };

    Bar.prototype.enpower = function() {
      if (this.pow === POW_1) {
        this.pow = POW_2;
        return;
      }
      return this.pow = POW_1;
    };

    Bar.prototype.usepower = function() {
      return this.pow = false;
    };

    return Bar;

  })(Block);

  Ball = (function() {

    function Ball(x, y, color) {
      if (x == null) x = 14;
      if (y == null) y = 28;
      if (color == null) color = '#333';
      this.x = x;
      this.y = y;
      this.color = color;
      this.block = r.circle(x, y, 4).attr({
        fill: this.color,
        stroke: '#888888'
      });
      this.vx = 4;
      this.vy = 8;
    }

    Ball.prototype.update = function() {
      return this._move(this.vx, this.vy);
    };

    Ball.prototype.get_tile = function() {
      var cd, cx, cy;
      cx = this.block.attr('cx');
      cy = this.block.attr('cy');
      cd = '|';
      if ((cx % CELL_X) < (cy % CELL_Y)) cd = '-';
      return {
        x: parseInt(cx / CELL_X),
        y: parseInt(cy / CELL_Y),
        direction: cd
      };
    };

    Ball.prototype.turn = function(direction) {
      if (direction === '|') {
        return this.vy *= -1;
      } else {
        return this.vx *= -1;
      }
    };

    Ball.prototype._move = function(vx, vy) {
      var map_height, map_width, tmp_x, tmp_y;
      tmp_x = this.block.attr('cx') + vx;
      if (tmp_x < 0) {
        tmp_x = Math.abs(tmp_x);
        this.turn('-');
      }
      map_width = CELL_X * 30;
      if (tmp_x > map_width) {
        tmp_x = map_width - this.vx;
        this.turn('-');
      }
      tmp_y = this.block.attr('cy') + vy;
      if (tmp_y < 0) {
        tmp_y = Math.abs(tmp_y);
        this.turn('|');
      }
      map_height = CELL_Y * 30;
      if (tmp_y > map_height) {
        tmp_y = map_height - this.vy;
        map.die();
      }
      return this.block.attr({
        cx: tmp_x,
        cy: tmp_y
      });
    };

    Ball.prototype.enpower = function() {
      this.vx = Math.random() * 8 + 8;
      this.vy = Math.random() * 8 + 8;
      return this.vy *= -1;
    };

    return Ball;

  })();

  map = new Map(0, 0, 30, 30);

  block = new Block(3, 4);

  id = setInterval(function() {
    return map.render();
  }, 100);

  map.render();

  window.document.onkeydown = function(e) {
    var x, y;
    x = y = 0;
    if (e.keyCode === 32) {
      return map.bar.enpower();
    } else {
      if (e.keyCode === 37) map.bar.left();
      if (e.keyCode === 39) return map.bar.right();
    }
  };

}).call(this);
