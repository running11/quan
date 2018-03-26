<template>
  <div>
    <my-header></my-header>
    <div class="main-container ">
      <div class="content-history" style="padding: 0 20px;min-width: 1024px">
        <div class="position" style="margin-bottom: 20px;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/bonusman' }">收益管理</el-breadcrumb-item>
            <el-breadcrumb-item>收益记录</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="filter-con content-list">
          <div class="filter-content" style="padding-top: 20px;padding-left: 20px;border-bottom: none">
            <div class="conditionSp pull-left">
              <el-select v-model="sortValue1" placeholder="全部文章类型">
                <el-option
                  v-for="item in sortOptions1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="conditionSp pull-left">
              <el-select v-model="sortValue2" placeholder="全部价格类型">
                <el-option
                  v-for="item in sortOptions2"
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
            <div class="filter-btn pull-left" style="cursor: pointer" @click="handleCurrentChange(1)">筛选</div>
            <div class="clearfix" style="height: 40px;"></div>
          </div>
          <table class="table" style="width: 100%;table-layout:fixed">
            <thead style="background: #FAFAFA;">
            <tr>
              <th style="border: none;width: 20px"></th>
              <th>收益</th>
              <th style="width: 600px;">文章</th>
              <th>收益时间</th>
              <th>购买人</th>
              <th style="border: none;width: 20px"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="i in dataList">
              <th style="border: none"></th>
              <td>{{i.earning_fees}}</td>
              <td class="article-content">{{i.title}}
              </td>
              <td>{{i.earning_time}}</td>
              <td>{{i.purchase_name}}</td>
              <th style="border: none"></th>
            </tr>
            </tbody>
          </table>

          <div class="page-num">
            <el-pagination
              background
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :current-page="page"
              :page-size="pageSize"
              :total="totals">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../common/headTitle.vue';

  export default {
    name: 'income',
    data() {
      return {
        page: 1,
        pageAll: 1,
        pageSize: 10,
        totals: 0,
        dataList: [],
        sortOptions1: [{
          value: '1',
          label: '图文'
        }, {
          value: '2',
          label: '音频'
        }, {
          value: '3',
          label: '视频'
        }],
        sortOptions2: [{
          value: '0',
          label: '免费'
        }, {
          value: '10',
          label: '¥1.00'
        }, {
          value: '20',
          label: '¥2.00'
        }],
        sortValue2: '',
        sortValue1:'',
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
        dateValue: '',
      }
    },
    created() {
      console.log(this.$route.fullPath)
    },
    components: {
      myHeader
    },
    methods: {
      handleCurrentChange(val) {
        console.log('00000');
        console.log(this.$route);
        let obj = {
          page: val,
          aid:this.$route.params.aid,
          type:this.sortValue1,
          points:this.sortValue2,
          time:''
        }
        if (this.dateValue.length > 0) {
          obj.time = moment(this.dateValue[0]).format("YYYY/MM/DD") + '-' + moment(this.dateValue[1]).format("YYYY/MM/DD");
        }
        this.$store.dispatch('GET_EARN_LIST', obj)
          .then(res => {
            let data = res.data
            this.page = parseInt(data.pages.page);
            this.pageAll = parseInt(data.pages.pageAll);
            this.pageSize = parseInt(data.pages.pageSize);
            this.totals = parseInt(data.totals);
            this.dataList = data.rows;
            console.log(data)
          }).catch(err => {
          console.log(err)
        })
      },
      getParams () {
        // 取到路由带过来的参数
        let routerParams = this.$route.params
        console.log(routerParams);
      }
    },
    mounted() {
      this.handleCurrentChange(1);
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .main-container {
    .content-history {
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
            text-align: center;
          }
        }
      }
    }
    .page-num {
      text-align: center;
      margin: 10px 0;
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

</style>
