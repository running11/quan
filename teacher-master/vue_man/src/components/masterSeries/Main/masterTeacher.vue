<template>
<div class="content-container">
 <div class="master-teacher-list">
   <div class="master-teacher-item" v-for="(items, index) in rows" @click="go(items.uid)" >
     <img :src="items.teacher_img ? items.teacher_img : '../../../../static/images/img_profile_photo.png'" alt="">
     <div class="info">
       <div class="teacher-name">{{ items.teacher_name }}</div>
       <div class="desc">{{ items.brief }}</div>
       <div class="clearfix"></div>
     </div>
   </div>
   <div class="clearfix"></div>
     <div class="page-num">
        <el-pagination
          background 
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="pages.pageSize"
          :current-page="current_page"
          :total="totals">
        </el-pagination>
      </div>
 </div>
</div>

</template>

<script>
export default {
  name: 'masterTeacher',
  data () {
    return {
      pages: {},
      rows: [],
      totals: 0,
      current_page: 1
    }
  },
  mounted() {
     this.$store.dispatch('GET_TEACHERLIST', {})
     .then(res => {
      console.log(res)
      let data = res.data
      this.pages = data.pages
      this.rows = data.rows
      this.totals = data.totals
     })
  },
  methods:{
  	go(uid){
      this.$router.push({path:'/adminteacher', query:{uid : uid}})
  	},
    //分页
    handleCurrentChange(val) {
      console.log(val)
      this.current_page = val
      let obj = {
        page : val,
        pageSize: this.pages.pageSize
      }
      this.$store.dispatch('GET_TEACHERLIST', obj)
      .then(res => {
        console.log(res)
        var data = res.data
        this.rows = data.rows;
      })
      },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.master-teacher-list{
  min-width:810px;
  .page-num{
    text-align :center
  }
  .master-teacher-item{
    float:left;
    width:48%;
    height:192px;
    box-sizing:border-box;
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    margin:0 2% 20px 0;
    padding:20px;
    img{
      float:left;
      width:152px;
      height:152px;
    }
    .info{
      margin-left:172px;
      .teacher-name{
        font-family: PingFangSC-Light;
        font-size: 24px;
        color: #444444;
        line-height: 40px;
        padding-bottom:8px;
      }
      .desc{
        font-family: PingFangSC-Light;
        font-size: 16px;
        color: #444444;
        letter-spacing: -0.39px;
        line-height: 24px;
        display:-webkit-box;
        overflow:hidden;
        text-overflow:ellipsis;
        -webkit-line-clamp:4;
        -webkit-box-orient: vertical;
      }
    }
  }
}
.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    background-color: #FFFFFF !important; 
}
</style>