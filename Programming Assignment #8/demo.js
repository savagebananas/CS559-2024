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

  var shaderProgram = shaderSetup(vertexSource, fragmentSource);

  // Helper method to compile shaders
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

  function shaderSetup(vSource, fSource){
    var vertexShader = compileShader(gl.VERTEX_SHADER, vSource);
    var fragmentShader = compileShader(gl.FRAGMENT_SHADER, fSource);
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
    return shaderProgram;
  }

  // Shader attribute and uniform locations
  shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
  shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
  shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
  shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");

  gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
  gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
  gl.enableVertexAttribArray(shaderProgram.ColorAttribute);
  gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);

  shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram, "uMV");
  shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram, "uMVn");
  shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram, "uMVP");

  // Attach samplers to texture units
  shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
  gl.uniform1i(shaderProgram.texSampler1, 0);
  

  var bodyVerticesPos = new Float32Array([
      1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,
      1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,
      1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,
     -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,
     -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
      1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]);

  var bodyNormals = new Float32Array([
    0,  0,  1,   0,  0,  1,   0,  0,  1,   0,  0,  1, // Front
    0,  0, -1,   0,  0, -1,   0,  0, -1,   0,  0, -1, // Back
    0,  1,  0,   0,  1,  0,   0,  1,  0,   0,  1,  0, // Top
    0, -1,  0,   0, -1,  0,   0, -1,  0,   0, -1,  0, // Bottom
    1,  0,  0,   1,  0,  0,   1,  0,  0,   1,  0,  0, // Right
   -1,  0,  0,  -1,  0,  0,  -1,  0,  0,  -1,  0,  0  // Left
  ]);

    // vertex texture coordinates
  var bodyVertexTextureCoords = new Float32Array(
    [  0, 0,   1, 0,   1, 1,   0, 1,
        1, 0,   1, 1,   0, 1,   0, 0,
        0, 1,   0, 0,   1, 0,   1, 1,
        0, 0,   1, 0,   1, 1,   0, 1,
        1, 1,   0, 1,   0, 0,   1, 0,
        1, 1,   0, 1,   0, 0,   1, 0 ]);

  var bodyColors = new Float32Array([
    0.6, 0.4, 0.2,  1.0, 0.6, 0.2,  1.0, 1.0, 0.2,  1.0, 0.6, 0.2, // Front face - Yellow
    0.6, 0.4, 0.2,  1.0, 0.6, 0.2,  1.0, 0.4, 0.2,  0.6, 0.4, 0.2, // Back face - Green
    0.6, 0.4, 0.3,  1.0, 0.6, 0.3,  1.0, 1.0, 0.3,  1.0, 0.6, 0.3, // Top face - Blue
    1.0, 0.6, 0.2,  1.0, 0.6, 0.2,  1.0, 0.6, 0.2,  1.0, 0.6, 0.2, // Bottom face - Orange
    0.6, 0.4, 0.2,  1.0, 0.6, 0.2,  1.0, 1.0, 0.2,  1.0, 0.6, 0.2, // Right face - Purple
    0.6, 0.4, 0.2,  1.0, 0.6, 0.2,  1.0, 1.0, 0.2,  1.0, 0.6, 0.2  // Left face - Pink
  ]);

  var bodyTriangles = new Uint16Array([
    0, 1, 2,   0, 2, 3,    // front
    4, 5, 6,   4, 6, 7,    // right
    8, 9,10,   8,10,11,    // top
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // bottom
    20,21,22,  20,22,23 ]); // back


  // Create sheep buffers
  var bodyPosBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bodyPosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bodyVerticesPos, gl.STATIC_DRAW);
  bodyPosBuffer.itemSize = 3;
  bodyPosBuffer.numItems = 24;
  
  // a buffer for normals
  var bodyNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bodyNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bodyNormals, gl.STATIC_DRAW);
  bodyNormalBuffer.itemSize = 3;
  bodyNormalBuffer.numItems = 24;
  
  // a buffer for colors
  var bodyColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bodyColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bodyColors, gl.STATIC_DRAW);
  bodyColorBuffer.itemSize = 3;
  bodyColorBuffer.numItems = 24;

  // a buffer for textures
  var bodyTextureBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bodyTextureBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, bodyVertexTextureCoords, gl.STATIC_DRAW);
  bodyTextureBuffer.itemSize = 2;
  bodyTextureBuffer.numItems = 24;

  // a buffer for indices
  var bodyIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bodyIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bodyTriangles, gl.STATIC_DRAW);    

  // Helper to create and bind buffers
  function createBuffer(data, isIndexBuffer = false, isTextureBuffer = false) {
    var buffer = gl.createBuffer();
    var target = isIndexBuffer ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);
    if (!isIndexBuffer) buffer.itemSize = isTextureBuffer ? 2 : 3;
    return buffer;
  }

  var texture1 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image1 = new Image();

  // Helper to setup textures
  function setupTexture(){
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return texture;
  }

  // Run before draw function
  function loadTexture(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // Option 1 : Use mipmap, select interpolation mode
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    // Option 2: At least use linear filters
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Optional ... if your shader & texture coordinates go outside the [0,1] range
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  function initTextureThenDraw()
  {
    image1.onload = function() { loadTexture(image1,texture1); };
    image1.crossOrigin = "anonymous";
    image1.src = "https://farm6.staticflickr.com/5564/30725680942_e3bfe50e5e_b.jpg";

    window.setTimeout(draw,200);
  }

  // Helper to draw one object
  function drawPart(posBuffer, normalBuffer, colorBuffer, indexBuffer, textureBuffer, modelMatrix, viewMatrix, projectionMatrix, shaderPrgm) {
    var mvMatrix = mat4.create();
    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    var mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
    var normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, mvMatrix);

    gl.uniformMatrix4fv(shaderPrgm.MVmatrix, false, mvMatrix);
    gl.uniformMatrix4fv(shaderPrgm.MVPmatrix, false, mvpMatrix);
    gl.uniformMatrix3fv(shaderPrgm.MVNormalmatrix, false, normalMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(shaderPrgm.PositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(shaderPrgm.NormalAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderPrgm.ColorAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Bind Texture
    if (textureBuffer != null)
    {
      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer.itemSize,
        gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
    }


    gl.drawElements(gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
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
    mat4.fromScaling(modelBodyMatrix, [1, 1, 1]);
    var t1 = mat4.create();
    mat4.fromTranslation(t1, [0, 0.05 * Math.sin(angle2 * 0.5 + 1), 0]);
    mat4.multiply(modelBodyMatrix, modelBodyMatrix, t1);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, bodyTextureBuffer, modelBodyMatrix, viewMatrix, projectionMatrix, shaderProgram);

    /*
    // Draw head
    var modelHeadMatrix = mat4.create();
    mat4.fromScaling(modelHeadMatrix,[0.4,0.6,0.4]);
    mat4.multiply(modelHeadMatrix, modelHeadMatrix, baseMatrix);
    var translation = mat4.create();
    mat4.fromTranslation(translation, [1.25, 0.5 + 0.1 * Math.sin(angle2 * 0.5), 0]);
    mat4.multiply(modelHeadMatrix, modelHeadMatrix, translation);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, null, modelHeadMatrix, viewMatrix, projectionMatrix, shaderProgram);
  
    // Draw face
    var modelFaceMatrix = mat4.create();
    mat4.fromScaling(modelFaceMatrix,[0.3,0.4,0.3]);
    mat4.multiply(modelFaceMatrix, modelFaceMatrix, baseMatrix);
    var t0 = mat4.create();
    mat4.fromTranslation(t0, [2, 0.75 + 0.1 * Math.sin(angle2 * 0.5), 0]);
    mat4.multiply(modelFaceMatrix, modelFaceMatrix, t0);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, null, modelFaceMatrix, viewMatrix, projectionMatrix, shaderProgram);

    // Draw Legs
    var modelLeg1Matrix = mat4.create();
    mat4.fromScaling(modelLeg1Matrix,[0.25,0.75,0.25]);
    mat4.multiply(modelLeg1Matrix, modelLeg1Matrix, baseMatrix);
    var t2 = mat4.create();
    mat4.fromTranslation(t2, [1.25, -0.5, 1]);
    mat4.multiply(modelLeg1Matrix, modelLeg1Matrix, t2);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, null, modelLeg1Matrix, viewMatrix, projectionMatrix, shaderProgram);
    
    // Draw Legs
    var modelLeg2Matrix = mat4.create();
    mat4.fromScaling(modelLeg2Matrix,[0.25,0.75,0.25]);
    mat4.multiply(modelLeg2Matrix, modelLeg2Matrix, baseMatrix);
    var t3 = mat4.create();
    mat4.fromTranslation(t3, [1.25, -0.5, -1]);
    mat4.multiply(modelLeg2Matrix, modelLeg2Matrix, t3);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, null, modelLeg2Matrix, viewMatrix, projectionMatrix, shaderProgram);

    // Draw Legs
    var modelLeg3Matrix = mat4.create();
    mat4.fromScaling(modelLeg3Matrix,[0.25,0.75,0.25]);
    mat4.multiply(modelLeg3Matrix, modelLeg3Matrix, baseMatrix);
    var t4 = mat4.create();
    mat4.fromTranslation(t4, [-1.25, -0.5, 1]);
    mat4.multiply(modelLeg3Matrix, modelLeg3Matrix, t4);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, null, modelLeg3Matrix, viewMatrix, projectionMatrix, shaderProgram);

    // Draw Legs
    var modelLeg4Matrix = mat4.create();
    mat4.fromScaling(modelLeg4Matrix,[0.25,0.75,0.25]);
    mat4.multiply(modelLeg4Matrix, modelLeg4Matrix, baseMatrix);
    var t5 = mat4.create();
    mat4.fromTranslation(t5, [-1.25, -0.5, -1]);
    mat4.multiply(modelLeg4Matrix, modelLeg4Matrix, t5);
    drawPart(bodyPosBuffer, bodyNormalBuffer, bodyColorBuffer, bodyIndexBuffer, null, modelLeg4Matrix, viewMatrix, projectionMatrix, shaderProgram);
    */
  }

  slider1.addEventListener("input", draw);
  slider2.addEventListener("input", draw);
  initTextureThenDraw();
}

window.onload = start;
