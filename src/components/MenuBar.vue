<template>
  <el-menu 
   :default-active="$route.path"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    unique-opened
    background-color="#1d4059"
    text-color="#ffff"
    >
   <menu-item :menuList="menuList"></menu-item>
</el-menu>
    
</template>

<script>
//
import MenuItem from "./MenuItem";
import{mapState} from "vuex";
export default {
  components: { MenuItem },
  computed:{
    ...mapState({
      isCollapse(){
        return this.$store.state.MenuStore.isCollapse
      },
      menuList(){
        return this.$store.state.MenuStore.menuList
      }
      //菜单伸缩
      //isCollapse:(state)=> state.MenuStore.isCollapse,
      //菜单数据
      //menuList:state =>state.MenuStore.menuList
      })
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;}
.el-menu{
  border-right: none!important;
}
</style>