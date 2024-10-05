function setup() {
  var canvas = document.getElementById('myCanvas');

  var slider1 = document.getElementById('slider1');
  slider1.value = 125;
  var slider2 = document.getElementById('slider2');
  slider2.value = 0;

  function draw() {
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;

    var theta = slider1.value * 0.005 * Math.PI;
    var x = -slider2.value;

    var stack = [ mat3.create() ];

    function moveToTx(x, y){
      var final = vec2.create();
      vec2.transformMat3(final, [x,y], stack[0]);
      context.moveTo(final[0], final[1]);
    }

    function lineToTx(x, y){
      var final = vec2.create();
      vec2.transformMat3(final, [x,y], stack[0]);
      context.lineTo(final[0], final[1]);
    }

    function backgroundColor(color){
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function star(size, distance) {
      context.fillStyle = "lightblue";
      context.beginPath();
      moveToTx(distance - size/2, -size/2);
      lineToTx(distance + size/2, -size/2);
      lineToTx(distance + size/2, size/2);
      lineToTx(distance - size/2, size/2);
      context.fill();
    }

    function scenery(){

      // Big mountain
      context.fillStyle = "#222836";
      context.beginPath();
      moveToTx(280, 400);
      lineToTx(560, 180);
      lineToTx(610, 180);
      lineToTx(840, 400);
      context.closePath();
      context.fill();

      // Medium Mountain
      context.fillStyle = "#2a3142";
      context.beginPath();
      moveToTx(250, 400);
      lineToTx(380, 345);
      lineToTx(700, 400);
      lineToTx(800, 400);
      context.closePath();
      context.fill();

      // Front Mountain
      context.fillStyle = "#313a4e";
      context.beginPath();
      moveToTx(100, 400);
      lineToTx(350, 320);
      lineToTx(500, 400);
      context.closePath();
      context.fill();

      // Front Mountain
      context.fillStyle = "#313a4e";
      context.beginPath();
      moveToTx(400, 400);
      lineToTx(780, 320);
      lineToTx(1000, 400);
      context.closePath();
      context.fill();

      // Front hill (green)
      context.fillStyle = "#2F404A";
      context.beginPath();
      moveToTx(0, 400)
      lineToTx(0, 310);
      lineToTx(40, 300);
      lineToTx(180, 320);
      lineToTx(400, 400);
      context.closePath();
      context.fill();
    }

    // Background
    const grad=context.createLinearGradient(0,0, 0,400);
    grad.addColorStop(0, "#2a2859");
    grad.addColorStop(1, "#42438d");
    backgroundColor(grad);

    context.save(); // canvas -> canvas

    // Center for stars to rotate on
    context.translate(200 + -3*x, x - 100); // Bottom Center -> canvas
    context.save();
    
    context.rotate(theta * 2/18);
    star(10, -600);
    star(10, 600);

    context.rotate(theta * 1/15);
    star(10, -550);
    star(10, 550);

    context.rotate(theta * 2/15);
    star(10, -500);
    star(10, 500);

    context.rotate(theta * 1/10);
    star(10, -450);
    star(10, 450);

    context.rotate(theta * 2/10);
    star(10, -400);
    star(10, 400);
    
    context.rotate(theta * 3/10);
    star(10, -350);
    star(10, 350);

    context.rotate(theta * 4/10);
    star(10, -300);
    star(10, 300);

    context.rotate(theta * 5/10);
    star(10, -250);
    star(10, 250);

    context.rotate(theta * 6/10);
    star(10, -200);
    star(10, 200);

    context.rotate(theta * 7/10);
    star(10, -150);
    star(10, 150);

    context.rotate(theta * 8/10);
    star(10, -100);
    star(10, 100);
    context.restore(); 

    context.restore(); // canvas -> canvas
    scenery();
  }

  slider1.addEventListener("input", draw);
  slider2.addEventListener("input", draw);
  draw();

  requestAnimationFrame(draw);
}

window.onload = setup;


