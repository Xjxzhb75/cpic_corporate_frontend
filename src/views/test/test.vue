<template>
    <div>
      <p>{{user}}</p>
      <p>{{myuser}}</p>
      <p>{{count}}</p>
      <p>{{$store.state.UserStore.count}}</p>
      <button @click="change">+</button>
    </div>
</template>
<script>

    import { mapState,mapMutations } from 'vuex'
    export default {
    name:"test",
    data(){
      return{

      }
    },    
    computed:{
        ...mapState("UserStore",['user','count']),//辅助函数后边以数组的形式直接写state里面的变量名
    //相当于直接把辅助函数里的变量展开放在计算属性里
    //state中的变量名不能跟data里的变量名重名
       ...mapState({
        myuser:'user' //相当于给state中的变量重新命名
       })
    },
    methods:{
        ...mapMutations("UserStore",['changeUser','changeCount']),
        change(){
          this.changeCount(100)
        }
        //通过commit方法来触发mutations修改state中数据 
    }
    }
    

</script>

<style lang="scss" scoped>

</style>