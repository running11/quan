<template>

<div class="content-container">
  <div class="content-articles content">
    <div class="filter-con content">
      <!--filter-content-->
      <div class="filter-content">
        <div class="fliter-wrapper">
          <div class="pull-left">
              <el-select v-model="priceValue" placeholder="请选择" class="condition-item price-select">
                <el-option
                  v-for="item in priceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="typeValue" placeholder="全部类型" class="condition-item type-select">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="condition-item">
                <el-date-picker
                  v-model="dataValue"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </div>
              <el-select v-model="stateValue" placeholder="状态" class="condition-item type-select">
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="filter-btn pull-left" @click="filter">筛选</div>
            <div class="clearfix" style="height:32px;"></div>
        </div>
      </div>
      <!--filter-content-->

      <!--article-top-->
      <div class="article-top">
        <div class="left pull-left last-article">全部文章：{{item.articles.totals}}篇</div>
        <div class="pull-right">
          <el-select v-model="sortValue" placeholder="排序" class="sort-select" @change="sort" style="width:105px">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <!--article-top-->
      <!--no-article-->
      <div class="article-list no-article" v-if="articleShow">
        <img src="/static/images/img_blank.png" alt="">
        <p>还没写过文章呢，点击右上角新建文章创作吧</p>
      </div>
      <!--no-article-->

      <!--article-list-->
      <div class="article-list had-article">
					<div class="list" v-for="(items,index) in item.articles.rows" @click ="articleDetails(items.article_id, items.type)">
            <div class="list-wrapper">
              <div class="list-left pull-left list-img">
                <img v-if="items.cover==''" src="../../../images/img_picture_default.png" alt="">
                <img v-if="items.cover!=''" :src="items.cover" alt="">
                <img src="static/images/ic_music.png" class="sign-btn video-btn" v-if="items.type == 2"/>
                <img src="static/images/ic_video.png" class="sign-btn video-btn" v-if="items.type == 3"/>
              </div>
              <div class="list-right pull-left list-info">
                <h4>{{items.title}}</h4>
                <div class="article-btns">
                  <span class="modify" @click="goToEdit(items.article_id, items.type)"></span>
                  <span class="delete" @click="delArticle(items.article_id, index)"></span>
                </div>
                <ul>
                  <li class="comment pull-left">
                    <img src="static/images/ic_list_comment.png" alt="">
                    <span>{{ items.comments }}</span>
                  </li>
                  <li class="eye pull-left">
                    <img src="static/images/ic_list_view.png" alt="">
                    <span>{{ items.views }}</span>
                  </li>
                  <li class="star pull-left">
                    <img src="static/images/ic_list_collection.png" alt="">
                    <span>{{ items.collections }}</span>
                  </li>
                 <!--  <li class="share pull-left">
                    <img src="static/images/ic_list_share.png" alt="">
                    <span>{{ items.shares }}</span>
                  </li> -->
                </ul>
                <div class="clearfix"></div>
                <div class="b-btns">
               <!--    <span class="a-type" :class="items.is_charge == 0 ?'free':'sell'">{{ items.charge }}</span> -->
                  <span class="a-shelves noUp" @click="articleSale(index)" v-if="items.show_status == '未上架'">{{ items.show_status }}</span>
                  <span class="a-shelves upper" @click="articleSale(index)" v-if="items.show_status == '已上架'">{{ items.show_status }}</span>
                  <span class="a-shelves lower" @click="articleSale(index)" v-if="items.show_status == '已下架'">{{ items.show_status }}</span>
                  <span class="show-time pull-right" style="margin-right:24px;">{{ items.show_time }}</span>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
					</div>

					<div class="page-num">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :current-page = "current_page"
              :page-size="item.articles.pages.pageSize"
              :total="item.articles.totals">
            </el-pagination>
          </div>
				</div>
			</div>
      <!--article-list-->
    </div>
    <el-dialog
      title="警告"
      :visible.sync="delDialogVisible"
      width="480px"
      :top="topValue"
      center
      id="del-dialog">
      <span class="text-center">确认要删除这篇文章？删除后午饭恢复，请谨慎操作</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDel">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="已有用户购买此文章，无法删除"
      :visible.sync="unableDelDialogVisible"
      width="480px"
      :top="topValue"
      center
      id="unable-del-dialog">
      <span class="text-center">为了保障用户权益，要删除文章请使用私聊中的晓客服联系教师圈管理员</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unableDelDialogVisible = false">我知道了</el-button>
      </span>
    </el-dialog>
  </div>

</div>

</template>

<script>
import moment from 'moment';

