<template>
  <div class="error404">
        <div class="inner">
          <p>
         UH OH! 页面丢失
        <span>
          您所寻找的页面不存在， {{ times }} 秒后，将返回首页!
        </span>
          </p>
         </div>
        <div class="out">
          <div class="img404" >
            <img src="@/assets/img/404.png">
          </div>
        
        </div>
  </div>

</template>

<script>
export default {
  name: "404",
  data() {
    return {
      times: 10
    }
  },
  created() {
    this.goHome();
  },
  methods: {
    goHome: function () {
      this.timer = setInterval(() => {
        this.times--
        if (this.times === 0) {
          clearInterval(this.timer)
          this.$router.push({path: '/login'});
        }
      }, 1000)
    }
  }
}
</script>

<style lang="sass" scoped>
   
</style>