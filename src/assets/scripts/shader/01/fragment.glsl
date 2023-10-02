precision highp float;

uniform float progress;

varying vec4 vColor;
varying float vDelay;

void main () {

  // gl_FragColor = vec4(step(progress, vDelay), .0, .0, 1.0);
  gl_FragColor = vColor;
}