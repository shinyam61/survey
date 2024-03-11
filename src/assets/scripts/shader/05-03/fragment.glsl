precision mediump float;

// uniform float progress;
uniform sampler2D tex1;
uniform sampler2D tex2;
// uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 vUv;

float noise(float time,vec2 resolution) {vec2 coord=gl_FragCoord.xy/resolution;vec2 signedCoord=coord*2.0-1.0;return (sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,0.6666666666666665)))*19.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,0.6666666666666665)))*-13.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,0.6666666666666665)))*-9.0)+sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,-5.551115123125783e-17)))*10.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,-5.551115123125783e-17)))*14.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,-5.551115123125783e-17)))*7.0)+sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,-0.6666666666666667)))*17.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,-0.6666666666666667)))*13.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,-0.6666666666666667)))*16.0))/18.0+.5;}

void main () {

  float n = noise(time, resolution);
  float p = clamp((cos(time / 1.5) * .6) + .5, 0., 1.);

  vec2 uv = 1.0 - vUv;

  // gl_FragColor = vec4(step(progress, vDelay), .0, .0, 1.0);
  vec4 texColor1 = texture2D(tex1, uv);
  vec4 texColor2 = texture2D(tex2, uv);

  float x = step(uv.x, p);
  vec4 color = mix(texColor1, texColor2, clamp(n + p * 2.0 - 1., .0, 1.));

  gl_FragColor = color;
  // gl_FragColor = vec4(vec3(n + p * 2.0 - 1.), 1.0);
}