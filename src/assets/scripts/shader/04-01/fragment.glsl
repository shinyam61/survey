precision mediump float;

uniform float progress;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform vec2 mouse;

varying vec2 vUv;

void main () {

  vec2 mUv = mouse * .5 + .5;
  float isLeft = max(sign(vUv.x - mUv.x), 0.0);
  float isRight = 1.0 - isLeft;

  // gl_FragColor = vec4(step(progress, vDelay), .0, .0, 1.0);
  vec4 texColor1 = texture2D(tex1, 1.0 - vUv);
  vec4 texColor2 = texture2D(tex2, 1.0 - vUv);
  vec4 color = texColor1 * isLeft + texColor2 * isRight;

  gl_FragColor = color;
}