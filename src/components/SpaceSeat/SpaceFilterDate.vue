<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useStore } from "vuex";
import { SearchOutlined } from "@ant-design/icons-vue";
import { exchangeDateTime, initSltTime } from "@/utils";
import moment from "moment";
const store = useStore();
const systemMode = computed(() => store.state.systemMode);

const emits = defineEmits(["update:initSearch"]);
const props = defineProps({
  date: {
    type: Object,
  },
  initSearch: {
    type: Object,
  },
});
const state = reactive({
  filterDate: [],
  filterDateType: "",
  filterDateRow: {},
  filterRows: {
    date: "",
    time: "",
    times: {},
  },

  filterTimes: [],

  timePickerPopShow: false,

  moTimePickerVal: [],
  moTimeType: "",
});

onMounted(() => {
  state.filterDate = props?.date?.list || {};
  state.filterDateType = props?.date?.reserveType || {};
  state.filterRows = props?.initSearch || {};
});

watch(
  () => state.filterRows.date,
  (v) => {
    if (v) getTimes();
  }
);

watch(
  () => state.filterRows.time,
  (v) => {
    if (v) onChangeTimes(v);
  }
);

const onChangeTimes = (v) => {
  let findTime = state.filterTimes?.find((e) => e?.id == v);
  state.filterRows.times = findTime;
};

const getTimes = () => {
  let cDate = state.filterRows?.date;
  let findDateRow = state.filterDate?.find((e) => e?.day == cDate);
  state.filterDateRow = { ...findDateRow };
  state.filterTimes = findDateRow?.times;

  if (state.filterDateType == 3) {
    if (state.filterDateRow?.day == exchangeDateTime(new Date(), 2)) {
      let [start, end] = initSltTime(
        state.filterTimes[0]?.end,
        state.filterDateRow?.min_time
      );
      state.filterTimes[0].start = start;
      state.filterTimes[0].end = end;
    }

    if (!state.filterRows.time?.length) {
      state.filterRows.time = [
        state.filterTimes[0].start,
        moment(state.filterTimes[0].start, "HH:mm")
          .add(Number(state.filterDateRow?.min_time), "minutes")
          .format("HH:mm"),
      ];
    }
  }
};

