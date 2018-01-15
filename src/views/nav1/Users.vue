<template>
    <section>
        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column prop="member_id" width="60">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100" sortable>
            </el-table-column>
            <el-table-column prop="nickName" label="昵称" width="100" sortable>
            </el-table-column>
            <el-table-column prop="avatar" label="头像" width="70">
                <template slot-scope="scope">
                    <img :src="scope.row.avatar" class="avatar">
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="210" sortable>
            </el-table-column>
            <el-table-column prop="openId" label="OPENID" width="280" sortable>
            </el-table-column>

            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑角色</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="handleTitle()">编辑角色</el-button>
            <el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="20"
                           :total="10000" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑角色" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form label-width="80px">
                <el-form-item label="角色" prop="name">
                    <el-select
                            v-model="newtitle"
                            multiple
                            filterable
                            allow-create
                            placeholder="请选择角色">
                        <el-option
                                v-for="title in titles"
                                :key="title.title_id"
                                :label="title.title_content"
                                :value="title.title_id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="角色管理" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form label-width="80px">
                <el-form-item label="角色" prop="name">
                    <el-tag
                            :key="title.title_id"
                            v-for="title in titles"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(title)">
                        {{title.title_content}}
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">添加新的角色</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false;">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {
        getUserListPage,
        getMemberTitles,
        getTitles,
        newTitle,
        deleteTitle,
        newMemberTitle,
        deleteMemberTitle
    } from '../../api/api';

    export default {
        data() {
            return {
                newtitle: [],
                inputValue: '',
                inputVisible: false,
                filters: {
                    name: ''
                },
                oldtitle: [],
                titles: [],
                member_id: 0,
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                addFormVisible: false,//新增界面是否显示
                addLoading: false

            }
        },
        methods: {

            handleClose(title) {
                deleteTitle({id: title.title_id}).then(res => {
                    console.log(res)
                    this.titles.splice(this.titles.indexOf(title), 1);
                })
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    newTitle({title_content: inputValue, title_icon: ''}).then(res => {
                        console.log(res)
                        this.titles.push({title_id: res.data.title_id, title_content: inputValue, title_icon: ''});
                    })

                }
                this.inputVisible = false;
                this.inputValue = '';
            },


            handleCurrentChange(val) {
                this.page = val;
                console.log(this.page);
                this.getUsers();
            },
            getUsers() {
                let para = {
                    page: this.page
                    // name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getUserListPage(para).then((res) => {
                    console.log(res)
                    this.users = res.data.members;
                    this.total = res.data.members.length;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            getTitles() {
                let that = this
                let para = {};
                //NProgress.start();
                getTitles(para).then((res) => {

                    that.titles = res.data.titles;
                    console.log(that.titles);
                });
            },

            //显示编辑界面

            handleEdit: function (index, row) {
                this.member_id = row.member_id
                let para = {
                    user: this.member_id,
                    // name: this.filters.name
                };
                getMemberTitles(para).then((res) => {
                    if (this.newtitle)
                        this.newtitle = res.data.titles.map(e => e.title_id);
                    this.oldtitle = this.newtitle
                    console.log(this.newtitle)
                    //NProgress.done();
                });

                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleTitle: function () {
                this.addFormVisible = true;
            },
            //编辑
            editSubmit: function () {

                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    //NProgress.start();
                    console.log(this.newtitle)
                    console.log(this.oldtitle)
                    this.newtitle.forEach(e => {
                        if (!this.oldtitle.some(ee => ee === e)) {
                            newMemberTitle({member_id: this.member_id, title_id: e}).then((res) => {
                                console.log('new ' + e + ' member: ' + this.member_id)
                                console.log(res)
                            }).catch(err => console.log(err))
                        }
                    })
                    this.oldtitle.forEach(e => {
                        if (!this.newtitle.some(ee => ee === e)) {
                            deleteMemberTitle({member_id: this.member_id, title_id: e}).then((res) => {
                                console.log('delete ' + e + ' member: ' + this.member_id)
                                console.log(res)
                            }).catch(err => console.log(err))
                        }
                    })
                    this.editLoading = false;
                });
                this.editFormVisible = false;

            },
            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getUsers();
            this.getTitles();
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
        width: 20px;
        height: 20px;
    }
</style>