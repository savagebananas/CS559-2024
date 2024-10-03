function setup() {
  var canvas = document.getElementById('myCanvas');

  var slider1 = document.getElementById('slider1');
  slider1.value = -25;
  var slider2 = document.getElementById('slider2');
  slider2.value = 50;
  var slider3 = document.getElementById('slider3');
  slider3.value = -50;

  function draw() {
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;

    var theta = slider1.value * 0.005 * Math.PI;
    var phi1 = slider2.value * 0.005 * Math.PI;
    var phi2 = slider3.value * 0.005 * Math.PI;

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

    // Background
    backgroundColor("#0B1026");

    context.fillStyle = 'rgba(11, 16, 38, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Center for stars
    context.translate(400, 400);
    linkage("blue");
    context.save();
    
    context.rotate(theta * 2/10);
    star(10, -400);
    star(10, 400);
    context.restore();

    context.rotate(theta * 3/10);
    star(10, -350);
    star(10, 350);
    context.restore();

    context.rotate(theta * 4/10);
    star(10, -300);
    star(10, 300);
    context.restore();

    context.rotate(theta * 5/10);
    star(10, -250);
    star(10, 250);
    context.restore();

    context.rotate(theta * 6/10);
    star(10, -200);
    star(10, 200);
    context.restore();

    context.rotate(theta * 7/10);
    star(10, -150);
    star(10, 150);
    context.restore();

    context.rotate(theta * 8/10);
    //linkage("cyan");
    star(10, -100);
    star(10, 100);
    context.restore();
  }

  slider1.addEventListener("input", draw);
  slider2.addEventListener("input", draw);
  slider3.addEventListener("input", draw);
  draw();

  requestAnimationFrame(draw);
}

window.onload = setup;


