<script setup>
import { reactive, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import _ from "lodash";
import { getBookingRules } from "@/request";

const store = useStore();
// const pageResizing = computed(() => store.state.pageResizing);
const lang = computed(() => store.state.lang);
const systemMode = computed(() => store.state.systemMode);
const rules = computed(() => store.state.rules);
const categoryList = computed(() => store.state.categoryList);

const props = defineProps({
  isShow: Boolean,
  type: String,
  title: String,
  okText: String,
  hideIcon: Boolean,
});
const emits = defineEmits(["handleShow", "update:isShow"]);
const state = reactive({
  isShow: true,
  activeKey: "",
  showList: [],
  showHtml: "",
});

onMounted(() => {
  fetchRules();
});
const handleConfirm = () => {
  emits("update:isShow", false);
};

const fetchRules = async () => {
  try {
    let BookRule = sessionStorage.getItem("BookRule");

    if (BookRule) {
      store.dispatch("setRules", JSON.parse(BookRule));
    } else {
      let res = await getBookingRules();
      store.dispatch("setRules", res.data);
    }

    initRuleList();
  } catch (e) {}
};

const initRuleList = () => {
  let typeList = categoryList?.value;

  let list = [
    {
      id: 1,
      title: store?.state?.lang?.currentLang?.Seat_reservation || "座位预约",
      key: "seat_declare",
    },
    {
      id: 2,
      title:
        store?.state?.lang?.currentLang?.Seminar_room_reservation ||
        "研讨室预约",
      key: "seminar_declare",
    },

    {
      id: 4,
      title:
        store?.state?.lang?.currentLang?.big_seminar_room || "大研讨室预约",
      key: "bigdiscussion",
    },
    {
      id: 5,
      title: store?.state?.lang?.lang == "zh" ? "入馆预约" : "Admission",
      key: "entrance",
    },
    {
      id: 7,
      title: store?.state?.lang?.currentLang?.Postgraduate_seats || "考研规则",
      key: "study_Rules",
    },
    {
      id: 10,
      title:
        store?.state?.lang?.currentLang?.Bookcase_reservation || "存书柜预约",
      key: "locker_declare",
    },
    {
      id: 14,
      title: store?.state?.lang?.currentLang?.lost_and_found || "物品招领柜",
      key: "LOST_AND_FOUND",
    },
  ];

  if (typeList?.length) {
    let filterIds = typeList?.map((e) => e?.id);
    let filterShowList = list?.filter((e) =>
      filterIds?.includes(String(e?.id))
    );

    state.showList = filterShowList || [];
    if (state.showList?.length) {
      state.activeKey = state.showList[0]?.id;
      onChangeMo(state.showList[0]);
    }
  }
};

const showHtmlCon = (row = {}) => {
  let { id, key } = row;
  if (lang?.value == "en") {
    key += "_en";
  }
  return rules?.value[key];
};

const onChangeMo = (row) => {
  state.activeKey = row.id;
  row = state.showList?.find((e) => e?.id == state.activeKey);

  let { id, key } = row;

  if (lang?.value == "en") {
    key += "_en";
  }
  state.showHtml = rules?.value[key];
};

// const filterRules = () => {
//   let category =
//     sessionStorage.getItem("category") &&
//     JSON.parse(sessionStorage.getItem("category"));

//   let list = [
//     {
//       id: 1,
//       title: store?.state?.lang?.currentLang?.Seat_reservation || "座位预约",
//       key: "seat_declare",
//     },
//     {
//       id: 2,
//       title:
//         store?.state?.lang?.currentLang?.Seminar_room_reservation ||
//         "研讨室预约",
//       key: "seminar_declare",
//     },
//     {
//       id: 5,
//       title: store?.state?.lang?.lang == "zh" ? "入馆预约" : "Admission",
//       key: "entrance",
//     },
//     {
//       id: 4,
//       title:
//         store?.state?.lang?.currentLang?.big_seminar_room || "大研讨室预约",
//       key: "bigdiscussion",
//     },
//     {
//       id: 7,
//       title: store?.state?.lang?.currentLang?.Postgraduate_seats || "考研规则",
//       key: "study_Rules",
//     },
//     {
//       id: 10,
//       title:
//         store?.state?.lang?.currentLang?.Bookcase_reservation || "存书柜预约",
//       key: "locker_declare",
//     },
//     {
//       id: 14,
//       title: store?.state?.lang?.currentLang?.lost_and_found || "物品招领柜",
//       key: "LOST_AND_FOUND",
//     },
//   ];

//   let initList = [];
//   if (category?.length) {
//     category
//       .filter((e) => {
//         return (
//           e.id != "8" &&
//           e.id != "6" &&
//           e.id != "4" &&
//           e.id != "11" &&
//           // e.id != "7" &&
//           e.id != "5"
//         );
//       })
//       .map((item, index) => {
//         list.map((rule, cur) => {
//           if (item.id == rule.id) {
//             initList.push(rule);
//           }
//         });
//       });
//   }

//   return initList;
// };
</script>
<template>
  <a-modal
    wrapClassName="bookRuleModal"
    :closable="systemMode == 'mobile' ? false : true"
    :width="systemMode == 'mobile' ? '100vw' : '60%'"
    :height="systemMode == 'mobile' ? '100vh' : 'auto'"
    v-model:open="props.isShow"
    @ok="handleConfirm"
    @cancel="handleConfirm"
    :cancelButtonProps="{
      style: {
        display: 'none',
      },
    }"
    okText="确认"
    :okButtonProps="{
      size: 'middle',
      ghost: true,
      style: {
        marginLeft: 0,
        border: 'none',
      },
    }"
    centered
    mask
  >
    <div
      class="bookRules"
      :style="{
        height: systemMode == 'mobile' ? '100%' : '60%',
        marginTop: systemMode == 'mobile' ? '-12px' : '0',
      }"
    >
      <a-tabs
        v-if="systemMode == 'pc'"
        v-model:activeKey="state.activeKey"
        tab-position="top"
        :style="{ height: '100%', overflow: 'hidden' }"
        size="small"
      >
        <a-tab-pane
          v-for="item in state.showList"
          :key="item?.id"
          :tab="item?.title"
          ><div class="showHtml" v-html="showHtmlCon(item)"></div
        ></a-tab-pane>
      </a-tabs>

      <div v-else class="mobileRule">
        <div class="tabsCon">
          <div
            v-for="item in state.showList"
            :key="item?.id"
            class="tabItem"
            @click="onChangeMo(item)"
          >
            <span :class="{ active: state.activeKey == item.id }">{{
              item?.title
            }}</span>
          </div>
        </div>
        <div class="showHtmlM" v-html="state.showHtml"></div>
      </div>
    </div>
  </a-modal>
</template>
<style lang="less" scoped>
.bookRules {
  margin: -12px -24px 0 -24px;
  padding: 0 16px;
  height: 100%;
  min-height: 400px;
  border-bottom: 1px solid rgba(4, 4, 21, 0.05);
  :deep(.ant-tabs-content) {
    height: 100%;
  }
  :deep(.ant-tabs-nav-operations) {
    display: block; /* 确保操作按钮不会被隐藏 */
  }
  .showHtml {
    height: 100%;
    overflow: auto;
  }
  .mobileRule {
    width: 100%;
    height: calc(100vh - 74px);
    display: flex;
    flex-direction: column;
    .tabsCon {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #ccc;
      .tabItem {
        padding: 2px 6px;
        transition: 0s;
        width: 33.3%;
        margin-bottom: 8px;
        text-align: center;
        span {
          border-bottom: 2px solid transparent;
          padding: 3px 0;

          &.active {
            border-bottom: 2px solid var(--primary-color);
          }
        }
      }
    }
    .showHtmlM {
      flex: 1;
      overflow: auto;
      padding: 10px 0;
    }
  }
}
</style>

<style lang="less">
.bookRuleModal {
  .ant-modal {
    max-width: 100%;
    height: 100vh;
  }
}
</style>
