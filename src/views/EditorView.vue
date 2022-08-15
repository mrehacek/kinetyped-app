<template>
  <n-layout has-sider content-style="height: calc(100vh - 42px - 1.5rem);">
    <FontImportModal v-model:open="fontImportModalOpen" @close="fontImportModalOpen = false" @import="addFonts" />

    <n-layout-sider content-style="padding: 24px; padding-bottom: 1rem" width="24rem" bordered>
      <n-space vertical style="max-width: 50rem">
        <n-space vertical>
          <div>
            <label>Displayed text</label>
            <n-input v-model:value="sketch_data_setup.text"></n-input>
          </div>

          <div>
            <label>Base font</label>
            <n-space>
              <n-select v-model:value="sketch_data_setup.fontPath" :options="fontOptions" style="width: 14rem" />
              <n-button @click="fontImportModalOpen = true">Import</n-button>
            </n-space>
          </div>

          <InputSlider
            label="Font size"
            v-model:modelValue="sketch_data_setup.fontSize"
            :min="1"
            :max="400"
            :step="1"
            :marginLeft="false"
          />
          <InputSlider
            label="Font interpolation resolution"
            v-model:modelValue="sketch_data_setup.interpolationResolution"
            :min="1"
            :max="30"
            :step="0.1"
            :marginLeft="false"
          />
        </n-space>

        <h4>Noise and animation</h4>
        <n-space vertical>
          <n-checkbox
            size="large"
            label="Apply noise to interpolated points"
            v-model:checked="sketch_data_draw.noise.enabled"
          />
          <template v-if="sketch_data_draw.noise.enabled">
            <n-collapse>
              <n-collapse-item name="sketch_data_draw.noise.animate">
                <template #header>
                  <n-checkbox
                    size="large"
                    label="Animate in time"
                    v-model:checked="sketch_data_draw.noise.animate"
                    style="margin-left: 0.4rem"
                  />
                </template>
                <InputSlider label="Speed" v-model:modelValue="sketch_data_draw.noise.speed" marginLeft />
                <InputSlider label="Strength" v-model:modelValue="sketch_data_draw.noise.strength" marginLeft />
              </n-collapse-item>
            </n-collapse>

            <n-collapse>
              <n-collapse-item name="sketch_data_draw.noise.mouse.enabled">
                <template #header>
                  <n-checkbox
                    size="large"
                    label="Change noise with mouse"
                    v-model:checked="sketch_data_draw.noise.mouse.enabled"
                    style="margin-left: 0.4rem"
                  />
                </template>

                <n-space vertical>
                  <InputSlider
                    label="Decay distance"
                    v-model:modelValue="sketch_data_draw.noise.mouse.decayDistance"
                    :min="1"
                    :max="10000"
                    :step="50"
                    :marginLeft="true"
                  />
                  <InputSlider
                    label="Decay factor"
                    v-model:modelValue="sketch_data_draw.noise.mouse.decayFactor"
                    :step="0.01"
                    :max="2"
                    :min="1"
                    :marginLeft="true"
                  />
                </n-space>
              </n-collapse-item>
            </n-collapse>
          </template>
        </n-space>

        <h4>Drawing method</h4>
        <n-space vertical>
          <n-radio-group v-model:value="sketch_data_draw.drawingMethod" name="radiogroup">
            <n-radio-button :key="1" :value="KT_DrawingMethod.POINTS" :label="'points'" />
            <n-radio-button :key="2" :value="KT_DrawingMethod.SHAPES" :label="'shapes'" />
            <n-radio-button :key="2" :value="KT_DrawingMethod.WEBGL_SHAPES" :label="'webgl shapes'" />
          </n-radio-group>
          <div
            v-if="
              !(sketch_data_draw.drawingMethod === KT_DrawingMethod.WEBGL_SHAPES && sketch_data_draw.webgl.useShader)
            "
          >
            <label>Element color</label>
            <n-color-picker
              :default-value="sketch_data_draw.shapeColor"
              :show-alpha="true"
              :modes="['hsl']"
              @update:value="handleColorPickConfirm($event, sketch_data_draw, 'shapeColor')"
            />
          </div>

          <n-checkbox
            v-if="sketch_data_draw.drawingMethod !== KT_DrawingMethod.POINTS"
            size="large"
            label="Use curves (smooth outlines)"
            v-model:checked="sketch_data_draw.drawCurves"
          />

          <n-checkbox
            v-if="sketch_data_draw.drawingMethod === KT_DrawingMethod.WEBGL_SHAPES"
            size="large"
            label="Use color noise shader"
            v-model:checked="sketch_data_draw.webgl.useShader"
          />
          <template v-if="sketch_data_draw.drawingMethod === KT_DrawingMethod.POINTS">
            <n-checkbox
              size="large"
              label="Draw lines from cursor position to points"
              v-model:checked="sketch_data_draw.connectGlyphPointsToMousePos"
            />
            <n-space>
              <n-space vertical>
                <label>Point size</label>
                <n-input-number
                  v-model:value="sketch_data_draw.pointSize"
                  size="small"
                  :min="0"
                  :max="20"
                  :step="1"
                  :style="{ 'max-width': '6rem' }"
                />
              </n-space>
              <n-space vertical v-if="sketch_data_draw.connectGlyphPointsToMousePos">
                <label>Connecting line size</label>
                <n-input-number
                  v-model:value="sketch_data_draw.lineWeight"
                  size="small"
                  :min="1"
                  :max="20"
                  :step="1"
                  :style="{ 'max-width': '6rem' }"
                />
              </n-space>
            </n-space>
          </template>
        </n-space>

        <h4>Background</h4>
        <n-space vertical>
          <n-color-picker
            :default-value="sketch_data_setup.backgroundColor"
            :show-alpha="true"
            :modes="['hsl']"
            @update:value="handleColorPickConfirm($event, sketch_data_setup, 'backgroundColor')"
          />

          <InputSlider
            v-if="sketch_data_draw.drawingMethod !== KT_DrawingMethod.WEBGL_SHAPES"
            label="Frame fadeout strength"
            v-model:modelValue="sketch_data_draw.frameFadeoutStrength"
            :step="0.01"
            :max="1"
            :min="0"
            :marginLeft="false"
          />

          <n-checkbox size="large" label="Freeze current frame" v-model:checked="freezeSketch" />
        </n-space>
      </n-space>

      <n-divider />
      <n-checkbox
        size="large"
        label="Visualize glyph points (debug)"
        v-model:checked="sketch_data_draw.debugVisualization"
      />
      <n-checkbox
        v-if="sketch_data_draw.debugVisualization"
        size="large"
        label="Show glyph control points"
        v-model:checked="sketch_data_draw.debugControlPoints"
      />
    </n-layout-sider>

    <!-- Sketch -->
    <n-layout>
      <n-layout-header embedded content-style="padding: 24px;">
        <n-card title="Current working design" size="small" embedded :bordered="false">
          <template #header> <h4 style="margin: 0">Current working design</h4></template>
          <template #header-extra>
            <n-space>
              <n-input
                placeholder="Name (optional)"
                v-model:value="current_design_name"
                autosize
                style="min-width: 12rem"
              />
              <n-button @click="saveCurrentDesign"> Save </n-button>
            </n-space>
          </template>
          <div
            :id="sketch_id"
            :style="{
              width: sketch_data_setup.canvasWidth + 'px',
              height: sketch_data_setup.canvasHeight + 'px',
              'min-height': sketch_data_setup.canvasHeight + 'px',
              'background-color': sketch_data_setup.backgroundColor,
            }"
            style="border: solid 1px black"
          ></div>
        </n-card>
      </n-layout-header>

      <!-- Gallery -->
      <n-layout-content style="padding: 1rem">
        <n-space style="margin-top: 1rem; margin-bottom: 1rem" justify="space-between">
          <h4 style="margin: 0; margin-right: 1rem">Saved designs</h4>
          <n-space style="display: flex; align-items: center">
            <label>Hide defaults</label><n-switch v-model:value="hideDefaultDesigns" size="medium" />
            <n-button
              v-if="saved_designs.length"
              @click="removeAllSavedDesigns"
              style="position: relative; bottom: 0.25rem"
              >Remove all</n-button
            >
          </n-space>
        </n-space>
        <n-space>
          <div v-if="hideDefaultDesigns && saved_designs.length === 0">None saved.</div>
          <n-card
            v-for="d in hideDefaultDesigns ? saved_designs : default_designs.concat(saved_designs)"
            :key="d.id"
            :title="d.name"
            :closable="!d?.default"
            @close="removeDesign(d.id)"
            :style="{
              'border-color': d?.default ? 'rgb(239, 239, 245)' : 'rgb(109, 109, 255)',
              'border-style': d?.default ? 'solid' : 'dashed',
            }"
          >
            <img
              :src="'data:image/jpeg;base64,' + d.preview_image"
              :width="d.width - d.width * ((d.height - 100) / d.height)"
              :height="100"
              style="border: solid 1px rgb(209, 209, 215); cursor: pointer"
              @click="loadSavedDesign(d)"
            />
          </n-card>
        </n-space>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, onBeforeUnmount, ref } from "vue";
