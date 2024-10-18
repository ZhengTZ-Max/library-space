<script setup>
import { reactive, onMounted, ref, nextTick } from "vue";
import { useStore } from "vuex";
import Panzoom from "panzoom";

const emit = defineEmits(["selected"]);
const props = defineProps({
  options: {
    default: {},
  },
});

const zoommap = ref(null);
const mapIMG = ref(null);

const store = useStore();

const state = reactive({
  list: [],
  background: "",
});

onMounted(() => {
  state.list = props?.options?.list;
  state.background = props?.options?.background;
});

const onMapImg = () => {
  initMap();
};

const initMap = (e) => {
  setTimeout(() => {
    nextTick(() => {
      zoommap.value &&
        Panzoom(zoommap.value, {
          minScale: 1,
          maxScale: 5,
          step: 0.5,
          maxZoom: 5,
          minZoom: 1,
          bounds: true,
          boundsPadding: 1,
        });

      fillCanvas();
    });
  }, 100);
};

const fillCanvas = () => {
  let mW = mapIMG?.value?.clientWidth;
  let mH = mapIMG?.value?.clientHeight;

  state.list?.map((e) => {
    let canvas = document.getElementById(`can-${e?.id}`);
    let x1 = (e?.point_x * mW) / 100,
      x2 = (e?.point_x2 * mW) / 100,
      x3 = (e?.point_x3 * mW) / 100,
      x4 = (e?.point_x4 * mW) / 100;

    let y1 = (e?.point_y * mH) / 100,
      y2 = (e?.point_y2 * mH) / 100,
      y3 = (e?.point_y3 * mH) / 100,
      y4 = (e?.point_y4 * mH) / 100;

    let rectW = Math.ceil(Math.abs(x1 - x2));
    let rectH = Math.ceil(Math.abs(y1 - y3));
    canvas.width = rectW;
    canvas.height = rectH;

    canvas.style.left = `${x2}px`;
    canvas.style.top = `${y1}px`;

    if (canvas.getContext) {
      let ctx = canvas.getContext("2d");

      // 通过缩放坐标，在canvas中绘制点
      ctx.beginPath();
      ctx.moveTo(x1, y1); // 移动到第一个点
      ctx.lineTo(x2, y2); // 连接到第二个点
      ctx.lineTo(x3, y3); // 连接到第三个点
      ctx.lineTo(x4, y4); // 连接到第四个点
      ctx.closePath(); // 闭合路径
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, rectW, rectH);

      // 设置文字样式并在 Canvas 中添加文字
      ctx.fillStyle = "#000"; // 设置文字颜色
      ctx.font = "14px AliRegular"; // 设置字体样式
      ctx.textAlign = "center"; // 设置文字水平居中
      ctx.textBaseline = "top"; // 设置文字垂直居中

      if (rectW < 70) {
        ctx.font = "11px AliRegular"; // 设置字体样式
      }

      if (rectH < 30) {
        ctx.textBaseline = "middle"; // 设置文字垂直居中
        ctx.font = "11px AliRegular"; // 设置字体样式
      }

      // 多行文字内容

      // 计算每行文本的起点位置，确保居中
      const startX = rectW / 2; // 水平居中位置
      const lineHeight = 15; // 行高

      if (rectH < 40) {
        let lines = `${e?.name} 空座:${e?.free_num || "-"}`;
        ctx.fillText(lines, rectW / 2, rectH / 2); // 水平和垂直居中
      } else {
        let lines = [`${e?.name}`, `空座:${e?.free_num || "-"}`];

        // 计算垂直居中
        const totalTextHeight = lines.length * lineHeight; // 文字的总高度
        const startY = (rectH - totalTextHeight) / 2; // 让文字在Y轴居中

        // 逐行绘制文字
        lines.forEach((line, i) => {
          ctx.fillText(line, startX, startY + i * lineHeight); // 水平和垂直居中
        });
      }
    }
  });
};

const selectSeat = (seat, event) => {
  emit("selected", { title: "空间详情", ...seat });
  console.log(seat);
};
</script>
<template>
  <div class="spaceMap">
    <div class="zoommap" ref="zoommap">
      <img ref="mapIMG" :src="state.background" alt="" @load="onMapImg" />

      <canvas
        v-for="item in state.list"
        :key="item.id"
        :id="`can-${item.id}`"
        class="absolute"
        @click="selectSeat(item, $event)"
      >
      </canvas>
    </div>
  </div>
</template>
<style lang="less" scoped>
.spaceMap {
  width: 72%;
  height: 100%;
  overflow: hidden;
  .zoommap {
    display: flex;
    justify-content: center;
    position: relative;
    img {
      margin: 0 auto;
      width: 100%;
      object-fit: contain;
    }
  }
  .absolute {
    position: absolute;
    z-index: 999;
    cursor: pointer;
    &:hover {
      // transform: scale(1.01);
      // border: 2px solid red;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.7);
    }

    // &:hover {
    //   border: 1px solid var(--van-primary-color);
    // }
  }
}
</style>
