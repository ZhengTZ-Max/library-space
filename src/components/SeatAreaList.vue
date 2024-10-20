<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const emit = defineEmits(["selected"]);

const props = defineProps({
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
  state.list = props?.data?.seat || [];
});

const selectSeat = (seat) => {
  emit("selected", { ...seat });
};
</script>
<template>
  <div class="SeatArea">
    <div class="seatList">
      <a-row :gutter="[26, 26]" justify="start">
        <a-col v-for="item in state.list" :key="item?.id">
          <div class="seatItem activeBtn" :class="{active:props?.seatSelected?.id == item?.id}" @click="selectSeat(item)">
            <span>{{ item?.no }}</span>
            <!-- <span class="leftStatus">{{item?.status_name}}</span> -->
            <img v-if="props?.seatSelected?.id == item?.id" class="selected" src="@/assets/seat/seatSelected.svg" alt="" />
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
}
</style>