import { useLocalStorage, watchDebounced } from "@vueuse/core";

import s_noise from "../p5/noise";
import { KT_DrawingMethod } from "../p5/noise";
import type { KT_P5_Example, KT_DataDraw_Noise, KT_DataSetup_Noise } from "../p5/noise";
import type { KT_Font } from "../components/FontImportModal.vue";
import default_designs_definitions from "../p5/default-designs.js";
import type { KT_SavedDesign, KT_SavedDesign_LocalStorage } from "../types";
import { useRouter, useRoute } from "vue-router";

import { useP5Helpers } from "../composables/p5-helpers";
import FontImportModal from "../components/FontImportModal.vue";
import default_fonts from "../p5/default-fonts";

const { p5_bind_sketch, p5_bind_data, p5_get_canvas_image } = useP5Helpers();
const router = useRouter();
const route = useRoute();

const sketch_id = "working_sketch";
const sketch_data_setup = reactive<KT_DataSetup_Noise>({
  canvasWidth: 900,
  canvasHeight: 450,
  interpolationResolution: 10,
  text: "abc",
  posX: 150,
  posY: 300,
  fontSize: 300,
  fontPath: "fonts/Roboto/Roboto-Regular.ttf",
  useWebGL: false,
  backgroundColor: "hsl(0, 0%, 0%)", // because clear only happens on setup
});
const sketch_data_draw = reactive<KT_DataDraw_Noise>({
  debugVisualization: false,
  debugControlPoints: true,
  connectGlyphPointsToMousePos: false,
  drawShapes: true,
  noise: {
    enabled: true,
    animate: true,
    speed: 15,
    strength: 1,
    mouse: {
      enabled: true,
      decayDistance: 600,
      decayFactor: 1.5,
    },
  },
  shapeColor: "hsl(0, 0%, 100%)",
  frameFadeoutStrength: 0.9,
  drawingMethod: KT_DrawingMethod.SHAPES,
  drawCurves: false,
  pointSize: 5,
  lineWeight: 1,
  webgl: {
    useShader: true,
  },
});

