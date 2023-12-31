precision mediump float;

uniform mat4 invMatrix;
uniform vec3 directionalLightPos;
uniform vec4 ambientColor;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vColor;

void main () {

  // 前提：invMatrix は mMatrix の逆行列
  //  ambientLightPos の位置は ワールド空間座標において常に同じ位置にいるが、
  //  ポリゴンと directionalLightPos の位置関係は、
  //  ポリゴンが translate, rotate, scale されている場合であっても変わらない。
  //  ポリゴンが translate, rotate, scale されている場合、それに合わせて directionalLightPos の位置を算出する必要がある。
  vec3  invLight = normalize(invMatrix * vec4(directionalLightPos, 0.0)).xyz;
  // 拡散値の算出
  //  頂点の法線の向きと、ライトの当たり方（向き）による内積を取得
  //  -> 向き合う（-><-）場合は：1.0（明るい）
  //  -> 反目しあう（<-->）場合は：0.0（暗い）
  float diffuse  = clamp(dot(vNormal, invLight), 0.0, 1.0);
  // ポリゴンの色に対して陰影（diffuseによる色の強弱）を算出したのち、
  // 「 環境光を全体に加算 」
  vec4 destColor = vColor * vec4(vec3(diffuse), 1.0) + ambientColor;
  
  gl_FragColor = destColor;
  // gl_FragColor = vec4(1.0);
}