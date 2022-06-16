<template>
  <fragment>
    <template v-for='menu in menuList'>
      <el-submenu
        v-if="menu.children && menu.children.length > 0"
        :index="menu.path"
        :key="menu.path"
      >
        <template slot="title">
          <i :class="menu.icon"></i>
          <span  style='font-size:15px;font-weight:500' slot="title">{{menu.label}}</span>
        </template>
        <menu-item :menuList="menu.children"></menu-item>
      </el-submenu>
      <el-menu-item @click="clickMenu(menu)"  v-else :index="menu.path" :key="menu.path">
        <i :class="menu.icon"></i>
        <span slot="title">{{ menu.label }}</span>
      </el-menu-item>
    </template>
  </fragment>
</template>

<script>
import MenuItem from "./MenuItem";
export default {
  name: "MenuItem",
  props: ["menuList"],
  components: {
    MenuItem,
  },
  methods:{
    //把当前点中的菜单放在选项卡中
    clickMenu(item){
      this.$store.commit('clickMenu',item)
      this.$router.push({name:item.name})
    }
      
  }
};
</script>
<style lang="scss" scoped>
</style>