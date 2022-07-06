<template>
  <div id="userLayout">
    <div class="login_panle">
      <div class="login_panle_left">
        <sign-left/>
      </div>
      <div  class="login_panle_form">
           <el-image 
           :src="logo" 
           style="padding-top:10px" 
           ></el-image>
          <el-Divider></el-Divider>
             
         <el-form
        class="loginForm"
        :model="loginForm"
        ref="loginForm"
        :rules="loginRules"
        status-icon
        label-position="left"
        label-width="auto"
      >
      
        <el-form-item label="用户名："  prop="username">
          <el-input
            v-model="loginForm.username"
            clearable
            placeholder="请输入用户名"
            ref="inputuser"
          >
          </el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <label slot="label">密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
          <el-input
            type="password"
            v-model="loginForm.password"
            show-password
            clearable
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10" >
            <el-col :span="12">
              <el-button type="primary"   @click="commitBtn" >
                 <span v-if="!loading">登录</span>
              <span v-else>登 录 中...</span>
              </el-button>
            </el-col>
            <el-col >
              <el-button type="primary"   @click="onReset">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
       <div class="login_panle_foot">
        <span>{{ copyright }}</span>
        <p>{{ copyrightEn }}</p>
      </div>
      </div>
    </div>
  
</template>

<script>
  import SignLeft from "./SignLeft.vue";
  import logo from "../assets/img/logo30.jpg";
  import { login } from "../api/login";
  import { setToken, setUserId, setTokenTime} from "../utils/auth";
  export default {
    components: { SignLeft },
    data() {
      return {
        logo,
        copyright:process.env.VUE_APP_COPYRIGHT,
        copyrightEn:process.env.VUE_APP_COPYRIGHTEN,
        loading: false,
        loginForm: {
          username: "",
          password: "",
        },
        loginRules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 4, max: 15, message: "用户名在4-15位之间", trigger: "blur" },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 4, max: 15, message: "密码在4-15位之间", trigger: "blur" },
          ],
        },
      };
    },
    methods: {
      onReset() {
        this.$refs["loginForm"].resetFields();
        this.$refs["inputuser"].focus();
      },
      commitBtn() {
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            this.loading = true;
            try{
            let res = await login(this.loginForm);
            console.log(res);
            if (res.data.code == 200) {
              let datas = res.data;
              setToken(datas.token);
              setUserId(datas.id);
              setTokenTime(datas.expireTime);
              this.$store.commit('UserStore/setloginInfo',datas.loginName)
              this.$store.dispatch('UserStore/getDeptByUserId', {parm:datas.id});
              this.$router.push("home");
            } else {
              this.$message.error(res.data.msg);
              return;}
            }catch (error){
              this.loading=false;
            }
            }
          
        });
      },
    },
  };
</script>
<style  lang="less" scoped>
#userLayout {
  margin: 0;
  padding: 0;
  background-image: url("../assets/img/background.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;
  position: fixed;
  .login_panle {
    position: absolute;
    top: 3vh;
    left: 2vw;
    width: 90vw;
    height: 94vh;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .login_panle_left {
      width: 697px;
      height: 547px;
      float: right !important;
    }
    .login_panle_form {
      height: 50%;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
        .el-row{
           display: flex;
         }}
    .login_panle_foot {
        position: fixed;
        bottom: 0;
        text-align: center;
        font-size: 16px;
        color: #f0f0f0
      }
  }
}
</style>