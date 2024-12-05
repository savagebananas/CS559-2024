function start() {
  // Get canvas and WebGL context
  var canvas = document.getElementById("mycanvas");
  var gl = canvas.getContext("webgl");

  // Sliders at center
  var slider1 = document.getElementById("slider1");
  var slider2 = document.getElementById("slider2");
  slider1.value = 0;
  slider2.value = 0;

  // Read shader source
  var vertexSource = document.getElementById("vertexShader").text;
  var fragmentSource = document.getElementById("fragmentShader").text;

  // Compile shaders
  function compileShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  var vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  var fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Could not initialize shaders");
    return;
  }
  gl.useProgram(shaderProgram);

  // Shader attribute and uniform locations
  shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
  shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
  shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");

  gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
  gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
  gl.enableVertexAttribArray(shaderProgram.ColorAttribute);

  shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram, "uMV");
  shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram, "uMVn");
  shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram, "uMVP");

  // Cat part arrays
  var bodyVertices = new Float32Array([
    0.5,  0.3,  0.5,  -0.5,  0.3,  0.5,  -0.5, -0.3,  0.5,  0.5, -0.3,  0.5, // Front
    0.5,  0.3, -0.5,  0.5, -0.3, -0.5,  -0.5, -0.3, -0.5,  -0.5,  0.3, -0.5, // Back
    0.5,  0.3,  0.5,  0.5,  0.3, -0.5,  -0.5,  0.3, -0.5,  -0.5,  0.3,  0.5, // Top
    0.5, -0.3,  0.5,  0.5, -0.3, -0.5,  -0.5, -0.3, -0.5,  -0.5, -0.3,  0.5, // Bottom
    0.5,  0.3,  0.5,  0.5, -0.3,  0.5,  0.5, -0.3, -0.5,  0.5,  0.3, -0.5, // Right
   -0.5,  0.3,  0.5,  -0.5, -0.3,  0.5,  -0.5, -0.3, -0.5,  -0.5,  0.3, -0.5  // Left
  ]);

  var bodyNormals = new Float32Array([
    0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1, // Front
    0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1, // Back
    0,  1,  0,   0,  1,  0,   0,  1,  0,   0,  1,  0, // Top
    0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Bottom
    1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0, // Right
   -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0  // Left
  ]);

  var bodyColors = new Float32Array([
    0.6, 0.4, 0.2,  1.0, 0.6, 0.2,  1.0, 1.0, 0.2,  1.0, 0.6, 0.2, // Front face - Yellow
    0.6, 0.4, 0.2,  1.0, 0.6, 0.2,  1.0, 0.4, 0.2,  0.6, 0.4, 0.2, // Back face - Green
    0.6, 0.4, 0.3,  1.0, 0.6, 0.3,  1.0, 1.0, 0.3,  1.0, 0.6, 0.3, // Top face - Blue
    1.0, 0.6, 0.2,  1.0, 0.6, 0.2,  1.0, 0.6, 0.2,  1.0, 0.6, 0.2, // Bottom face - Orange
    0.6, 0.4, 0.2,  1.0, 0.6, 0.2,  1.0, 1.0, 0.2,  1.0, 0.6, 0.2, // Right face - Purple
    0.6, 0.4, 0.2,  1.0, 0.6, 0.2,  1.0, 1.0, 0.2,  1.0, 0.6, 0.2  // Left face - Pink
  ]);

  var bodyTriangles = new Uint16Array([
    0, 1, 2,  0, 2, 3,   // Front face
    4, 5, 6,  4, 6, 7,   // Back face
    8, 9,10,  8,10,11,   // Top face
   12,13,14, 12,14,15,   // Bottom face
   16,17,18, 16,18,19,   // Right face
   20,21,22, 20,22,23    // Left face
  ]);

    // Cat part arrays
    var bodyVertices = new Float32Array([
      0.5,  0.3,  0.5,  -0.5,  0.3,  0.5,  -0.5, -0.3,  0.5,  0.5, -0.3,  0.5, // Front
      0.5,  0.3, -0.5,  0.5, -0.3, -0.5,  -0.5, -0.3, -0.5,  -0.5,  0.3, -0.5, // Back
      0.5,  0.3,  0.5,  0.5,  0.3, -0.5,  -0.5,  0.3, -0.5,  -0.5,  0.3,  0.5, // Top
      0.5, -0.3,  0.5,  0.5, -0.3, -0.5,  -0.5, -0.3, -0.5,  -0.5, -0.3,  0.5, // Bottom
      0.5,  0.3,  0.5,  0.5, -0.3,  0.5,  0.5, -0.3, -0.5,  0.5,  0.3, -0.5, // Right
     -0.5,  0.3,  0.5,  -0.5, -0.3,  0.5,  -0.5, -0.3, -0.5,  -0.5,  0.3, -0.5  // Left
    ]);

    var prismVertices = new Float32Array([
      1, 0, 1,    1, 0, -1,    -1, 0, 1
      -1, 0, -1,    0, 1, 0
    ]);

    var prismTriangles = new Uint16Array([
      0, 1, 2,    1, 2, 3

    ]);

  // Add similar arrays for the head, legs, and tail (as shared earlier).

  // Create buffers
  var bodyPosBuffer = createBuffer(bodyVertices);
  bodyPosBuffer.numItems = bodyVertices.length;

  var bodyNormalBuffer = createBuffer(bodyNormals);
  bodyNormalBuffer.numItems = bodyNormals.length;
  var bodyColorBuffer = createBuffer(bodyColors);
  bodyColorBuffer.numItems = bodyColors.length;
  var bodyIndexBuffer = createBuffer(bodyTriangles, true);
  bodyIndexBuffer.numItems = bodyTriangles.length;

    // Utility function to create and bind buffers
    function createBuffer(data, isElementArray = false) {
      var buffer = gl.createBuffer();
      var target = isElementArray ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
      gl.bindBuffer(target, buffer);
      gl.bufferData(target, data, gl.STATIC_DRAW);
      buffer.itemSize = 3;
      return buffer;
    }
  // Draw function
  function drawPart(posBuffer, normalBuffer, colorBuffer, indexBuffer, modelMatrix, viewMatrix, projectionMatrix) {
    var mvMatrix = mat4.create();
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    var mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, mvMatrix);

    gl.uniformMatrix4fv(shaderProgram.MVmatrix, false, mvMatrix);
    gl.uniformMatrix4fv(shaderProgram.MVPmatrix, false, mvpMatrix);
    gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(shaderProgram.PositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(shaderProgram.NormalAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderProgram.ColorAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  }

  function backgroundColor(color){

  }

  function draw() {

    // Setup camera and projection
    var angle1 = slider1.value * 0.01 * Math.PI;
    var angle2 = slider2.value;
    var eye = [4 * Math.sin(angle1), 1, 4 * Math.cos(angle1)];
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eye, target, up);

    var projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    var baseMatrix = mat4.create();
    // Draw body
    var modelBodyMatrix = mat4.create();
    //mat4.fromRotation(modelBodyMatrix, Math.sin(angle2) * 0.1, [1, 1, 1]);
    //mat4.multiply(modelBodyMatrix, modelBodyMatrix, baseMatrix);
    mat4.fromScaling(modelBodyMatrix, [1, 1, 0.8]);
    var t1 = mat4.create();
    mat4.fromTranslation(t1, [0, 0.05 * Math.sin(angle2 * 0.5 + 1), 0]);
    mat4.multiply(modelBodyMatrix, modelBodyMatrix, t1);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, modelBodyMatrix, viewMatrix, projectionMatrix);

    // Draw head
    var modelHeadMatrix = mat4.create();
    mat4.fromScaling(modelHeadMatrix,[0.4,0.6,0.4]);
    mat4.multiply(modelHeadMatrix, modelHeadMatrix, baseMatrix);
    var translation = mat4.create();
    mat4.fromTranslation(translation, [1.25, 0.5 + 0.1 * Math.sin(angle2 * 0.5), 0]);
    mat4.multiply(modelHeadMatrix, modelHeadMatrix, translation);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, modelHeadMatrix, viewMatrix, projectionMatrix);
  
    // Draw face
    var modelFaceMatrix = mat4.create();
    mat4.fromScaling(modelFaceMatrix,[0.3,0.4,0.3]);
    mat4.multiply(modelFaceMatrix, modelFaceMatrix, baseMatrix);
    var t0 = mat4.create();
    mat4.fromTranslation(t0, [2, 0.75 + 0.1 * Math.sin(angle2 * 0.5), 0]);
    mat4.multiply(modelFaceMatrix, modelFaceMatrix, t0);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, modelFaceMatrix, viewMatrix, projectionMatrix);

    // Draw Legs
    var modelLeg1Matrix = mat4.create();
    mat4.fromScaling(modelLeg1Matrix,[0.25,0.75,0.25]);
    mat4.multiply(modelLeg1Matrix, modelLeg1Matrix, baseMatrix);
    var t2 = mat4.create();
    mat4.fromTranslation(t2, [1.25, -0.5, 1]);
    mat4.multiply(modelLeg1Matrix, modelLeg1Matrix, t2);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, modelLeg1Matrix, viewMatrix, projectionMatrix);
    
    // Draw Legs
    var modelLeg2Matrix = mat4.create();
    mat4.fromScaling(modelLeg2Matrix,[0.25,0.75,0.25]);
    mat4.multiply(modelLeg2Matrix, modelLeg2Matrix, baseMatrix);
    var t3 = mat4.create();
    mat4.fromTranslation(t3, [1.25, -0.5, -1]);
    mat4.multiply(modelLeg2Matrix, modelLeg2Matrix, t3);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, modelLeg2Matrix, viewMatrix, projectionMatrix);

    // Draw Legs
    var modelLeg3Matrix = mat4.create();
    mat4.fromScaling(modelLeg3Matrix,[0.25,0.75,0.25]);
    mat4.multiply(modelLeg3Matrix, modelLeg3Matrix, baseMatrix);
    var t4 = mat4.create();
    mat4.fromTranslation(t4, [-1.25, -0.5, 1]);
    mat4.multiply(modelLeg3Matrix, modelLeg3Matrix, t4);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, modelLeg3Matrix, viewMatrix, projectionMatrix);

    // Draw Legs
    var modelLeg4Matrix = mat4.create();
    mat4.fromScaling(modelLeg4Matrix,[0.25,0.75,0.25]);
    mat4.multiply(modelLeg4Matrix, modelLeg4Matrix, baseMatrix);
    var t5 = mat4.create();
    mat4.fromTranslation(t5, [-1.25, -0.5, -1]);
    mat4.multiply(modelLeg4Matrix, modelLeg4Matrix, t5);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, modelLeg4Matrix, viewMatrix, projectionMatrix);

  }

  slider1.addEventListener("input", draw);
  slider2.addEventListener("input", draw);
  draw();
}

window.onload = start;
