<script setup>
import { reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getUserInfo } from "@/utils";
import { showToast, showConfirmDialog, emptyProps } from "vant";
import { fetchCancelSeat, fetchCancelStudyCancel } from "@/request/home";

const emit = defineEmits(["close"]);
const router = useRouter();
const store = useStore();
const lang = computed(() => store.state.lang);
const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  selectedRecord: {},
  userInfo: getUserInfo(),
});

onMounted(() => {
  state.selectedRecord = props?.data || {};
  console.log(state.selectedRecord);
});

const onCancelReservation = async () => {
  try {
    let res;
    let params = {
      id: state.selectedRecord.id,
    };
    let message = "";
    if (state.selectedRecord.activeKey == "1") {
      message = `${state.selectedRecord.nameMerge}:${state.selectedRecord.name} ${
        lang == "zh" ? "的预约" : "Appointment"
      }？`;
    } else {
      message = `${state.selectedRecord.nameMerge}:${state.selectedRecord.spacename} ${
        lang == "zh" ? "的预约" : "Appointment"
      }？`;
    }
    showConfirmDialog({
      title: $t("cancelappointment"),
      message,
    }).then(async () => {
      if (state.selectedRecord.activeKey == "1") {
        res = await fetchCancelSeat(params);
      } else {
        res = await fetchCancelStudyCancel(params);
      }
      if (res.code == 0) {
        showToast({
          message: res?.message || res?.msg,
        });
        router.refresh();
      }
    });
  } catch (e) {
    console.log(e);
  }
};
</script>
<template>
  <a-divider />
  <div v-if="state.selectedRecord" class="modal-content">
    <!--  普通座位
                  预约成功			2、9
                  预约待审核		1、32	
                  待邀			    21
                  草稿			    31
                  使用中			  3、11、33
                  已结束			  4、8、12、34、35
                  已取消			  6
                  状态异常			其它
                -->
    <p v-if="state.selectedRecord.activeKey == '1'">
      预约状态：<span
        :class="
          state.selectedRecord.status === '2' ||
          state.selectedRecord.status === '9'
            ? 'status-success'
            : state.selectedRecord.status === '1' ||
              state.selectedRecord.status === '32'
            ? 'status-orange'
            : state.selectedRecord.status === '3' ||
              state.selectedRecord.status === '11' ||
              state.selectedRecord.status === '33'
            ? 'status-active'
            : state.selectedRecord.status_name === '未签到'
            ? 'status-nosign'
            : 'status-cancel'
        "
        >{{ state.selectedRecord.status_name }}</span
      >
    </p>

    <!-- 考研/研习座位
                  已预约    1   绿色 可取消
                  已取消    2   灰色
                  暂停      3   橙色
                  已结束    4   灰色
                  状态异常  其它 灰色
                -->
    <p v-else>
      预约状态：<span
        :class="
          state.selectedRecord.status === '1'
            ? 'status-success'
            : state.selectedRecord.status === '3'
            ? 'status-orange'
            : 'status-cancel'
        "
        >{{ state.selectedRecord.status_name }}</span
      >
    </p>
    <p>
      预约用户：{{ state.userInfo.name }}({{ state.selectedRecord.booker }})
    </p>
    <p>预约时间：{{ state.selectedRecord.examTime }}</p>
    <p>开始时间：{{ state.selectedRecord.beginTime }}</p>
    <p>结束时间：{{ state.selectedRecord.endTime }}</p>
    <p>预约地点：{{ state.selectedRecord.nameMerge }}</p>
    <p>
      座位号：{{ state.selectedRecord.name || state.selectedRecord?.spacename }}
    </p>
    <a-divider dashed />

    <!-- 普通座位 2/9 显示取消预约 -->
    <!-- 考研/研习座位 1 显示取消预约 -->
    <div
      class="modal-footer"
      v-if="
        (state.selectedRecord.activeKey == '1' &&
          (state.selectedRecord.status === '2' ||
            state.selectedRecord.status === '9')) ||
        (state.selectedRecord.activeKey != '2' &&
          state.selectedRecord.status === '1')
      "
    >
      <a-button
        type="primary"
        class="cancel-button"
        @click="onCancelReservation"
        >取消预约</a-button
      >
    </div>
    <div v-else-if="state.selectedRecord.timelist">
      <template v-for="item in state.selectedRecord.timelist"
        ><p>{{ item.status_name }}：{{ item.operateTime }}</p></template
      >
    </div>
    <div v-else class="modal-footer">
      <a-button
        type="primary"
        class="cancel-button"
        @click="emit('close')"
        >确定</a-button
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
  .status-cancel {
    color: rgba(153, 153, 153, 1);
  }
  .status-orange {
    color: rgba(255, 153, 0, 1);
  }
}
</style>
