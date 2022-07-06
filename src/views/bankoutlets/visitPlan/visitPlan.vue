<template>
  <div>
  <el-card class="box-card">
    
    <el-row :gutter="20">
    <div class="grid-content">
        <el-col :span="5">
   <div class="block">
    <span class="demonstration"> 拜访日期: </span>
    <el-date-picker
    v-model="bankvisitdata.activevalue"
    type="date"
    value-format="yyyy-MM-dd"
    placeholder="选择日期"
    :picker-options="pickerOptions"
    size="mini"
    :disabled="dataPickerDisabled"
    @change='dataPickclick'
    >
    </el-date-picker>
  </div>
   </el-col>
   <el-col :span="5">
    <span class="demonstration"> 机构: </span>
   <el-select v-model="bankvisitdata.deptId" 
        placeholder="请选择机构"  
        size="mini"
        @change="newOpenOption"
        :disabled="selectdeptDisabled">
    <el-option
      v-for="item in optinProps"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
    </el-select>
   </el-col>
   <el-col :span="5">
    <span class="demonstration"> 银行: </span>
   <el-select v-model="bankvisitdata.bankId" 
        placeholder="请选择银行"  
        size="mini"
        @change="newbankOption"
       :disabled="selectbankDisabled"
       >
    <el-option
      v-for="it in bankNameProps"
      :key="it.id"
      :label="it.bankName"
      :value="it.id">
    </el-option>
    </el-select>
   </el-col>
    <el-col :span="5">
    <span class="demonstration"> 支行: </span>
   <el-select v-model="bankvisitdata.branchId" 
        placeholder="请选择支行"  
        size="mini"
        @change="newbranchOption"
       :disabled="selectbranchDisabled"
       >
    <el-option
      v-for="it in branchNameProps"
      :key="it.id"
      :label="it.branchName"
      :value="it.id">
    </el-option>
    </el-select>
   </el-col>
   <el-col :span="4" >
   <el-button   @click="commitBtn" size="mini" type="success" :disabled="commDisabled"> 提交</el-button>
   <el-button  @click="onReson" size="mini" type="primary" > 重置</el-button>
   </el-col>
   </div>
  </el-row>
 </el-card>
 <el-card class="box-card">
    <el-calendar v-model="calendarvalue"  >
           <template  slot="dateCell" slot-scope="{ data}" > 
                  <div  @click="viewDayBank(data)"  class="cell-container">       
               {{ data.day.split('-').slice(1).join('-') }} 
              
               <div  v-for="(item) in CalendarDataList " :key="item.id" class="calendarvalueinfo" >
                    <span  v-if="(item.activevalue).indexOf(data.day)!=-1 && item.num <= 2">
                         {{item.branchName}}  
                    </span>
               </div>
               <div  v-if="formatSchedule(data)>2" style="font-size: 12px;left: 0;float:right;bottom: 0;" 
                           >共有{{formatSchedule(data)}}条</div>
                 </div> 
           </template> 
          
    </el-calendar>
  </el-card>
  <sys-dialog
      :title="bankDialog.title"
      :height="bankDialog.height"
      :width="bankDialog.width"
      :visible="bankDialog.visible"
      @onClose="onbankDialogClose"
      @onConfirm="onbankDialogConfirm">
      <div  slot="content">
            <el-table  :data="calendarBranchList">
             <el-table-column prop="deptName" label="机构名称"></el-table-column>
             <el-table-column prop="loginName" label="用户名称"></el-table-column>
             <el-table-column prop="bankName" label="银行名称"></el-table-column>
             <el-table-column prop="branchName" label="支行名称"></el-table-column>
            </el-table>

      </div> 
      </sys-dialog>

  
  </div>
  
</template>

