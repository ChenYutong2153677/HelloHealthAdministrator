<template>
    <div class="title">
        <div class="forum-title title-with-line" >
            论坛举报
        </div>
    </div>

    <div class="bodyTable">
    <el-tabs
        v-model="type_sort.type"
        
        @tab-click="sortSwitcher">
        <el-tab-pane  label="未处理" name="unchecked"> </el-tab-pane>
        <el-tab-pane  label="已处理" name="checked"> </el-tab-pane>
             
    </el-tabs>

    <el-table :data="report_list" border style="width: 100%" height="400" empty-text="暂无举报内容">
 

        <el-table-column label="发布用户" :width="display_width" align="center">
            <template #default="scope">
                <UserInfoCardSmall :avatar-url="scope.row.authorPortrait" :user-name="scope.row.authorName" :user-id="scope.row.authorId"></UserInfoCardSmall>
            </template>
        </el-table-column>

        <el-table-column label="发布时间" :width="display_width" align="center">
            <template #default="scope">
                                   
                {{ scope.row.commentTime }}
                     
            </template>
        </el-table-column>

        <el-table-column label="举报用户" :width="display_width" align="center">
            <template #default="scope">
                <UserInfoCardSmall :avatar-url="scope.row.userPortrait" :user-name="scope.row.userName" :user-id="scope.row.userId"></UserInfoCardSmall>
            </template>
        </el-table-column>

        <el-table-column label="举报时间" :width="display_width" align="center">
            <template #default="scope">
                                   
                {{ scope.row.reportTime }}
                     
            </template>
        </el-table-column>

        <!--已处理-->
        <el-table-column v-if="type_sort.type=='checked'" :width="display_width" label="处理管理员ID" align="center">
            <template #default="scope">
                {{ scope.row.administratorId }}
            </template>
        </el-table-column>

        <el-table-column v-if="type_sort.type=='checked'"  :width="display_width" label="处理时间" align="center">
            <template #default="scope">
                {{ scope.row.reportBackTime }}
            </template>
        </el-table-column>
    
 

        <el-table-column  label="操作" align="center">
            <template #default="scope">
                <FancyButton v-if="type_sort.type==='unchecked'" @click="check(scope.row)"> 去处理</FancyButton>
                <FancyButton v-else @click="check(scope.row)"> 查看详情</FancyButton>
            </template>
        </el-table-column>
       

    </el-table>
    </div>


    <el-dialog
        v-model="checkDialogVisible"
         
        align-center
        title="处理论坛举报"
        width="70%"
        top="0"
        class="checkform"
    >
        <CheckReportCommentForm v-if="checkDialogVisible" :report_info="selected_report" :is_checked="type_sort.type=='checked'" @open-content="openDetail" @refresh="display" @close-me="checkDialogVisible=false"/>
    </el-dialog>

    <el-dialog
        v-model="detailContentVisible"
        width="70%"
        top="0"
        title="内容详情"
        align-center
        >
        <TipTapEditorReadonly v-if="detailContentVisible" :contentJsonString="selected_report.content"></TipTapEditorReadonly>
        
    </el-dialog>

</template>


<script>
import axios from "axios"; 
import CheckReportCommentForm from "../components/checkView/CheckReportCommentForm.vue"
import UserInfoCardSmall from "@/components/UserInfoCardSmall.vue";
import FancyButton from "@/components/FancyButton.vue";
import TipTapEditorReadonly from "../components/postView/TipTapEditorReadonly.vue";

export default{

    components:
        {
            FancyButton,
            UserInfoCardSmall,
            CheckReportCommentForm,
            TipTapEditorReadonly
        },
    data:()=>({
        type_sort:{type:"unchecked",AdminID:localStorage.getItem("adminId")},
        
        report_list:[],
        checkDialogVisible:false,
        detailContentVisible:false,
        
        selected_report:[],
        display_width:160,//控制每列宽度
    }),
    methods:
    {
        check(report_info){
            axios.get("/spring/api/v1/CheckService/check/report/detail",{
                params:{
                    report_id:report_info.reportId,
                    admin_id:localStorage.getItem("adminId")
                }
            })
            .then((res)=> {
                report_info.postId=res.data.data.postId;
                report_info.postTitle=res.data.data.postTitle;
                report_info.floorNumber=res.data.data.floorNumber;
                report_info.content=res.data.data.content;
                report_info.reportRespond=res.data.data.reportRespond;
                report_info.reportReason=res.data.data.reportReason;
            })
            .then(()=>{
                 console.log(report_info);
                this.selected_report=report_info;
                this.checkDialogVisible=true;
            })

           
        },
 
        sortSwitcher(res){
            if(res.paneName==this.type_sort.type){
                return;
            }
            this.type_sort.type=res.paneName;
            this.display();
        },
        display(){
            axios.get("/spring/api/v1/CheckService/check/report/sortBy", {
                params: {
                    type: this.type_sort.type,
                    admin_id: localStorage.getItem("adminId")
                }
            })
            .then((res)=> {
                this.report_list= res.data.data.report_list;
                    
            })

        },
        openDetail(){
            console.log("openDetail")
            console.log(this.selected_report.content)
            this.detailContentVisible=true;
             
        }
 
    },
    created(){
        this.display();
    }

}
</script>


<style scoped>
.title {
   font-size: xx-large;
   margin-left: 10%;
   margin-top:5%;
   font-weight: bold;
}

.forum-title {
    position: relative;
}

.title-with-line:before{
    content:"";
    top:50%;
    width: 1px;
    height: 1.2em;
    display: inline-block;
    position: absolute;
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    border-radius: 2px;
    transform: translate(-16px , -50%);
}

.bodyTable{
    width: 85%;
    margin: 5% auto 0 auto;
}

.container svg:hover {
    transform: scale(1.1);
}

.container input:checked ~ svg {
    fill: RGB(253, 190, 45);
}

</style>