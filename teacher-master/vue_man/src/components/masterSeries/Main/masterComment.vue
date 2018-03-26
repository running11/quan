<template>
  <div class="main-container masterComment">
    <div class="content-history" style="padding: 0 20px;min-width: 1024px">
      <div class="filter-con content-list">
        <div class="filter-content" style="padding-top: 20px;padding-left: 20px;border-bottom: none">
          <div class="conditionSp pull-left">
            <el-select v-model="sortValue" placeholder="状态">
              <el-option
                v-for="item in sortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="conditionSp pull-left">
            <el-date-picker
              v-model="dateValue"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="filter-btn pull-left buttonSelect" @click="selectData(1)">筛选</div>
          <div class="clearfix" style="height: 40px;"></div>
        </div>
        <table class="tableStyle" style="width: 100%;table-layout:fixed">
          <thead style="background: #FAFAFA;">
          <tr>
            <th style="border: none;width: 20px"></th>
            <th style="width: 60px">选择</th>
            <th style="width: 500px;">评论内容</th>
            <th>评论时间</th>
            <th>状态</th>
            <th>详情</th>
            <th style="border: none;width: 20px"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="i in tableData" :key="i.comment_id">
            <th style="border: none"></th>
            <td style="width: 100px">
              <el-checkbox v-model="i.checked" v-on:change="toggleSelection(i,'single')"></el-checkbox>
            </td>
            <td class="article-content">{{i.content}}</td>
            <td>{{i.create_time}}
            </td>
            <td>
              <span v-if="i.status==3" style="color: #F92424;cursor: pointer;" @click="upDownAll('up',i)">{{i.show_status}}</span>
              <span v-if="i.status==2" style="color: #4CBF4A;cursor: pointer;" @click="upDownAll('down',i)">{{i.show_status}}</span>
              <span v-if="i.status==1" style="color: #5895FF;cursor: pointer;" @click="upDownAll('up',i)">{{i.show_status}}</span>
            </td>
            <td><el-button @click="readDetail(i)" type="text" size="medium">查看</el-button></td>
            <th style="border: none"></th>
          </tr>
          </tbody>
        </table>
        <div class="page-num">
          <div class="leftButton">
            <el-checkbox v-model="checked" v-on:change="toggleSelection(tableData,'all')">全选</el-checkbox>
            <span class="downAll" v-on:click="upDownAll('up','all')">批量上架</span>
            <span class="downAll" v-on:click="upDownAll('down','all')">批量下架</span>
          </div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="pageSize"
            :current-page="page"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      title=""
      :visible.sync="withdrawVisible"
      width="40%"
      center>
      <div class="detailRead">
        <div class="headInfo">
          <img :src="alertData.headimg">
          <div class="userInfo">
            <span class="name">{{alertData.name}}</span>
            <span class="phone">{{alertData.account}}</span>
          </div>
        </div>

        <div class="contentDetail">
          {{alertData.content}}
        </div>
        <div class="comment">
          <div>评论文章：{{alertData.title}}</div>
          <div>文章作者：{{alertData.author}}</div>
        </div>
        <div class="footInfo"><span class="time">{{alertData.create_time}}</span>
          <!--<span >{{alertData.show_status}}</span>-->
          <span v-if="alertData.status==3" @click = "commentSale" style="color: #F92424 ;cursor: pointer;" class="statu">{{alertData.show_status}}</span>
          <span v-if="alertData.status==2" @click = "commentSale" style="color: #4CBF4A ;cursor: pointer;" class="statu">{{alertData.show_status}}</span>
          <span v-if="alertData.status==1" @click = "commentSale" style="color: #5895FF ;cursor: pointer;" class="statu">{{alertData.show_status}}</span>
        </div>
      </div>
    </el-dialog>

  </div>
</template>


