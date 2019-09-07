<style lang="less" scoped>
body{background:#fff;color:#8E8F96;font-family:"Microsoft YaHei","Segoe UI","Lucida Grande",Helvetica,Arial,sans-serif}
a{font-size:18px;transition-property:background,color;transition-duration:.2s;transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-webkit-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;text-decoration:none}
.newfinno-con{background:url(../assets/images/404.png) no-repeat;width:768px;height:424px;margin:20px auto 0px}
.tips{text-align:center}
.tips h2{font-size:20px;margin-bottom:20px}
.tips .m-box{width:295px;margin:auto}
.tips .m-text{font-size:12px;line-height:32px}
.tips .back-index{display:block;width:110px;height:30px;background-color:#e3453d;border-radius:10px;float:right;color:#fff;line-height:30px}
</style>
<template>
  <div>
    <div class="newfinno-con"></div>

    <div class="tips">
      <h2 class="b-text">矮油~~您访问的页面不在地球上...</h2>
      <p class="m-box">
        <span class="m-text">休息一下,{{seconds}}秒返回哦~~</span>
        <router-link tag="a" v-if="userType==6" :to="{name:'enlist'}">返回活动</router-link>
        <router-link tag="a" v-else :to="{name:'home'}">返回首页</router-link>
      </p>
    </div>
  </div>
</template>
<script>
export default {
    name:'error',
    data(){
        return{
            seconds:5,
            timer:null
        }
    },
    created () {
        this.leftTime();
    },
    computed: {
        ...mapState({
            userType: function (state) {
                return state.userInfo.type;
            }
        })
    },
    methods: {
        leftTime(){
            this.timer = setInterval(()=>{
                if(this.seconds<=1){
                    clearInterval(this.timer)
                    if(this.userType==6){
                       this.$router.push({
                            name:'enlist'
                        }) 
                    }else{
                        this.$router.push({
                            name:'home'
                        })
                    }
                }else{
                    this.seconds--;
                }
            },1000)
        }
    },
    destroyed () {
        clearInterval(this.timer);
    }
}
</script>
