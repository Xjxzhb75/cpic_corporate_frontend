<template>
    <div>
      {{user}},
      {{myuser}}
    </div>
</template>
<script>
import { component } from 'vue/types/umd'
    import { mapState } from 'vuex'
    export default {
    name:"test",
    data(){
      return{
        
      }
    },    
    component:{
        ...mapState(['user','count']),//辅助函数后边以数组的形式直接写state里面的变量名
    //相当于直接把辅助函数里的变量展开放在计算属性里
    //state中的变量名不能跟data里的变量名重名
       ...mapState({
        myuser:'user' //相当于给state中的变量重新命名
       })
    }
    }
</script>

<style lang="scss" scoped>

</style>