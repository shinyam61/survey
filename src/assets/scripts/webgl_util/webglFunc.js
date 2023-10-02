// シェーダを生成する関数
function create_shader(gl, source, type){
  var shader;
  // scriptタグのtype属性をチェック
  switch(type){
    
    // 頂点シェーダの場合
    case 'v':
      shader = gl.createShader(gl.VERTEX_SHADER);
      break;
      
    // フラグメントシェーダの場合
    case 'f':
      shader = gl.createShader(gl.FRAGMENT_SHADER);
      break;
    default :
      return;
  }
  
  // 生成されたシェーダにソースを割り当てる
  gl.shaderSource(shader, source);
  
  // シェーダをコンパイルする
  gl.compileShader(shader);
  
  // シェーダが正しくコンパイルされたかチェック
  if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    
    // 成功していたらシェーダを返して終了
    return shader;
  }else{
    
    // 失敗していたらエラーログをアラートする
    alert(gl.getShaderInfoLog(shader));
  }
}

// プログラムオブジェクトを生成しシェーダをリンクする関数
function create_program(gl, vs, fs){

  // プログラムオブジェクトの生成
  var program = gl.createProgram();
  
  // プログラムオブジェクトにシェーダを割り当てる
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  
  // シェーダをリンク
  gl.linkProgram(program);
  
  // シェーダのリンクが正しく行なわれたかチェック
  if(gl.getProgramParameter(program, gl.LINK_STATUS)){
  
    // 成功していたらプログラムオブジェクトを有効にする
    gl.useProgram(program);
    
    // プログラムオブジェクトを返して終了
    return program;
  }else{
    
    // 失敗していたらエラーログをアラートする
    alert(gl.getProgramInfoLog(program));
  }
}

// VBOを生成する関数
function create_vbo(gl, data){
  // バッファオブジェクトの生成
  var vbo = gl.createBuffer();
  
  // バッファをバインドする
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  
  // バッファにデータをセット
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  
  // バッファのバインドを無効化
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  // 生成した VBO を返して終了
  return vbo;
}

// VBOをバインドし登録する関数
function set_attribute(gl, vbo, attL, attS){
  // 引数として受け取った配列を処理する
  for(var i in vbo){
    // バッファをバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
    
    // attributeLocationを有効にする
    gl.enableVertexAttribArray(attL[i]);
    
    // attributeLocationを通知し登録する
    gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
  }
}

// IBOを生成する関数
function create_ibo(gl, data){
  // バッファオブジェクトの生成
  var ibo = gl.createBuffer();
  
  // バッファをバインドする
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  
  // バッファにデータをセット
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
  
  // バッファのバインドを無効化
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
  // 生成したIBOを返して終了
  return ibo;
}

// テクスチャを生成する関数
function create_texture(gl, resource){
  // テクスチャオブジェクトを生成
  const texture = gl.createTexture();
  // アクティブなテクスチャユニット番号を指定する
  gl.activeTexture(gl.TEXTURE0);
  // テクスチャをアクティブなユニットにバインドする
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // バインドしたテクスチャにデータを割り当て
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resource);
  // ミップマップを自動生成する
  gl.generateMipmap(gl.TEXTURE_2D);
  // テクスチャパラメータを設定する
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  // 安全の為にテクスチャのバインドを解除してから返す
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

// フレームバッファをオブジェクトとして生成する関数
function create_framebuffer(gl, width, height){
  // フレームバッファの生成
  var framebuffer = gl.createFramebuffer();
  
  // フレームバッファをWebGLにバインド
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  
  // 深度バッファ用レンダーバッファの生成とバインド
  var depthRenderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderbuffer);
  
  // レンダーバッファを深度バッファとして設定
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  
  // フレームバッファにレンダーバッファを関連付ける
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderbuffer);
  
  // フレームバッファ用テクスチャの生成
  var texture = gl.createTexture();
  
  // フレームバッファ用のテクスチャをバインド
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // フレームバッファ用のテクスチャにカラー用のメモリ領域を確保
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  
  // テクスチャパラメータ
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // フレームバッファにテクスチャを関連付ける
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  
  // 各種オブジェクトのバインドを解除
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  // オブジェクトを返して終了
  return {framebuffer, depthRenderbuffer, texture};
}      

function delete_framebuffer(gl, framebuffer, renderbuffer, texture) {
  gl.deleteFramebuffer(framebuffer);
  gl.deleteRenderbuffer(renderbuffer);
  gl.deleteTexture(texture);
  framebuffer = null;
  renderbuffer = null;
  texture = null;
}

export default {
  create_shader,
  create_program,
  create_vbo,
  set_attribute,
  create_ibo,
  create_texture,
  create_framebuffer,
  delete_framebuffer
}