<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import { DownOutlined } from "@ant-design/icons-vue";
import { showToast } from "vant";

import { exchangeDateTime } from "@/utils";

import {
  // getLockerList,
  // getLockerFilter,
  getLostStorage,
  getAllArea,
  getLostlocker,
  getLostInfo,
  sumbitLostStorage,
} from "@/request/collection";
import CollectionFilterCom from "@/components/CollectionCom/CollectionFilterCom.vue";
import Uploader from "@/components/Uploader.vue";
import ClearList from "@/components/CollectionCom/ClearList.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const clearListRef = ref();

const state = reactive({
  activeRow: {},

  initQuery: {
    bookcaseId: route?.query?.id || "",
    quickDate: route?.query?.date || "",
    floorId: route?.query?.floor || "",
    seatType: route?.query?.seatType || "",
  },

  lostlockerList: [],

  filterOptions: [],
  filterSearch: {
    date: "",
    library: "",
    floor: "",
    areaId: "",
  },

  searchDate: "",
  collectionFilterShow: false,
  collectionInfoShow: false,

  showRightCon: false,

  showAreaSelect: false,
  filterClearOptions: [],
  areaSelectRow: {
    showType: "",
    library: "",
    floor: "",
    areaId: "",
  },
  areaForm: {
    deposit: {},
    collect: {},
  },
  depositFreeList: [],

  showClearRightCon: false,

  clearSelected: [],
});

onMounted(() => {
  fetchFilter();
});

const onChangeAct = (i) => {
  state.activeRow = i;
  // fetchInfo(i);
  // state.collectionInfoShow = true;
  state.collectionInfoShow = true;
};

const fetchInfo = async (row) => {
  try {
    let params = {
      boxId: row?.boxId,
    };
    const res = await getLostInfo(params);
    state.collectionInfoShow = true;
  } catch (e) {
    console.log(e);
  }
};

const fetchFilter = async () => {
  try {
    // let res = await getAllArea();
    let res = await getLostStorage();
    state.filterOptions = res?.data?.storageList || [];
    state.filterClearOptions = res?.data?.storeList || [];
    state.depositFreeList = res?.data?.freeNum || [];
    // initQueryFn();
    fetchLibrary();
  } catch (e) {
    console.log(e);
  }
};

const fetchLibrary = async () => {
  try {
    let { date, areaId } = state.filterSearch;
    let params = {
      start: date && exchangeDateTime(date, 2),
      areaId,
      page: 1,
      size: 20,
    };

    let res = await getLostlocker(params);

    if (res.code != 0) {
      return false;
    }

    state.lostlockerList = res?.data?.list || [];
    state.searchDate = res?.data?.minDate;
    // getFloorArea();
  } catch (e) {
    console.log(e);
  }
};

const goToLink = (link) => {
  router.replace(link);
};

const handleAppt = (row) => {
  router.push({
    path: "/bookcase/appointment",
    query: {
      id: row?.id,
    },
  });
  console.log(row);
};

const handleFilter = () => {
  fetchLibrary();
  state.collectionFilterShow = false;
};
const handleAreaSelect = () => {
  console.log(state.areaSelectRow);
  let { library, floor, areaId, showType } = state.areaSelectRow;

  let areaRows = findDataRows(
    showType == "deposit" ? state.filterClearOptions : state.filterOptions,
    { library, floor, areaId }
  );
  let { library: libraryRow, floor: floorRow, areaId: areaRow } = areaRows;

  state.areaForm[showType] = {
    library,
    floor,
    areaId,
    name: `${libraryRow?.name}-${floorRow?.name}-${areaRow?.name}`,
  };
  console.log(state.areaForm);
  state.showAreaSelect = false;
};

const onReviewImg = (v) => {};

const onShowArea = (t) => {
  let { library, floor, areaId } = state.areaForm[t];
  console.log(state.areaForm[t]);
  state.areaSelectRow = {
    showType: t,
    library: library || "",
    floor: floor || "",
    areaId: areaId || "",
  };
  state.showAreaSelect = true;
};

const findDataRows = (data, ids) => {
  const result = {};
  let currentLevel = data;

  // 遍历每一层的 ID
  for (const [key, id] of Object.entries(ids)) {
    const found = currentLevel.find((item) => item.id === id);
    if (found) {
      result[key] = { id: found.id, name: found.name, enname: found.enname };
      currentLevel = found.child || []; // 进入下一层
    } else {
      break; // 如果某层未找到，停止查找
    }
  }

  return result;
};

