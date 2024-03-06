precision mediump float;

// uniform float progress;
uniform sampler2D tex1;
uniform sampler2D tex2;
// uniform vec2 mouse;
uniform float time;

varying vec2 vUv;

void main () {

  float p = clamp((cos(time / 1.5) * .6) + .5, 0., 1.);

  vec2 uv = 1.0 - vUv;

  // gl_FragColor = vec4(step(progress, vDelay), .0, .0, 1.0);
  vec4 texColor1 = texture2D(tex1, uv);
  vec4 texColor2 = texture2D(tex2, uv);

  float x = step(uv.x, p);
  vec4 color = mix(texColor1, texColor2, x);

  gl_FragColor = color;
}