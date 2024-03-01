precision mediump float;

uniform float progress;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 vUv;

void main () {
  float aspect = resolution.x / resolution.y;
  vec2 mUv = mouse * .5 + .5;

  vec2 p = vec2(vUv.x * aspect, vUv.y);
  vec2 m = vec2(mUv.x * aspect, 1.0 - mUv.y);
  float distance = distance(p, m);
  float vignette = 1.0 - distance * (2. / (progress + .5));

  // gl_FragColor = vec4(step(progress, vDelay), .0, .0, 1.0);
  vec4 texColor1 = texture2D(tex1, 1.0 - vUv);
  vec4 texColor2 = texture2D(tex2, 1.0 - vUv);
  float clip = smoothstep(0.1, .2, vignette);
  vec4 color = vec4(vec3(mix(texColor1.rgb, texColor2.rgb, clip)), 1.);

  gl_FragColor = color;
}