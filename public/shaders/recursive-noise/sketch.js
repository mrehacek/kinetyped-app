// a shader variable
let theShader;

function preload(){
  // load the shader
  theShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  pixelDensity(1);
  noStroke();
}

function draw() {  
  // shader() sets the active shader with our shader
  shader(theShader);
  
  theShader.setUniform("iResolution", [width, height]);
  theShader.setUniform("iFrame", frameCount);
  theShader.setUniform("iMouse", [mouseX, map(mouseY, 0, height, height, 0)]);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}