// 定义 disabledTime 函数
const onDisabledTime = (date, type) => {
  let { start, end } = state.filterTimes[0];

  if (state.filterRows.time?.length && type == "end") {
    start = moment(state.filterTimes[0].start, "HH:mm")
      .add(Number(state.filterDateRow?.min_time), "minutes")
      .format("HH:mm");
  }

  // 解析开始和结束时间的小时和分钟
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  return {
    disabledHours: () => {
      // 获取要禁用的小时
      const disabledHours = [];

      // 禁用 0 到 startHour 之前的所有小时
      for (let i = 0; i < startHour; i++) {
        disabledHours.push(i);
      }

      // 禁用 endHour 之后的所有小时
      for (let i = endHour + 1; i <= 23; i++) {
        disabledHours.push(i);
      }

      return disabledHours;
    },
    disabledMinutes: (selectedHour) => {
      // 如果是 startHour，禁用 0 到 startMinute 之前的分钟
      if (selectedHour === startHour) {
        const disabledMinutes = [];
        for (let i = 0; i < startMinute; i++) {
          disabledMinutes.push(i);
        }
        return disabledMinutes;
      }

      // 如果是 endHour，禁用 endMinute 之后的分钟
      if (selectedHour === endHour) {
        const disabledMinutes = [];
        for (let i = endMinute + 1; i < 60; i++) {
          disabledMinutes.push(i);
        }
        return disabledMinutes;
      }

      return [];
    },
  };
};
// 定义 disabledTime 函数
const onDisabledTimeMo = (type, options, values) => {
  let { start, end } = state.filterTimes[0];
  let [sltStart, sltEnd] = state.filterRows.time;

  if (state.moTimeType == "end" && sltStart) {
    start = moment(sltStart, "HH:mm")
      .add(Number(state.filterDateRow?.min_time), "minutes")
      .format("HH:mm");
  }

  // 解析开始和结束时间的小时和分钟
  let [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  let [sTime, eTime] = values;
  if (type === "hour") {
    return options.filter(
      (option) =>
        Number(option.value) >= startHour && Number(option.value) <= endHour
    );
  }

  if (type === "minute") {
    options = options.filter(
      (option) => Number(option.value) % state.filterDateRow?.min_time === 0
    );

    if (state.moTimeType == "start" && sTime == startHour) {
      return options.filter((option) => Number(option.value) >= startMinute);
    } else if (state.moTimeType == "end" && sTime == startHour) {
      return options.filter((option) => Number(option.value) <= endMinute);
    }
    return options;
  }

  return options;
};

const onShowTimePicker = (t) => {
  state.moTimeType = t;
  let [start, end] = state.filterRows.time;
  // let { start: deStart, end: deEnd } = state.filterTimes[0];

  if (state?.filterRows?.date == exchangeDateTime(new Date(), 2)) {
    let minTime = state.filterDateRow?.min_time;
    let deTime = moment();
    if (deTime.minutes() <= minTime - 1) {
      deTime = deTime.minutes(Math.ceil(deTime.minutes() / minTime) * minTime);
    } else if (deTime.minutes() > minTime) {
      deTime.add(minTime, "minutes");
      deTime = deTime.minutes(Math.floor(deTime.minutes() / minTime) * minTime);
    }
    state.filterTimes[0].start = exchangeDateTime(deTime, 8);
  }

  if (t == "start" && start) {
    const [startHour, startMinute] = start.split(":").map(Number);

    state.moTimePickerVal = [startHour, startMinute];
  } else if (end) {
    const [endHour, endMinute] = end.split(":").map(Number);

    state.moTimePickerVal = [endHour, endMinute];
  }

  state.timePickerPopShow = true;
};

const onChangeTimesMo = () => {
  let [s, e] = state.moTimePickerVal;
  if (state.moTimeType == "start") {
    state.filterRows.time[0] = `${s}:${e}`;
    if (`${s}:${e}` > state.filterRows.time[1]) {
      state.filterRows.time[1] = ``;
    }
  } else {
    state.filterRows.time[1] = `${s}:${e}`;
  }
  state.timePickerPopShow = false;
};
</script>
<template>
  <div class="filterCon" :class="{ filterConMo: systemMode != 'pc' }">
    <div class="filterScr">
      <div class="filterFilter">日期</div>
      <div class="fiterItem">
        <a-radio-group
          v-model:value="state.filterRows.date"
          @change="state.filterRows.time = ''"
        >
          <a-radio
            v-for="item in state.filterDate"
            :value="item?.day"
            :key="item?.day"
            >{{ item?.day }}</a-radio
          >
        </a-radio-group>
      </div>

      <div class="filterFilter">时间</div>
      <div class="fiterItem">
        <template v-if="state.filterDateType == 3">
          <a-time-range-picker
            v-if="systemMode == 'pc'"
            v-model:value="state.filterRows.time"
            format="HH:mm"
            valueFormat="HH:mm"
            :minuteStep="Number(state.filterDateRow?.min_time || 1)"
            hideDisabledOptions
            :disabledTime="onDisabledTime"
          />

          <div class="timePickerMo" v-else>
            <div class="timeItem activeBtn" @click="onShowTimePicker('start')">
              {{ state.filterRows.time[0] || "-" }}
              <img class="posIcon" src="@/assets/seat/timeIcon.svg" alt="" />
            </div>
            <span>~</span>
            <div class="timeItem activeBtn" @click="onShowTimePicker('end')">
              {{ state.filterRows.time[1] || "-" }}

              <img class="posIcon" src="@/assets/seat/timeIcon.svg" alt="" />
            </div>
          </div>
        </template>
        <a-radio-group v-else v-model:value="state.filterRows.time">
          <template v-if="state.filterDateType == 1">
            <a-radio
              v-for="item in state.filterTimes"
              :value="item?.id"
              :key="item?.id"
              >{{ item?.start }} - {{ item?.end }}</a-radio
            >
          </template>
          <template v-else-if="state.filterDateType == 2">
            <a-radio
              v-for="item in state.filterTimes[0]"
              :value="item"
              :key="item"
              >{{ item }}</a-radio
            >
          </template>
        </a-radio-group>
      </div>

      <van-popup
        v-model:show="state.timePickerPopShow"
        position="bottom"
        :style="{ height: '35%' }"
      >
        <div class="timePickerPop">
          <van-time-picker
            v-model="state.moTimePickerVal"
            :filter="onDisabledTimeMo"
            title="选择时间"
            @confirm="onChangeTimesMo"
          />
        </div>
      </van-popup>
    </div>
  </div>
</template>
<style lang="less" scoped>
.filterCon {
  padding: 24px 0 0 0;
  height: 30vh !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &.filterConMo {
    height: auto !important;
  }
  .filterScr {
    flex: 1;
    overflow-y: auto;
  }
  .filterFilter {
    margin-bottom: 24px;
    background: rgba(97, 97, 97, 0.05);
    border-radius: 0px 0px 0px 0px;
    padding: 2px 10px;
  }
  .fiterItem {
    user-select: none;
    padding: 0 20px;
    margin-bottom: 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: 40px;
  }

  .ant-checkbox-group {
    column-gap: 36px;
    row-gap: 20px;
  }

  .ant-radio-group {
    display: inline-flex;
    flex-wrap: wrap;
    column-gap: 36px;
    row-gap: 20px;
  }
  .timePickerMo {
    display: flex;
    align-items: center;
    .timeItem {
      position: relative;
      min-width: 160px;
      padding: 8px 14px;
      border-radius: 18px;
      border: 1px solid #eaeaea;
      text-align: center;
      .posIcon {
        position: absolute;
        right: 12px;
        top: 12px;
      }
    }
    span {
      margin: 0 10px;
      font-size: 14px;
      color: #868686;
    }
  }
}
</style>
