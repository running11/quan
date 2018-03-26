<template>
    <div>
        <quill-editor ref="myTextEditor" v-model="content" :config="editorOption"></quill-editor>
    </div>
</template>

<script>
    import { quillEditor } from 'vue-quill-editor';
    export default {
        data: function(){
            return {
                content: '',
                editorOption: {
                    // something config
                }
            }
        },
        components: {
            quillEditor
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            submit(){
                console.log(this.content);
                this.$message.success('提交成功！');
            }
        },
        computed: {
            editor() {
                return this.$refs.myTextEditor.quillEditor;
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>