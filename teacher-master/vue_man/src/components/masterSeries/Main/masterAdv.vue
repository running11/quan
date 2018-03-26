<template>
  <div class="content-container">
    <div class="advert-container content-articles content">
      <div class="article-top" style="margin-top: 0;">
        <div class="left pull-left last-article">广告管理</div>
        <div class="right pull-right teacher-btn" @click="go">添加广告</div>
      </div>

      <div class="article-list had-article">
        <div class="list" v-for="(items, index) in dataList.rows">
          <div class="line">
            <div class="list-left pull-left list-img" style="height: 104px;width: 184px">
              <!--<img v-if="items.link==''" src="../../../images/img_picture_default.png" alt="">-->
              <img  :src="items.ad_img" alt="">
              <!--<img src="static/images/ic_music.png" class="sign-btn video-btn" v-if="items.type == 2"/>-->
              <!--<img src="static/images/ic_video.png" class="sign-btn video-btn" v-if="items.type == 3"/>-->
            </div>
            <div class="list-right pull-left list-info">
              <h4>{{items.title}}</h4>
              <ul >
                <li class="comment" v-if="items.type == '1'">
                  链接网址：{{ items.link }}
                </li>
                <li class="comment" v-if="items.type == '2'">
                  链接名师：{{ items.link }}
                </li>
                <li class="comment" v-if="items.type == '3'">
                  链接文章：{{ items.link }}
                </li>
              </ul>

              <div class="b-btns">
                <span class="a-shelves noUp" @click="advSale(index)" v-if="items.show_status == '未上架'">{{ items.show_status }}</span>
                <span class="a-shelves upper" @click="advSale(index)" v-if="items.show_status == '已上架'">{{ items.show_status }}</span>
                <span class="a-shelves lower" @click="advSale(index)" v-if="items.show_status == '已下架'">{{ items.show_status }}</span>
                <span class="a-type show-time">{{ items.show_time }}</span>

                <div class="change-sort pull-right" v-if="items.status == '2'">
                  <el-select :key='index' v-model="items.sortValue" placeholder="请选择" class="condition-item"
                             @change="order(index,items)">
                    <el-option
                      v-for="item in items.sortsList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
          <!--<div class="clearfix"></div>-->
        </div>
        <div class="page-num">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :current-page="dataList.pages.page"
            :page-size="dataList.pages.pageSize"
            :total="dataList.totals">
          </el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
     title="是否替换顺序"
     :visible.sync="orderDialogVisible"
     width="480px"
     :top = 'topValue'
     center
     id="del-dialog2">
     <span class="text-center">{{labelInfo.label}}已经被占用，点击确定将替换当前项和目标项的顺序</span>
     <span slot="footer" class="dialog-footer">
       <el-button @click="orderDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="confirm">确 定</el-button>
     </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'masteradv',
    data() {
      return {
        orderValue: '',
        orderDialogVisible: false,
        value1: [],
        topValue: '',
        index: '',
        label: '',
        dataList: {
          pages: {
            page:1,
            pageSize:10
          },
          rows: [],
          totals: 0
        },
        selectInfo:'',
        labelInfo:''
      }
    },
    mounted() {
      this.topValue  = ((window.document.documentElement.clientHeight) - 201)/2 + 'px'
      this.$nextTick(function () {
        this.getAdvList(1)
      });
    },
    methods: {
      //分页
      getAdvList(val) {
        let obj = {
          page: val,
        }
        this.$store.dispatch('GET_ADV_LIST', obj)
          .then(res => {
           if(res.code != 200){
            this.$message.error(res.info);
            }
            this.dataList.pages = res.data.pages
            this.dataList.pages.page = parseInt(res.data.pages.page)
            this.dataList.pages.pageSize = parseInt(res.data.pages.pageSize)
            this.dataList.rows = res.data.rows
            this.dataList.totals = res.data.totals
            for(let i=0;i<this.dataList.rows.length;i++){
              this.dataList.rows[i].sortsList = res.data.sorts;
              this.dataList.rows[i].sortValue = parseInt(this.dataList.rows[i].ad_id);
            }
          })
        console.log(this.dataList);
      },
      handleCurrentChange(val) {
        this.getAdvList(val);
      },
      //广告上下架
      advSale(index) {
        let obj = {
          adid: this.dataList.rows[index].ad_id
        }
        this.$store.dispatch('ADV_SALE', obj)
          .then(res => {
            this.getAdvList(1)
          })
      },

      go() {
        this.$router.push({path: '/adminaddadv'})
      },
      order(index,items) {
        for(let i=0;i<items.sortsList.length;i++){
          if(items.sortValue == items.sortsList[i].value){
            this.labelInfo = items.sortsList[i];
            break;
          }
        }

        this.index = index
        this.selectInfo = items.sortValue
        this.orderDialogVisible = true

      },
      confirm() {
        this.orderDialogVisible = false
        let index = this.index;
        let obj = {
          adid: this.dataList.rows[index].ad_id,
          to_adid: this.selectInfo
        }
        this.$store.dispatch('CHANGE_ADV', obj)
          .then(res => {
            this.getAdvList(1)
            console.log(res)
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    /*display: inline-block;*/
    /*margin: 0 10px;*/
  }

  a {
    color: #42b983;
  }
  .content-container{
    padding-bottom:16px;
  }
  .content-container .content-articles {
    padding: 0;
    margin-top: 0;
  }

  .content-container .content-articles .article-top {
    padding: 20px 20px 0;
  }
  .content-container .content-articles .had-article .list {
    padding: 20px 20px 0;
    border: none;
  }

  .content-container .content-articles .had-article .list .line {
    padding-bottom: 20px;
    overflow: hidden;
    border-bottom: 1px solid #E5E5E5;
  }

  .content-container .content-articles .had-article .list:hover .line {
    border-bottom: 1px solid #F4F8FF;
  }

  .content-container .content-articles .had-article .list-info .b-btns {
   
    overflow: hidden;
    bottom: 0;
  }

  .content-container .content-articles .had-article .list-info .b-btns span {
    float: left;
    line-height: 40px;
    margin-right: 36px;
  }

  .content-container .content-articles .had-article .list-info .b-btns .change-sort {
    margin-right: 20px;
  }
.content-container .content-articles .had-article .list-info .b-btns {
  top: 75px;
}
  .content-container .content-articles .had-article .list-info h4 {
    height: 24px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
  }

  .content-container .content-articles .had-article .list-info ul {
    margin-top: 2px;
    overflow: hidden;
  }

.content-container .content-articles .had-article .list-info {
  height: 130px;
}
  .content-container .content-articles .had-article .list-info ul li {
    height: 36px;
    font-family: PingFangSC-Light;
    font-size: 15px;
    color: #AAAAAA;
    letter-spacing: -0.39px;
    line-height: 36px;
  }

  .change-sort .el-select {
    width: 100px;
  }

  .dialog-footer button {
    height: 32px;
    width: 196px;
    line-height: 8px;
  }

  .el-dialog--center .el-dialog__body {
    text-align: center;
  }

  .page-num {
    padding: 10px 0 20px;
    text-align: center;
  }

  .income .income-list .had-article .list .list-img img.sign-btn {
    width: 48px;
    height: 48px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -24px 0 0 -24px;
    cursor: pointer;
  }

  .el-tabs__item {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 16px;
  }

  .change-sort {
    height: 32px;
  }
  .text-center {
    display: block;
    width: 90%;
    margin: 0 auto;
    text-align: center;
  }
  .content-container .content-articles .had-article .list .list-img{
    position:relative;
  }
  .content-container .content-articles .had-article .list .list-img img.sign-btn{
    width: 48px;
    height: 48px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -24px 0 0 -24px;
    cursor: pointer;
  }
</style>
<style scoped>
  
  #del-dialog2{
  text-align: center;
}
 #del-dialog2 .el-dialog__header{
    height:24px;
    line-height:24px;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #444444;
    letter-spacing: -0.48px;
  }
  #del-dialog2 .el-dialog--center .el-dialog__body{
    padding: 25px 15px 10px;
  }
  #del-dialog2 .dialog-footer{
    margin-left:-25px;
  }
  #del-dialog2 .el-dialog__headerbtn .el-dialog__close{
    display:none;
  }
  #del-dialog2 .el-dialog__footer{
    padding:10px 20px;
  }
  #del-dialog2 .text-center{
    text-align:center;
    font-family: PingFangSC-Light;
    font-size: 16px;
    width: 400px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 24px;
  }
 #del-dialog2 .dialog-footer{
      text-align: center;
         margin: 0 auto; 
  }
  .dialog-footer button{
      height: 32px;
      width: 196px;
      line-height:8px;

  }
  .cancel-button {
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 8px;
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
</style>