<script>
  import moment from 'moment';
  import Vue from 'vue'


  export default {
    name: 'masterComment',
    data() {
      return {
        page: 1,
        currentPage: 1,
        aid: 0,
        cid: 0,
        detail: {},
        pageSize: 10,
        total: 0,
        withdrawVisible: false,
        sortOptions: [{
          value: '1',
          label: '未上架'
        }, {
          value: '2',
          label: '已上架'
        }, {
          value: '3',
          label: '已下架'
        }],
        sortValue: '',
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
        dateValue: [],
        tableData: [],
        multipleSelection: [],
        checked: false,
        alertData: {}
      }
    },
    created() {
      console.log(this.$route.fullPath)
    },
    components: {},
    methods: {
      toggleSelection(row,item) {
        console.log(this.tableData);
        let num = 0;
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].checked == true){
            num++
          }
        }
        console.log(num);
        if(item == 'all'){
          for(let i=0;i<this.tableData.length;i++){
            if(num == 10){
              this.$set(this.tableData[i],'checked', false)
            }else{
              this.$set(this.tableData[i],'checked', true)
            }
          }
        }else{
          for(let i=0;i<this.tableData.length;i++){
            if(this.tableData[i].comment_id == row.comment_id){
                this.tableData.splice(i,1,this.tableData[i])
            }
          }
          if(num == 10){
            this.checked = true
          }else{
            this.checked = false
          }
        }
        console.log(this.tableData);

      },
      upDownAll(item, val) {
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].checked){
            this.multipleSelection.push(this.tableData[i]);
          }
        }
        console.log(val);
        var obj = {
          status: '',
          list: ''
        };

        let list = []
        if (val == 'all') {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            list.push(this.multipleSelection[i].comment_id)
          }
        } else {
          list.push(val.comment_id)
        }
        obj.list = list.join(',');
        if (item == 'up') {
          obj.status = 2;
        } else {
          obj.status = 3;
        }

        this.$store.dispatch('GET_UPDOWN_LIST', obj)
          .then(res => {
            let data = res.data;
            this.selectData(this.page);
            this.checked = false;
          }).catch(err => {
          console.log(err)
        })
      },
      readDetail(item) {
        this.aid = item.article_id;
        this.cid = item.comment_id;
        this.detail = item;
        var obj = {cid: this.cid}
        this.$store.dispatch('GET_ONE_COMMENT', obj)
          .then(res => {
            let data = res.data
            console.log(data)
            this.alertData = data;
          }).catch(err => {
          console.log(err)
        })
        this.withdrawVisible = true;
      },
      commentSale() {
          let obj = {
            aid : this.aid,
            cid : this.cid,
          }
          console.log(obj)
          this.$store.dispatch('COMMENT_SALE' ,obj)
          .then(res => {
            console.log(res)
            this.selectData(this.currentPage)
            this.readDetail(this.detail)
          })
      },
      selectData(page) {
        // vuex 后台调取数据
        let obj = {
          status: this.sortValue,
          page: page,
          time: '',
        }
        if (this.dateValue.length > 0) {
          obj.time = moment(this.dateValue[0]).format("YYYY/MM/DD") + '-' + moment(this.dateValue[1]).format("YYYY/MM/DD");
        }
        this.$store.dispatch('GET_MANAGE_LIST', obj)
          .then(res => {
            let data = res.data
            this.tableData = data.rows;
            for(let i=0;i<this.tableData.length;i++){
              this.tableData[i].checked = false;
            }
            console.log(this.tableData);
            this.total = data.totals;
            this.pageSize = data.pages.pageSize;
            this.page = parseInt(data.pages.page);
          }).catch(err => {
          console.log(err)
        })
      },
      handleCurrentChange(val) {
        this.selectData(val);
        this.currentPage =  val;
      },
      getRowClass({row, rowIndex}) {
        if (rowIndex == 0) {
          return 'background-color: #FAFAFA !important;'
        } else {
          return ''
        }
      }
    },
    mounted() {
      this.selectData(1);
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .tableStyle {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 16px;
    .article-content {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

    }
    thead tr th {
      border: none;
      height: 44px ;
      line-height: 44px;
      font-family: PingFangSC-Light;
      font-size: 14px;
      color: #444444;
      letter-spacing: -0.34px;
    }
    tbody tr td {
      border-top: none;
      border-bottom: 1px solid #ddd;
      text-align: center;
      height: 64px;
      line-height: 64px;
    }
    thead {
      tr {
        height: 44px;
        line-height: 44px;
      }
    }
    tbody {
      tr {
        height: 44px;
        line-height: 44px;
      }
    }
  }
  h1, h2 {
    font-weight: normal;
  }


  a {
    color: #42b983;
  }

  .colorBack {
    background-color: #FAFAFA !important;
  }

  .main-container {
    .content-history {
      margin-top: -30px;
      .filter-con {
        background: #FFF;

        .filter-content {
          padding-bottom: 20px;
          border-bottom: 1px solid #E5E5E5;
        }

        .conditionSp {
          margin-right: 15px;

          input {
            line-height: 34px;
            border: 1px solid #ccc;
            text-indent: 5px;
            border-radius: 4px;
          }
        }
        .filter-btn {
          height: 40px;
          line-height: 40px;
          color: #5895FF;
        }
      }
      .position {
        .el-breadcrumb__item {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 16px;
        }
      }
      .content-list {
        border: 1px solid #E5E5E5;
        .table {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 16px;
          .article-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

          }
          thead tr th {
            border: none;
          }
          tbody tr td {
            border-top: none;
            border-bottom: 1px solid #ddd;
            font-family: PingFangSC-Light;
            font-size: 16px;
            color: #444444;
            letter-spacing: -0.39px;
          }
        }
      }
    }
    .page-num {
      text-align: center;
      margin: 10px 0;
      .leftButton {
        position: relative;
        top: 8px;
        left: 20px;
        float: left
      }
    }
    table {
      thead {
        tr {
          height: 38px;
          line-height: 38px;
        }
      }
      tbody {
        tr {
          height: 38px;
          line-height: 38px;
        }
      }
    }

  }

  .masterComment {
    .downAll {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #5895FF;
      letter-spacing: -0.39px;
      line-height: 16px;
      margin-left: 20px;
      cursor: pointer;
    }
    .upAll {

    }
  }

  .buttonSelect {
    cursor: pointer;
  }

  .detailRead {
    position: relative;
    top: -20px;
    .headInfo {
      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        float: left;
        display: inline-block;
      }
      .userInfo {
        display: inline-block;
        margin-left: 15px;
        .name {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 16px;
          display: block;
        }
        .phone {
          font-family: PingFangSC-Light;
          font-size: 14px;
          color: #AAAAAA;
          letter-spacing: -0.34px;
          line-height: 14px;
          display: block;
          margin-top: 12px;
        }
      }
    }
    .contentDetail {
      margin-top: 16px;
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 24px;
    }
    .comment {
      padding: 16px;
      margin-top: 16px;
      background: #F6F6F6;
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 24px;
    }
    .footInfo {
      margin-top: 24px;
      .time {
        font-family: PingFangSC-Light;
        font-size: 16px;
        color: #AAAAAA;
        letter-spacing: -0.39px;
        line-height: 16px;
        display: inline-block;
        float: left;
      }
      .statu {
        display: inline-block;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4CBF4A;
        letter-spacing: -0.39px;
        line-height: 16px;
        float: right;
      }
    }
    .page-num {
      text-align: center;
      margin: 10px 0;
    }

  }

</style>
