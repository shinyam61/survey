precision mediump float;

// uniform float progress;
uniform sampler2D tex1;
uniform sampler2D tex2;
// uniform vec2 mouse;
uniform float time;

varying vec2 vUv;

void main () {

  float p = 1.0 - clamp((cos(time / 1.5) * .6) + .5, 0., 1.);

  // gl_FragColor = vec4(step(progress, vDelay), .0, .0, 1.0);
  vec4 texColor1 = texture2D(tex1, 1.0 - vUv);
  vec4 texColor2 = texture2D(tex2, 1.0 - vUv);

  vec4 color = mix(texColor1, texColor2, p);

  gl_FragColor = color;
}