const areaBoxFreeNum = () => {
  let { areaId } = state.areaForm?.deposit;
  let findRow = state.depositFreeList?.find((e) => e?.id == areaId);
  return findRow?.num || "";
};

const onSubmit = async () => {
  try {
    let params = {
      filePath: state.areaUploadImg,
      storageArea: state.areaForm?.deposit?.areaId,
      storeArea: state.areaForm?.collect?.areaId,
    };

    const res = await sumbitLostStorage(params);
    if (res.code != 0) {
      showToast({
        duration: 3000,
        message: res?.message || res?.msg,
      });
      return false;
    }
    showToast({
      message: res?.message || res?.msg,
    });
    state.showRightCon = false;
    state.areaSelectRow = {
      showType: "",
      library: "",
      floor: "",
      areaId: "",
    };
    state.areaForm = {
      deposit: {},
      collect: {},
    };
  } catch (e) {
    console.log(e);
  }
};

const fileUpload = (v) => {
  let fileList = v;
  if (fileList?.length) {
    state.areaUploadImg = fileList[0]?.response?.data?.file_path;
  } else {
    state.areaUploadImg = "";
  }
};

const onClearList = () => {
  clearListRef?.value?.onClearList();
};
</script>
<template>
  <div class="bookcase" ref="containerRef">
    <a-affix offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit">
          <a-button
            @click="state.showRightCon = true"
            type="primary"
            shape="round"
            size="m"
            >{{ " + " + $t("V4_item_collection") }}</a-button
          >
          <a-button
            shape="round"
            size="m"
            class="clearBtn"
            @click="state.showClearRightCon = true"
          >
            <template #icon>
              <img src="@/assets/collection/clearC.svg" alt="" />
            </template>
            清柜</a-button
          >
        </div>
        <div class="rightAction">
          <div
            class="filters activeBtn"
            @click="state.collectionFilterShow = true"
          >
            <img src="@/assets/seat/filtersIcon.svg" alt="" />
            {{ $t("Screen") }}
          </div>
        </div>
      </div>
    </a-affix>

    <div class="librarySlt">
      <a-row v-if="state.lostlockerList?.length" :gutter="[60, 80]">
        <template v-for="item in state.lostlockerList" :key="item?.id">
          <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4">
            <div class="libraryItem cardItem" @click="onChangeAct(item)">
              <div class="cardItemImgCon">
                <a-image
                  @click.stop=""
                  class="cardItemImg"
                  :src="item?.thumb_imageUrl"
                >
                </a-image>
                <div class="leftBadge basicsBadge">
                  {{ item?.lockerPremises }}
                </div>
              </div>
              <div class="bottomItem">
                <div class="title">
                  <span>{{ item?.name }}号柜：{{ item?.boxId }}格</span>
                  <span>{{ item?.lockerFloor }}</span>
                </div>
                <div class="details">
                  <span>{{ $t("V4_collection_date") }}</span>
                  {{ item?.insertDate }}
                </div>
                <div class="details">
                  <span>{{ $t("V4_collection_location") }}</span>
                  {{ item?.storageName }}
                </div>
              </div>
              <!-- <div
                v-if="item?.id == state.activeIndex"
                class="action clickBoxT"
                @click="handleAppt(item)"
              >
                立即预约
              </div> -->
            </div>
          </a-col>
        </template>
      </a-row>
      <a-empty v-else />
    </div>

    <a-modal
      width="50%"
      v-model:open="state.collectionFilterShow"
      title="物品筛选"
      @ok="handleFilter"
      :okText="$t('visitor_Confirm')"
      :cancelText="$t('cancel')"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{ size: 'middle' }"
      centered
    >
      <CollectionFilterCom
        v-if="state.filterOptions?.length"
        :data="state.filterOptions"
        :initSearch="state.filterSearch"
        :minDate="state.searchDate"
      />
    </a-modal>

    <a-modal
      width="50%"
      v-model:open="state.showAreaSelect"
      :title="
        state.areaSelectRow?.showType == 'deposit' ? '存放区域' : '收物地点'
      "
      @ok="handleAreaSelect"
      :okText="$t('visitor_Confirm')"
      :cancelText="$t('cancel')"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{
        size: 'middle',
        style: {
          background: !state.areaSelectRow?.areaId ? 'rgba(26,73,192,0.3)' : '',
          pointerEvents: !state.areaSelectRow?.areaId ? 'none' : '',
        },
      }"
      centered
    >
      <template v-if="state.showAreaSelect">
        <CollectionFilterCom
          v-if="
            state.areaSelectRow?.showType == 'collect' &&
            state.filterOptions?.length
          "
          :data="state.filterOptions"
          :initSearch="state.areaSelectRow"
          type="area"
        />
        <CollectionFilterCom
          v-else-if="
            state.areaSelectRow?.showType == 'deposit' &&
            state.filterClearOptions?.length
          "
          :data="state.filterClearOptions"
          :initSearch="state.areaSelectRow"
          type="area"
        />
      </template>
    </a-modal>

    <a-modal
      width="50%"
      v-model:open="state.collectionInfoShow"
      title="扫码取物"
      okText=""
      :cancelText="$t('cancel')"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{
        size: 'middle',
        style: {
          display: 'none',
        },
      }"
      centered
    >
      <div class="qrInfo libraryItem">
        <div class="cardItemImgCon">
          <a-image class="cardItemImg" :src="state.activeRow?.imageUrl">
          </a-image>
          <!-- <div class="leftBadge basicsBadge">14213</div> -->
        </div>
        <div class="bottomItem">
          <div class="title">
            <span
              >{{ state.activeRow?.lockerName }}：{{
                state.activeRow?.boxId
              }}格</span
            >
          </div>
          <div class="details">
            <span>{{ $t("V4_collection_date") }}</span>
            {{ state.activeRow?.insertDate }}
          </div>
          <div class="details">
            <span>{{ $t("V4_collection_location") }}</span>
            {{ state.activeRow?.storageName }}
          </div>
        </div>
      </div>
    </a-modal>

    <a-drawer
      title="物品收取"
      :width="820"
      :open="state.showRightCon"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="state.showRightCon = false"
      class="collectionDrawer"
    >
      <a-form size="m">
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item label="收取地点：" name="name" :labelCol="{ span: 3 }">
              <div class="selector" @click="onShowArea('collect')">
                <span
                  v-if="state.areaForm?.collect?.name"
                  style="color: #202020"
                  >{{ state.areaForm?.collect?.name }}</span
                >
                <span v-else>请选择</span>
                <DownOutlined />
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="存放区域："
              name="owner"
              :labelCol="{ span: 3 }"
            >
              <div class="selector" @click="onShowArea('deposit')">
                <span
                  v-if="state.areaForm?.deposit?.name"
                  style="color: #202020"
                  >{{ state.areaForm?.deposit?.name }}</span
                >
                <span v-else>请选择</span>

                <DownOutlined />
              </div>
            </a-form-item>
          </a-col>
          <a-col v-if="areaBoxFreeNum()" :span="24">
            <a-form-item label="剩余格口：" name="box" :labelCol="{ span: 3 }">
              <a-input :value="areaBoxFreeNum()" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="上传图片："
              name="owner"
              :labelCol="{ span: 3 }"
            >
              <Uploader
                @onFileUpload="fileUpload"
                filePath="activity"
                :showUploadList="true"
                :maxCount="1"
                accept=".png, .jpg, .jpeg"
                list-type="picture-card"
              >
                <img src="@/assets/feedback_uploadimg.svg" alt="" />
              </Uploader>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button size="m" @click="state.showRightCon = false"
            >Cancel</a-button
          >
          <a-button
            size="m"
            type="primary"
            :disabled="
              !(
                state.areaForm?.deposit?.name && state.areaForm?.collect?.name
              ) || !state.areaUploadImg
            "
            @click="onSubmit"
            >Submit</a-button
          >
        </a-space>
      </template>
    </a-drawer>

    <a-drawer
      title="清柜"
      :width="960"
      :open="state.showClearRightCon"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="state.showClearRightCon = false"
      class="collectionClearDrawer"
    >
      <ClearList
        v-if="state.showClearRightCon"
        ref="clearListRef"
        v-model:clearSelected="state.clearSelected"
      />
      <template #extra>
        <a-space>
          <a-button size="m" @click="state.showClearRightCon = false"
            >Cancel</a-button
          >
          <a-button
            size="m"
            type="primary"
            :disabled="!state.clearSelected?.length"
            @click="onClearList"
            >立即清柜</a-button
          >
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>
<style lang="less" scoped>
.bookcase {
  height: 100%;
  overflow: auto;
  .header {
    padding: 20px 30px;
    color: #202020;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    .leftTit {
      font-size: 18px;
      img {
        width: 22px;
        height: 22px;
      }
      button {
        width: 160px;
      }
      .clearBtn {
        margin-left: 20px;
        background: rgba(26, 73, 192, 0.07);
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 12px;
          height: 12px;
          margin-right: 4px;
          transform: translateY(-2px);
        }
      }
    }
    .rightAction {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .quickDate {
        flex: 1;
        display: flex;
        justify-content: center;
      }
      .filters {
        margin-left: 20px;
        padding: 8px 16px;
        background: rgba(26, 73, 192, 0.07);
        border-radius: 18px 18px 18px 18px;
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
    }
  }
  .librarySlt {
    width: 100%;
    margin: 38px 0 50px 0;
    padding: 0 82px;
    .libraryItem {
      position: relative;
      box-sizing: initial;
      .cardItemImgCon {
        :deep(.ant-image) {
          width: 100%;
        }
      }
    }
    .basicsBadge {
      padding: 3px 8px;
      background: #1a49c0;
      border-radius: 6px 0px 6px 0px;
      font-size: 14px;
      color: #ffffff;
    }
    .viewMore {
      display: flex;
      align-items: center;
      padding: 7px 10px 7px 22px;
      background: linear-gradient(
        254deg,
        #122f7a 0%,
        rgba(18, 47, 122, 0.3) 74%,
        rgba(18, 47, 122, 0) 100%
      );
      border-radius: 0px 6px 0px 6px;
      font-size: 14px;
      color: #ffffff;
      img {
        margin-left: 2px;
        width: 10px;
        height: 12px;
      }
    }
    .posBot {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 16px;
    }
    .bottomItem {
      padding: 10px 4px 10px 4px;

      .title {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        color: #616161;
        span {
          &:nth-child(1) {
            font-size: 16px;
            color: #202020;
          }
        }
      }

      .details {
        font-size: 14px;
        color: #202020;
        margin-top: 12px;
        span {
          color: #616161;
        }
      }
    }
    .action {
      position: absolute;
      left: -2px;
      width: calc(100% + 4px);
      transform: translateY(10%);
      padding: 9px 0;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      background: #1a49c0;
      border-radius: 0px 0px 10px 10px;
      text-align: center;
      box-sizing: initial;
      z-index: 1;
    }
  }

  .quickFloor {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 180px;
    background: linear-gradient(135deg, #f0f2f7 0%, #ffffff 100%);
    border-radius: 20px;
    box-shadow: 8px 10px 14px #e7ecf7;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    .floorNum {
      font-weight: 400;
      font-size: 36px;
      color: #1a49c0;
      transform: skewX(-12deg);
    }
    .floorTotal {
      font-size: 18px;
      color: #616161;
      span {
        &:nth-child(1) {
          color: #f28800;
        }
      }
    }
  }
}

.filterCon {
  padding: 24px 0;
  height: 100%;
  overflow: auto;
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
    .ant-checkbox-group,
    .ant-radio-group {
      width: 100%;
    }
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
    column-gap: 36px;
    row-gap: 20px;
  }
}
.qrInfo {
  margin: 40px;
  display: flex;
  align-items: center;
  .cardItemImgCon {
    width: 220px;
    margin-right: 80px;
  }
  .bottomItem {
    padding: 10px 4px 10px 4px;

    .title {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      color: #616161;
      span {
        &:nth-child(1) {
          font-size: 16px;
          color: #202020;
        }
      }
    }

    .details {
      font-size: 14px;
      color: #202020;
      margin-top: 12px;
      span {
        color: #616161;
      }
    }
  }
}
.collectionDrawer {
  .selector {
    border: 1px solid #d9d9d9;
    padding: 4px 11px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    color: #d9d9d9;

    span {
      color: rgba(0, 0, 0, 0.25);
    }
    &:hover {
      border-color: var(--primary-color);
    }
  }
}
</style>
