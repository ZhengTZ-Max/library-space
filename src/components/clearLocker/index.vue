<template>
  <div
    class="centerCon clearBookCase"
    :class="{ clearBookcaseM: systemMode != 'pc' }"
  >
    <div class="caseList">
      <div
        class="caseItem"
        v-for="item in state.listConfig.list"
        :key="item?.id"
      >
        <p class="caseTitle">{{ item?.name }}</p>
        <div class="libiryCon">
          <div v-for="row in item?.child" :key="row?.id" class="typeInfo">
            <div
              class="lockerStatus"
              :class="{
                dayCon: row?.id == 14,
                weekCon: row?.id == 15,
                longCon: row?.id == 16,
              }"
            >
              <span v-if="row?.id == 14">日</span>
              <span v-if="row?.id == 15">周</span>
              <span v-if="row?.id == 16">长</span>
            </div>
            <div class="lockerInfo">
              <p class="showNum">
                <span>·总数{{ row?.all }}</span>
                <span style="color: #5d89f6"
                  >·空闲{{ row?.empty }}({{ row?.emptyPCT }})</span
                >
              </p>
              <p class="showNum">
                <span>·在用{{ row?.use }}({{ row?.usePCT }})</span>
                <span style="color: #ff5d5d"
                  >·异常{{ row?.unusually }}({{ row?.unusuallyPCT }})</span
                >
              </p>
            </div>
            <div class="viewInfo btn" @click="details(item?.id, row?.id)">
              详情
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import { reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { clearBookcaseHome } from "@/request/bookcase";
// import { filterTreeEn } from "@/utils/help";

const router = useRouter();
const store = useStore();
const lang = store?.state?.lang?.lang;

const systemMode = computed(() => store.state.systemMode);

const state = reactive({
  listConfig: {
    list: [],
  },
});

onMounted(() => {
  getBookcaseList();
});

const getBookcaseList = async () => {
  const res = await clearBookcaseHome();
  if (res?.code != 0) {
    return;
  }
  //   state.listConfig.list = filterTreeEn(res?.data);
};

const details = (id, type) => {
  router.push({
    path: "/clear",
    query: {
      id: id,
      typeId: type,
    },
  });
};
</script>
<style lang="less" scoped>
::v-deep.van-pull-refresh {
  flex: 1;
  overflow: auto;
  background-color: #fff;
}
.clearBookcaseM {
  height: calc(100vh - 50px) !important;
  overflow: auto;
}
.clearBookcase {
  height: calc(100vh - 78px);
  display: flex;
  flex-direction: column;
  .filterCon {
    padding: 20px 18px;
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #f2f2f2;
    .filter {
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 13px;
      font-weight: 500;
      transition: 0.2s;
      color: rgb(34 34 34 / 70%);
      svg {
        margin-left: 4px;
        color: #222222;
      }
    }
  }
}
.caseList {
  padding: 16px;
  .caseItem {
    margin-bottom: 15px;
    padding: 12px 15px;
    border-radius: 8px;
    border: 1px solid #dddddd;
    .caseTitle {
      font-size: 15px;
      color: #222222;
      text-align: center;
      padding-bottom: 15px;
    }
    .libiryCon {
      width: 100%;
      font-size: 12px;

      .typeInfo {
        border-top: 1px solid #dddddd;
        padding: 15px 0;
        display: flex;
        .lockerStatus {
          margin-right: 15px;
          align-self: center;
        }
        .lockerInfo {
          flex: 1;
          border-left: 1px solid #dddddd;
          padding: 0 25px 0 15px;

          .showNum {
            &:nth-child(1) {
              margin-bottom: 9px;
            }
            display: flex;
            span {
              width: 50%;
            }
          }
        }
        .viewInfo {
          background: rgba(53, 83, 158, 0.1);
          border-radius: 4px;
          padding: 4px 10px;
          color: #35539e;
          align-self: center;
          font-size: 12px;
        }
      }
      .lockerStatus {
        border-radius: 2px;
        color: #fff !important;
        padding: 1px 2px;
        align-self: center;
        &.dayCon {
          background: linear-gradient(
            146deg,
            #35539e 0%,
            #6d8cd9 100%
          ) !important;
        }
        &.weekCon {
          background: linear-gradient(
            146deg,
            #6a9e35 0%,
            #88d96d 100%
          ) !important;
        }
        &.longCon {
          background: linear-gradient(
            146deg,
            #e58100 0%,
            #ffbf6d 99%
          ) !important;
        }
      }
    }
  }
}
</style>
