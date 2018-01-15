<template>
    <section>
        <!--列表-->
        <el-table :data="articles" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column prop="article_id" width="60">
            </el-table-column>
            <el-table-column prop="title" show-overflow-tooltip label="标题" width="140" sortable>
            </el-table-column>
            <el-table-column prop="name" show-overflow-tooltip label="作者" width="140" sortable>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="90" sortable>
                <template slot-scope="scope">
                    {{types[parseInt(scope.row.type)]}}
                </template>
            </el-table-column>
            <el-table-column prop="draft" label="草稿" width="90" sortable>
                <template slot-scope="scope">
                    {{parseInt(scope.row.draft)?"是":"否"}}
                </template>
            </el-table-column>
            <el-table-column prop="for_titles" label="权限" width="120" sortable>
            </el-table-column>

            <el-table-column prop="created_at" label="创建时间" width="220" sortable>
            </el-table-column>

            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="handleAdd()">添加文章</el-button>
            <el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="20"
                           :total="10000" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog top="5vh" title="编辑文章" v-model="editFormVisible" :close-on-click-modal="false">
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="first">
                    <el-form :model="editForm" label-width="80px" ref="editForm">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="editForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="权限" prop="for_titles">
                            <el-input v-model="editForm.for_titles"></el-input>
                        </el-form-item>
                        <el-form-item label="作者" prop="owner">
                            <el-input v-model="editForm.owner"></el-input>
                        </el-form-item>
                        <el-form-item label="草稿">
                            <el-radio-group v-model="editForm.draft">
                                <el-radio class="radio" :label="1">是</el-radio>
                                <el-radio class="radio" :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-radio-group v-model="editForm.type">
                                <el-radio class="radio" :label="0">公告</el-radio>
                                <el-radio class="radio" :label="1">消息</el-radio>
                                <el-radio class="radio" :label="2">球迷志</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="头图" prop="header">
                            <el-input v-model="editForm.header"></el-input><img class="avatar" :src="editForm.header">
                        </el-form-item>
                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="内容编辑" name="second" class="editor-container">
                    <quill-editor v-model="editForm.content"
                                  class="quill-editor"
                                  ref="myQuillEditor"
                                  @blur="onEditorBlur($event)"
                                  @focus="onEditorFocus($event)"
                                  @ready="onEditorReady($event)"
                    ></quill-editor>
                </el-tab-pane>

            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--新增界面-->
        <el-dialog top="5vh" title="新增文章" v-model="addFormVisible" :close-on-click-modal="false">
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="first">
                    <el-form :model="addForm" label-width="80px" ref="addForm">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="addForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="权限" prop="for_titles">
                            <el-input v-model="addForm.for_titles"></el-input>
                        </el-form-item>
                        <el-form-item label="作者" prop="owner">
                            <el-input v-model="addForm.owner"></el-input>
                        </el-form-item>
                        <el-form-item label="草稿">
                            <el-radio-group v-model="addForm.draft">
                                <el-radio class="radio" :label="1">是</el-radio>
                                <el-radio class="radio" :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-radio-group v-model="addForm.type">
                                <el-radio class="radio" :label="0">公告</el-radio>
                                <el-radio class="radio" :label="1">消息</el-radio>
                                <el-radio class="radio" :label="2">球迷志</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="头图" prop="header">
                            <el-input v-model="addForm.header"></el-input><img class="avatar" :src="addForm.header">
                        </el-form-item>
                    </el-form>

                </el-tab-pane>
                <el-tab-pane label="内容编辑" name="second" class="editor-container">
                    <quill-editor v-model="addForm.content"
                                  class="quill-editor"
                                  ref="myQuillEditor"
                                  @blur="onEditorBlur($event)"
                                  @focus="onEditorFocus($event)"
                                  @ready="onEditorReady($event)"
                                  ></quill-editor>
                </el-tab-pane>

            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import { quillEditor } from 'vue-quill-editor'
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getArticles, getArticle, newArticle, editArticle, deleteArticle} from '../../api/api';

    export default {
        components: {
            quillEditor
        },
        data() {
            return {
                activeName: 'first',
                types: ['', '公告', '信息', '球迷志'],
                newtitle: [],
                inputValue: '',
                inputVisible: false,
                filters: {
                    name: ''
                },
                editorOption: { /* quill options */ },
                articles: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                editForm: {
                    article_id: '',
                    title: '',
                    content: '',
                    for_title: '',
                    owner: '',
                    type: 0,
                    created_at: '',
                    draft: 1,
                    header: ''
                },
                addForm: {
                    title: '',
                    content: '',
                    for_title: '',
                    owner: '',
                    type: 0,
                    draft: 1,
                    header: ''

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

            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.article_id};
                    deleteArticle(para).then((res) => {
                        console.log(res)
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getArticleList();
                    });
                }).catch(() => {

                });
            },
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    title: '',
                    content: '',
                    for_title: '',
                    owner: 0,
                    created_at: '',
                    type: 0,
                    draft: 0,
                    header: ''
                }
            },


            handleCurrentChange(val) {
                this.page = val;
                this.getArticleList();
            },
            getArticleList() {
                let para = {
                    page: this.page,
                    pms: true
                    // name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getArticles(para).then((res) => {
                    console.log(res)
                    this.articles = res.data.articles;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                getArticle({pms:true, id: row.article_id}).then(res => {
                    console.log(res)
                    this.editForm = res.data
                })
                // this.editForm = row;
                this.editFormVisible = true;
            },
            //编辑
            editSubmit: function () {
                console.log(this.editForm)
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    this.editForm.time = util.formatDate.format(new Date(this.editForm.time), 'yyyy-MM-dd hh:mm:ss')
                    //NProgress.start();
                    let para = Object.assign({}, this.editForm);
                    editArticle(para).then((res) => {
                        console.log(res)
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.getArticleList()
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                    });
                });


            },

            //新增
            addSubmit: function () {

                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addLoading = true;
                    //NProgress.start();
                    this.addForm.time = util.formatDate.format(new Date(this.addForm.time), 'yyyy-MM-dd hh:mm:ss')
                    let para = Object.assign({}, this.addForm);
                    newArticle(para).then((res) => {
                        console.log(res)
                        this.addLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$refs['addForm'].resetFields();
                        this.addFormVisible = false;
                        this.getArticleList();
                    });
                });

            },
            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getArticleList()
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