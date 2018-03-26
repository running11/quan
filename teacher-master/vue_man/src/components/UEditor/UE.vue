<template>
		<script id="editor" type="text/plain"></script>
</template>
<script>
import 'static/utf8-php/ueditor.config';
import 'static/utf8-php/ueditor.all';
import 'static/utf8-php/lang/zh-cn/zh-cn'; 
import 'static/utf8-php/ueditor.parse.min.js'; 

export default {  
    name: 'UE',  
    data () {
      return {
        editor: null,
      }  
    },  
    mounted() {  
      this.$nextTick(function () {
          this.setUEContent() 
      })
      
    },  
    methods: {  
      setUEContent(){
        let editor = UE.getEditor('editor', {  
          wordCount: true,          //是否开启字数统计 
          elementPathEnabled: false,
          BaseUrl: '',
          focus: false,   
          UEDITOR_HOME_URL: '/static/utf8-php/', //这个是静态资源的路径  
          // toolbars:[]  //编辑器里需要用的功能  
          autoHeightEnabled: false,
          autoFloatEnabled: true,　　//是否工具栏可浮动
          autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 450,
        }); 
        // 初始化UE         
        editor.addListener("ready", ()=> {
          this.editor = editor;
          this.editor.setContent(this.escape2Html(this.text)); // 确保UE加载完成后，放入内容。
        });
      },
      getUEContent() { // 获取内容方法  
        return this.editor.getContent()
      },
      escape2Html(str){
        if(!str){
          return "";
        }
        if(str.indexOf("&#34;") > -1){
            str = str.replace(/&#34;/ig,"&quot;");
        } 
        var arrEntities={'&#34;':'"','lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];})
      }
    },  
    watch: {  
      text : function (val, oldVal) {
        if(this.editor && val != oldVal){
          this.editor.setContent(this.escape2Html(val));
        }
      }
    },  
    props: ['text'], //接收传过来的文章  
    destroyed() {  
      this.editor.destroy();  
    }  
}
</script>

<style scoped>
  .edui-default .edui-editor{
    border:none;
  }
</style>