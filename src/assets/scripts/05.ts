import { matIV } from './webgl_util/minMatrixb'
import webglFunc from './webgl_util/webglFunc'
import PlaneGeometory from './webgl_util/PlaneGeometory';
import { debounce } from "debounce"
import GUI from 'lil-gui';

type PerspectiveParams = {
  fovy: number,
  aspect: number,
  near: number,
  far: number
}

export default class App {

  // private prop
  #canvas: HTMLCanvasElement;
  #gl: WebGLRenderingContext;
  #resolution: number[];

  #renderProgram: any;
  #renderParams: any;
  #renderBuffer: any;
  #planeParams = [2.0, window.innerHeight / window.innerWidth * 2, 32];
  // #planeGeometory = new PlaneGeometory(this.#planeParams[0], this.#planeParams[1], this.#planeParams[2], this.#planeParams[2]);
  #planeGeometory = new PlaneGeometory(2.0, 2.0);

  #startTime = Date.now();
  #eyeDirection = [0.0, 0.0, 3.0];
  #perspectiveParms: PerspectiveParams = {
    fovy: 45,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 500
  }
  #fixedScale = [.0, .0];
  #mat: any;

  #params: any;

  #texture: any[] = [];

  mouse = {
    x: 0.0,
    y: 0.0
  }

  vShader: string;
  fShader: string;


  constructor(vShader: string, fShader: string) {
    this.vShader = vShader;
    this.fShader = fShader;
    this.#canvas = document.getElementById('webgl') as HTMLCanvasElement;
    this.#gl = this.#canvas.getContext('webgl') as WebGLRenderingContext;
    this.#resolution = [window.innerWidth, window.innerHeight];

    
    this.#resize();
    window.addEventListener('resize', () => {
      debounce(this.#resize.bind(this), 500)();
    });

    window.addEventListener("mousemove", e => {
      const { x: mX, y: mY} = e;
      this.mouse = {
        x: mX / this.#resolution[0] * 2.0 - 1.0,
        y: mY / this.#resolution[1] * 2.0 - 1.0,
      }
    })

    this.#create();

    // this.render = this.render.bind(this);
    this.#render();
  }

  #create () {
    this.#createProgram();
    this.#createGeometory();
    this.#setEnv();
    // this.#setGui();
  }

  #createProgram () {
    const gl = this.#gl;
    const rVs = webglFunc.create_shader(gl, this.vShader, 'v');
    const rFs = webglFunc.create_shader(gl, this.fShader, 'f');
    this.#renderProgram = webglFunc.create_program(gl, rVs, rFs);
  }

  #createGeometory () {
    const planeGeometory = this.#planeGeometory;

    const gl = this.#gl;
    this.#renderParams = {
      attLocation: [
        gl?.getAttribLocation(this.#renderProgram, 'position'),
        gl?.getAttribLocation(this.#renderProgram, 'normal'),
        gl?.getAttribLocation(this.#renderProgram, 'uv'),
      ],
      attStride: [
        3, 3, 2
      ],
      uniLocation: {
        // mMatrix: gl?.getUniformLocation(this.#renderProgram, 'mMatrix'),
        // mvpMatrix: gl?.getUniformLocation(this.#renderProgram, 'mvpMatrix'),
        // scaleMatrix: gl?.getUniformLocation(this.#renderProgram, 'scaleMatrix'),
        time: gl?.getUniformLocation(this.#renderProgram, 'time'),
        // progress: gl?.getUniformLocation(this.#renderProgram, 'progress'),
        tex1: gl?.getUniformLocation(this.#renderProgram, 'tex1'),
        tex2: gl?.getUniformLocation(this.#renderProgram, 'tex2'),
        // mouse: gl?.getUniformLocation(this.#renderProgram, 'mouse'),
      }
    }
    this.#renderBuffer = {
      v: [
        webglFunc.create_vbo(gl, planeGeometory.position),
        webglFunc.create_vbo(gl, planeGeometory.normal),
        webglFunc.create_vbo(gl, planeGeometory.uv),
      ],
      i: webglFunc.create_ibo(gl, planeGeometory.index)
    }
  }

  async #setEnv() {
    const gl = this.#gl;
    gl?.enable(gl?.DEPTH_TEST);
    gl?.depthFunc(gl?.LEQUAL);
    gl?.enable(gl?.CULL_FACE);


    const m = new matIV();
    this.#mat = {
      mMatrix: m.identity(m.create()),
      vMatrix: m.identity(m.create()),
      pMatrix: m.identity(m.create()),
      tmpMatrix: m.identity(m.create()), // m(Model), p(Projection) の合成行列を格納するための変数
      mvpMatrix: m.identity(m.create()),
      invMatrix: m.identity(m.create()),
    }

    const halfVFovy = this.#perspectiveParms.fovy / 2;
    const displayGeoHeightHalf = this.#planeParams[1] / 2;
    const scaledGeoHeightHalf = this.#eyeDirection[2] * Math.tan(halfVFovy * (Math.PI / 180));
    const scaleYRatio = scaledGeoHeightHalf / displayGeoHeightHalf;

    const displayGeoWidthHalf = this.#planeParams[0] / 2;
    const scaledGeoWidthHalf = scaledGeoHeightHalf * 2 * this.#perspectiveParms.aspect / 2;
    const scaleXRatio = scaledGeoWidthHalf / displayGeoWidthHalf;

    this.#fixedScale = [scaleXRatio, scaleYRatio, .0];

    this.#mat.scaleMatrix = m.identity(m.create());
    m.scale(this.#mat.scaleMatrix, this.#fixedScale, this.#mat.scaleMatrix);
    // console.log(this.#mat.scaleMatrix)

    const imgPromise = [
      this.#loadTexture('/images/sample/01.jpg'),
      this.#loadTexture('/images/sample/02.jpg')
    ]
    await Promise.all(imgPromise)
      .then((images) => {
        this.#texture = images.map(img => webglFunc.create_texture(gl, img))
      })


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.#texture[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.#texture[1]);

  }

  #loadTexture (path: string) {
    return new Promise (resolve => {
      const imgEle = new Image();
      imgEle.addEventListener("load", () => {
        resolve(imgEle);
      })
      imgEle.src = path
    })
  }

  #setGui () {
    const gui = new GUI();
    const params = {
      progress: .0
    }
    this.#params = params;
    console.log(this.#params)
    gui.add( params, 'progress' )
      .min(.0)
      .max(1.0)
      .name('progress')
  }

  #render () {
    const gl = this.#gl;
    if (!gl) {
      return
    }

    const nowTime = (Date.now() - this.#startTime) * 0.0005;

    const m = new matIV();

    m.lookAt(
      this.#eyeDirection, 
      [0, 0, 0], 
      [0, 1, 0], 
      this.#mat.vMatrix
    );
    m.perspective(
      this.#perspectiveParms.fovy, 
      this.#perspectiveParms.aspect, 
      this.#perspectiveParms.near, 
      this.#perspectiveParms.far, 
      this.#mat.pMatrix
    );
    m.multiply(
      this.#mat.pMatrix, 
      this.#mat.vMatrix, 
      this.#mat.tmpMatrix
    );

    gl.viewport(0, 0, this.#resolution[0], this.#resolution[1]);
    gl.clearColor(.0, .0, .0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.#renderProgram);

    {
      webglFunc.set_attribute(gl, this.#renderBuffer.v, this.#renderParams.attLocation, this.#renderParams.attStride);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.#renderBuffer.i);

        // モデル座標変換行列の生成
      m.identity(this.#mat.mMatrix);
      // m.multiply(this.#mat.tmpMatrix, this.#mat.mMatrix, this.#mat.mvpMatrix);
      // m.inverse(this.#mat.mMatrix, this.#mat.invMatrix);

      // gl.uniformMatrix4fv(this.#renderParams.uniLocation.mvpMatrix, false, this.#mat.mvpMatrix);
      // gl.uniformMatrix4fv(this.#renderParams.uniLocation.mMatrix, false, this.#mat.mMatrix);
      // gl.uniformMatrix4fv(this.#renderParams.uniLocation.scaleMatrix, false, this.#mat.scaleMatrix);
      gl.uniform1f(this.#renderParams.uniLocation.time, nowTime);
      // console.log({nowTime})
      // gl.uniform1f(this.#renderParams.uniLocation.progress, this.#params.progress);
      gl.uniform1i(this.#renderParams.uniLocation.tex1, 0);
      gl.uniform1i(this.#renderParams.uniLocation.tex2, 1);

      // console.log('mouse', Object.values(this.mouse))
      // gl.uniform2fv(this.#renderParams.uniLocation.mouse, Object.values(this.mouse));

      gl.drawElements(gl.TRIANGLES, this.#planeGeometory.index.length, gl.UNSIGNED_SHORT, 0);
    }

    requestAnimationFrame(this.#render.bind(this));
  }

  #resize () {
    this.#resolution = [window.innerWidth, window.innerHeight];
    this.#canvas.width = this.#resolution[0];
    this.#canvas.height = this.#resolution[1];
  }
}