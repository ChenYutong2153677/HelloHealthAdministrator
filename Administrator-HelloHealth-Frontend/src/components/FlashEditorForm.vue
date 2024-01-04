<template>

    <el-form label-width="50px" label-position="left" :model="newFlashInfo">
        <el-form-item label="标题">
            <el-input v-model="newFlashInfo.title"/>
        </el-form-item>
        <el-form-item label="标签">
            <el-select
                    class="tagSelector"
                    v-model="newFlashInfo.tags"
                    multiple
                    placeholder="选择1~4个标签"
                    style="width: 100%"
                    :filterable="true"
                    :multiple-limit="4"
            >
                <el-option
                        v-for="tag in tags"
                        :key="tag.tagId"
                        :label="tag.tagName"
                        :value="tag.tagName"
                />
            </el-select>
        </el-form-item>
    </el-form>
    <TipTapEditableExpert ref="editor"/>

    <span style="margin-left:50%;" class="dialog-footer">
                <el-button type="primary" @click="submitNewFlash">
                    发布
                </el-button>
            </span>


</template>

<script>
import WritePostButton from "@/components/postBoardView/WritePostButton.vue";
import TipTapEditableExpert from "@/components/postView/TipTapEditableExpert.vue";
import TipTapEditable from "@/components/postView/TipTapEditable.vue";
import {ElMessage} from "element-plus";
import axios from "axios";

export default {

    components: {TipTapEditableExpert, WritePostButton, TipTapEditable},
    props: ["NewFlashInfo"],
    emits: ["closeMe", "refresh"],
    data: () => ({
        newFlashInfo: {},
        tags: []

    }),
    mounted() {

        axios.get("/FlashService/flash/childTags")
            .then(response => {
                this.tags = response.data.data;
            })
            .catch(error => {
                console.error(error)
            });

        if (this.newFlashInfo.flash_being_edited_id === -1) {
            this.$refs.editor.editor.commands.clearContent();//清空编辑器
        } else {
            this.$nextTick(() => {
                this.$refs.editor.editor.commands.setContent(this.newFlashInfo.content);
            });
        }
    },
    created() {
        this.newFlashInfo = this.NewFlashInfo

        console.log(this.tags)
    },
    methods: {
        changeTags() {
            //对照标签列表this.tags，将this.newFlashInfo.tags中标签的名字转换为id
            let newTags = [];
            this.newFlashInfo.tags.forEach(tag => {
                this.tags.forEach(tag2 => {
                    if (tag === tag2.tagName) {
                        newTags.push(tag2.tagId);
                    }
                })
            })
            this.newFlashInfo.tags = newTags;
        },

        submitNewFlash() {
            if (this.$refs.editor.editor.state.doc.textContent.length < 15) {

                ElMessage.error('请输入更多内容。');
                return;
            }
            if (this.newFlashInfo.title.length < 5) {
                ElMessage.error('请输入更长的标题。');
                return;
            }
            if (this.newFlashInfo.tags.length < 1) {
                ElMessage.error('请选择更多标签。');
                return;
            }

            this.newFlashInfo.content = this.$refs.editor.editor.getJSON();
            console.log(this.newFlashInfo.content)
            this.changeTags();
            //临时变量flash
            let flash = {
                content: JSON.stringify(this.$refs.editor.editor.getJSON()),
                flash_being_edited_id: this.newFlashInfo.flash_being_edited_id,
                tags: this.newFlashInfo.tags,
                title: this.newFlashInfo.title
            }
            console.log("传输的参数flash")
            console.log(flash);

            axios.put("/FlashService/flash",flash)
                .then(res => {
                    ElMessage.success('发送成功。');
                    this.$emit('closeMe')

                    let newNews = {
                        id: this.newFlashInfo.flash_being_edited_id,
                        title: this.newFlashInfo.title,
                        content: this.newFlashInfo.content,
                        tags: this.newFlashInfo.tags,
                    };
                    this.$emit('refresh', newNews)
                    console.log("116")

                    this.$refs.editor.editor.commands.clearContent();
                })
                .catch(error => {
                    if (error.network) return;
                    switch (error.errorCode) {
                        case 400:
                            ElMessage.error('选择的标签数量有误');
                            break;
                        default:
                            error.defaultHandler("资讯发送失败")
                    }
                })
        }
    }
}

</script>


