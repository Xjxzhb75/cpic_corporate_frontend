<template>
  <div style="text-align: center;margin-top: 10px;margin-left: 20px; ">
    <el-card class="box-card" shadow="always" style="text-align:center;width: 45%;">
     
              <el-form
                 ref="ruleForm"
                label-width="100px"
                :model="addModel"
              >
                <el-form-item label="账号" prop="username">
                  <el-input v-model="addModel.username" disabled />
                </el-form-item>
                <el-form-item label="昵称" prop="loginName">
                  <el-input v-model="addModel.loginName" />
                </el-form-item>
                <el-form-item label="机构" prop="deptName">
                  <el-input v-model="addModel.deptName"  disabled/>
                </el-form-item>
               
                <el-form-item
                  prop="email"
                  label="邮箱"
                  :rules="[
                    {
                      required: true,
                      message: '请输入邮箱地址',
                      trigger: 'blur',
                    },
                    {
                      type: 'email',
                      message: '请输入正确的邮箱地址',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <el-input v-model="addModel.email" />
                </el-form-item>
      
                <el-form-item  label="手机号" prop="mobile">
                  <el-input v-model="addModel.mobile" />
                </el-form-item>
                  <el-form-item prop="sex" label="性别">
                    <el-radio-group v-model="addModel.sex">
                    <el-radio :label="'0'">男</el-radio>
                    <el-radio :label="'1'">女</el-radio>
                   </el-radio-group>
                 </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary" @click="commitBtn"
                    
                    >提交</el-button
                  >
            
                </el-form-item>
              </el-form> 
       </el-card>
  </div>
</template>

<script>
import { getUserId,setloginName} from "../../../utils/auth";
import { getUserByUserIdApi,settingUserApi} from "../../../api/user";
export default {
  name:"Setting",
  data(){
    return{
       
       addModel: {
        id:getUserId(),
        deptName: "",
        loginName: "",
        mobile: "",
        email: "",
        username: "",
        sex: ""
        },
      };
  },
  created(){
    this.userInfo();
    console.log(this.userInfo());
  },
  methods:{
     async userInfo(){
      let parm = {
        userId: getUserId(),
      }
       let{data:res} = await getUserByUserIdApi(parm);
       if (res.code == 200 && res.data){
        console.log(res.data)
        this.addModel=res.data
       }
     },
     commitBtn() {
        this.$refs.ruleForm.validate(async (valid)=>{
          if(valid){
            console.log(this.addModel);
             let res=null;
             res =await settingUserApi(this.addModel);
            if (res.data.code == 200) {
            this.userInfo();
            setloginName(this.addModel.loginName);
            this.$message.success(res.data.msg);
            location.reload();
            
          }}
        })
  
      },
      
      
    }
  
}
       
</script>

<style>

</style>