<template>
  <div style="overflow: hidden">
    <theader class="heads"></theader>
    <div class="content-container" style="margin-left: 0">
      <div class="advert-addContainer content">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/masterIndex/mastermain' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="add_adv">添加广告</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="aad-incon">
          <div class="aad-line">
            <div class="aad-left pull-left aad-info">
              <div class="advert-memo">
                <h4>广告备注</h4>
                <p class="lightTxt">显示于广告管理列表，用于识别链接内容</p>
                <el-input placeholder="不超过20字" v-model="title"></el-input>
              </div>

              <div class="advert-href">
                <h4>广告链接</h4>
                <el-select v-model="value" placeholder="请选择" class="advert-select">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input class="advert-input" placeholder="请点击输入" v-model="address"></el-input>
              </div>
            </div>
            <div class="add-right pull-left aad-info">
              <div class="advert-cover">
                <h4>广告封面</h4>
                <p class="lightTxt">800X300像素图片，支持JPG、PNG格式</p>
                <div class="label-img">
                  <!--<el-upload-->
                  <!--class="avatar-uploader"-->
                  <!--action="http://quan-dev.xiaoheiban.cn/api/?auth_token=YWUwM0FmNStVK2pXRVE2d21IaGFtWmg4emZLL0dvNE1JT3grRUhzbHpjcGZDK0Q4Z3lZZDh5ZUp3VTk2ZndFMmZ3WHc0bVFDQ3VQa0MrMA==&method=Advertise.saveCover"-->
                  <!--name="upfile"-->
                  <!--:show-file-list="false"-->
                  <!--:on-success="handleAvatarSuccess"-->
                  <!--:before-upload="beforeAvatarUpload">-->
                  <!--<img :src="pciture ? pciture : '../../../../static/images/ic_add_picture.png'" alt="">-->
                  <!--</el-upload>-->

                  <el-upload
                    class="avatar-uploader"
                    :action="upLoadAdvImg"
                    name="upfile"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="pciture" :src="pciture" class="avatar" style="width:280px;height: 158px">
                    <i v-else class="el-icon-plus avatar-uploader-icon"
                       style="width:280px;height: 158px;background: #F6F6F6;position:relative;"></i>
                  </el-upload>

                </div>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
          <div class="teacher-btn" @click='save'>保存</div>
        </div>
      </div>
       <tfooter style="margin-top:16px"></tfooter>
    </div>
   
  </div>
</template>

<script>
  import theader from 'components/common/headTitle';
  import tfooter from '../../common/footContent';


  export default {
    name: 'HelloWorld',
    data() {
      return {
        options: [{
          value: '1',
          label: '链接网址'
        }
          // , {
          //   value: '3',
          //   label: '链接文章'
          // }, {
          // 	value: '2',
          // 	label: '链接名师'
          // }
        ],
        value: '1',
        address: '',
        content: '',
        title: '',
        pciture: '',
        adimg: '',
        upLoadAdvImg: this.global.upLoadAdvImg
      }
    },
    methods: {
      save() {
        if (this.address != "") {
          var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
          if (!reg.test(this.address)) {
            // alert("不是正确的网址吧，请注意检查一下");
            this.$message.error('请输入正确的链接');
            return;
          }
        }
        console.log('保存')
        let obj = {
          title: this.title,
          adimg: this.adimg,
          type: this.value,
          link: this.address,
          content: this.address
        }
        if(obj.title.length > 20){
          this.$message.error('广告备注超过字数限制');
          return;
        }
        if (obj.type == '' || obj.title == '' || obj.content == '') {
          // alert("数据不能为空")
          this.$message.error('数据不能为空');
          return;
        } else if (this.adimg == '') {
          this.$message.error('请选择广告封面');
          return;
        } else {
          this.$store.dispatch('GET_ADV_ADD', obj)
            .then(res => {
              console.log(res);
              if (res.data.code == '200') {
                 this.$message.success('保存成功');
                this.$router.push({path: '/masterIndex/masteradv'})
              } else {
                this.$message.error(res.info);
              }
              console.log(res)
            })
        }
      },
      handleAvatarSuccess(res, file) {
        console.log();
        console.log(file);

        if (res.code == '200') {
          console.log('-------------');
          this.pciture = URL.createObjectURL(file.raw);
          console.log(res)
          this.adimg = res.data.url
        } else {
          this.$message.error(res.info);
        }

      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';

        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG/png 格式!');
        }
        return (isJPG || isPNG);
      }
    },
    components: {
      'theader': theader,
       'tfooter' :tfooter
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .content-container .content {
    padding-top: 20px;
    min-width:980px;

    .advert-select {

    }
    .advert-input {
      min-width: 450px;
      max-width: 702px;
    }
  }
  .advert-addContainer .aad-incon{
    min-width : 1290px;
  }
  .advert-addContainer .aad-incon .aad-line .aad-info{
    margin-left: 50px;
  }
  .advert-addContainer .aad-incon .aad-line .aad-info h4 {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 24px;
  }

  .advert-addContainer .aad-incon .aad-line .aad-info .lightTxt {
    opacity: 0.8;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #AAAAAA;
    letter-spacing: -0.39px;
    line-height: 24px;
  }

  .advert-href > * {
    box-sizing: border-box;
  }

  .advert-select {
    float: left;
    width: 20%;
    margin-right: 1%;
  }

  .advert-input {
    float: left;
    width: 79%;
  }

  .breadcrumb {
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    margin-top: 68px;
  }
  .teacher-btn{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: -0.39px;
  }

  .avatar-uploader .el-upload {
    /*border: 1px dashed #d9d9d9;*/
    /*border-radius: 6px;*/
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 100%;
    height: 100%
  }

  .article-details-dialog .el-dialog--center .el-dialog__body {
    padding: 25px 15px 30px;
  }

  .el-icon-plus:before {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -89px 0 0 -14px;
  }
  .heads{
   float: left;
  }
  .add_adv{
    font-family: PingFangSC-Regular;font-size: 16px;
    color: #FFFFFF;
    letter-spacing: -0.39px;
    line-height: 16px;
  }


:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #AAAAAA ; opacity:1; 
    font-family:PingFangSC-Light;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #AAAAAA ;opacity:1;
    font-family:PingFangSC-Light;
}

input:-ms-input-placeholder{
    color: #AAAAAA ;opacity:1;
    font-family:PingFangSC-Light;
}

input::-webkit-input-placeholder{
    color: #AAAAAA ;opacity:1;
    
}
</style>
