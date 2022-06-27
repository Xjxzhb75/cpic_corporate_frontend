//引入axios请求方法
import { getMenuList } from '../../api/login'
export default {
  namespaced: true,
  state: {
    //当前选中的选项卡
    editableTabsValue: "desktop",
    //选项卡数据域
    editableTabs: [
      {
        title: '首页',
        name: 'desktop'
      }
    ],
    //菜单伸缩控制,通过点击事件取反，组件上使用三元运算具体见home的伸缩按钮中目录、时间、logo的改变等
    isCollapse: false,
    //菜单数据
    menuList: [],
    //路由数据
    routerList: []
  },
  mutations: {
    //获取tabs
    getTabs(state) {
      let tabs = sessionStorage.getItem('tabsList')
      if (tabs) {
        state.editableTabs = JSON.parse(tabs)
      }
    },
    //设置当前激活的选项卡
    setActiveTabs(state, val) {
      state.editableTabsValue = val;
    },
    setOpenOrClose(state) {
      state.isCollapse = !state.isCollapse;
    },
    clickMenu(state, val) {
      //1.判断当前点中菜单是否在tabs里面
      //findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
      //当数组中的元素在测试条件时返回 true 时, findIndex() 返回符合条件的元素的索引位置，之后的值不会再调用执行函数。
      //如果没有符合条件的元素返回 -1
      let res = state.editableTabs.findIndex(item => item.name === val.name)
      //2.如果不存在，组织tabs数据，存放到editableTabs
      if (res === -1) {
        let tab = {};
        tab.title = val.label;
        tab.name = val.name;
        state.editableTabs.push(tab);
      }
      //3.设置当前选中的选项卡
      state.editableTabsValue = val.name;
      //4.把选中的选项卡存放到sessionStorage里面
      sessionStorage.setItem('tabsList', JSON.stringify(state.editableTabs))
    },
    //设置菜单数据
    setMenuList(state, list) {
      state.menuList = list;
    },
    //设置路由数据
    setRouterList(state, list) {
      state.routerList = list;
    },
    //生成动态路由
    dynamicRouter(state, router) {
      //获取原来的路由
      let oldRouter = router.options.routes;
      //获取后台生成的路由
      let routerList = state.routerList;
      routerList.forEach(item => {
        //html页面，需要IFrame展示
        if (/^.+\.html$/ig.test(item.url)) {
          item.component = resolve => require([`@/views/IFrame/IFrame.vue`],resolve)
        } else {
          item.component = resolve => require([`@/views${item.url}.vue`], resolve);
        }
        oldRouter[1].children.push(item);
      })
      router.addRoutes(oldRouter)
    }
  },
  actions: {
    async getMenuList({ commit }, router) {
      
      let res = await getMenuList();
      //菜单数据
      let menuList = res.data.data.menuList;
      //路由数据
      let routerList = res.data.data.routerList;
      //权限字段
      sessionStorage.setItem('codeList',JSON.stringify(res.data.data.authList))
      //把获取到的菜单或路由数据存放到vuex里面
      commit('setMenuList', menuList);
      commit('setRouterList', routerList);
      //生成动态路由
      commit('dynamicRouter', router)
    }
  }
}