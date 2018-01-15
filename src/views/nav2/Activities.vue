<template>
    <section>
        <!--列表-->
        <el-table :data="activities" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column prop="activity_id" width="60">
            </el-table-column>
            <el-table-column prop="activity_name" show-overflow-tooltip label="活动名" width="200" sortable>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="150" sortable>
                <template slot-scope="scope">
                    {{types[parseInt(scope.row.type)]}}
                </template>
            </el-table-column>
            <el-table-column prop="running" label="状态" width="90" sortable>
                <template slot-scope="scope">
                    {{parseInt(scope.row.running)?"运":"停"}} | {{scope.row.state}}
                </template>
            </el-table-column>
            <el-table-column prop="for_titles" label="权限" width="120" sortable>
            </el-table-column>
            <el-table-column prop="count" label="人数" width="120" sortable>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleSubmitPage(scope.$index, scope.row)">回收结果</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="handleAdd()">添加活动</el-button>
            <el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="20"
                           :total="10000" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor} from 'vue-quill-editor'
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getActivities, getActivity, newActivity, editActivity, deleteActivity} from '../../api/api';
    //import ActivityForm from "../../components/ActivityForm";

    export default {
        components: {
            ActivityForm: resolve => require(['../../components/ActivityForm'], resolve),
            quillEditor
        },
        data() {
            return {
                activeName: 'first',
                types: ['重要报名', '线上活动', '线下活动'],
                newtitle: [],
                inputValue: '',
                inputVisible: false,
                filters: {
                    name: ''
                },
                editorOption: {/* quill options */},
                activities: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
            }
        },
        methods: {
            handleSubmitPage: function (index, row) {
                this.$router.push('/submits?id=' + row.activity_id)
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.activity_id};
                    deleteActivity(para).then((res) => {
                        console.log(res)
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getActivityList();
                    });
                }).catch(() => {

                });
            },
            handleAdd: function () {
                // this.addFormVisible = true;
                // this.addForm = {
                //     activity_name: '',
                //     type: 0,
                //     limit_count: 0,
                //     start_time: new Date(),
                //     end_time: new Date(),
                //     state: 0,
                //     owner_id: 0,
                //     description: '',
                //     attach_title_id: 1,
                //     is_attached_title: 0,
                //     content: '',
                //     for_titles: '',
                //     running: 0
                // }
                this.$router.push('/activity?id=-1')
            },


            handleCurrentChange(val) {
                this.page = val;
                this.getActivityList();
            },
            getActivityList() {
                let para = {
                    page: this.page,
                    pms: true
                    // name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getActivities(para).then((res) => {
                    console.log(res)
                    this.activities = res.data.activities;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                // getActivity({admin:true, pms: true, id: row.activity_id}).then(res => {
                //     console.log(res)
                //     this.editForm = res.data
                // })
                // this.editForm = row;
                // this.editFormVisible = true;
                this.$router.push('/activity?id='+row.activity_id)
            },

            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getActivityList()
        }
    }

</script>

<style scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .avatar {
        width: 100px;
        height: 50px;
    }

    .quill-editor {
        height: 80%;
    }

    .editor-container {
        height: 400px;
    }
</style>