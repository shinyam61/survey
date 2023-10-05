precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec4 color;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform mat4 invMatrix;
uniform mat4 nMatrix;
uniform vec3 directionalLightPos;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vColor;

void main () {
  vPosition = (mMatrix * vec4(position, 1.0)).xyz;
  vNormal = normal;
  vUv = uv;
  vColor = color;

  gl_Position = mvpMatrix * vec4(position, 1.0);
}
