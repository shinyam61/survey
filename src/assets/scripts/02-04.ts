import BasicApp from "./webgl_util/App";
import { matIV, torus as Torus } from './webgl_util/minMatrixb'
import webglFunc from './webgl_util/webglFunc'
import PlaneGeometry from "./webgl_util/PlaneGeometory";

import GUI from "lil-gui";

import vShader from '@assets/scripts/shader/02-04/vertex.glsl';
import fShader from '@assets/scripts/shader/02-04/fragment.glsl';


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

  private directionalLightPos = [0.0, 10.0, 0.0];

  private spotLightPos = [0.0, 0.5, 1.0]; // 光源位置
  private spotLightTarget = [0.0, 0.25, 0.0]; // 光を当てる位置

  constructor() {
    super(vShader, fShader, [0.0, 1.0, 5.0]);

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
    const torusGeometory = this.torusGeometory = Torus(100, 100, .2, .5, [...torusColor, 1.0]);
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
        nMatrix: gl.getUniformLocation(this.renderProgram, 'nMatrix'),
        directionalLightPos: gl.getUniformLocation(this.renderProgram, 'directionalLightPos'),
        spotLightPos: gl.getUniformLocation(this.renderProgram, 'spotLightPos'),
        spotLightTarget: gl.getUniformLocation(this.renderProgram, 'spotLightTarget'),
        spotLightOuter: gl.getUniformLocation(this.renderProgram, 'spotLightOuter'),
        spotLightInner: gl.getUniformLocation(this.renderProgram, 'spotLightInner'),
        time: gl.getUniformLocation(this.renderProgram, 'time'),
      }
    }

  }
  loadScopeEnv () {
    console.log('loadScopeEnv')
    const gui = new GUI();
    const params = {
      outer: 5.0,
      inner: 1.5
    }
    this.params = params;
    gui.add( params, 'outer' )
      .min(.0)
      .max(20.0)
      .step(0.001)
      .name('outer');
    gui.add( params, 'inner' )
      .min(.0)
      .max(20.0)
      .step(0.001)
      .name('inner');
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

    m.rotate(
      this.mat.mMatrix,
      this.deg2rad(-90),
      [1.0, 0.0, 0.0],
      this.mat.mMatrix,
    );

    m.multiply(this.mat.tmpMatrix, this.mat.mMatrix, this.mat.mvpMatrix);
    m.inverse(this.mat.mMatrix, this.mat.invMatrix);
    const normalMatrix = m.transpose(this.mat.invMatrix, m.create());

    this.setUniformValue({normalMatrix});

    gl.drawElements(gl.TRIANGLES, this.planeGeometory.index.length, gl.UNSIGNED_SHORT, 0);

  }
  drawTorus (gl: WebGLRenderingContext, m: matIV) {

    webglFunc.set_attribute(gl, this.torusBuffer.v, this.renderParams.attLocation, this.renderParams.attStride);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.torusBuffer.i);

      // モデル座標変換行列の生成
      m.identity(this.mat.mMatrix);
  
      m.translate(
        this.mat.mMatrix,
        [.0, .75, 0.0],
        this.mat.mMatrix,
      );
      m.rotate(
        this.mat.mMatrix,
        this.nowTime,
        [1.0, 0.0, 0.0],
        this.mat.mMatrix,
      );
  
      m.multiply(this.mat.tmpMatrix, this.mat.mMatrix, this.mat.mvpMatrix);
      m.inverse(this.mat.mMatrix, this.mat.invMatrix);
      const normalMatrix = m.transpose(this.mat.invMatrix, m.create());

      this.setUniformValue({normalMatrix});
      
      gl.drawElements(gl.TRIANGLES, this.torusGeometory.i.length, gl.UNSIGNED_SHORT, 0);
  }

  setUniformValue({ normalMatrix }: any) {
    const gl = this.gl;

    const {mvpMatrix, mMatrix, invMatrix, nMatrix, directionalLightPos, spotLightPos, spotLightTarget, spotLightOuter, spotLightInner, time} = this.renderParams.uniLocation;
    gl.uniformMatrix4fv(mvpMatrix, false, this.mat.mvpMatrix);
    gl.uniformMatrix4fv(mMatrix, false, this.mat.mMatrix);
    gl.uniformMatrix4fv(invMatrix, false, this.mat.invMatrix);
    gl.uniformMatrix4fv(nMatrix, false, normalMatrix);
    gl.uniform3fv(directionalLightPos, this.directionalLightPos);
    gl.uniform3fv(spotLightPos, this.spotLightPos);
    gl.uniform3fv(spotLightTarget, this.spotLightTarget);

    // 光の視野角（水平）、仰俯角（上下）の角度：outer, innerどちらも spotLightTargetから開く角度
    //  outer*2 = 視野角 or 仰俯角, outer = 正面から左or右への角度,仰角or俯角
    //  -> 180度の場合はポイントライトと同じ効果
    //  inner -> outer までが光の減衰効果となり、同じ数値の場合にはパキッと色が出る
    const outerLimit = Math.cos(this.params.outer * (Math.PI / 180.0));
    const innerLimit = Math.cos(this.params.inner * (Math.PI / 180.0));
    gl.uniform1f(spotLightOuter, outerLimit);
    gl.uniform1f(spotLightInner, innerLimit);
    gl.uniform1f(time, this.nowTime);
  }

  protected render() {
    this.raf();
    this.drawGeometory();

    requestAnimationFrame(this.render.bind(this))
  }
}
