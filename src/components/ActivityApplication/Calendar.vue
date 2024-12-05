<script setup>
import { reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import { exchangeDateTime, getAllDate } from "@/utils";
import { showToast } from "vant";
const store = useStore();
const emits = defineEmits(["onSelected", "update:selectedDate"]);
const systemMode = computed(() => store.state.systemMode);

const props = defineProps({
  calendarInfo: {
    type: Object,
    default: {},
  },
  selectedDate: {
    type: Array,
    default: [],
  },
  axisTimeList: {
    type: Array,
    default: [],
  },
});

const state = reactive({
  selectedDate: [],

  minDate: "",
  maxDate: "",
  dayData: [],

  disabledDate: [],
});

onMounted(() => {
  state.selectedDate = props?.selectedDate || [];
});

watch(
  () => props.selectedDate,
  (newVal) => {
    state.selectedDate = newVal;
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => props.calendarInfo,
  (newVal) => {
    state.selectedDate = [];
    state.minDate = new Date(props.calendarInfo.startDate);
    state.maxDate = new Date(props.calendarInfo.endDate);
    state.dayData = props?.calendarInfo?.list || [];
    // state.dayData[0].status = 0;
  },
  {
    immediate: true,
    deep: true,
  }
);
watch(
  () => state.selectedDate,
  (newVal) => {
    checkSelectDate();
  }
);

const onSelect = (date) => {
  state.selectedDate = date;
  emits("update:selectedDate", date);
  console.log(date);
};

const checkSelectDate = () => {
  let disabledArr = state.dayData.filter(
    (e) => e.status == 0 && e?.list?.length
  );
  console.log(disabledArr);

  if (state.selectedDate?.length == 2) {
    let startDate = exchangeDateTime(state.selectedDate[0], 2);
    let endDate = exchangeDateTime(state.selectedDate[1], 2);
    let newSelectDate = getAllDate(startDate, endDate);

    let appointmentInfo = newSelectDate.find((e) => {
      return disabledArr.find((d) => d?.day == e);
    });
    if (appointmentInfo) {
      state.selectedDate = [];
      showToast("无法选中该日期段，已存在预约~");
    }
  }
  emits("onSelected", state.selectedDate);
};

const formatter = (day) => {
  try {
    // const month = day.date.getMonth() + 1;
    const date = exchangeDateTime(day.date, 2);

    let findDate; // 1可预约，0已被预约，-1节假日或未开放
    if (state.dayData?.length) {
      findDate = state.dayData.find((e) => e.date == date);
    }
    // console.log(date, findDate);
    if (findDate?.status == -1) {
      day.className = `day-disabled`;
      day.type = `disabled`;
    } else if (findDate?.status == 0 && findDate?.list?.length) {
      day.className = `day-all`;
      day.type = `disabled`;
    } else if (findDate?.status == 1 && findDate?.list?.length) {
      day.className = `day-all`;
    }

    if (
      (state.selectedDate?.length == 1 &&
        date == exchangeDateTime(state.selectedDate[0], 2)) ||
      state.selectedDate?.length == 0
    ) {
      day.className += ` day-afterN`;
    }

    if (
      date < exchangeDateTime(state.minDate, 2) ||
      date > exchangeDateTime(state.maxDate, 2)
    ) {
      day.className = `day-none`;
      day.type = `disabled`;
    }

    if (props?.axisTimeList?.length) {
      // 下午被预约
      if (findDate?.status == -3) {
        day.className = `day-bot`;
      } else if (findDate?.status == -2) {
        // 上午被预约
        day.className = `day-top`;
      } else if (findDate?.status == -1) {
        // 全天
        day.className = `day-all`;
        day.type = `disabled`;
      } else if (findDate?.status == 0) {
        // 未开放
        day.className = `day-none`;
        day.type = `disabled`;
      }
    }
    return day;
  } catch (e) {
    console.log(e);
  }
};
</script>
<template>
  <van-calendar
    v-if="state.minDate"
    switch-mode="month"
    type="range"
    :min-date="state.minDate"
    :max-date="state.maxDate"
    :poppable="false"
    :show-title="false"
    :show-confirm="false"
    :show-mark="false"
    @select="onSelect"
    :formatter="formatter"
    :allow-same-day="false"
    :default-date="state.selectedDate"
  />
  <!-- <van-calendar
      v-if="state.minDate"

      :poppable="false"
      :show-confirm="false"
      :min-date="state.minDate"
      :max-date="state.maxDate"
      :show-subtitle="false" // 副标题
      :show-mark="false" // 水印
      :formatter="formatter"
      switch-mode="month"
      :allow-same-day="false"
      type="range"
      :default-date="state.selectedDate"

    >

    
    </van-calendar> -->
</template>
<style lang="less" scoped>
.day-item {
  position: relative;
  z-index: 2;
  // border-radius: 50%;
  overflow: hidden;
  font-size: 13px;
  font-weight: 500;
  &::before {
    z-index: -1;
    position: absolute;
    content: "";
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

:deep(.currentDay) {
  &::before {
    background: #000;
    border: 2px solid #ff8e5d;
  }
  &.van-calendar__day {
    background-color: var(--van-primary-color);
    color: #fff;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
  }
  // .van-calendar__selected-day {

  // }
}

:deep(.van-calendar__day) {
  font-size: 13px;
  //   &.van-calendar__day--disabled {
  //     // color: #333;
  //     // height: 0;
  //     // opacity: 0;
  //   }
  &.van-calendar__day--start-end {
    background: rgba(53, 83, 158, 0);
    color: #333;
    // border-radius: 12px;
  }
  &.van-calendar__day--start {
    background: rgba(53, 83, 158, 0);
    color: #fff;
    position: relative;
    // border-radius: 24px 0 0 24px;
    .day-item();
    &::before {
      z-index: -1;
      position: absolute;
      content: "";
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    &::before {
      //   background: #7586b6;
      background-color: rgba(26, 73, 192, 1);
      border: 2px solid rgba(26, 73, 192, 1);
    }
    &::after {
      content: "";
      position: absolute;
      display: block;
      width: 50%;
      height: 50%;
      left: 50%;
      background-color: rgba(26, 73, 192, 0.2);
      z-index: -2;
    }
  }
  &.van-calendar__day--end {
    background: rgba(53, 83, 158, 0);
    color: #fff;
    position: relative;
    // border-radius: 24px 0 0 24px;
    .day-item();
    &::before {
      background-color: rgba(26, 73, 192, 1);
      border: 2px solid rgba(26, 73, 192, 1);
    }
    &::after {
      content: "";
      position: absolute;
      display: block;
      width: 50%;
      height: 50%;
      right: 50%;
      background-color: rgba(26, 73, 192, 0.2);
      z-index: -2;
    }
  }
  &.van-calendar__day--middle {
    color: #333;
    position: relative;

    .day-item();
    &::after {
      content: "";
      position: absolute;
      display: block;
      width: 100%;
      height: 50%;
      top: 25%;
      background-color: rgba(26, 73, 192, 1) !important;
      z-index: -2;
    }
  }
  .van-calendar__bottom-info {
    display: none;
  }
}
:deep(.day-none) {
  //   height: 0;
  //   opacity: 0;
  margin-bottom: 0;
}
:deep(.day-all) {
  color: #333;
  .day-item();
  &::before {
    background: rgba(245, 181, 68, 1) !important;
    border: 2px solid rgba(245, 181, 68, 1);
  }
}
:deep(.day-bot) {
  color: #333 !important;
  .day-item();
  &::before {
    background-color: #fff !important;
    background-image: url("@/assets/space/dayBot.png");
    background-size: 100%;
  }
}
:deep(.day-top) {
  color: #333 !important;
  .day-item();
  &::before {
    background-color: #fff !important;
    background-image: url("@/assets/space/dayTop.png");
    background-size: 100%;
  }
}
:deep(.day-disabled) {
  color: #999999;
  .day-item();
  &::before {
    background: #dddddd;
    border: 2px solid #dddddd;
  }
}
:deep(.day-afterN) {
  &::after {
    display: none !important;
  }
}
:deep(.day-beforeN) {
  &::after {
    display: none !important;
  }
}

:deep(.day-item) {
  .day-item();
}

:deep(.van-calendar__body) {
  overflow: initial;
  & .van-calendar__month-title {
    display: none;
  }
}
</style>
