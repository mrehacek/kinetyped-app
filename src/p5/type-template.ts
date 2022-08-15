import opentype from "opentype.js";
import p5 from "p5";
import { interpolate_glyphs } from "../libs/kinetyped";
import { KT_DataDraw, KT_DataSetup, KT_Glyph, KT_P5 } from "../types";

export interface KT_DataSetup_SketchName extends KT_DataSetup {
  interpolationResolution: number;
  posX: number;
  posY: number;
  fontSize: number;
  fontPath: string;
  text: string;
}
export interface KT_DataDraw_SketchName extends KT_DataDraw {
  shapeColor: string;
}
export interface KT_P5_SketchName extends KT_P5 {
  reset: () => void;
}

const sketch_data_wrap = (props_setup: KT_DataSetup_SketchName, props_draw: KT_DataDraw_SketchName) => {
  const sketch = async (p: KT_P5_SketchName) => {
    let font: opentype.Font;
    let glyphs_raw: opentype.Path[];
    let points_separated: KT_Glyph[] = [];

    async function load_font() {
      font = await opentype.load(props_setup.fontPath);
    }
    async function generate_glyphs() {
      glyphs_raw = await font.getPaths(props_setup.text, props_setup.posX, props_setup.posY, props_setup.fontSize);
    }

    p.preload = async function () {
      await load_font();
      await generate_glyphs();
    };

    p.setup = function () {
      p.colorMode(p.HSB, 360, 100, 100, 1);
      p.createCanvas(props_setup.canvasWidth, props_setup.canvasHeight);
      p.background(0, 100, 100);

      setTimeout(async function () {
        recalculate_glyph_points();
      }, 100);
    };

    function recalculate_glyph_points() {
      ({ points_separated } = interpolate_glyphs(glyphs_raw, props_setup.interpolationResolution));
    }

    p.reset = async function () {
      console.log("Sketch reset");
      //p.clear();
      await generate_glyphs();
    };

    p.draw = function () {
      if (!glyphs_raw || !points_separated) {
        return;
      }

      //p.clear();
      p.fill(props_draw.shapeColor);
      for (const glyph of points_separated) {
        drawShapeFromPoints(p, glyph);
      }
    };

    function drawShapeFromPoints(p: p5, glyph: KT_Glyph) {
      p.beginShape();

      for (const v of glyph.shape) {
        //p.curveVertex(v.x, v.y);
        p.vertex(v.x, v.y);
      }

      if (glyph.contour.length > 0) {
        p.beginContour();
        for (const v of glyph.contour) {
          p.vertex(v.x, v.y);
        }
        p.endContour();
      }
      p.endShape(p.CLOSE);
    }
  };
  return sketch;
};

export default sketch_data_wrap;
