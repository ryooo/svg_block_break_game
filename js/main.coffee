el = document.getElementById('mainsvg');
sc = document.getElementById('score');
pw = document.getElementById('power');

r = Raphael(el, 750, 400);
CELL_X=20
CELL_Y=10
CELL_BK='gray'
CELL_KEEP='blue'
score = 0

POW_1 = 'いくぜ!!'
POW_2 = 'どりゃぁぁぁあ！'

class Map
  constructor:(x, y, width, height) ->
    @arr = []
    @arrWk = []
    @currentBlock = null
    @x = x
    @y = y
    for i in [0...height]
      @arr[i] ||= []
      
      for j in [0...width]
        @arr[i][j] = r.rect(@x + CELL_X*i, @y + CELL_Y*j, CELL_X, CELL_Y).attr({ fill: CELL_BK, stroke: '#888888'})
    
    # blockを表示
    @initBlocks()
    
    @bar = new Bar()
    @ball = new Ball()
    
  
  initBlocks: ->
    for i in [3...27]
      @arrWk[i] ||= []
      for j in [3...8]
        @arrWk[i][j] = new Block(i, j)
  
  render:() ->
    sc.innerText = score
    pow = if @bar.pow is false then 'まだだ...' else @bar.pow
    
    pw.innerText = pow
    @ball.update()
    
    # 当たり判定
    ball = @ball.get_tile()
    if @arrWk[ball.x] && @arrWk[ball.x][ball.y]
      @arrWk[ball.x][ball.y].remove()
      unless @bar.pow is POW_2
        @ball.turn(ball.direction)
    
    if @bar.hit(ball)
      @ball.turn('|')
      if @bar.pow is POW_1
        @ball.enpower()
        @bar.usepower()
  
  die: ->
    sc.innerText = score + ' (You dead...)'
    clearInterval(id)


class Block
  constructor:(x = 0, y = 0, color = CELL_KEEP) ->
    @x = x
    @y = y
    @length ||= 1
    @color = color
    @block = r.rect(CELL_X*x, CELL_Y*y, CELL_X*@length, CELL_Y).attr({ fill: @color, stroke: '#888888'})
  
  remove: ->
    score++
    @block.remove()
  

class Bar extends Block
  constructor:(x = 14, y = 28, color = '#f00') ->
    @length = 2
    @color = color
    @pow = false
    super(x, y, color)
  
  left: ->
    tmp_x = @.block.attr('x') - CELL_X
    tmp_x = Math.max(tmp_x, 0)
    @.block.attr({ x: tmp_x});
  
  right: ->
    tmp_x = @.block.attr('x') + CELL_X
    tmp_x = Math.min(tmp_x, (30 - @length) * CELL_X)
    @.block.attr({ x: tmp_x});
  
  hit:(ball) ->
    x = @.block.attr('x')
    y = @.block.attr('y')
    x = parseInt(x / CELL_X)
    y = parseInt(y / CELL_Y)
    if x <= ball.x && ball.x <= x + @length && y == ball.y
      return true
    return false
  
  enpower: ->
    if @pow is POW_1
      @pow = POW_2
      return
    @pow = POW_1
  
  usepower: ->
    @pow = false



class Ball
  constructor:(x = 14, y = 28, color = '#333') ->
    @x = x
    @y = y
    @color = color
    @block = r.circle(x, y, 4).attr({ fill: @color, stroke: '#888888'})
    
    @vx = 4
    @vy = 8
  
  update: ->
    @_move(@vx, @vy)
  
  get_tile: ->
    cx = @.block.attr('cx')
    cy = @.block.attr('cy')
    cd = '|'
    cd = '-' if (cx % CELL_X) < (cy % CELL_Y)
    return {x: parseInt(cx / CELL_X), y: parseInt(cy / CELL_Y), direction: cd}
  
  turn: (direction) ->
    if direction is '|'
      @vy *= -1
    else
      @vx *= -1
  
  _move:(vx, vy) ->
    tmp_x = @.block.attr('cx') + vx
    # xが左にout
    if tmp_x < 0
      tmp_x = Math.abs(tmp_x)
      @turn('-')
    
    # xが右にout
    map_width = CELL_X * 30
    if tmp_x > map_width
      tmp_x = map_width - @vx
      @turn('-')
    
    tmp_y = @.block.attr('cy') + vy
    # yが下にout
    if tmp_y < 0
      tmp_y = Math.abs(tmp_y)
      @turn('|')
    
    # yが上にout
    map_height = CELL_Y * 30
    if tmp_y > map_height
      tmp_y = map_height - @vy
      map.die()
    
    @.block.attr({ cx: tmp_x, cy: tmp_y});
  
  enpower: ->
    @vx = Math.random()*8 + 8
    @vy = Math.random()*8 + 8
    @vy *= -1


map = new Map(0, 0, 30, 30)
block = new Block(3,4)


id = setInterval(->
  map.render()
, 100)
map.render()

window.document.onkeydown = (e) ->
  x = y = 0
  if e.keyCode == 32
    map.bar.enpower()
  else
    map.bar.left() if e.keyCode == 37
    map.bar.right() if e.keyCode == 39
    



