<template>
<div class="deskheader">
   <desk></desk>
   <sale></sale>
</div>
</template>

<script>
import desk  from '../views/Card/desk.vue'
import sale  from '../views/Card/Sale/index.vue'
export default {
components:{
    desk,sale
}
}
</script>

<style scoped>
.deskheader{
  margin: 15px 15px;
 
}
</style>