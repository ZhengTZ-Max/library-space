<script setup>
import { reactive, onMounted, watch, computed } from "vue";
import { useStore } from "vuex";
import _ from "lodash";

const store = useStore();
const systemMode = computed(() => store.state.systemMode);

const props = defineProps(["list", "selected"]);
const emits = defineEmits(["handleSlt"]);
const state = reactive({
  list: [],
  selected: [],

  indeterminate: true,
  checkAll: false,
});

onMounted(() => {
  state.list = props?.list;
  state.selected = props?.selected;
});

const onCheckAllChange = (e) => {
  console.log(e.target.checked);
  Object.assign(state, {
    selected: e.target.checked ? state.list?.map((e) => e?.id) : [],
    indeterminate: false,
  });
};
watch(
  () => state.selected,
  _.debounce((val) => {
    state.indeterminate = !!val.length && val.length < state.list?.length;
    state.checkAll = val.length === state.list?.length;
    emits("handleSlt", state.selected);
  }, 500)
);

const handleClickChange = (v) => {
  // !v && emits("handleSlt", state.selected);
};
</script>
<template>
  <a-popover
    placement="bottomRight"
    trigger="click"
    @openChange="handleClickChange"
  >
    <template #content>
      <div class="spacesltlabel">
        <a-checkbox
          v-model:checked="state.checkAll"
          :indeterminate="state.indeterminate"
          @change="onCheckAllChange"
        >
          全部
        </a-checkbox>
        <a-checkbox-group v-model:value="state.selected">
          <a-checkbox
            v-for="item in state.list"
            :key="item?.id"
            :value="item?.id"
            >{{ item?.name }}</a-checkbox
          >
        </a-checkbox-group>
      </div>
    </template>
    <div :class="{ filters: systemMode == 'pc' }" class="activeBtn">
      <img
        v-if="systemMode == 'pc'"
        src="@/assets/seat/filtersIcon.svg"
        alt=""
      />
      <img v-else src="@/assets/home/filterOutline.svg" alt="" />
    </div>
  </a-popover>
</template>
<style lang="less" scoped>
.filters {
  margin-left: 20px;
  padding: 6px 10px;
  background: rgba(26, 73, 192, 0.07);
  border-radius: 24px;
  border: 1px solid rgba(26, 73, 192, 0.14);
  font-size: 14px;
  color: #1a49c0;
  img {
    width: 14px;
    height: 14px;
  }
}

.spacesltlabel {
  display: flex;
  flex-direction: column;
  .ant-checkbox-wrapper {
    padding: 6px 12px;
    margin: 0 -12px;
    user-select: none;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .ant-checkbox-group {
    display: flex;
    flex-direction: column;
  }
}
</style>
