<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    closable
    @tab-remove="removeTab"
    @tab-click="tabClick">
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name">
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
    computed:{
        editableTabsValue:{
            get(){
                return this.$store.state.MenuStore.editableTabsValue
            },
            set(val){
                this.$store.state.MenuStore.editableTabsValue = val;
            },
        },
        editableTabs:{
            get(){
                return this.$store.state.MenuStore.editableTabs
            },
            set(val){
                this.$store.state.MenuStore.editableTabs =val;
            },
        },
    },
  data() {
    return {};
  },
  methods: {
      tabClick(tab){
      let obj = {};
      obj.title = tab.label;
      obj.name = tab.name;
      this.$store.commit('MenuStore/clickMenu',obj);
      this.$router.push({name:tab.name})
    },
    
    removeTab(targetName) {
      //如果是首页不关闭
      if (targetName === "desktop") {
        return;
      }
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      //设置当前激活的选项卡
      this.$store.commit('MenuStore/setActiveTabs',this.editableTabsValue)
      //激活的选项卡存储到sessionStorage里面
      sessionStorage.setItem('tabsList',JSON.stringify(this.editableTabs))
      //跳转到路由
      this.$router.push({name:this.editableTabsValue})
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__header{
  margin: 0px;
}
</style>