// function draw() {
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var slider = document.getElementById("slider1");
    slider.value = 0;

    function Draw() {

        var dy = slider.value;

        function DrawHead() {
            context.beginPath();
            context.moveTo(450, 475); // chin
            context.lineTo(325, 400);
            context.lineTo(250, 350);
            context.lineTo(250, 100); // left ear
            context.lineTo(350, 200);
            context.lineTo(450, 175);
            context.lineTo(550, 200);
            context.lineTo(650, 100); // right ear
            context.lineTo(650, 350);
            context.lineTo(450, 475);
            context.closePath();

            context.fillStyle = "#cc5200"; // dark orange
            context.fill();

            // Left Ear Fill
            context.beginPath();
            context.moveTo(250, 225);
            context.lineTo(250, 100);
            context.lineTo(300, 150);
            context.closePath();
            context.fillStyle = "#000005";
            context.fill();

            // Right Ear Fill
            context.beginPath();
            context.moveTo(650, 225);
            context.lineTo(650, 100);
            context.lineTo(600, 150);
            context.closePath();
            context.fillStyle = "#000005";
            context.fill();

            // Other Head Lines
            context.beginPath();
            context.moveTo(250, 350);
            context.lineTo(350, 250);
            context.lineTo(250, 225);
            context.lineTo(350, 200);
            context.lineTo(350, 250);
            context.lineTo(450, 175);
            context.lineTo(550, 250);
            context.lineTo(550, 200);
            context.lineTo(650, 225);
            context.lineTo(550, 250);
            context.lineTo(650, 350);
            context.fillStyle = "#e55c00"; // medium orange
            context.fill();

            // Snout Fill
            context.beginPath();
            context.moveTo(450, 475);
            context.lineTo(350, 250);
            context.lineTo(550, 250);
            context.closePath();
            context.fillStyle = "#ff6700"; // brightest orange
            context.fill();

            // Nose Tip
            context.beginPath();
            context.moveTo(450, 475);
            context.lineTo(425, 460);
            context.lineTo(430, 440);
            context.lineTo(470, 440);
            context.lineTo(475, 460);
            context.closePath();
            context.fillStyle = "#000000";
            context.fill();
            context.stroke();
        }


        function DrawSnow() {
            context.beginPath();
            context.arc(95, 50, 10, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }

        function DrawBody() {
            context.beginPath();
            context.moveTo(350, 400);
            context.lineTo(400, 925); // left toe
            context.lineTo(600, 925); // right toe
            context.lineTo(750, 850); // back body
            context.lineTo(750, 575); // middle back
            context.lineTo(600, 375);
            context.closePath();
            context.fillStyle = "#e55c00"; // medium orange
            context.fill();

            context.beginPath();
            context.moveTo(350, 400);
            context.lineTo(450, 650);
            context.lineTo(400, 925);
            context.closePath();
            context.fillStyle = "#ff6700"; // brightest orange
            context.fill();

            context.beginPath();
            context.moveTo(550, 475);
            context.lineTo(450, 650);
            context.lineTo(600, 925);
            context.closePath();
            context.fillStyle = "#ff6700"; // brightest orange
            context.fill();

            context.beginPath();
            context.moveTo(550, 475); 
            context.lineTo(750, 575);
            context.lineTo(600, 325);
            context.closePath();
            context.fillStyle = "#ff6700"; // brightest orange
            context.fill();

            // TOES
            context.beginPath();
            context.moveTo(400, 925); 
            context.lineTo(475, 850);
            context.lineTo(600, 925);
            context.closePath();
            context.fillStyle = "#000000"; // black
            context.fill();

            context.beginPath();
            context.moveTo(600, 925); // right toe
            context.lineTo(750, 575);
            context.lineTo(600, 325);
            context.closePath();
            context.fillStyle = "#cc5200"; // brightest orange
            context.fill();

            context.beginPath();
            context.moveTo(600, 925); // right toe
            context.lineTo(750, 850); // back body
            context.lineTo(900, 925); 
            context.closePath();
            context.fillStyle = "#cc5200"; // brightest orange
            context.fill();

        }

        function DrawBackground() {
            var value = parseInt(dy, 10);

            // Background Color
            context.fillStyle = 'rgb(' + (185 - 2* value/2) + ',' + (200 - 2*value/6) + ', ' + (255 - 2*value/8) + ')';
            context.fillRect(0, 0, 1000, 1000);
        }


        context.save();
        DrawBackground();
        context.restore
        DrawBody();
        DrawHead();

        DrawSnow();

    }

    slider.addEventListener("input", Draw);


    Draw();


};
// window.onload = draw;

