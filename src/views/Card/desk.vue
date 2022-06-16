<template>
<div >
   <el-row :gutter="10">
       <el-col :span="6" :offset="0">
           <el-card>
           <detail 
           title="总数据量"
           count="123689"
           >
           <template slot="charts">
            <span>周同比&nbsp;&nbsp;56.57% <i class="el-icon-top"  style="color:red"></i></span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;日同比&nbsp;&nbsp;35.2%<i class="el-icon-bottom" style="color:green"></i></span>
           </template>
           <template slot="detfooter">
              <span>日增量:56895</span>
           </template>
           </detail>
           </el-card>
       </el-col>
       <el-col :span="6" :offset="0">
            <el-card>
           <detail 
           title="住院数据量"
           count="83569">
           <template slot="charts">
               <lineCharts></lineCharts>
           </template>
           <template slot="detfooter">
              <span>日增量:3895</span>
           </template>
           </detail>
           </el-card>
       </el-col>
       <el-col :span="6" :offset="0">
            <el-card>
           <detail 
           title="门诊数据量"
           count="43210">
           <template slot="charts">
               <barCharts></barCharts>
           </template>
           <template slot="detfooter">
              <span>日增量:6895</span>
           </template>
           </detail>
           </el-card>
       </el-col>
       <el-col :span="6" :offset="0">
            <el-card>
           <detail 
           title="总支付金额占比"
           count="1256897元">
           <template slot="charts">
               <progressCharts></progressCharts>
           </template>
           <template slot="detfooter">
              <span>日增量:156895</span>
           </template>
           </detail>
           </el-card>
       </el-col>
   </el-row>
   
</div>
</template>

<script>
import detail from "../Card/detail/detail.vue"
import lineCharts from "../Card/lineChart/index.vue"
import barCharts from '../Card/barChart/index.vue'
import progressCharts from '../Card/progressChart/index'
export default {
components:{
    detail,lineCharts,barCharts,progressCharts
}
}
</script>

<style >

</style>