<template>
  <div class="charts" ref="charts">

  </div>
</template>

<script>
import echarts from 'echarts';
export default {

mounted(){
  //初始化echarts实例
  let lineCharts= echarts.init(this.$refs.charts);
  //配置折线图数据
  lineCharts.setOption({
      xAxis:{
          show:false,
          min:0,
          max:100,
          
          },
      yAxis:{ show:false,type:"category"},
      series:[
          { type:'bar',
            data:[78],
            color:"yellowgreen",
            barWidth:10,
            showBackground:true,
            backgroundStyle:{
                color:"#eee"
            },
            label:{
                show:true,
                position:'right'
            }

          },
          ],
          grid:{
              left:0,
              top:0,
              right:0,
              bottom:0
          },
          tooltip:{}
        });
    },
};
</script>

<style >
.charts{
   width: 100%;
   height: 100%;
}
</style>