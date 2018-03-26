import $ from 'jquery'
$(function () {

            var bucket = 'quan';
            var appid = '1252817547';
            var region = 'sh';
         
            var myFolder = '/video/';//需要操作的目录

            //初始化逻辑
            //特别注意: JS-SDK使用之前请先到console.qcloud.com/cos 对相应的Bucket进行跨域设置
            var cos = new CosCloud({
                appid: appid, // APPID 必填参数
                bucket: bucket, // bucketName 必填参数
                region: region, // 地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
                getAppSign: function (callback) {//获取签名 必填参数

                    $.get('http://quan-dev.xiaoheiban.cn/api/upload/getSign',function(xhr){
                        callback(xhr.data.authorization);

                    },'json');

                },
                getAppSignOnce: function (callback) {//单次签名，参考上面的注释即可

                }
            });

            var successCallBack = function (result) {
                $('#hash').text('上传成功'); 
                console.log(JSON.stringify(result));
            };

            var errorCallBack = function (result) {
                result = result || {};
                console.log('request error:', result && result.message);
                console.log(result.responseText || 'error');
            };

            
            var lastTaskId;
            var taskReady = function (taskId) {
                lastTaskId = taskId;
            };


            //分片上传文件,当选择大于20M大小的文件的时候用分片上传
            var taskId = 0;
            var size = 0;
            var sizeM = 0;
            var base = 1024*1024;
            var start = 0;
            var end = 0;
            $('input[name="upfile"]').on('change',function(e){

                    var file = e.target.files[0];
                
                     size = file.size;
                     sizeM = (size/base).toFixed(2);
                     //修改file.name 唯一
                     var ext = file.name.split('.');
                     var fileName = new Date().getTime()+'.'+ext[1];

                    // 分片上传直接调用uploadFile方法，内部会判断是否需要分片
                    // 分片上传过程可能会有 op=upload_slice_list 的 POST 请求返回 404，不会影响上传：https://github.com/tencentyun/cos-js-sdk-v4/issues/16
                    taskId = cos.uploadFile(successCallBack, errorCallBack, progressCallBack, bucket, myFolder + fileName, file, 0, taskReady);//insertOnly==0 表示允许覆盖文件 1表示不允许
                   return false;

            });

            var progressCallBack = function (curr, sha1) {

                var sha1CheckProgress = ((sha1 * 100).toFixed(2) || 100) + '%';
                if(sha1CheckProgress=='100.00%' || sha1CheckProgress=='100%'){
                    $('#hash').remove();
                    var uploadProgress = ((curr || 0) * 100).toFixed(2) + '%';
                    if(uploadProgress=='0.00%'){
                        start=new Date().getTime();
                        console.log(start);
                    }else{
                        end=new Date().getTime();
                        var differ = end-start;  //毫秒
                        var uploaded = (size*(curr || 0)/base).toFixed(2);//已上传大小
                        var uploadProgress = ((curr || 0) * 100).toFixed(2) + '%';//已上传进度
                        var speed = (uploaded*1000/differ).toFixed(1);
                        var leftStr = '已上传:'+uploaded+'M/'+sizeM+'M'+'&nbsp;&nbsp;&nbsp;'+'当前上传速度：'+speed+'MB/S';
                        var rightStr = uploadProgress=='100.00%'?'':'剩余 '+parseInt((size/base-uploaded)/speed,10)+' 秒';
                        $('.left').html(leftStr);
                        $('.right').html(rightStr);
                        $('#middle').css({width:uploadProgress});
                    }

                }else{
                     $('#hash').text('正在检测hash值：'+sha1CheckProgress);
                }
            };
            $('#cancelTask').on('click', function () {
                cos.cancelTask(lastTaskId);
            });
        });