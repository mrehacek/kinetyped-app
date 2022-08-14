import p5 from "p5";
import opentype from "opentype.js";
import { interpolate_glyphs } from "../libs/kinetyped";
import { KT_SketchClosure, KT_SketchDataClosure, KT_DataDraw, KT_DataSetup, KT_P5 } from "../types";

export interface KT_DataSetup_SketchName extends KT_DataSetup {

}

export interface KT_DataDraw_SketchName extends KT_DataDraw {

};
export interface KT_P5_SketchName extends KT_P5 {
  reset: () => void;
}

const sketch_data_wrap = (data_setup: KT_DataSetup_SketchName, data_draw: KT_DataDraw_SketchName) => {
  const sketch = async (p: KT_P5_SketchName) => {

    p.setup = function () {
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.createCanvas(data_setup.canvasWidth, data_setup.canvasHeight);
    };

    p.reset = async function () {
      console.log("Sketch reset");
      p.clear();
    };

    p.draw = function () {
      p.clear();

    };

  };
  return sketch;
};

export default sketch_data_wrap;