let s_instance: KT_P5_Example | null = null;
let s_reactive: any = null;
let freezeSketch = ref(false);
let fontImportModalOpen = ref(false);
let hideDefaultDesigns = ref(false);

const fontOptions = ref(default_fonts);

function addFonts(fonts: KT_Font[]): void {
  fontImportModalOpen.value = false;
  for (const f of fonts) {
    for (const [weight, file] of Object.entries(f.files)) {
      const https_file = file.replace(/^http\:/, "https:");
      const new_font = {
        label: f.family + ` (${weight})`,
        value: https_file,
      };
      fontOptions.value.push(new_font);
    }
  }
}

const current_design_name = ref<string | null>(null);
const saved_designs_ls = useLocalStorage<KT_SavedDesign_LocalStorage[]>("saved_designs", []);
const default_designs = ref<KT_SavedDesign[]>([]);
const saved_designs = ref<KT_SavedDesign[]>([]);
const PREVIEW_DOWNSCALE_FACTOR = 3.5;

function saveDataToUrl() {
  router.push({ query: { setup: JSON.stringify(sketch_data_setup), draw: JSON.stringify(sketch_data_draw) } });
}

onMounted(async () => {
  if (route.query?.setup) {
    Object.assign(sketch_data_setup, JSON.parse(String(route.query.setup)));
    Object.assign(sketch_data_draw, JSON.parse(String(route.query.draw)));
  }

  s_reactive = p5_bind_data(s_noise, sketch_data_setup, sketch_data_draw);
  // @ts-expect-error
  s_instance = await p5_bind_sketch(s_reactive, sketch_id);

  watchDebounced(
    sketch_data_setup,
    () => {
      if (s_instance) {
        s_instance.reset();
      }
      saveDataToUrl();
    },
    { debounce: 15, maxWait: 20 }
  );

  watchDebounced(sketch_data_draw, () => saveDataToUrl(), { debounce: 15, maxWait: 20 });

  watch(
    () => freezeSketch.value,
    (freezeSketch) => {
      console.log(`freezeSketch: ${freezeSketch}`);
      if (!freezeSketch) s_instance?.loop();
      else s_instance?.noLoop();
    }
  );

  saved_designs_ls.value.forEach((s) => {
    saved_designs.value.push({
      id: s.id,
      name: s.name,
      data_setup: s.data_setup,
      data_draw: s.data_draw,
      width: s.width,
      height: s.height,
      active: false,
      instance: null,
      preview_image: s.preview_image,
    });
  });

  // @ts-expect-error
  default_designs.value = default_designs_definitions;
});

