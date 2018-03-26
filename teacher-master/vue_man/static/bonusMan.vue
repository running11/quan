<template>
  <div class="content-container income">
    <el-row class="income-num  no-margin">
      <el-col :span="6">
        <div class="center-div">
          <div class="num-title">总收益</div>
          <div class="num-style text-left">¥2000</div>
          <div>
            <button @click="income"><span>收益记录</span></button>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="center-div">
          <div class="num-title">已提现</div>
          <div class="num-style">¥2000</div>
          <div>
            <button @click="withdraw">提现记录</button>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="center-div">
          <div class="num-title">总收益</div>
          <div class="num-style">¥2000</div>
          <div></div>
        </div>
      </el-col>
      <el-col class="text-right" :span="6">
        <div class="num-rule" @click="ruleVisible = true">提现规则</div>
        <div class="withdraw-style">
          <button class="want-withdraw" @click="withdrawVisible = true"><span>我要提现</span>
          </button>
          <button class="will-withdraw" @click="withdrawVisible = true">
            <span>已申请提现 ¥ 500 <img src="images/ic_button_edit.png"></span></button>
          <button class="already-withdraw" @click="withdrawVisible = true">
            <span>已申请提现 ¥ 500</span></button>
        </div>
        <div></div>
      </el-col>
    </el-row>
    <div class="income-echars">
      <div class="echars-head">
        <span class="echars-name">收益走势</span>
        <div class="pull-right">
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
      </div>
      <div class="echars-content">
        <div id="myChart" style="width: 100%;height:330px;"></div>
      </div>
    </div>
    <div class="income-list ">
      <div class="income-list-head">
        <span class="echars-name">文章收益</span>
        <span class="echars-time">
            <el-select v-model="sortValue" placeholder="请选择">
              <el-option
                v-for="item in sortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </span>
      </div>
      <div class="article-list had-article">
        <div class="list" v-for="i in [1,2,3]">
          <div class="list-left pull-left list-img">
            <img src="../../images/62682166_p0.png" alt="">
          </div>
          <div class="list-right pull-left list-info">
            <h4>普通文章标题文章标题文章标题文章标题文章标题</h4>
            <div class="article-btns">
              <span class="modify"></span>
              <span class="delete" data-toggle="modal" data-target="#deleteArticle"></span>
            </div>
            <ul>
              <li class="comment pull-left">
                <img src="../../images/ic_list_comment.png" alt="">
                <span>221</span>
              </li>
              <li class="eye pull-left">
                <img src="../../images/ic_list_view.png" alt="">
                <span>221</span>
              </li>
              <li class="star pull-left">
                <img src="../../images/ic_list_collection.png" alt="">
                <span>221</span>
              </li>
              <li class="share pull-left">
                <img src="../../images/ic_list_share.png" alt="">
                <span>221</span>
              </li>
            </ul>
            <div class="clearfix"></div>
            <div class="b-btns">
              <span class="price">¥ 2.00</span>
              总收益：<span class="all-price">¥ 1.40</span>
              <button @click="income">收益记录</button>
              <span class="show-time pull-right">修改时间：2018/11/12</span>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
        <div class="page-num">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="10"
            :total="100">
          </el-pagination>
        </div>
      </div>

    </div>

    <el-dialog
      title="提现规则"
      :visible.sync="ruleVisible"
      width="30%"
      center>
      <div class="rule-content"><span></span>每月1-10日可申请提现，10日前可更改申请金额。</div>
      <div class="rule-content"><span></span>单次提现金额不少于500，提现通过后与每月15日发放</div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="ruleVisible = false" class="rule-button">我知道了</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="申请提现"
      :visible.sync="withdrawVisible"
      width="30%"
      center>
      <div class="input-num">
        <input type="number" placeholder="请输入金额，如：500"><span>元</span>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="withdrawVisible = false" class="cancel-button">取消</el-button>
    <el-button type="primary" @click="withdrawVisible = false" class="confirm-button">申请提现</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'bounsMan',
    data() {
      return {
        ruleVisible: false,
        withdrawVisible: false,
        sortOptions : [{
          value: '选项1',
          label: '收益从高到低'
        }, {
          value: '选项2',
          label: '收益从低到高'
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
        dateValue: '',
      }
    },
    mounted() {
      this.drawLine();
    },
    methods: {
      income() {
        this.$router.push({path: '/incomedetails'})
      },
      withdraw() {
        this.$router.push({path: '/withdrawdetails'})
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          tooltip: {},
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'line',
            data: [5, 20, 36, 10, 10, 20]
          }]
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .income {
    .no-padding {
      padding: 0;
    }
    .no-margin {
      margin: 0;
    }
    .income-num {
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      height: 164px;
      min-width: 811px;
      margin-right: 20px;
      .center-div {
        margin: 0 auto;
        width: 115px;
        height: 100%;
      }
      .num-title {
        font-family: PingFangSC-Light;
        font-size: 16px;
        color: #AAAAAA;
        letter-spacing: -0.39px;
        line-height: 16px;
        margin-top: 24px;
      }
      .num-style {
        font-family: PingFangSC-Medium;
        font-size: 36px;
        color: #444444;
        letter-spacing: -0.87px;
        line-height: 36px;
        margin-top: 16px;
      }
      button {
        background: #FFFFFF;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        height: 32px;
        width: 112px;
        margin-top: 16px;
      }
      button span {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #444444;
        letter-spacing: -0.39px;
        line-height: 16px;
      }
      .num-rule {
        cursor: pointer;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #5895FF;
        letter-spacing: -0.39px;
        line-height: 16px;
        margin-top: 16px;
        text-align: right;
        margin-right: 10px;
      }
      .withdraw-style {
        margin-top: 12px;
        margin-right: 10px;
        .want-withdraw {
          height: 32px;
          width: 132px;
          background: #5895FF;
          border-radius: 2px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: -0.39px;
            line-height: 16px;
          }
        }
        .will-withdraw {
          height: 32px;
          width: 168px;
          background: #FFFFFF;
          border: 1px solid #E5E5E5;
          border-radius: 2px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #444444;
            letter-spacing: -0.39px;
            line-height: 16px;
            img {
              height: 12px;
              width: 12px;
            }
          }
        }
        .already-withdraw {
          background: #4CBF4A;
          border-radius: 2px;
          height: 32px;
          width: 169px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: -0.39px;
            line-height: 16px;
          }
        }
      }
    }
    .income-echars {
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      height: 370px;
      min-width: 811px;
      margin-top: 20px;
      margin-right: 20px;
      .echars-head {
        height: 32px;
        width: 100%;
        padding: 0 26px 0 18px;
        margin-top: 16px;
        .pull-right{
          float: right;
          margin-right: 40px;
        }
        .echars-name {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 32px;
          display: inline-block;
          height: 32px;
        }
        .echars-time {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 16px;
          float: right;
          margin-right: 40px;
        }
      }
      .echars-content {

      }
    }
    .income-list {
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      //height: 164px;
      min-width: 811px;
      margin-top: 20px;
      margin-right: 20px;
      .income-list-head {
        height: 32px;
        width: 100%;
        padding: 0 26px 0 18px;
        margin-top: 16px;
        .echars-name {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 32px;
          display: inline-block;
          height: 32px;
        }
        .echars-time {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 16px;
          float: right;
          margin-right: 40px;
        }
      }
      .had-article {
        position: relative;
        margin: 20px 20px 0 20px;
        .list {
          padding: 20px 0;
          border-bottom: 1px solid #E5E5E5;

          &:hover {
            background: #F4F8FF;

            .article-btns {
              display: block;
            }
          }
        }

        .list-img {
          img {
            width: 184px;
            height: 104px;
          }
        }
        .article-btns {
          position: absolute;
          right: 5px;
          top: 5px;
          display: none;
          span {
            display: inline-block;
            width: 22px;
            height: 22px;
            margin-right: 15px;
            cursor: pointer;
          }
          .modify {
            background: url('../../images/ic_list_edit.png') center center no-repeat;
            background-size: 20px;
          }
          .delete {
            background: url('../../images/ic_list_delete.png') center center no-repeat;
            background-size: 20px;
          }
        }
        .list-info {
          margin-left: 20px;
          font-size: 16px;
          height: 104px;
          position: absolute;
          left: 204px;
          right: 0;
          img {
            width: 18px;
            vertical-align: text-top;
          }
          h4 {
            color: #444444;
          }
          ul {
            margin-top: 12px;
            color: #AAAAAA;
            li {
              margin-right: 20px;
            }
          }

          .b-btns {
            position: absolute;
            bottom: 3px;
            left: 0;
            right: 0;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #AAAAAA;
            letter-spacing: -0.48px;
            line-height: 20px;
            .price {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #FFB13D;
              letter-spacing: -0.34px;
              line-height: 14px;
            }
            .all-price {
              font-family: PingFangSC-Regular;
              font-size: 20px;
              color: #FFB13D;
              letter-spacing: -0.48px;
              line-height: 20px;
            }
            button {
              background: #FFFFFF;
              border: 1px solid #E5E5E5;
              border-radius: 2px;
              font-family: PingFangSC-Regular;
              font-size: 16px;
              color: #444444;
              letter-spacing: -0.39px;
              line-height: 16px;
              height: 32px;
              width: 112px;
            }
            span {
              display: inline-block;
              margin-right: 25px;
            }
            .show-time {
              float: right;
              color: #AAAAAA;
              font-size: 16px;
              margin: 0;
            }
          }
        }
      }
      .page-num {
        text-align: center;
        margin: 10px 0;
      }
    }
    .demo {
      position: relative;
    }
    .demo i {
      position: absolute;
      bottom: 10px;
      right: 24px;
      top: auto;
      cursor: pointer;
    }
    .rule-content {
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 24px;
      span {
        background: #5895FF;
        display: inline-block;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        margin-right: 15px;
        position: relative;
        top: -2px;
      }
    }
    .rule-button {
      background: #5895FF;
      border-radius: 2px;
      height: 32px;
      width: 196px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: -0.39px;
      line-height: 8px;
    }
    .el-dialog__body {

    }
    .input-num {
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 24px;
      input {
        padding-left: 15px;
        padding-right: 30px;
        font-family: PingFangSC-Light;
        font-size: 16px;
        //color: #AAAAAA;
        letter-spacing: -0.39px;
        line-height: 16px;
        height: 44px;
        width: 90%;
        background: #FFFFFF;
        border: 1px solid #E5E5E5;
      }
      span {
        float: right;
        position: relative;
        top: -33px;
        left: -15px;
      }
    }
    .dialog-footer {
      border: none;
      text-align: center;
      button {
        height: 32px;
        width: 196px;
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
      .confirm-button {
        background: #5895FF;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: -0.39px;
        line-height: 8px;
      }
    }

  }
</style>
