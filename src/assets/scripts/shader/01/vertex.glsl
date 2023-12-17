precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform mat4 scaleMatrix;
uniform float time;
uniform float progress;

varying vec3 vPosition;
varying vec4 vColor;
varying float vDelay;

#define PI 3.141592653589793
float backOut(float t) {
  float f = t < 0.5
    ? 2.0 * t
    : 1.0 - (2.0 * t - 1.0);

  float g = pow(f, 3.0) - f * sin(f * PI);

  return t < 0.5
    ? 0.5 * g
    : 0.5 * (1.0 - g) + 0.5;
}


vec2 startUv = vec2(.5, .5); // 中心から
// vec2 startUv = vec2(.0, 1.0); // 左上から
vec2 endUv = vec2(1.0, 1.0);


void main () {
  vec3 pos = position;
  vPosition = (mMatrix * vec4(pos, 1.0)).xyz;
  vColor = vec4(uv, 0.0, 1.0);

  vec3 scaledPositon = (scaleMatrix * vec4(pos, 1.0)).xyz;

  // delayMax = 1
  // 分母max => sqrt( pow(1, 2) + pow(1, 2) ) => √2
  float delay = distance(startUv, uv) / distance(startUv, endUv);
  float x = clamp(progress * 2.0 - delay * 1., .0, 1.0);

  // pos.x += sin(pos.y * 2.5 + 2.0 * time) * .25
  //   * sin(pos.x * 5.5 + 2.0 * time) * .25;

  vDelay = delay;

  // float p = backOut(x);
  float p = x;

  vPosition.x = mix(pos.x, scaledPositon.x, p);
  vPosition.y = mix(pos.y, scaledPositon.y, p);

  gl_Position = mvpMatrix * vec4(vPosition, 1.0);
}