onBeforeUnmount(() => {
  console.log("onUnmounted, sketch remove");
  s_instance?.remove();
  s_instance = null;
});

function handleColorPickConfirm(value: string, targetObj: any, targetKey: string) {
  targetObj[targetKey] = value;
}

async function saveCurrentDesign() {
  const d_setup = { ...sketch_data_setup };
  d_setup.fontSize = Math.ceil(d_setup.fontSize / PREVIEW_DOWNSCALE_FACTOR);
  d_setup.canvasWidth = Math.ceil(d_setup.canvasWidth / PREVIEW_DOWNSCALE_FACTOR);
  d_setup.canvasHeight = Math.ceil(d_setup.canvasHeight / PREVIEW_DOWNSCALE_FACTOR);

  const datetime = new Date().toISOString().substring(0, 10);
  const name = current_design_name.value;
  current_design_name.value = null;

  const s: KT_SavedDesign = {
    id: Math.ceil(Math.random() * 10000000).toString(),
    name: name && name?.length > 1 ? name : `Unnamed ${datetime}`,
    data_setup: d_setup,
    data_draw: { ...sketch_data_draw },
    width: d_setup.canvasWidth,
    height: d_setup.canvasHeight,
    instance: null,
    active: true,
    preview_image: p5_get_canvas_image("defaultCanvas0"), // canvas id is generated by p5
  };
  saved_designs_ls.value.push({
    id: s.id,
    name: s.name,
    data_setup: s.data_setup,
    data_draw: s.data_draw,
    width: s.width,
    height: s.height,
    preview_image: s.preview_image,
  });
  saved_designs.value.push(s);
}

function loadSavedDesign(d: KT_SavedDesign) {
  console.log("Loading saved design");
  for (const [key, val] of Object.entries(d.data_setup)) {
    if (key == "instance") continue;

    switch (key) {
      case "fontSize":
      case "canvasWidth":
      case "canvasHeight":
        sketch_data_setup[key] = Math.ceil(val * PREVIEW_DOWNSCALE_FACTOR);
        console.log(`${key}=${val} new val: ${sketch_data_setup[key]}`);
        break;
      default:
        // @ts-expect-error
        sketch_data_setup[key] = val;
        break;
    }
  }
  for (const [key, val] of Object.entries(d.data_draw)) {
    // @ts-expect-error
    sketch_data_draw[key] = val;
  }
}

function removeDesign(id: string) {
  saved_designs.value = saved_designs.value.filter((d) => d.id !== id);
  saved_designs_ls.value = saved_designs_ls.value.filter((d) => d.id !== id);
}

function removeAllSavedDesigns() {
  saved_designs_ls.value = [];
  saved_designs.value = [];
}
</script>

<style>
h4 {
  margin-bottom: 0.2rem;
  margin-top: 0.8rem;
}

.n-card__content {
  overflow-x: auto;
}

.n-card-header__main {
  font-size: 0.8rem;
  color: #9c9c9c;
}
</style>
