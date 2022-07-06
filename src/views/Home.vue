<template>
  <el-container class="home">
    <el-aside
      width="atuo"
      style="border-right: 1px solid #1d4059; background-color: #1d4059"
    >
      <div class="logo">
        <img
          :src="[isCollapse ? logopng : logolong]"
          style="height: 65%; margin-top: 15px; margin-left: 15px"
        />
      </div>
      <menu-bar></menu-bar>
        <div class="userAndtime" :style="{'display':(isCollapse ? 'none' : '' )}">
            <div text-align:center>欢迎: {{ loginName }}</div>
            <div>{{ date }}</div>
        </div>
    </el-aside>
    <el-container>
      <el-header
        style="
          background-color: #ffff;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
        "
      >
        <div class="text">法人客户信息管理平台</div>
        
        <div class="upLogin">
          <div class="userAndtime">
            <div text-align:center>欢迎: {{ loginName }}</div>
            <div>{{ date }}</div>
          </div>
        <el-popconfirm title="确定要退出登录吗？" @confirm="loginOut">
          <el-button type="danger" slot="reference">退出登录</el-button>
        </el-popconfirm>
      
        </div>
      </el-header>

      <el-container>
        <el-main style="padding: 0">
          <i
            class="arrow-icon"
            :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
            @click="iconClick"
          ></i>
          <tabs></tabs>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
  //引入侧边栏
  import logolong from "../assets/img/logo-long.png";
  import logopng from "../assets/img/logo.png";
  import MenuBar from "../components/MenuBar";
  import tabs from "../components/tabs";
  import { mapState } from "vuex";
  import { loginOutApi } from "../api/user";
  import {
    getToken,
    removeToken,
    removeUserId,
    clearStorage,
    removeTokenTime,
  } from "../utils/auth";
  var $vueIndex;
  export default {
    components: { MenuBar, tabs },
    computed: {
      // isCollapse(){
      //   return this.$store.state.MenuStore.isCollapse
      // },
      
      ...mapState('MenuStore',['isCollapse']),
      ...mapState('UserStore',['loginName'])
      //   isCollapse: (state) => state.MenuStore.isCollapse,
      // }),
    },
    data() {
      return {
        date: "",
        logolong,
        logopng,
      };
    },
    mounted() {
      $vueIndex = this;
      this.showTime();
      setInterval(function () {
        $vueIndex.showTime();
      }, 1000);
    },
    methods: {
      iconClick() {
        this.$store.commit("MenuStore/setOpenOrClose");
    
      },
      async loginOut() {
        let parm = {
          token: getToken(),
        };
        let { data: res } = await loginOutApi(parm);
        if (res && res.code == 200) {
          //清除相关信息
          removeToken();
          removeUserId();
          clearStorage();
          removeTokenTime();
          //跳到登录
          window.location.href = "/login";
        }
      },

      showTime() {
        var week = new Array(
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六"
        );
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var second = date.getSeconds();
        this.date =
          year +
          "." +
          (month < 10 ? "0" + month : month) +
          "." +
          day +
          "" +
          " " +
          hour +
          ":" +
          minutes +
          ":" +
          (second < 10 ? "0" + second : second) +
          " " +
          (week[date.getDay()] || "");
      },
    },
  };
</script>


<style lang="scss" scoped>
.home {
  height: 100%;
}
.logo {
  height: 60px;
  background-color: #002140;
}

.text {
  font-size: 20px;
  color: #409EFF;
  font-family:"PingFang SC";
  //color:#E8FFE8;
  padding-left: 30px;
}
.upLogin {
  display: flex;
  text-align: center;
}
.userAndtime {
  position:absolute;
  text-align: center;
  bottom:20px;
  font-size: 14px;
  font-weight: 500;
  color:#fff
}
.arrow-icon {
  float: left;
  background: #eaedf1;
  border: 1px solid transparent;
  font-size: 23px;
  height: 39px;
  line-height: 39px !important;
  width: 40px;
  text-align: center;
}
.el-main /deep/ .el-tabs__header {
  position: static !important;
}
 .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
