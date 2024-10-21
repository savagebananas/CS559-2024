function setup() {
  var canvas = document.getElementById('myCanvas');

  var slider1 = document.getElementById('slider1');
  slider1.value = 0;

  var showCurve = document.getElementById('showCurve');
  showCurve.checked = false;

  function draw() {
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;

    var tSliderValue = slider1.value * 0.01;
    var curveOn = showCurve.checked;

    function moveToTx(loc,Tx)
    {var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.moveTo(res[0],res[1]);}
  
    function lineToTx(loc,Tx)
    {var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.lineTo(res[0],res[1]);}
    

    function drawAxes(color,Tx) {
	    context.strokeStyle=color;
	    context.beginPath();
	    // Axes
	    moveToTx([120,0],Tx);lineToTx([0,0],Tx);lineToTx([0,120],Tx);
	    // Arrowheads
	    moveToTx([110,5],Tx);lineToTx([120,0],Tx);lineToTx([110,-5],Tx);
	    moveToTx([5,110],Tx);lineToTx([0,120],Tx);lineToTx([-5,110],Tx);
	    // X-label
	    moveToTx([130,0],Tx);lineToTx([140,10],Tx);
	    moveToTx([130,10],Tx);lineToTx([140,0],Tx);
	    context.stroke();
	  }

    function backgroundColor(color){
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function star(size, distance, color, Tx) {
      context.fillStyle = "white";
      context.fillStyle = color;
      context.beginPath();
      moveToTx([distance - size/2, -size/2], Tx);
      lineToTx([distance + size/2, -size/2], Tx);
      lineToTx([distance + size/2, size/2], Tx);
      lineToTx([distance - size/2, size/2], Tx);
      context.fill();
    }

    var Hermite = function(t) {
	    return [
		2*(t*t*t) - 3*(t*t) + 1,
		(t*t*t) - 2*(t*t) + t,
		-2*(t*t*t) + 3*(t*t),
		(t*t*t) - (t*t)
	    ];
	  }

    function Cubic(basis,P,t){
      var b = basis(t);
      var result=vec2.create();
      vec2.scale(result,P[0],b[0]);
      vec2.scaleAndAdd(result,result,P[1],b[1]);
      vec2.scaleAndAdd(result,result,P[2],b[2]);
      vec2.scaleAndAdd(result,result,P[3],b[3]);
      return result;
    }

    var p0=[-0.5,0.5];
    var d0=[1,1/3];
    var p1=[0.5,1];
    var d1=[1,1];
    var p2=[3,1.5];
    var d2=[1,2];
    var p3=[5,1];
    var d3=[-1,0];
  
    var P0 = [p0,d0,p1,d1]; // First two points and tangents
    var P1 = [p1,d1,p2,d2]; // Last two points and tangents
    var P2 = [p2,d2,p3,d3]; // Last two points and tangents

    var C0 = function(t_) {return Cubic(Hermite,P0,t_);};
    var C1 = function(t_) {return Cubic(Hermite,P1,t_);};
    var C2 = function(t_) {return Cubic(Hermite,P2,t_);};


  function drawTrajectory(t_begin, t_end, intervals, C, Tx, color) {
    context.strokeStyle = color;
    context.beginPath();
      moveToTx(C(t_begin), Tx);
      for(var i = 1; i <= intervals; i++){
          var t = ((intervals - i) / intervals) * t_begin + (i/intervals) * t_end;
          lineToTx(C(t),Tx);
      }
      context.stroke();
}

  // For moving object along curve
  var Ccomp = function(t) {
    if (t<1){
        var u = t;
        return C0(u);
    } 
    else if (t >= 1 && t < 2){
      var u = t-1.0;
      return C1(u);
    }
    else {
      var u = t-2.0;
      return C2(u);
    }          
  }

    // Background
    const grad=context.createLinearGradient(0,-200, 200,800);
    grad.addColorStop(0.34, "#82C8E5");
    grad.addColorStop(0.4, "#e81416");
    grad.addColorStop(0.43, "#ffa500");
    grad.addColorStop(0.46, "#faeb36");
    grad.addColorStop(0.49, "#79c314");
    grad.addColorStop(0.52, "#487de7");
    grad.addColorStop(.55, "#4b369d");
    grad.addColorStop(0.58, "#70369d");
    grad.addColorStop(0.64, "#82C8E5");
    backgroundColor(grad);

    var TCenterTrackToCanvas = mat3.create();
    mat3.fromTranslation(TCenterTrackToCanvas,[50,420]);
    mat3.scale(TCenterTrackToCanvas,TCenterTrackToCanvas,[200,-200]); // Flip the Y-axis

    if (curveOn){
      drawTrajectory(0.0, 1.0, 100, C0, TCenterTrackToCanvas, "black");
      drawTrajectory(0.0, 1.0, 100, C1, TCenterTrackToCanvas, "white");
      drawTrajectory(0.0, 1.0, 100, C2, TCenterTrackToCanvas, "cyan");
    }

    var TCar1ToCenter = mat3.create();
    mat3.fromTranslation(TCar1ToCenter, Ccomp(tSliderValue));
    TCar1ToCanvas = mat3.create();
    mat3.multiply(TCar1ToCanvas, TCenterTrackToCanvas, TCar1ToCenter);
    star(.05, 0, "white", TCar1ToCanvas);


    // Upper track bounds
    var TupperTrackToCenter = mat3.create();
    mat3.fromTranslation(TupperTrackToCenter, [-.3, .25]);
    var TupperTrackToCanvas = mat3.create();
    mat3.multiply(TupperTrackToCanvas, TCenterTrackToCanvas, TupperTrackToCenter);
    drawTrajectory(0.0, 1.0, 100, C0, TupperTrackToCanvas, "white");
    drawTrajectory(0.0, 1.0, 100, C1, TupperTrackToCanvas, "white");
    drawTrajectory(0.0, 1.0, 100, C2, TupperTrackToCanvas, "white");

    // Lower track bounds
    var TbottomTrackToCenter = mat3.create();
    mat3.fromTranslation(TbottomTrackToCenter, [.2, -.25]);
    var TbottomTrackToCanvas = mat3.create();
    mat3.multiply(TbottomTrackToCanvas, TCenterTrackToCanvas, TbottomTrackToCenter);
    drawTrajectory(0.0, 1.0, 100, C0, TbottomTrackToCanvas, "white");
    drawTrajectory(0.0, 1.0, 100, C1, TbottomTrackToCanvas, "white");
    drawTrajectory(0.0, 1.0, 100, C2, TbottomTrackToCanvas, "white");
  }

  slider1.addEventListener("input", draw);
  showCurve.addEventListener("input", draw);
  draw();

  requestAnimationFrame(draw);
}

window.onload = setup;