export default {
  name: 'masterArticle',
  data () {
    return {
      priceOptions: [{
        value: '0',
        label: '免费'
      }],
      priceValue: '',
      typeOptions: [{
        value: '1',
        label: '图文'
      }, {
        value: '2',
        label: '语音'
      },{
        value: '3',
        label: '视频'
      }],
      typeValue: '',
      stateOptions: [{
        value: '2',
        label: '已上架'
      }, {
        value: '1',
        label: '未上架'
      },{
        value: '3',
        label: '已下架'
      }],
      stateValue: '',
      sortOptions: [{
        value: '1',
        label: '评论数'
      }, {
        value: '2',
        label: '浏览量'
      }, {
        value: '3',
        label: '收藏量'
      }],
      sortValue: '',
      checkOptions:[{
        value: '选项1',
        label:'未审核'
      },{
        value: '选项2',
        label:'已审核'
      }],
      pickerOptions: {
        disabledDate(time) {
            return time.getTime() > Date.now();
          },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dataValue: '',
      deleteId: '',
      deleteIndex: '',
      delDialogVisible: false,
      unableDelDialogVisible: false,
      current_page: 1,
      topValue: 0,
      item:{
        articles: {
          pages: {},
          rows: [],
          totals: 0
        }
      },
      articleShow: false
    }
  },
  mounted(){
     this.topValue = ((window.document.documentElement.clientHeight) - 201)/2 + 'px'
    // vuex 后台调取数据
     this.$store.dispatch('GET_ARTICLE')
        .then(res => {
        let data = res.data
          if(res.code != 200){
            this.$message.error(res.info);
            }
        // 封装数据
        if(data){
          console.log(data);
          this.item.articles.rows = data.rows;
          this.item.articles.totals = parseInt(data.totals);
          this.item.articles.pages = data.pages;
        }
        if(this.item.articles.rows.length == 0){
          this.articleShow = true
        }

      }).catch(err => {
        console.log(err)
      })
  },
  methods:{
    updata() {
        this.$store.dispatch('GET_ARTICLE')
        .then(res => {
        let data = res.data

        // 封装数据
        if(data){
          console.log(data);
          this.item.articles.rows = data.rows;
          this.item.articles.totals = parseInt(data.totals);
          this.item.articles.pages = data.pages;
        }
        if(this.item.articles.rows.length == 0){
          this.articleShow = true
        }

      }).catch(err => {
        console.log(err)
      })
    },
  	articleDetails(value1,value2){
  		//路由跳转
       this.$router.push({path:'/adminarticle',query:{article_id: value1, article_type: value2}})
  	},
    delArticle(deleteId, index){
      this.delDialogVisible = true;
      this.deleteId = deleteId;
      this.deleteIndex = index;
      event.stopPropagation();
    },
    sureDel(){
      let index = this.deleteIndex 
       this.delDialogVisible = false
       let free = this.item.articles.rows[index].charge
       if(free != '免费文章'){
        this.unableDelDialogVisible = true;
      }else{
         let obj = {
          aid : this.deleteId
         }
        this.$store.dispatch('DELETE_ARTICLE', obj)
        .then(res => {
          this.$message.success('删除成功');
          this.updata();
        }).catch( err => {
          console.log(err)
        })
      }
      
    },
    goToEdit(value1, value2,item){
      if(value2 === "1"){
        item = '1'
        this.$router.push({path:'/addArticle', query:{article_id: value1, article_type: value2}})
        localStorage.removeItem('goType');
        localStorage.setItem('goType',item);

      }else if(value2 === '2'){
        item = '2'
        this.$router.push({path:'/addArticle', query:{article_id: value1, article_type: value2}})
        localStorage.removeItem('goType');
        localStorage.setItem('goType',item);
      }else if(value2 === '3'){
        item = '3'
        this.$router.push({path:'/addArticle', query:{article_id: value1, article_type: value2}})
        localStorage.removeItem('goType');
        localStorage.setItem('goType',item);
      }
      localStorage.removeItem('orgin');
      localStorage.setItem('orgin','articleMan');
      localStorage.removeItem('orginArticleDetails');
      localStorage.removeItem('newArticle');
      localStorage.setItem('newArticle','newArticle');

      event.stopPropagation();
    },
    filter(){
      let filterTime = null;
      if(this.dataValue.length>0){
        filterTime = moment(this.dataValue[0]).format("YYYY/MM/DD")+'-'+moment(this.dataValue[1]).format("YYYY/MM/DD")
      }
      let obj = {
        points:this.priceValue,
        type:this.typeValue,
        time:filterTime,
        status:this.stateValue
      }
      console.log(obj);

      this.$store.dispatch('GET_ARTICLE', obj)
      .then(res => {
        console.log(res);
        this.item.articles.rows = res.data.rows;
        this.item.articles.totals = parseInt(res.data.totals);
        if(this.item.articles.rows.length == 0){
          this.articleShow = true
        }else{
          this.articleShow = false
        }
      }).catch( err => {
        console.log(err)
      })
    },
    sort(){
      console.log(this.sortValue);
      let obj = {
         sort:this.sortValue
      }
      this.$store.dispatch('GET_ARTICLE', obj)
      .then(res => {
        this.item.articles.rows = res.data.rows;
        this.item.articles.totals = parseInt(res.data.totals);
        if(this.item.articles.rows.length == 0){
          this.articleShow = true
        }else{
          this.articleShow = false
        }
      }).catch( err => {
        console.log(err)
      })
    },
    //分页
    handleCurrentChange(val) {
      console.log(val)
      let filterTime = null;
      if(this.dataValue.length>0){
        filterTime = moment(this.dataValue[0]).format("YYYY/MM/DD")+'-'+moment(this.dataValue[1]).format("YYYY/MM/DD")
      }
      this.current_page = val
      this.page = val
      let obj = {
        page : val ,
        pageSize: this.item.articles.pages.pageSize,
        points:this.priceValue,
        type:this.typeValue,
        time:filterTime == null? '':filterTime,
        status:this.stateValue
      }
      this.$store.dispatch('GET_LIST', obj)
      .then(res => {
        console.log(res)
        var data = res.data
        this.item.articles.rows = data.rows;
      })
    },
   //文章上下架
    articleSale(index) {
      let filterTime = null;
      if(this.dataValue.length>0){
        filterTime = moment(this.dataValue[0]).format("YYYY/MM/DD")+'-'+moment(this.dataValue[1]).format("YYYY/MM/DD")
      }
      console.log(index)
      let obj = {
        aid :  this.item.articles.rows[index].article_id,
      }
      console.log(obj)
      this.$store.dispatch('ARTICLE_SALE' ,obj)
      .then(res => {
        console.log(res)
        this.handleCurrentChange(this.current_page)
      })
    event.stopPropagation();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .content-articles{
    padding:20px 0;
    min-width:920px;
    position:relative;
    .filter-content{
      padding:0 16px;
      border-bottom:none;
      .fliter-wrapper{
        padding-bottom:20px;
        border-bottom:1px solid #E5E5E5;
        .condition-item{
          float:left;
          margin-right:7px;
        }
        .price-select{
          width:104px;
        }
        .type-select{
          width:110px;
        }
        .content-articles{
          position:relative;
        }
      }
    }
  }

  .article-top{
    padding:0 20px;
  }
  .content-container .content-articles .had-article .list{
    border-bottom:10px;
    padding:20px 20px 0;
  }
  .content-container .content-articles .had-article .list .list-wrapper{
     border-bottom:1px solid #E5E5E5;
     height:125px;
  }
  .content-container .content-articles .had-article .list:hover .list-wrapper{
    border-bottom:1px solid #F4F8FF;
  }


  .add-article-type{
    position:absolute;
    top:52px;
    right:12px;
    z-index:100;
    color: #444444;
    text-align: center;
    width: 320px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
    margin-top: 10px;
    background-color:#FFF;
    padding-bottom:10px;
    h4{
      line-height: 30px;
      margin-top: 10px;
    }
    ul{
      text-align: center;
      margin-top: 15px;
      margin-bottom: 15px;
      overflow:hidden;
      li{
        float:left;
        width:33.3%;
        cursor: pointer;
        img{
          width: 72px;
        }
      }
    }

  }
  .sort-select{
    width:88px;
    height:34px!important;
  }
  .page-num{
    text-align:center;
    margin-top:10px;
  }
  .content-container .content-articles .had-article .list-img{
    width: 184px;
    height: 104px;
    position:relative;
  }
  .content-container .content-articles .had-article .list-img img.sign-btn{
     width:48px;
     height:48px;
     position:absolute;
     left:50%;
     top:50%;
     margin:-24px 0 0 -24px;
     cursor:pointer;
  }
  .filter-con .filter-btn{
    line-height:32px;
    margin-left:10px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #5895FF;
    letter-spacing: -0.39px;
  }
  .content-container .content-articles .right{
    margin-top:5px;
  }
  .content-container .mark{
    position: absolute;
    z-index: 100;
    top: 0px;
    left: 0px;
    display: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }

  .dialog-footer button{
    height: 32px;
    width: 196px;
    line-height:8px;
  }
  .el-dialog--center .el-dialog__body{
    text-align:center;
  }
  .text-center{
    display:block;
    width:90%;
    margin:0 auto;
    text-align:center;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 16px;
  }
  .dialog-footer .el-button--primary{
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    color: #444444;
  }
  .dialog-footer .el-button--primary:hover{
     color: #409EFF;
     border-color:#c6e2ff;
     background-color:#ecf5ff;
  }
  .content-container .content-articles .had-article .article-btns li {
    margin-right: 20px;
    height:18px;
    overflow:hidden;
  }
  .content-container .content-articles .had-article .list-info ul li img{
    float:left;
    margin-right:7px;
  }
  .content-container .content-articles .had-article .list-info li span {
    float:left;
    height:18px;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #AAAAAA;
    letter-spacing: -0.39px;
    line-height: 18px;
  }
</style>
<style>
  #del-dialog .el-dialog__headerbtn .el-dialog__close{
    display:none;
  }
  #del-dialog .el-dialog__title{
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #444444;
    letter-spacing: -0.48px;
    line-height: 20px;
  }
  #del-dialog .el-dialog__footer{
    padding:10px 20px 30px;
  }
</style>
