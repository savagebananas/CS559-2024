
function start() {

  // Get canvas, WebGL context, twgl.m4
  var canvas = document.getElementById("mycanvas");
  var gl = canvas.getContext("webgl");

  // Sliders at center
  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
  var slider2 = document.getElementById('slider2');
  slider2.value = 0;

  // Read shader source
  var vertexSource = document.getElementById("vertexShader").text;
  var skyFragmentSource = document.getElementById("skyFragmentShader").text; // skybox
  var fireFragmentSource = document.getElementById("fireFragmentShader").text;

  //#region Shader Setup

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

  // with the vertex shader, we need to pass it positions
  // as an attribute - so set up that communication
  function setupAttributesAndUniforms(shdrPrgm){
    shdrPrgm.PositionAttribute = gl.getAttribLocation(shdrPrgm, "vPosition");
    gl.enableVertexAttribArray(shdrPrgm.PositionAttribute);
  
    shdrPrgm.NormalAttribute = gl.getAttribLocation(shdrPrgm, "vNormal");
    gl.enableVertexAttribArray(shdrPrgm.NormalAttribute);
  
    shdrPrgm.ColorAttribute = gl.getAttribLocation(shdrPrgm, "vColor");
    gl.enableVertexAttribArray(shdrPrgm.ColorAttribute);
  
    shdrPrgm.texcoordAttribute = gl.getAttribLocation(shdrPrgm, "vTexCoord");
    gl.enableVertexAttribArray(shdrPrgm.texcoordAttribute);
  
    // this gives us access to the matrix uniform
    shdrPrgm.MVmatrix = gl.getUniformLocation(shdrPrgm, "uMV");
    shdrPrgm.MVNormalmatrix = gl.getUniformLocation(shdrPrgm, "uMVn");
    shdrPrgm.MVPmatrix = gl.getUniformLocation(shdrPrgm, "uMVP");
  
    // Attach samplers to texture units
    shdrPrgm.texSampler1 = gl.getUniformLocation(shdrPrgm, "texSampler1");
    gl.uniform1i(shdrPrgm.texSampler1, 0);
    shdrPrgm.texSampler2 = gl.getUniformLocation(shdrPrgm, "texSampler2");
    gl.uniform1i(shdrPrgm.texSampler2, 1);
  }

  //#endregion

  //#region Skybox arrays

  var vertexPos = new Float32Array(
    [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1,
      1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1,
      1, 1, 1, 1, 1, -1, -1, 1, -1, -1, 1, 1,
      -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1,
      -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
      1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, -1]);

  var vertexNormals = new Float32Array([
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1
  ]);

  var vertexColors = new Float32Array([
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
    1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
    0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1
  ]);

  var vertexTextureCoords = new Float32Array([
    0, 0,   0.25, 0,   0.25, 1,   0, 1,
    1, 0,   1, 1,   0.75, 1,   0.75, 0,
    0, 1,   0, 0,   1, 0,   1, 1,
    0.25, 0,   0.5, 0,   0.5, 1,   0.25, 1,
    1, 1,   0, 1,   0, 0,   1, 0,
    0.75, 1,   0.5, 1,   0.5, 0,   0.75, 0
  ]);

  var triangleIndices = new Uint8Array([
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // right
    8, 9, 10, 8, 10, 11,    // top
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // bottom
    20, 21, 22, 20, 22, 23       // back
  ]);
  //#endregion

  //#region Log arrays

  var logVertexPos = new Float32Array([
    9,4,2,   9,0,4,   9,4,-2,    9,0,-4, // front
    9,4,-2,  9,0,-4,  -9,4,-2,  -9,0,-4, // right
    9,4,2,   9,4,-2,  -9,4,2,   -9,4,-2, // top
    -9,4,2, -9,0,4,    9,4,2,    9,0,4,  // left
    9,0,4,   9,0,-4,  -9,0,4,   -9,0,-4, // bottom
    -9,4,-2, -9,0,-4, -9,4,2,    -9,0,4  // back
    ]);

  var logVertexNormals = new Float32Array([
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1
  ]);

  var logVertexColors = new Float32Array([
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
    1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
    0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1
  ]);

  var logVertexTextureCoords = new Float32Array([
    0, 0.5,   0, 1,   0.5, 0.5,   0.5, 1,
    0, 0,   0, 0.5,   1, 0,   1, 0.5,
    0, 0,   0, 0.5,   1, 0,   1, 0.5,
    0, 0,   0, 0.5,   1, 0,   1, 0.5,
    0, 0,   0, 0.5,   1, 0,   1, 0.5,
    0, 0.5,   0, 1,   0.5, 0.5,   0.5, 1,
  ]);

  var logTriangleIndices = new Uint8Array([
    0, 1, 2, 2, 3, 1,    // front
    4, 5, 6, 6, 7, 5,    // right
    8, 9, 10, 10, 11, 9,   // top
    12, 13, 14, 14, 15, 13,    // left
    16, 17, 18, 18, 19, 17,    // bottom
    20, 21, 22, 22, 23, 21       // back
  ]);
  //#endregion
  
  //#region Buffers

  //Skybox Buffers
  var trianglePosBuffer = createBuffer(vertexPos, false, false);
  trianglePosBuffer.numItems = triangleIndices.length;
  var triangleNormalBuffer = createBuffer(vertexNormals);
  triangleNormalBuffer.numItems = vertexNormals.length;
  var colorBuffer = createBuffer(vertexColors);
  colorBuffer.numItems = vertexColors.length;
  var textureBuffer = createBuffer(vertexTextureCoords, false, true);
  textureBuffer.numItems = vertexTextureCoords.length / 2;
  var indexBuffer = createBuffer(triangleIndices, true);

  // Log Buffers
  var logTrianglePosBuffer = createBuffer(logVertexPos, false, false);
  logTrianglePosBuffer.numItems = logTriangleIndices.length;
  var logTriangleNormalBuffer = createBuffer(logVertexNormals);
  logTriangleNormalBuffer.numItems = logVertexNormals.length;
  var logColorBuffer = createBuffer(logVertexColors);
  logColorBuffer.numItems = logVertexColors.length;
  var logTextureBuffer = createBuffer(logVertexTextureCoords, false, true);
  logTextureBuffer.numItems = logVertexTextureCoords.length / 2;
  var logIndexBuffer = createBuffer(logTriangleIndices, true);

  // Helper to create buffers
  function createBuffer(data, isIndexBuffer = false, isTextureBuffer = false) {
    var buffer = gl.createBuffer();
    var target = isIndexBuffer ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, gl.STATIC_DRAW);
    if (!isIndexBuffer) buffer.itemSize = isTextureBuffer ? 2 : 3;
    return buffer;
  }

  //#endregion
  
  // Set up texture
  var texture1 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image1 = new Image();

  var texture2 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture2);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image2 = new Image();

  var texture3 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture3);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  var image3 = new Image();

  function initTextureThenDraw() {
    image1.onload = function () { loadTexture(image1, texture1); };
    image1.crossOrigin = "anonymous";
    image1.src = "https://live.staticflickr.com/65535/54192900449_2b5e025acb_o.jpg";

    image2.onload = function () { loadTexture(image2, texture2); };
    image2.crossOrigin = "anonymous";
    image2.src = "https://live.staticflickr.com/65535/54196260182_80e082f823_o.jpg";

    image3.onload = function() { loadTexture(image3,texture3); };
    image3.crossOrigin = "anonymous";
    image3.src = "https://live.staticflickr.com/65535/50641908943_f6ebfef28d_o.jpg";

    window.setTimeout(draw, 200);
  }

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

  function drawPart(trianglePosBuffer, triangleNormalBuffer, colorBuffer, indexBuffer, textureBuffer, modelMatrix, viewMatrix, projectionMatrix, shaderPrgm) {
    var tMV = mat4.create();
    var tMVn = mat3.create();
    var tMVP = mat4.create();
    mat4.multiply(tMV, viewMatrix, modelMatrix);
    mat3.normalFromMat4(tMVn, tMV);
    mat4.multiply(tMVP, projectionMatrix, tMV);

    gl.uniformMatrix4fv(shaderPrgm.MVmatrix, false, tMV);
    gl.uniformMatrix3fv(shaderPrgm.MVNormalmatrix, false, tMVn);
    gl.uniformMatrix4fv(shaderPrgm.MVPmatrix, false, tMVP);

    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.vertexAttribPointer(shaderPrgm.PositionAttribute, trianglePosBuffer.itemSize,
      gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.vertexAttribPointer(shaderPrgm.NormalAttribute, triangleNormalBuffer.itemSize,
      gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderPrgm.ColorAttribute, colorBuffer.itemSize,
      gl.FLOAT, false, 0, 0);

    // set index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Bind Texture
    
    if (textureBuffer != null) {
      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      gl.vertexAttribPointer(shaderPrgm.texcoordAttribute, textureBuffer.itemSize,
        gl.FLOAT, false, 0, 0);
    }
    

    gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);
  }

  function draw() {

    var angle1 = slider1.value * 0.01 * Math.PI;
    var angle2 = slider2.value;

    var eye = [20 * Math.sin(angle1), 7, 20 * Math.cos(angle1)];
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eye, target, up);

    var projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, 1, 10, 1000);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    //#region Skybox

    // switch shader!
    var shaderProgram = shaderSetup(vertexSource, skyFragmentSource);
    setupAttributesAndUniforms(shaderProgram);

    var skyBoxModelMatrix = mat4.create();
    mat4.fromScaling(skyBoxModelMatrix, [400, 500, 400]);
    var translation = mat4.create();
    mat4.fromTranslation(translation, [0, -0.45, 0]);
    mat4.multiply(skyBoxModelMatrix, skyBoxModelMatrix, translation);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    drawPart(trianglePosBuffer, triangleNormalBuffer, colorBuffer, indexBuffer, textureBuffer, skyBoxModelMatrix, viewMatrix, projectionMatrix, shaderProgram);
    
    //#endregion

    //#region CAMPFIRE

    // Switch shaders!
    var fireShaderProgram = shaderSetup(vertexSource, fireFragmentSource);
    setupAttributesAndUniforms(fireShaderProgram);

    var campfireParentMatrix = mat4.create();
    mat4.rotate(campfireParentMatrix,campfireParentMatrix, angle2 * 0.05,[0,1,0]); // rotate 90 degree
    var campfireTransform = mat4.create();
    mat4.fromTranslation(campfireTransform, [0, -5, 0]);
    mat4.multiply(campfireParentMatrix, campfireParentMatrix, campfireTransform);

    // log 1
    var log1ModelMatrix = mat4.create();
    mat4.fromScaling(log1ModelMatrix, [0.5, 0.5, 0.5]);
    mat4.translate(log1ModelMatrix,log1ModelMatrix, [0,0.1,0]); // move up 0.1
    mat4.multiply(log1ModelMatrix, log1ModelMatrix, campfireParentMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    drawPart(logTrianglePosBuffer, logTriangleNormalBuffer, logColorBuffer, logIndexBuffer, logTextureBuffer, log1ModelMatrix, viewMatrix, projectionMatrix, fireShaderProgram);

    // log 2
    var log2ModelMatrix = mat4.create();
    mat4.fromScaling(log2ModelMatrix, [0.5, 0.5, 0.5]);
    mat4.rotate(log2ModelMatrix,log2ModelMatrix, Math.PI * .5 ,[0,1,0]); // rotate 90 degree
    mat4.multiply(log2ModelMatrix, log2ModelMatrix, campfireParentMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    drawPart(logTrianglePosBuffer, logTriangleNormalBuffer, logColorBuffer, logIndexBuffer, logTextureBuffer, log2ModelMatrix, viewMatrix, projectionMatrix, fireShaderProgram);
  
    //#endregion
  }

  slider1.addEventListener("input", draw);
  slider2.addEventListener("input", draw);
  initTextureThenDraw();
}

window.onload = start;
