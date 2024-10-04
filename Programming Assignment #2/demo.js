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

    function linkage(color) {

      context.beginPath();
      context.fillStyle = color;
      context.moveTo(0, 0);
      context.lineTo(10, 5);
      context.lineTo(90, 5);
      context.lineTo(100, 0);
      context.lineTo(90, -5);
      context.lineTo(10, -5);
      context.closePath();
      context.fill();

      axes(color);
    }

    function axes(color) {
      context.strokeStyle = color;
      context.beginPath();
      // Axes
      context.moveTo(120, 0); context.lineTo(0, 0); context.lineTo(0, 120);
      // Arrowheads
      context.moveTo(110, 5); context.lineTo(120, 0); context.lineTo(110, -5);
      context.moveTo(5, 110); context.lineTo(0, 120); context.lineTo(-5, 110);
      // X-label
      context.moveTo(130, -5); context.lineTo(140, 5);
      context.moveTo(130, 5); context.lineTo(140, -5);
      // Y-label
      context.moveTo(-5, 130); context.lineTo(0, 135); context.lineTo(5, 130);
      context.moveTo(0, 135); context.lineTo(0, 142);

      context.stroke();
    }

    function backgroundColor(color){
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function star(size, distance) {
      context.fillStyle = "white";
      context.beginPath();
      context.rect(distance - size/2, -size/2, size, size);
      context.fill();
    }

    function scenery(){

      // Big mountain
      context.fillStyle = "#222836";
      context.beginPath();
      context.moveTo(280, 400);
      context.lineTo(560, 180);
      context.lineTo(610, 180);
      context.lineTo(840, 400);
      context.closePath();
      context.fill();

      // Medium Mountain
      context.fillStyle = "#2a3142";
      context.beginPath();
      context.moveTo(250, 400);
      context.lineTo(380, 345);
      context.lineTo(700, 400);
      context.lineTo(800, 400);
      context.closePath();
      context.fill();

      context.fillStyle = "#313a4e";
      context.beginPath();
      context.moveTo(100, 400);
      context.lineTo(350, 320);
      context.lineTo(500, 400);
      context.closePath();
      context.fill();

      context.fillStyle = "#313a4e";
      context.beginPath();
      context.moveTo(400, 400);
      context.lineTo(780, 320);
      context.lineTo(1000, 400);
      context.closePath();
      context.fill();

      // Front hills
      context.fillStyle = "#2F404A";
      context.beginPath();
      context.moveTo(0, 400)
      context.lineTo(0, 310);
      context.lineTo(40, 300);
      context.lineTo(180, 320);
      context.lineTo(400, 400);
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
    linkage("blue");
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


