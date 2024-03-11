precision mediump float;

attribute vec3 position;
// attribute vec3 normal;
attribute vec2 uv;

// uniform mat4 mMatrix;
// uniform mat4 mvpMatrix;
// uniform mat4 scaleMatrix;
// uniform float time;
// uniform float progress;

varying vec2 vUv;

void main () {
  vec3 pos = position;

  vUv = uv;

  gl_Position = vec4(pos, 1.0);
}
