<template>
    <section>
        <!--列表-->

        <el-form :model="editForm" label-width="80px" ref="editForm">
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="first">

                    <el-form-item label="活动名" prop="activity_name">
                        <el-input v-model="editForm.activity_name"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="for_titles">
                        <el-input v-model="editForm.for_titles"></el-input>
                    </el-form-item>
                    <el-form-item label="组织者" prop="owner_id">
                        <el-input v-model="editForm.owner_id"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-radio-group v-model="editForm.running">
                            <el-radio class="radio" :label="1">正在运行</el-radio>
                            <el-radio class="radio" :label="0">暂停报名</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-radio-group v-model="editForm.type">
                            <el-radio class="radio" :label="0">重要报名</el-radio>
                            <el-radio class="radio" :label="1">线下活动</el-radio>
                            <el-radio class="radio" :label="2">线上活动</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="头图" prop="header">
                        <el-input v-model="editForm.header"></el-input>
                        <img class="avatar" :src="editForm.header">
                    </el-form-item>


                </el-tab-pane>

                <el-tab-pane label="活动配置" name="second">

                    <el-form-item label="开始时间" prop="start_time">
                        <el-date-picker
                                v-model="editForm.start_time"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="end_time">
                        <el-date-picker
                                v-model="editForm.end_time"
                                type="datetime"
                                placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="限制人数" prop="limit_count">
                        <el-input v-model="editForm.limit_count"></el-input>
                    </el-form-item>

                    <el-form-item label="角色关联">
                        <el-radio-group v-model="editForm.is_attached_title">
                            <el-radio class="radio" :label="1">与角色关联</el-radio>
                            <el-radio class="radio" :label="0">不与角色关联</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="角色" prop="attach_title_id">
                        <el-input v-model="editForm.attach_title_id"></el-input>
                    </el-form-item>


                </el-tab-pane>

                <el-tab-pane label="描述编辑" name="third" class="editor-container">
                    <quill-editor v-model="editForm.description"
                                  class="quill-editor"
                                  ref="myQuillEditor"
                                  @blur="onEditorBlur($event)"
                                  @focus="onEditorFocus($event)"
                                  @ready="onEditorReady($event)"
                    ></quill-editor>
                </el-tab-pane>

                <el-tab-pane label="问卷编辑" name="fourth" class="editor-container">
                    <activity-form :value.sync="editForm.content"></activity-form>
                </el-tab-pane>
                <el-tab-pane label="问卷JSON" name="fifth" class="editor-container">
                    <el-input style="word-break:break-all;" type="textarea"
                              :autosize="{ minRows: 18, maxRows: 18}"
                              v-model="editForm.content"></el-input>
                </el-tab-pane>


            </el-tabs>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>

    </section>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor} from 'vue-quill-editor'
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getActivity, editActivity, newActivity} from '../../api/api';
    //import ActivityForm from "../../components/ActivityForm";

    export default {
        components: {
            ActivityForm: resolve => require(['../../components/ActivityForm.vue'], resolve),
            quillEditor
        },
        data() {
            return {
                addActivity: false,
                activeName: 'first',
                types: ['重要报名', '线上活动', '线下活动'],

                inputValue: '',
                inputVisible: false,

                editorOption: {/* quill options */},


                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editForm: {
                    activity_name: '',
                    type: 0,
                    limit_count: 0,
                    start_time: new Date(),
                    end_time: new Date(),
                    state: 0,
                    owner_id: 0,
                    description: '',
                    attach_title_id: 1,
                    is_attached_title: 0,
                    content: '{"items":[],"submit":"","success":""}',
                    for_titles: '',
                    running: 0

                }

            }
        },
        methods: {
            onEditorBlur(quill) {
                console.log('editor blur!', quill)
            },
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            onEditorReady(quill) {
                console.log('editor ready!', quill)
            },

            //显示编辑界面
            handleEdit: function (aid) {
                console.log(aid)
                getActivity({admin: true, pms: true, id: aid}).then(res => {
                    console.log(res)
                    this.editForm = res.data
                })
            },
            //编辑
            editSubmit: function () {
                console.log(this.editForm)
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    this.editForm.end_time = util.formatDate.format(new Date(this.editForm.end_time), 'yyyy-MM-dd hh:mm:ss')
                    this.editForm.start_time = util.formatDate.format(new Date(this.editForm.start_time), 'yyyy-MM-dd hh:mm:ss')
                    //NProgress.start();
                    let para = Object.assign({}, this.editForm);
                    if (!this.addActivity)
                        editActivity(para).then((res) => {
                            console.log(res)
                            this.editLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            //this.$refs['editForm'].resetFields();
                        });
                    else
                        newActivity(para).then((res) => {
                            console.log(res)
                            this.editLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            //this.$refs['editForm'].resetFields();
                        });
                });


            }
        },
        mounted() {
            if (this.$route.query.id === '-1') {
                this.addActivity = true
            } else {
                this.handleEdit(this.$route.query.id)
            }
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