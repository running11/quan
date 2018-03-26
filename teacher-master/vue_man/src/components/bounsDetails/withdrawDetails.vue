<template>
  <div>
    <my-header></my-header>
    <div class="main-container ">
      <div class="content-history" style="padding: 0 20px;min-width: 1024px">
        <div class="position" style="margin-bottom: 20px;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/bonusman' }">收益管理</el-breadcrumb-item>
            <el-breadcrumb-item>提现记录</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="filter-con content-list">
          <table class="table" style="width: 100%;table-layout:fixed">
            <thead style="background: #FAFAFA;">
            <tr>
              <th style="border: none;width: 20px"></th>
              <th>提现金额</th>
              <th style="width: 600px;">提现申请日期</th>
              <!--<th>申请人</th>-->
              <th>到账日期</th>
              <th>提现方式</th>
              <th style="border: none;width: 20px"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in dataList">
              <th style="border: none"></th>
              <td>{{item.crash}}</td>
              <td class="article-content">{{item.apply_time}}
              </td>
              <!--<td>{{item.apply_user}}</td>-->
              <td>{{item.operate_time}}</td>
              <td>{{item.withdraw_way}}</td>
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
        dataList: []
      }
    },
    components: {
      myHeader
    },
    mounted() {
      // vuex 后台调取数据
      this.$store.dispatch('GET_DRAW_LIST')
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
    methods: {
      handleCurrentChange(val) {
        let obj = {page: val}
        this.$store.dispatch('GET_DRAW_LIST', obj)
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
      }
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
