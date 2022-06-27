<template>
  <div style="text-align: center;margin-top: 20px;margin-left: 20px; ">
     <el-card  class="box-card" shadow="always" style="text-align:center;width: 45%;">
      <el-form
                ref="passwordForm"
                :rules="rules"
                :label-position="labelPosition"
                label-width="100px"
                :model="passwordForm"
              >
              <el-form-item label="密码" prop="pass">
                <el-input
                  v-model="passwordForm.pass"
                  type="password"
                  autocomplete="off"
                  ref="inputpass"
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input
                  v-model="passwordForm.checkPass"
                  type="password"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item>
                  <el-button
                    type="primary"
                    @click="commitBtn"
                    >提交</el-button
                  >
                  <el-button @click="onReset"
                    >重置</el-button
                  >
                </el-form-item>
                </el-form>
     </el-card>
  </div>
</template>

<script>
import { getUserId} from "../../../utils/auth";
import { editPasswordApi } from "../../../api/user"
export default {
data(){
  const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }}
  return{
    labelPosition:"right",
     passwordForm:{
          id:getUserId(),
          pass:"",
          checkPass:""
        },
    rules:{
            pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {min: 6,max: 20,message: '长度在 6 到 20 个字符',trigger: 'blur'}
        ],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
        },
       }
      },
      methods: {
      onReset() {
        this.$refs["passwordForm"].resetFields();
        this.$refs["inputpass"].focus();
      },
      commitBtn() {
        this.$refs.passwordForm.validate(async (valid)=>{
             if(valid){
              let {data:res}=await editPasswordApi(this.passwordForm);
              if (res.code == 200)
                  this.$message.success (res.msg);
            }}
          )}
       }
       
     }
</script>

<style>

</style>