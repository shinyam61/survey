/* 

  定点（eyeDirection）から固定された空間の描画用 Classファイル

*/



import { matIV } from './minMatrixb'
import webglFunc from './webglFunc'
import { debounce } from "debounce"

type PerspectiveParams = {
  fovy: number,
  aspect: number,
  near: number,
  far: number
}

export default abstract class {

  protected canvas: HTMLCanvasElement;
  protected gl: WebGLRenderingContext;
  protected resolution: number[];

  protected renderProgram: any;
  protected renderParams: any;
  protected renderBuffer: any;

  private startTime = Date.now();
  protected nowTime = 0.;
  private eyeDirection = [0.0, 0.0, 3.0];
  private perspectiveParms: PerspectiveParams = {
    fovy: 45,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 500
  }
  protected mat: any;

  protected params: any;


  constructor(protected vShader: string, protected fShader: string, eyePos: number[] | null) {
    this.canvas = document.getElementById('webgl')! as HTMLCanvasElement;
    this.gl = this.canvas.getContext('webgl')! as WebGLRenderingContext;
    this.resolution = [window.innerWidth, window.innerHeight];

    if (eyePos) {
      this.eyeDirection = eyePos;
    }

    
    this.#resize();
    window.addEventListener('resize', () => {
      debounce(this.#resize.bind(this), 500)();
    });

    this.#createProgram();
    this.#setEnv();
  }

  #createProgram () {
    const gl = this.gl;
    const rVs = webglFunc.create_shader(gl, this.vShader, 'v');
    const rFs = webglFunc.create_shader(gl, this.fShader, 'f');
    this.renderProgram = webglFunc.create_program(gl, rVs, rFs);
  }

  protected abstract createGeometory(): void

  #setEnv () {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);


    const m = new matIV();
    this.mat = {
      mMatrix: m.identity(m.create()),
      vMatrix: m.identity(m.create()),
      pMatrix: m.identity(m.create()),
      tmpMatrix: m.identity(m.create()), // m(Model), p(Projection) の合成行列を格納するための変数
      mvpMatrix: m.identity(m.create()),
      invMatrix: m.identity(m.create()),
    }

    this.loadScopeEnv();
  }

  protected abstract loadScopeEnv(): void

  raf () {
    const gl = this.gl;

    this.nowTime = (Date.now() - this.startTime) * 0.0005;

    const m = new matIV();

    m.lookAt(
      this.eyeDirection, 
      [0, 0, 0], 
      [0, 1, 0], 
      this.mat.vMatrix
    );
    m.perspective(
      this.perspectiveParms.fovy, 
      this.perspectiveParms.aspect, 
      this.perspectiveParms.near, 
      this.perspectiveParms.far, 
      this.mat.pMatrix
    );
    m.multiply(
      this.mat.pMatrix, 
      this.mat.vMatrix, 
      this.mat.tmpMatrix
    );

    gl.viewport(0, 0, this.resolution[0], this.resolution[1]);
    gl.clearColor(.0, .0, .0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.renderProgram);

    requestAnimationFrame(this.render.bind(this));
  }

  protected abstract drawGeometory(): void;

  protected abstract render(): void;

  #resize () {
    this.resolution = [window.innerWidth, window.innerHeight];
    this.canvas.width = this.resolution[0];
    this.canvas.height = this.resolution[1];
  }

  protected deg2rad (degree: number) {
    return degree * (Math.PI / 360);
  }
}
