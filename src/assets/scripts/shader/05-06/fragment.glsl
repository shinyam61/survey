precision mediump float;

// uniform float progress;
uniform sampler2D tex1;
uniform sampler2D tex2;
// uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

varying vec2 vUv;

float noise1(float time,vec2 resolution) {vec2 coord=gl_FragCoord.xy/resolution;vec2 signedCoord=coord*2.0-1.0;return (sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,0.6666666666666665)))*19.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,0.6666666666666665)))*-13.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,0.6666666666666665)))*-9.0)+sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,-5.551115123125783e-17)))*10.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,-5.551115123125783e-17)))*14.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,-5.551115123125783e-17)))*7.0)+sin((-time*0.1+length(signedCoord-vec2(-0.6666666666666667,-0.6666666666666667)))*17.0)+sin((-time*0.1+length(signedCoord-vec2(-5.551115123125783e-17,-0.6666666666666667)))*13.0)+sin((-time*0.1+length(signedCoord-vec2(0.6666666666666667,-0.6666666666666667)))*16.0))/18.0+.5;}
float noise2(float time,vec2 resolution) {vec2 coord=gl_FragCoord.xy/resolution;vec2 signedCoord=coord*2.0-1.0;return (sin((-time*0.001+length(signedCoord-vec2(-0.8333333333333334,0.8)))*9.0)+sin((-time*0.001+length(signedCoord-vec2(0.1666666666666666,0.8)))*39.0)+sin((-time*0.001+length(signedCoord-vec2(-0.16666666666666666,0.4000000000000002)))*15.0)+sin((-time*0.001+length(signedCoord-vec2(0.8333333333333334,5.551115123125783e-17)))*20.0)+sin((-time*0.001+length(signedCoord-vec2(-0.8333333333333334,5.551115123125783e-17)))*33.0)+sin((-time*0.001+length(signedCoord-vec2(0.1666666666666666,-0.39999999999999997)))*30.0)+sin((-time*0.001+length(signedCoord-vec2(0.4999999999999999,-0.39999999999999997)))*25.0)+sin((-time*0.001+length(signedCoord-vec2(-0.8333333333333334,-0.39999999999999997)))*20.0)+sin((-time*0.001+length(signedCoord-vec2(-0.16666666666666666,-0.8)))*10.0)+sin((-time*0.001+length(signedCoord-vec2(0.4999999999999999,-0.8)))*30.0)+sin((-time*0.001+length(signedCoord-vec2(0.8333333333333334,-0.8)))*43.0)+sin((-time*0.001+length(signedCoord-vec2(-0.8333333333333334,-0.8)))*50.0)+sin((-time*0.001+length(signedCoord-vec2(-0.5,-1.2)))*15.0)+sin((-time*0.001+length(signedCoord-vec2(0.4999999999999999,-1.2)))*25.0)+sin((-time*0.001+length(signedCoord-vec2(0.8333333333333334,-1.2)))*7.0))/30.0+.5;}

