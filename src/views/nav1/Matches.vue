<template>
    <section>
        <!--列表-->
        <el-table :data="matches" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column prop="match_id" width="60">
            </el-table-column>
            <el-table-column label="主场" width="90" sortable>
                <template slot-scope="scope">
                    {{parseInt(scope.row.home)?'主场':'客场'}}
                </template>
            </el-table-column>
            <el-table-column prop="team" label="对手" width="140" sortable>
            </el-table-column>
            <el-table-column prop="type" label="比赛" width="90" sortable>
                <template slot-scope="scope">
                    {{types[parseInt(scope.row.type)]}}
                </template>
            </el-table-column>
            <el-table-column prop="round" label="轮次" width="120" sortable>
            </el-table-column>
            <el-table-column prop="time" label="时间" width="210" sortable>
            </el-table-column>
            <el-table-column prop="stadium" label="球场" width="120" sortable>
            </el-table-column>
            <el-table-column prop="result" label="结果" width="120" sortable>
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
            <el-button type="danger" @click="handleAdd()">添加比赛</el-button>
            <el-pagination layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="20"
                           :total="10000" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑比赛" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm">
                <el-form-item label="对手" prop="team">
                    <el-input v-model="editForm.team"></el-input>
                </el-form-item>
                <el-form-item label="主场">
                    <el-radio-group v-model="editForm.home">
                        <el-radio class="radio" :label="1">主场</el-radio>
                        <el-radio class="radio" :label="0">客场</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="editForm.type">
                        <el-radio class="radio" :label="1">中超</el-radio>
                        <el-radio class="radio" :label="2">亚冠</el-radio>
                        <el-radio class="radio" :label="3">足协杯</el-radio>
                        <el-radio class="radio" :label="4">友谊赛</el-radio>
                        <el-radio class="radio" :label="5">预备队</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="轮次" prop="round">
                    <el-input v-model="editForm.round"></el-input>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker type="datetime" placeholder="选择时间" v-model="editForm.time"
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                <el-form-item label="场地" prop="stadium">
                    <el-input v-model="editForm.stadium"></el-input>
                </el-form-item>
                <el-form-item label="结果" prop="result">
                    <el-input v-model="editForm.result"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


        <!--新增界面-->
        <el-dialog title="新增比赛" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" ref="addForm">
                <el-form-item label="对手" prop="team">
                    <el-input v-model="addForm.team"></el-input>
                </el-form-item>
                <el-form-item label="主场">
                    <el-radio-group v-model="addForm.home">
                        <el-radio class="radio" :label="1">主场</el-radio>
                        <el-radio class="radio" :label="0">客场</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="addForm.type">
                        <el-radio class="radio" :label="1">中超</el-radio>
                        <el-radio class="radio" :label="2">亚冠</el-radio>
                        <el-radio class="radio" :label="3">足协杯</el-radio>
                        <el-radio class="radio" :label="4">友谊赛</el-radio>
                        <el-radio class="radio" :label="5">预备队</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="轮次" prop="round">
                    <el-input v-model="addForm.round"></el-input>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker type="datetime" placeholder="选择时间" v-model="addForm.time"
                                    value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                <el-form-item label="场地" prop="stadium">
                    <el-input v-model="addForm.stadium"></el-input>
                </el-form-item>
                <el-form-item label="结果" prop="result">
                    <el-input v-model="addForm.result"></el-input>
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
    import {getMatches, newMatch, editMatch, deleteMatch} from '../../api/api';

    export default {
        data() {
            return {
                types: ['', '中超', '亚冠', '足协杯', '友谊赛', '预备队'],
                newtitle: [],
                inputValue: '',
                inputVisible: false,
                filters: {
                    name: ''
                },
                matches: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                editForm: {
                    member_id: '',
                    home: 1,
                    team: '',
                    type: 1,
                    round: '',
                    time: '',
                    result: '',
                    stadium: ''
                },
                addForm: {
                    home: 1,
                    team: '',
                    type: 1,
                    round: '',
                    time: '',
                    result: '',
                    stadium: ''
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
                    let para = {id: row.match_id};
                    deleteMatch(para).then((res) => {
                        console.log(res)
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getMatchList();
                    });
                }).catch(() => {

                });
            },
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    home: 1,
                    team: '',
                    type: 1,
                    round: '',
                    time: '',
                    result: '',
                    stadium: ''
                }
            },


            handleCurrentChange(val) {
                this.page = val;
                this.getMatchList();
            },
            getMatchList() {
                let para = {
                    page: this.page,
                    type: 7
                    // name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getMatches(para).then((res) => {
                    console.log(res)
                    this.matches = res.data.matches;
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
                    this.editForm.time = util.formatDate.format(new Date(this.editForm.time), 'yyyy-MM-dd hh:mm:ss')
                    //NProgress.start();
                    let para = Object.assign({}, this.editForm);
                    editMatch(para).then((res) => {
                        console.log(res)
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.getMatchList()
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
                    newMatch(para).then((res) => {
                        console.log(res)
                        this.addLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.$refs['addForm'].resetFields();
                        this.addFormVisible = false;
                        this.getMatchList();
                    });
                });

            },
            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getMatchList()
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