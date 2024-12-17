<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getUserInfo } from "@/utils";
const store = useStore();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  data: {
    type: Object,
  },
});

const state = reactive({
  UserInfo: getUserInfo(),
  propsData: {},
});

onMounted(() => {
  state.propsData = props?.data || {};
});
</script>
<template>
  <div class="area-record-details">
    <div class="top_info">
      <van-cell-group>
        <van-cell
          class="info_item_status"
          :class="{
            info_item_status_success:
              state.propsData.status_name === '预约成功',
            info_item_status_waitting:
              state.propsData.status_name === '预约待审核',
            info_item_status_blue: state.propsData.status_name === '使用中',
          }"
          title="预约状态"
          :value="state.propsData.status_name"
        />
        <van-cell
          class="info_item"
          title="预约用户"
          :value="
            state.propsData.member_name + ' (' + state.propsData.member_id + ')'
          "
        />
        <van-cell
          class="info_item"
          title="预约时间"
          :value="state.propsData.create_time"
        />
        <van-cell
          class="info_item"
          title="开始时间"
          :value="state.propsData.begin_time"
        />
        <van-cell
          class="info_item"
          title="结束时间"
          :value="state.propsData.end_time"
        />
        <van-cell
          class="info_item"
          title="预约地点"
          :value="state.propsData.nameMerge"
        />
        <van-cell
          class="info_item"
          title="预约信息"
          :value="state.propsData.title"
        />
      </van-cell-group>
      <!-- 全部成员 -->
      <div class="all_member">
        <div>全部成员</div>
        <div class="right_value">
          <div v-for="member in state.propsData.teams" :key="member.member_id">
            <span :class="{ isMySelf: member.member_id === state.UserInfo.id }"
              >{{ member.member_name }} ({{ member.member_id }})
            </span>
            <span
              :class="{
                statusPending: member.isAuthorized === '0',
                statusAgreed: member.isAuthorized === '1',
                statusRejected: member.isAuthorized === '2',
              }"
              class="memberStatus"
              >{{
                member.isAuthorized === "0"
                  ? "待确认"
                  : member.isAuthorized === "1"
                  ? "同意邀请"
                  : member.isAuthorized === "2"
                  ? "拒绝邀请"
                  : ""
              }}
            </span>
          </div>
        </div>
      </div>
      <!-- 签到时间 -->
      <!-- <div class="sign_time">
        <div style="color: #616161; font-size: 14px; margin-bottom: 10px">
          签到时间
        </div>
        <div v-for="item in 3" :key="item" class="sign_time_value">
          <div>VIP111</div>
          <div>
            <div>11111111 接受邀请</div>
          </div>
        </div>
      </div> -->
      <!-- <br /> -->
      <!-- 取消时间 -->
      <!-- <van-cell class="info_item" title="取消时间" value="内容" />
      <van-cell class="info_item" title="违约时间" value="内容" /> -->
      <!-- 签到信息 -->
    </div>
    <!-- <van-cell-group class="bottom_info">
        <van-cell class="info_item" title="预约用户" value="内容" />
        <van-cell class="info_item" title="预约用户" value="内容" />
        <van-cell class="info_item" title="预约用户" value="内容" />

    </van-cell-group> -->
    <!-- <div class="bottom_info_btn">
      <a-button shape="round" block class="cancel_btn">取消预约</a-button>
    </div> -->
    <!-- <div class="bottomAct">
      <van-button round block type="default"> 拒绝 </van-button>
      <van-button round block type="primary" @click="handleFilter"
        >接受邀请</van-button
      >
    </div> -->
  </div>
</template>
<style lang="less" scoped>
.area-record-details {
  position: relative;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  .top_info {
    overflow-y: auto;
    height: calc(100% - 50px);
    margin-top: 16px;

    .info_item_status {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
    .info_item_status_success {
      --van-cell-value-color: rgba(78, 201, 91, 1);
    }
    .info_item_status_waitting {
      --van-cell-value-color: rgba(255, 128, 0, 1);
    }
    .info_item_status_blue {
      --van-cell-value-color: rgba(31, 86, 225, 1);
    }
    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }

    .all_member {
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      overflow: hidden;
      color: #616161;
      font-size: 14px;
      background-color: #fff;
      .right_value {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-end;
        .isMySelf {
          color: #1f56e1;
        }
        .memberStatus {
          margin-left: 3px;
        }

        .statusRejected {
          color: #ff4d4f;
        }

        .statusAgreed {
          color: #52c41a;
        }

        .statusPending {
          color: #d9d9d9;
        }
      }
    }
    .sign_time {
      padding: 10px 16px;
      background-color: #fff;
      margin-top: 10px;
      .sign_time_value {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        overflow: hidden;
        color: #616161;
        font-size: 14px;
      }
    }
  }
  .bottom_info {
    margin-top: 16px;

    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
  }
  .bottom_info_btn {
    flex: 1;
    width: 100%;
    background-color: #fff;
    padding: 16px;
    .cancel_btn {
      border-color: rgba(26, 73, 192, 0.5);
      color: rgba(26, 73, 192, 1);
      font-size: 15px;
    }
  }
  .bottomAct {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
    }
  }
}
:deep(.van-cell__title) {
  color: rgba(97, 97, 97, 1) !important;
  font-size: 14px;
}
</style>
