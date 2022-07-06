import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
Vue.config.productionTip = false;
// import Cookies from "js-cookie";
import { getToken, removeToken, removeUserId } from "../src/utils/auth";
//菜单收缩文字文字变图标
import Fragment from "vue-fragment";
Vue.use(Fragment.Plugin);
//引入阿里图标
import "../src/assets/icon/iconfont.css";
//引入清空保单工具类
import resetForm from "../src/utils/resetForm";
Vue.prototype.$resetForm = resetForm;
//快速复制对象的值
import objCoppy from "../src/utils/objCoppy";
Vue.prototype.$objCoppy = objCoppy;
import hasPermisson from "../src/pesmisson/index";
Vue.prototype.hasPerm = hasPermisson;
import MessageUtils from "../src/utils/MessageUtils";
Vue.prototype.$message = MessageUtils;

const whiteList = ["/login"];
router.beforeEach(async (to, from, next) => {
  let token = getToken();
  if (token) {
    //token存在
    if (to.path === "/login" || to.path === "/") {
      next({ path: "/home" });
    } else {
      let menuList = store.state.MenuStore.menuList;
      if (menuList && menuList.length > 0) {
        next();
      } else {
        try {
          setTimeout(async function () {
            await store.dispatch("MenuStore/getMenuList", router);
          }, 400);
          next();
        } catch (error) {
          removeToken();
          //重置用户id
          removeUserId();
          
          //跳到登录
          next({ path: "/login" });
        }
      }
    }
    //将sessionStorage中的内容保存到state中，防止刷新丢失数据
    store.commit("MenuStore/getTabs");
    store.commit("UserStore/getloginName")
    store.commit("UserStore/getdeptList")
    //设置当前选中的tabs
    store.commit("MenuStore/setActiveTabs", to.name);
    
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      //存在白名单中
      next();
    } else {
      next({ path: "/login" });
    }
  }
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
