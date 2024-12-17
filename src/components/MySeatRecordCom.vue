<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps({
  data: {
    type: Object,
  },
  userName: {
    type: String,
  },
});
const state = reactive({
  selectedRecord: {},
  userName: "",
});

onMounted(() => {
  state.selectedRecord = props?.data || {};
  state.userName = props?.userName || "";
});

const onCancelReservation = () => {
  state.selectedRecord.clickCancelReservation = true;
};
</script>
<template>
  <a-divider />
  <div v-if="state.selectedRecord" class="modal-content">
    <p>
      预约状态：<span
        :class="
          state.selectedRecord.status_name === '使用中'
            ? 'status-active'
            : state.selectedRecord.status_name === '未签到' ||
              state.selectedRecord.status_name === '状态异常'
            ? 'status-nosign'
            : state.selectedRecord.status_name === '预约成功'
            ? 'status-success'
            : ''
        "
        >{{ state.selectedRecord.status_name }}</span
      >
    </p>
    <p>预约用户：{{ state.userName }}({{ state.selectedRecord.booker }})</p>
    <p>预约时间：{{ state.selectedRecord.beginTime }}</p>
    <p>开始时间：{{ state.selectedRecord.beginTime }}</p>
    <p>结束时间：{{ state.selectedRecord.endTime }}</p>
    <p>
      预约地点：{{ state.selectedRecord.nameMerge }} :
      {{ state.selectedRecord.name }}
    </p>
    <a-divider dashed />
    <div v-if="state.selectedRecord.status_name !== '预约成功'">
      <p v-if="state.selectedRecord.status_name == '未签到'">
        违约时间：{{ state.selectedRecord.renegeTime }}
      </p>
      <p v-else-if="state.selectedRecord.status_name == '已取消'">
        取消时间：{{ state.selectedRecord.cancelTime }}
      </p>
      <p v-else>签到时间：{{ state.selectedRecord.signInTime }}</p>
    </div>
    <div
      class="modal-footer"
      v-if="state.selectedRecord.status_name === '预约成功'"
    >
      <a-button
        type="primary"
        class="cancel-button"
        @click="onCancelReservation"
        >取消预约</a-button
      >
    </div>
  </div>
</template>
<style lang="less" scoped>
.modal-footer {
  text-align: center;
  margin-top: 20px;
}

.cancel-button {
  width: 120px;
}
.modal-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;

  p {
    margin: 19px 0;
  }

  .status-active {
    color: #1890ff;
  }
  .status-nosign {
    color: #ff4d4f;
  }
  .status-success {
    color: rgba(78, 201, 91, 1);
  }
}
</style>
