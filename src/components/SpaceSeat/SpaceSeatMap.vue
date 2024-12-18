<script setup>
import { reactive, onMounted, ref, nextTick } from "vue";
import { useStore } from "vuex";
import Panzoom from "panzoom";

const emit = defineEmits(["selected"]);
const props = defineProps({
  review: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
  },
  data: {
    default: {},
  },
  seatSelected: {},
});

const zoommap = ref(null);
const mapIMG = ref(null);

const store = useStore();

const state = reactive({
  ratio: 1.0,
  list: [],
  backgroundMap: {},
  resizing: false,
});

onMounted(() => {
  state.list = props?.list;
  state.backgroundMap = props?.data?.map;
});

const onMapImg = () => {
  initMap();

  setTimeout(() => {
    filterMap(mapIMG.value.clientHeight, mapIMG.value.clientWidth);
  }, 200);
};

const initMap = (e) => {
  setTimeout(() => {
    nextTick(() => {
      zoommap.value &&
        Panzoom(zoommap.value, {
          minScale: 1,
          maxScale: 4,
          step: 0.5,
          maxZoom: 5,
          minZoom: 1,
          bounds: true,
          boundsPadding: 1,
          contain: "inside",
        });
    });
  }, 100);
};

const filterMap = (height, weight) => {
  let list = state.list;
  list.map((item, index) => {
    item.style = calcSeatLocation(item, height, weight);
    return item;
  });
  //   state.list = list;
  console.log(list);
};

const calcSeatLocation = (seat, height, weight) => {
  return {
    left: Math.round(((seat.point_x * weight) / 100) * state.ratio) + "px",
    top: Math.round(((seat.point_y * height) / 100) * state.ratio) + "px",
    width: Math.round(((seat.width * weight) / 100) * state.ratio) + "px",
    height: Math.round(((seat.height * height) / 100) * state.ratio) + "px",
    "background-image": statusBg(seat),
    "background-repeat": "no-repeat",
    "background-position":
      "-" +
      Math.round(((seat.point_x * weight) / 100) * state.ratio) +
      "px -" +
      Math.round(((seat.point_y * height) / 100) * state.ratio) +
      "px",
    "background-size": Math.round(weight * state.ratio) + "px",
  };
};
const statusBg = (seat) => {
  let backgroundImg = null;
  seat.status = Number(seat.status);
  if (props?.review) {
    return `url("${state?.backgroundMap?.free}")`;
  }
  if (seat.in_label == 1) {
    if (seat.status == 1) {
      backgroundImg = state?.backgroundMap?.free;
    } else if (seat.status == 7) {
      backgroundImg = state?.backgroundMap?.leave;
    } else if ([2, 10, 11].includes(seat.status)) {
      backgroundImg = state?.backgroundMap?.book;
    } else if ([6, 8, 9].includes(seat.status)) {
      backgroundImg = state?.backgroundMap?.use;
    } else if ([3, 4, 5].includes(seat.status)) {
      backgroundImg = state?.backgroundMap?.close;
    }
  } else {
    backgroundImg = state?.backgroundMap?.not;
  }
  return (backgroundImg && `url("${backgroundImg}")`) || "";
};

const selectSeat = (seat, event) => {
  emit("selected", { ...seat });
};

const onReset = (v) => {
  if (mapIMG?.value?.clientHeight) {
    filterMap(mapIMG.value.clientHeight, mapIMG.value.clientWidth);
  }
  state.resizing = false;
};

const onResizing = (v) => {
  state.resizing = true;
};
</script>
<template>
  <div class="spaceMap" v-onReset:150="onReset" v-resizing="onResizing">
    <div class="zoommap" ref="zoommap">
      <img
        ref="mapIMG"
        :src="state.backgroundMap?.free"
        alt=""
        @load="onMapImg"
      />

      <div
        v-for="seat in state.list"
        :key="seat.id"
        :style="{
          ...seat.style,
          display: state?.resizing ? 'none' : '',
          backgroundImage:
            props?.seatSelected?.id == seat.id && !props?.review
              ? `url(${state.backgroundMap?.config})`
              : statusBg(seat),
        }"
        class="absolute"
        :class="{
          active: props?.seatSelected?.id == seat.id,
          noSelectV2: seat.status != 1 || seat.in_label != 1 || props?.review,
        }"
        @click="selectSeat(seat, $event)"
        @touchend="selectSeat(seat, $event)"
      ></div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.spaceMap {
  width: 80%;
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

    &.noSelectV2 {
      pointer-events: none;
      border: none;
      cursor: initial;
      &:hover {
        border: none;
      }
    }
    // &:hover {
    //   border: 1px solid var(--van-primary-color);
    // }
    &.active {
      border: 1px solid var(--primary-color);
      z-index: 99999;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
