<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="住院数据" name="sale"></el-tab-pane>
        <el-tab-pane label="门诊数据" name="visite"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span>医疗费总额</span>
        <span>进入统筹费用</span>
        <span>统筹支出</span>
        <span>大病保险支出</span>
        <span>支出合计</span>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div>
            <h3>{{title}}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>长春中心支公司</span>
                <span class="rvalue">1256888</span>
              </li>
              <li>
                 <span class="rindex">2</span>
                <span>吉林中心支公司</span>
                <span class="rvalue">856888</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>四平中心支公司</span>
                <span class="rvalue">656888</span>
              </li>
              <li>
                 <span class="nindex">4</span>
                <span>延边中心支公司</span>
                <span class="rvalue">556888</span>
              </li>
              <li>
                <span class="nindex">5</span>
                <span>通化中心支公司</span>
                <span class="rvalue">546888</span>
              </li>
              <li>
                <span class="nindex">6</span>
                <span>白城中心支公司</span>
                <span class="rvalue">536888</span>
              </li>
              <li>
                <span class="nindex">7</span>
                <span>松原中心支公司</span>
                <span class="rvalue">426888</span>
              </li>
              <li>
                <span class="nindex">8</span>
                <span>白山中心支公司</span>
                <span class="rvalue">356888</span>
              </li>
              <li>
                <span class="nindex">9</span>
                <span>辽源中心支公司</span>
                <span class="rvalue">256888</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
  import echarts from "echarts";
  export default {
    data() {
      return {
        activeName: "sale",
        mycharts:null
      };
    },
    computed:{
     title() {
       return this.activeName =='sale'?'住院数据':'门诊数据'
     }
    },
    watch:{
      title(){
        this.mycharts.setOption({
          title:{
            text:this.title
          }
        })
      }
    },
    mounted() {
      this.mycharts = echarts.init(this.$refs.charts);
      this.mycharts.setOption({
        title: {
          text: this.title,
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "长春",
              "吉林",
              "四平",
              "延吉",
              "白城",
              "松源",
              "辽源",
              "通化",
              "白山",
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: this.activeName,
            type: "bar",
            barWidth: "60%",
            data: [580, 420, 330, 260, 170, 200, 190, 300, 290],
          },
        ],
      });
    },
  };
</script>

<style scoped>
::v-deep .el-card__header {
  border-bottom: none;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
  font-size: 13px;
  margin: 10px 0px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 400px;
}
ul{
  list-style: none;
  width: 100%;
  height: 400px;
  padding: 0px;
}
ul li{
  height: 9%;
}
ul li span{
  margin: 0px 10px;
}
.rindex{
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  color:white;
  text-align: center;
}
.nindex{
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  color:rgb(0, 0, 0);
  text-align: center;
}
.rvalue{
  float: right;
}
</style>