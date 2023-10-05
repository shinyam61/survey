precision mediump float;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform mat4 invMatrix;
uniform mat4 nMatrix;
uniform vec3 directionalLightPos;
uniform vec3 pointLightPos;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vColor;


void main () {

  // ディレクショナルライトの拡散値を算出
  vec3  invDirectionalLight = normalize(invMatrix * vec4(directionalLightPos, 0.0)).xyz;
  float diffuseDirectional  = clamp(dot(vNormal, invDirectionalLight), 0.1, 1.0);

  // ポイントライト光源位置からポリゴンの頂点へ向かう光の向きを算出
  vec3 vecPointL2VertecsP = pointLightPos - vPosition; // ベクトルを算出
  vec3 invPointLight =  normalize(invMatrix * vec4(vecPointL2VertecsP, 0.0)).xyz; // 光源位置からの頂点へのベクトルに変換 
  // 光の向きから拡散値を算出
  float diffusePoint = clamp(dot(vNormal, invPointLight), 0.0, 1.0);

  // ディレクショナルライトによって生じるポリゴンの陰影
  // ポイントライトによって生じるポリゴンの陰影
  // 上記の陰影を合成する
  vec3 combinedLight = vec3(1.0, 1.0, 1.0) * diffuseDirectional + vec3(1.0, 0.0, 0.0) * diffusePoint;

  gl_FragColor = vec4(vColor.rgb * combinedLight, 1.0);
  // gl_FragColor = vec4(1.0);
}