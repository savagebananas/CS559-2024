function setup() {
  var canvas = document.getElementById('myCanvas');

  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
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

    function star(size, distance, color) {
      context.fillStyle = "white";
      context.fillStyle = color;
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
    grad.addColorStop(0.4, "#06283b");
    grad.addColorStop(0.6, "#063047");
    grad.addColorStop(0.85, "#0B486B");
    grad.addColorStop(1, "#0f5780");
    backgroundColor(grad);

    stack.unshift(mat3.clone(stack[0])); // canvas, canvas

    var Tstarpivot_to_canvas = mat3.create();
    mat3.fromTranslation(Tstarpivot_to_canvas,[250 + -3*x, x + 400]);
    //mat3.fromTranslation(Tstarpivot_to_canvas,[400, 200]);
    mat3.multiply(stack[0],stack[0],Tstarpivot_to_canvas);
    stack.unshift(mat3.clone(stack[0])); // Top: starpivot, starpivot, canvas

    var Tstar1 = mat3.create();
    mat3.rotate(Tstar1, Tstar1,theta * 1/15);
    mat3.multiply(stack[0],stack[0], Tstar1); // Top: star1, starpivot, canvas
    star(10, -600);
    star(10, 600);
    stack.shift(); // Top: starpivot, canvas
    stack.unshift(mat3.clone(stack[0])); // Top: starpivot, starpivot, canvas

    var Tstar2 = mat3.create();
    mat3.rotate(Tstar2, Tstar2, theta * 2/15);
    mat3.multiply(stack[0],stack[0], Tstar2);
    star(10, -550);
    star(10, 550);
    stack.shift(); 
    stack.unshift(mat3.clone(stack[0]));

    var Tstar3 = mat3.create();
    mat3.rotate(Tstar3, Tstar3,theta * 3/15);
    mat3.multiply(stack[0],stack[0], Tstar3);
    star(10, -500);
    star(10, 500);
    stack.shift();
    stack.unshift(mat3.clone(stack[0]));

    
    var Tstar4 = mat3.create();
    mat3.rotate(Tstar4, Tstar4,theta * 4/15);
    mat3.multiply(stack[0],stack[0], Tstar4);
    star(10, -450);
    star(10, 450);
    stack.shift();
    stack.unshift(mat3.clone(stack[0]));

    var Tstar5 = mat3.create();
    mat3.rotate(Tstar5, Tstar5,theta * 5/15);
    mat3.multiply(stack[0],stack[0], Tstar5);
    star(10, -400);
    star(10, 400);
    stack.shift();
    stack.unshift(mat3.clone(stack[0]));
    
    var Tstar6 = mat3.create();
    mat3.rotate(Tstar6, Tstar6,theta * 6/15);
    mat3.multiply(stack[0],stack[0], Tstar6);
    star(10, -350);
    star(10, 350);
    stack.shift();
    stack.unshift(mat3.clone(stack[0]));

    var Tstar7 = mat3.create();
    mat3.rotate(Tstar7, Tstar7,theta * 7/15);
    mat3.multiply(stack[0],stack[0], Tstar7);
    star(10, -300);
    star(10, 300);
    stack.shift();
    stack.unshift(mat3.clone(stack[0]));

    var Tstar8 = mat3.create();
    mat3.rotate(Tstar8, Tstar8,theta * 8/15);
    mat3.multiply(stack[0],stack[0], Tstar8);
    star(10, -250);
    star(10, 250);
    stack.shift();
    stack.unshift(mat3.clone(stack[0]));

    var Tstar9 = mat3.create();
    mat3.rotate(Tstar9, Tstar9,theta * 9/15);
    mat3.multiply(stack[0],stack[0], Tstar9);
    star(10, -200);
    star(10, 200);
    stack.shift();

    stack.shift(); 
    scenery();
  }

  slider1.addEventListener("input", draw);
  slider2.addEventListener("input", draw);
  draw();

  requestAnimationFrame(draw);
}

window.onload = setup;


