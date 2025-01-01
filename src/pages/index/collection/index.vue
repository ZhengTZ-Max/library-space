<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import { DownOutlined } from "@ant-design/icons-vue";
import { exchangeDateTime } from "@/utils";
import {
  // getLockerList,
  // getLockerFilter,
  getAllArea,
  getLostlocker,
  getLostInfo,
} from "@/request/collection";
import CollectionFilterCom from "@/components/CollectionCom/CollectionFilterCom.vue";
import Uploader from "@/components/Uploader.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();

const form = reactive({
  name: "",
  url: "",
  owner: "",
  type: "",
  approver: "",
  dateTime: null,
  description: "",
});

const clearColumns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Disabled User",
    age: 99,
    address: "Sidney No. 1 Lake Park",
  },
];

const state = reactive({
  activeIndex: "",

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
  areaSelectRow: {
    library: "",
    floor: "",
    areaId: "",
  },
  areaUploadImg: [],

  showClearRightCon: false,

  clearSearch: {
    library: "",
    type: "",
    hour: "",
  },
});

onMounted(() => {
  fetchFilter();
});

const onChangeAct = (i) => {
  state.activeIndex = i.id;
  fetchInfo(i);
  // state.collectionInfoShow = true;
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
    let res = await getAllArea();
    state.filterOptions = res?.data;
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
const handleAreaSelect = () => {};
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};
const onReviewImg = (v) => {};
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
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
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
                  <span>{{ $t("V4_collection_date") }}</span> 2024-01-29
                </div>
                <div class="details">
                  <span>{{ $t("V4_collection_location") }}</span>
                  基础馆-1F-自修B区
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
      title="物品筛选"
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
      :okButtonProps="{ size: 'middle' }"
      centered
    >
      <CollectionFilterCom
        v-if="state.filterOptions?.length"
        :data="state.filterOptions"
        :initSearch="state.areaSelectRow"
        type="area"
      />
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
          <a-image
            class="cardItemImg"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          >
          </a-image>
          <!-- <div class="leftBadge basicsBadge">14213</div> -->
        </div>
        <div class="bottomItem">
          <div class="title">
            <span>基础馆-1F-1号柜：08格</span>
          </div>
          <div class="details">
            <span>{{ $t("V4_collection_date") }}</span> 2024-01-29
          </div>
          <div class="details">
            <span>{{ $t("V4_collection_location") }}</span> 基础馆-1F-自修B区
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
      <a-form size="m" :model="form">
        <a-row style="margin-top: 24px; padding-right: 12px" :gutter="0">
          <a-col :span="24">
            <a-form-item
              label="存放区域："
              name="owner"
              :labelCol="{ span: 3 }"
            >
              <div class="selector" @click="state.showAreaSelect = true">
                请选择
                <DownOutlined />
              </div>
              <!-- <a-select placeholder="Please a-s an owner">
              </a-select> -->
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="收取地点：" name="name" :labelCol="{ span: 3 }">
              <div class="selector" @click="state.showAreaSelect = true">
                请选择
                <DownOutlined />
              </div>
              <!-- <a-input
                v-model:value="form.name"
                placeholder="Please enter user name"
              /> -->
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              label="上传图片："
              name="owner"
              :labelCol="{ span: 3 }"
            >
              <Uploader
                :initFileList="state.areaUploadImg"
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
          <!-- <a-col :span="24">
            <a-form-item label="Owner" name="owner" :labelCol="{ span: 3 }">
              <div class="selector">
                请选择
                <DownOutlined />
              </div>
            </a-form-item>
          </a-col> -->
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button size="m">Cancel</a-button>
          <a-button size="m" type="primary">Submit</a-button>
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
      <div class="clearCon">
        <div class="clearHead">
          <a-select
            size="m"
            v-model:value="state.clearSearch.library"
            style="width: 200px"
            placeholder="请选择馆舍"
            allowClear
          >
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
          <a-select
            size="m"
            v-model:value="state.clearSearch.type"
            style="width: 200px; margin: 0 20px"
            placeholder="类型"
            allowClear
          >
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>

          <a-input
            style="width: 200px"
            size="m"
            v-model:value="state.clearSearch.hour"
            suffix="小时"
          />

          <a-button shape="round" size="m" class="clearBtn">
            <template #icon>
              <img src="@/assets/collection/clearSearch.svg" alt="" />
            </template>
            搜索</a-button
          >
        </div>

        <div class="clearTable">
          <a-table
            :row-selection="rowSelection"
            :columns="clearColumns"
            :data-source="data"
          >
            <template #bodyCell="{ column, text }">
              <template v-if="column.dataIndex === 'name'">
                <a>{{ text }}</a>
              </template>
            </template>
          </a-table>
        </div>
      </div>
      <template #extra>
        <a-space>
          <a-button size="m">Cancel</a-button>
          <a-button size="m" type="primary">立即清柜</a-button>
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

.collectionClearDrawer {
  .clearCon {
    padding: 30px 40px;
    .clearHead {
      display: flex;
      align-items: center;
      .clearBtn {
        width: 82px;
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

      :deep(.ant-select-selector) {
        border-radius: 20px;
      }
    }
  }
}
</style>
