<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useStore } from "vuex";
const systemMode = computed(() => store.state.systemMode);

const store = useStore();
const emit = defineEmits(["selected"]);

const props = defineProps({
  list: {
    type: Array,
  },
  data: {
    type: Object,
  },
  type: {
    type: String,
  },
  seatSelected: {
    type: Object,
  },
});
const state = reactive({
  list: [],
  type: "",
});

onMounted(() => {
  state.list = props?.list || [];
});

const selectSeat = (seat) => {
  emit("selected", { ...seat });
};
</script>
<template>
  <div class="SeatArea" :class="{ SeatAreaMo: systemMode != 'pc' }">
    <div class="seatList">
      <a-row :gutter="systemMode != 'pc' ? [14, 14] : [26, 26]" justify="start">
        <a-col v-for="item in state.list" :key="item?.id">
          <div
            class="seatItem activeBtn"
            :class="{
              active: props?.seatSelected?.id == item?.id,
              notSelected: item?.status != '1' || item?.in_label != '1',
            }"
            @click="selectSeat(item)"
          >
            <span>{{ item?.no }}</span>
            <span
              v-if="item?.status != '1' || item?.in_label != '1'"
              class="leftStatus"
            >
              {{ item?.in_label != "1" ? "不可用" : item?.status_name }}
            </span>
            <img
              v-if="props?.seatSelected?.id == item?.id"
              class="selected"
              src="@/assets/seat/seatSelected.svg"
              alt=""
            />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<style lang="less" scoped>
.SeatArea {
  .seatList {
    .seatItem {
      padding: 10px 50px;
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #eaeaea;
      font-size: 14px;
      color: #616161;
      position: relative;

      &.active {
        background: rgba(26, 73, 192, 0.05);
        border: 1px solid rgba(26, 73, 192, 0.4);
      }
      &.notSelected {
        pointer-events: none;
        background: rgba(97, 97, 97, 0.05);
        color: rgba(97, 97, 97, 0.3);
      }

      .selected {
        position: absolute;
        width: 24px;
        height: 24px;
        bottom: -1px;
        right: -1px;
      }

      .leftStatus {
        position: absolute;
        padding: 1px 4px;
        font-size: 11px;
        color: rgba(97, 97, 97, 0.5);
        left: 0;
        top: 0;
        background: rgba(97, 97, 97, 0.05);
        border-radius: 6px 0px 6px 0px;
      }
    }
  }
  &.SeatAreaMo {
    .ant-col {
      min-width: 33.3%;
    }
    .seatItem {
      min-width: 33.3%;
      padding: 10px 12px;
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
