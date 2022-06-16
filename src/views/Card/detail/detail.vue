<template>
  <div>
      <!--上部卡片的头部-->
     <div class="detail-header">
         <span>{{title}}</span>
         <i class="el-icon-magic-stick"></i>
     </div>
     <div class="detail-content">{{count}}</div>
      <div class="detail-charts">
          <slot name="charts"></slot>
      </div>
      <div class="detail-footer">
          <slot name="detfooter"></slot>
      </div>
  </div>
</template>

<script>
export default {
props:['title','count']
}
</script>

<style lang="scss" scoped>
.detail-header{
    display: flex;
    justify-content:space-between;
    color:#797777;
    font-size: 16px;
}
.detail-content{
    font-size: 28px;
    padding: 6px 6px;
}
.detail-charts{
   height: 50px; 
}
.detail-footer{
    border-top: 1px solid #b4b2b2;
    padding-top: 5px 0px;
    color:#797777;
}

</style>