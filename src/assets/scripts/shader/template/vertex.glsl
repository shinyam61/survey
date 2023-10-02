precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;

varying vec3 vPosition;
varying vec3 vColor;

void main () {
  vPosition = position;
  vColor = color;

  gl_Position = vec4(position, 1.0);
}
