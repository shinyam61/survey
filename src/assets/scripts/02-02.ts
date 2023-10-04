import BasicApp from "./webgl_util/App";
import { matIV, torus as Torus } from './webgl_util/minMatrixb'
import webglFunc from './webgl_util/webglFunc'
import PlaneGeometry from "./webgl_util/PlaneGeometory";

import vShader from '@assets/scripts/shader/02-02/vertex.glsl';
import fShader from '@assets/scripts/shader/02-02/fragment.glsl';


window.addEventListener('DOMContentLoaded', () => {
  new AmbientLightApp();
})

class AmbientLightApp extends BasicApp {

  protected planeGeometory!: PlaneGeometry;
  protected torusGeometory!: any;
  protected planeParams: any;
  protected planeBuffer: any;
  protected torusParams: any;
  protected torusBuffer: any;

  private ambientColor = [0.25, 0.25, 0.25, 1.0];
  private directionalLightPos = [0.0, 10.0, 0.0];

  constructor() {
    super(vShader, fShader, [0.0, 2.0, 5.0]);

    this.createGeometory();

    this.render();
  }

  createGeometory() {
    const gl = this.gl;
    const planeGeometory = this.planeGeometory = new PlaneGeometry(3, 3);

    const planeColor = [.75, .75, .75];
    const planeGeometoryColor = [...Array(planeGeometory.position.length / 3)].map(() => [...planeColor, 1.0]).flat();
    this.planeBuffer = {
      v: [
        webglFunc.create_vbo(gl, planeGeometory.position),
        webglFunc.create_vbo(gl, planeGeometory.normal),
        webglFunc.create_vbo(gl, planeGeometory.uv),
        webglFunc.create_vbo(gl, planeGeometoryColor),
      ],
      i: webglFunc.create_ibo(gl, planeGeometory.index)
    }

    const torusColor = [1.0, 1.0, 1.0];
    const torusGeometory = this.torusGeometory = Torus(100, 100, .1, .25, [...torusColor, 1.0]);
    this.torusBuffer = {
      v: [
        webglFunc.create_vbo(gl, torusGeometory.p),
        webglFunc.create_vbo(gl, torusGeometory.n),
        webglFunc.create_vbo(gl, torusGeometory.t),
        webglFunc.create_vbo(gl, torusGeometory.c),
      ],
      i: webglFunc.create_ibo(gl, torusGeometory.i)
    }

    this.renderParams = {
      attLocation: [
        gl.getAttribLocation(this.renderProgram, 'position'),
        gl.getAttribLocation(this.renderProgram, 'normal'),
        gl.getAttribLocation(this.renderProgram, 'uv'),
        gl.getAttribLocation(this.renderProgram, 'color'),
      ],
      attStride: [
        3, 3, 2, 4
      ],
      uniLocation: {
        mMatrix: gl.getUniformLocation(this.renderProgram, 'mMatrix'),
        mvpMatrix: gl.getUniformLocation(this.renderProgram, 'mvpMatrix'),
        invMatrix: gl.getUniformLocation(this.renderProgram, 'invMatrix'),
        ambientColor: gl.getUniformLocation(this.renderProgram, 'ambientColor'),
        directionalLightPos: gl.getUniformLocation(this.renderProgram, 'directionalLightPos'),
        time: gl.getUniformLocation(this.renderProgram, 'time'),
      }
    }

  }
  loadScopeEnv () {
    console.log('loadScopeEnv')
  }

  drawGeometory() {
    const gl = this.gl;
    const m = new matIV();

    this.drawFloor(gl, m);
    this.drawTorus(gl, m);
  }

  drawFloor (gl: WebGLRenderingContext, m: matIV) {

    webglFunc.set_attribute(gl, this.planeBuffer.v, this.renderParams.attLocation, this.renderParams.attStride);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.planeBuffer.i);

      // モデル座標変換行列の生成
    m.identity(this.mat.mMatrix);

    m.translate(
      this.mat.mMatrix,
      [0.0, -0.3, 0.0],
      this.mat.mMatrix,
    );
    m.rotate(
      this.mat.mMatrix,
      this.deg2rad(-90),
      [1.0, 0.0, 0.0],
      this.mat.mMatrix,
    );

    m.multiply(this.mat.tmpMatrix, this.mat.mMatrix, this.mat.mvpMatrix);
    m.inverse(this.mat.mMatrix, this.mat.invMatrix);

    this.setUniformValue();

    gl.drawElements(gl.TRIANGLES, this.planeGeometory.index.length, gl.UNSIGNED_SHORT, 0);

  }
  drawTorus (gl: WebGLRenderingContext, m: matIV) {

    webglFunc.set_attribute(gl, this.torusBuffer.v, this.renderParams.attLocation, this.renderParams.attStride);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.torusBuffer.i);

      // モデル座標変換行列の生成
      m.identity(this.mat.mMatrix);
  
      m.rotate(
        this.mat.mMatrix,
        -this.nowTime,
        [1.0, 0.0, 0.0],
        this.mat.mMatrix,
      );
  
      m.multiply(this.mat.tmpMatrix, this.mat.mMatrix, this.mat.mvpMatrix);
      m.inverse(this.mat.mMatrix, this.mat.invMatrix);

      this.setUniformValue();
    
      gl.drawElements(gl.TRIANGLES, this.torusGeometory.i.length, gl.UNSIGNED_SHORT, 0);
  }

  setUniformValue() {
    const gl = this.gl;

    const {mvpMatrix, mMatrix, invMatrix, ambientColor, directionalLightPos, time} = this.renderParams.uniLocation;
    gl.uniformMatrix4fv(mvpMatrix, false, this.mat.mvpMatrix);
    gl.uniformMatrix4fv(mMatrix, false, this.mat.mMatrix);
    gl.uniformMatrix4fv(invMatrix, false, this.mat.invMatrix);
    gl.uniform4fv(ambientColor, this.ambientColor);
    gl.uniform3fv(directionalLightPos, this.directionalLightPos);
    gl.uniform1f(time, this.nowTime);
  }

  protected render() {
    this.raf();
    this.drawGeometory();

    requestAnimationFrame(this.render.bind(this))
  }
}