vec4 fireGradient(vec2 uv) {
    
    vec4 colors[13];
    
    colors[0] = vec4(0.4,0.4,0.4,0.0);
    colors[1] = vec4(0.102,0.102,0.102,0.0);
    colors[2] = vec4(0.0,0.0,0.0,1.0);
    colors[3] = vec4(1.0,0.2,0.0,1.0);
    colors[4] = vec4(1.0,1.0,0.0,1.0);
    colors[5] = vec4(1.0,1.0,0.788,1.0);
    colors[6] = vec4(0.98,0.98,0.35,1.0);
    colors[7] = vec4(1.0,0.2,0.0,1.0);
    colors[8] = vec4(0.0,0.0,0.0,1.0);
    colors[9] = vec4(0.0,0.0,0.0,1.0);
    colors[10] = vec4(0.4,0.2,0.0,1.0);
    colors[11] = vec4(1.0,1.0,1.0,0.0);
    colors[12] = vec4(1.0,1.0,1.0,0.0);
    
    //float pos[13] = [0, 32, 70, 71, 72, 73, 74, 75, 78, 95, 105, 158];
    
    //Why? I can't write like this
    //float pos[13] = [0.0, 0.1255, 0.2745, 0.2784, 0.2824, 0.2863, 0.2902, 0.2941, 0.3059, 0.3725, 0.4118, 0.6197, 1.0];
    
    float pos[13];
    
    pos[0] = 0.0;
    pos[1] = 0.1255;
    pos[2] = 0.2745;
    pos[3] = 0.2784;
    pos[4] = 0.2824;
    pos[5] = 0.2863;
    pos[6] = 0.2902;
    pos[7] = 0.2941;
    pos[8] = 0.3059;
    pos[9] = 0.3725;
    pos[10] = 0.4118;
    pos[11] = 0.6197;
    pos[12] = 1.0;
    
    vec4 color = vec4(vec3(0.0), 1.0);
    for(int i = 0; i < 12; i++){
       	vec4 color1 =  colors[i];
       	vec4 color2 =  colors[i + 1];
        
        float pos1 = pos[i];
        float pos2 = pos[i + 1];
        
        float percent = (uv.x - pos1) / (pos2-pos1);
        
        if(percent >= 0.0 && uv.x <= 1.0 ){
            color = mix(color1,color2,percent);
            
        }
    }

    return color;
}

// 各色のalphaの比率で色を加算合成
vec4 alphaBlend( vec4 tc, vec4 bc) {
	vec4 o;
	o.rgb = bc.rgb * (1.0 - tc.a) + tc.rgb * tc.a;
	o.a = 1.0 - (1.0 - tc.a) * (1.0 - bc.a);
	return o; 
}

const float oneTime = 7.0;


void main () {

  float n1 = noise1(floor(time / oneTime), resolution);
  float n2 = noise2(floor(time / oneTime), resolution);

  vec2 uv = 1.0 - vUv;

  vec4 texColor1 = texture2D(tex1, uv);
  vec4 texColor2 = texture2D(tex2, uv);

  bool isToRight = sign(1.0 - step(oneTime, mod(time, oneTime * 2.0))) == 1.;

  vec4 tex1 = isToRight ? texColor1 : texColor2;
  vec4 tex2 = isToRight ? texColor2 : texColor1;


  float percent = 0.0;
  // n1, n2 を掛け合わせることで、切り替わり位置に規則性を崩す（n1,n2それぞれだけだと波形の規則性が出てしまう）
  // 7s周期、2sウェイト → 5sディストーション
  percent = (n1 * n2) + mod(time, oneTime) * (1. / 5.) - ((oneTime / 5.) - 1.);
  // 0.0~1.0にくるめる
  percent = clamp(percent, 0.0,1.0);
  // グラデションテクスチャの画像抽出用座標として使う
  // 0%     15%    30%     45%    65%
  // グレー　黒　　　オレンジ　黒　　　白
  // 透明　　不透明　不透明　　不透明　透明
  vec4 gradientColor = fireGradient(vec2(1.0 - percent,0));
  // gradientColor = fireGradient(vec2(1.0 - uv.x,0));
  // 線形補間
  // 0.0~0.7255   : 1.0
  // 0.7255~0.8745: 線形補間
  // 0.8745~      : 0.0
  float alpha = clamp((percent - 0.8745) /(0.7255 - 0.8745), 0.0, 1.0);

  // gradientColorは不透明度が変化するテクチャ
  // texColor1は常に不透明度が1
  vec4 color = alphaBlend(gradientColor, tex1);
  
  // alpha比率による色の算出  
  color.rgb *= alpha;
  // alpha設定
  color.a = alpha;
  
  // colorは不透明度が変化するテクチャ
  // texColor1は常に不透明度が1
  gl_FragColor = alphaBlend(color, tex2);
  
  // gl_FragColor = gradientColor;
  // gl_FragColor = vec4(vec3(1.0 - percent), 1.);

  // color = mix(texColor1, texColor2, x);

  // gl_FragColor = color;
  // gl_FragColor = gradientColor;
  // gl_FragColor = vec4(vec3(percent), 1.0);
  // gl_FragColor = vec4(vec3(n + p * 2.0 - 1.), 1.0);
  // gl_FragColor = vec4(vec3(n), 1.0);
}