<script>
   import SysDialog from "../../../components/SysDialog";
  
  import{getBankNameListApi,
         getBranchNameListApi,
         addbankvisitApi,
         getCalendarDataByUserIdApi} from "../../../api/outlets"
  import {  getUserId} from "../../../utils/auth"
  export default {
    name:"visitPlan",
    data(){
      return {
         bankvisitdata:{
         userId:getUserId(),
         activevalue:new Date(),
         deptId:'',
         bankId:"",
         branchId:"",
         isExamine:"",
         calendarsign:0,
        },
        bankDialog: {
        title: "",
        height: 270,
        width: 800,
        visible: false,
      },
        calendarvalue:new Date(),
        dataPickerDisabled:false,
        selectdeptDisabled:true,
        selectbankDisabled:true,
        selectbranchDisabled:true,
        commDisabled:true,
        optinProps: [],
        bankNameProps:[],
        branchNameProps:[],
        CalendarDataList:[],
        calendarBranchList:[],
        pickerOptions: { 
         disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是可以选择今天 
         }  
        }
     }
    },
     components: {
    SysDialog,
  },
    computed: {
     formatSchedule() {
       return data => {
           if(!this.CalendarDataList) return []
           let drivers = 0;
           this.CalendarDataList.forEach(item => {
               if(item.activevalue == data.day){
                   if(drivers<=item.num){
                    drivers=item.num
                   }
               }
           });
           return drivers
       }
      }
    },
    created(){
    this.optinProps=this.$store.state.UserStore.deptList
    this.CalendarDataByUserId();
    },
    methods: { 
      dataPickclick(){
       this.dataPickerDisabled=!this.dataPickerDisabled;
        this.selectdeptDisabled=!this.selectdeptDisabled;
      },
  
    async newOpenOption(deptId){
        this.selectdeptDisabled=!this.selectdeptDisabled;
        this.selectbankDisabled=!this.selectbankDisabled;
        //参数名和变量名相同，简写
        let parm={
            deptId
        }
        let {data:res}= await getBankNameListApi(parm);
            if(res.code==200){
                this.bankNameProps=res.data
            }
        },
      async newbankOption(bankId){
            this.selectbankDisabled=!this.selectbankDisabled;
            this.selectbranchDisabled=!this.selectbranchDisabled;
           let parm={
            bankId
           }
           let{data:res}= await getBranchNameListApi(parm);
          if(res.code ==200){
            this.branchNameProps=res.data
          }
        },
        newbranchOption(){
           this.selectbranchDisabled=!this.selectbranchDisabled;
          this.commDisabled=!this.commDisabled
        },
        onReson(){
            this.bankvisitdata.activevalue=new Date();
            this.dataPickerDisabled=false;
            this.commDisabled=true;
            this.selectdeptDisabled=true;
            this.selectbankDisabled=true;
            this.selectbranchDisabled=true;
            this.bankvisitdata.deptId="请选择支公司";
            this.bankvisitdata.bankId="请选择银行";
            this.bankvisitdata.branchId="请选择支行";
            this.CalendarDataByUserId();
        },
       async commitBtn(){
        try{
            let {data:res}  = await addbankvisitApi(this.bankvisitdata);
             console.log(res);
          if (res.code ==200){
             this.$message.success(res.msg);
             this.onReson();
             
             }
            this.onReson();
          }
          catch(error){
            this.onReson();
          }
         
        },
        async CalendarDataByUserId(){
          let parm={
            userId:getUserId()
        }
          let {data:res} =await getCalendarDataByUserIdApi(parm);
           console.log(res);
           if (res.code == 200){
            this.CalendarDataList=res.data
           }
        },
        onbankDialogClose(){
            this.calendarBranchList=[];
             this.bankDialog.visible=false;
        },
        onbankDialogConfirm(){
          this.calendarBranchList=[];
          this.bankDialog.visible=false;
        },
       async viewDayBank(data){ 
         this.bankDialog.title=data.day+"日拜访计划"
          this.calendarBranchList=this.CalendarDataList.filter((item)=>{
            return item.activevalue == data.day
          })
          console.log(this.calendarBranchList);
          this.bankDialog.visible=true;
        }
    }
}
    
    
</script>

<style lang="scss" scoped>
.cell-container {
  height: 100%;
  width: 100%;
  position: relative;
}
.demonstration{
     margin-right: 15px;
}
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
  .box-card {
    margin-left: 20px;
    margin-top: 20px;
    width: 97%;
  }
  .cardinfo{
    font-size: 12px;
  }
  .calendarvalueinfo{
    font-size: 12px;
   margin: 0 auto;
  }
  

  
</style>