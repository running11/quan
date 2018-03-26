<template>
  <div class="main-container masterComment">
    <div class="content-history" style="padding: 0 20px;min-width: 1024px">
      <div class="filter-con content-list">
        <div class="filter-content" style="padding-top: 20px;padding-left: 20px;border-bottom: none">
          <div class="conditionSp pull-left">
            <el-select v-model="sortValue" placeholder="状态" class="condition-item price-select">
              <el-option
                v-for="item in sortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="conditionSp pull-left">
            <el-select v-model="accountValue" placeholder="操作账号">
              <el-option
                v-for="item in accounts"
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
            <th style="min-width: 200px;">操作时间</th>
            <th>操作IP</th>
            <th style="min-width: 200px;">被操作内容</th>
            <th>操作动作</th>
            <th>操作账号</th>
            <th>User Agent</th>
            <th style="border: none;width: 20px"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="i in tableData" :key="i.comment_id">
            <th style="border: none"></th>
            <td style="width:300px">{{i.operate_time}}</td>
            <td >{{i.operate_ip}}
            </td>
            <td class="article-content">
              {{i.operate_content}}
            </td>
            <td>{{i.operate_action}}</td>
            <td>{{i.operate_account}}</td>
            <td>{{i.user_agent}}</td>
            <th style="border: none"></th>
          </tr>
          </tbody>
        </table>
        <div class="page-num">
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
        pageSize: 10,
        total: 0,
        withdrawVisible: false,
        sortOptions: [{
          value: '1',
          label: '账号'
        }, {
          value: '2',
          label: '教师'
        }, {
          value: '3',
          label: '文章'
        }],
        sortValue: '',
        pickerOptions: {
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
        accounts:[],
        accountValue:''
      }
    },
    created() {
      console.log(this.$route.fullPath)
    },
    components: {},
    methods: {
      selectData(page) {
        // vuex 后台调取数据
        let obj = {
          type: this.sortValue,
          page: page,
          time: '',
          uid:this.accountValue
        }
        if (this.dateValue.length > 0) {
          obj.time = moment(this.dateValue[0]).format("YYYY/MM/DD") + '-' + moment(this.dateValue[1]).format("YYYY/MM/DD");
        }
        this.$store.dispatch('TERCHER_LOGS', obj)
          .then(res => {
            if(res.code != 200){
             this.$message.error(res.info);
            }
            let data = res.data
            this.tableData = data.rows;
            this.accounts = data.accounts;
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
      },
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
      text-align: left;
    }
    tbody tr td {
      border-top: none;
      border-bottom: 1px solid #ddd;
      text-align: left;
      height: 44px;
      line-height: 44px;
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
          }
        }
      }
    }
    .page-num {
      text-align: center;
      margin: 22px 0;
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
      margin: 22px 0;
    }

  }

</style>
