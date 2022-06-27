<template>
  <el-card>
    <el-row :gutter="20">
    <div class="grid-content">
        <el-col :span="8">
   <div class="block">
    <span class="demonstration"> 拜访日期 </span>
    <el-date-picker
    v-model="activevalue"
    type="date"
    value-format="yyyy-MM-dd"
    placeholder="选择日期"
    :picker-options="pickerOptions"
    size="mini">
    </el-date-picker>
  </div>

   </el-col>
   <el-col :span="8">
   </el-col>
   </div>
  </el-row>
 </el-card>
</template>

<script>
  import { getDeptByUserId } from "../../../api/department"
  import {  getUserId} from "../../../utils/auth"
  export default {
    name:"visitPlan",
    data(){
      return {
        activevalue:new Date(),
        addtableList: [],
        optinProps: {
          value: "id",
          label: "branchName",
          children: "children",
          expandTrigger: "hover",
        },
        pickerOptions: { 
         disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
         }  
        }
     }
    },
    created(){
    this.userDeptinfo();
    },
    methods: { 
    async userDeptinfo(){
        let parm={
            userId:getUserId()
        }
        let {data:res}= await getDeptByUserId(parm);
        if (res.code == 200){
            
        }
    }      
    
    }
}
    
    
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
  }
</style>