<template>
    <section>
        <!--列表-->
        <el-table :data="banners" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column prop="banner_id" width="60">
            </el-table-column>
            <el-table-column label="图片" width="200">
                <template slot-scope="scope">
                    <img class="avatar" :src="scope.row.image">
                </template>
            </el-table-column>
            <el-table-column prop="goto" label="关联" width="140" sortable>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="90" sortable>
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
            <el-button type="danger" @click="handleAdd()">添加头图</el-button>
            <el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="20"
                           :total="10000" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑头图" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm">
                <el-form-item label="图片" prop="image">
                    <el-input v-model="editForm.image"></el-input><img class="avatar" :src="editForm.image">
                </el-form-item>

                <el-form-item label="关联" prop="goto">
                    <el-input v-model="editForm.goto"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="editForm.type"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--新增界面-->
        <el-dialog title="新增头图" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="图片" prop="image">
                    <el-input v-model="addForm.image"></el-input><img class="avatar" :src="addForm.image">
                </el-form-item>

                <el-form-item label="关联" prop="goto">
                    <el-input v-model="addForm.goto"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="addForm.type"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getBanners, newBanner, editBanner, deleteBanner} from '../../api/api';

    export default {
        data() {
            return {
                newtitle: [],
                inputValue: '',
                inputVisible: false,
                filters: {
                    name: ''
                },
                banners: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                editForm: {
                    image: '',
                    goto: '',
                    type: 1
                },
                addForm: {
                    image: '',
                    goto: '',
                    type: 1
                }

            }
        },
        methods: {


            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.banner_id};
                    deleteBanner(para).then((res) => {
                        console.log(res)
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getBannerList();
                    });
                }).catch(() => {

                });
            },
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    image: '',
                    goto: '',
                    type: 1
                }
            },


            handleCurrentChange(val) {
                this.page = val;
                this.getBannerList();
            },
            getBannerList() {
                let para = {
                };
                this.listLoading = true;
                //NProgress.start();
                getBanners(para).then((res) => {
                    console.log(res)
                    this.banners = res.data.banners;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                this.editForm = row;
                this.editFormVisible = true;
            },
            //编辑
            editSubmit: function () {
                console.log(this.editForm)
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    // this.editForm.time = util.formatDate.format(new Date(this.editForm.time), 'yyyy-MM-dd hh:mm:ss')
                    //NProgress.start();
                    let para = Object.assign({}, this.editForm);
                    editBanner(para).then((res) => {
                        console.log(res)
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.getBannerList()
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
                    // this.addForm.time = util.formatDate.format(new Date(this.addForm.time), 'yyyy-MM-dd hh:mm:ss')
                    let para = Object.assign({}, this.addForm);
                    newBanner(para).then((res) => {
                        console.log(res)
                        this.addLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$refs['addForm'].resetFields();
                        this.addFormVisible = false;
                        this.getBannerList();
                    });
                });

            },
            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getBannerList()
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
</style>