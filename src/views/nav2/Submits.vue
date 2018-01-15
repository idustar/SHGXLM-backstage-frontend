<template>
    <section>
        <!--列表-->
        <el-table :data="submits" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column prop="submit_id" width="60">
            </el-table-column>
            <el-table-column prop="name" label="作者" width="200" sortable>
                <template slot-scope="scope">
                    <span><img class="avatar" :src="scope.row.avatar"></span><span>{{scope.row.name}} - {{scope.row.nickName}}</span>
                </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in activity.content.items" :key="item.id"
                             v-if="item.title" show-overflow-tooltip :label="item.title" width="140" sortable>
                <template slot-scope="scope">
                    <div v-if="item.name!=='image'"> {{scope.row.ct.form[index]||'未填写'}}</div>
                    <div v-else>
                        <img :src="scope.row.ct.form[index]||''" class="avatar">
                        <a :href="scope.row.ct.form[index]||''"  target="_blank">查看大图</a>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" width="120"
                             :filters="states"
                             :filter-method="filterState"
                             filter-placement="bottom-end" sortable>
                <template slot-scope="scope">
                    <el-tag>{{states[parseInt(scope.row.state)].value}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_notified" label="通知" width="90" sortable>
                <template slot-scope="scope">
                    {{parseInt(scope.row.is_notified)?"是":"否"}}
                </template>
            </el-table-column>
            <el-table-column prop="state_json" show-overflow-tooltip  label="状态说明" width="120" sortable>
            </el-table-column>

            <el-table-column prop="create_at" label="创建时间" width="220" sortable>
            </el-table-column>

            <el-table-column label="操作" width="200" fixed="right">
                <template slot-scope="scope">
                    <el-button-group>
                    <el-button size="small" @click="handleLook(scope.$index, scope.row)">看</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编</el-button>
                    <el-button size="small" @click="handleNoti(scope.$index, scope.row)">通</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="$router.push('/activity?id='+$route.query.id)">编辑活动</el-button>
            <el-button type="danger" @click="loadToken">获取token</el-button>
            <el-tag> 活动: {{activity.activity_name}} </el-tag>
            <el-tag> token: {{token?token[0]:''}} </el-tag>
            <el-pagination layout="sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="pagesize"
                           @size-change="handleSizeChange"
                           :total="10000" style="float:right;" :page-sizes="[1, 5, 10, 20, 40, 80, 150, 300, 1000]"
                           >
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog top="5vh" title="编辑表单状态" v-model="editFormVisible" :close-on-click-modal="false">
                    <el-form :model="editForm" label-width="80px" ref="editForm">
                        <el-form-item label="状态">
                            <el-radio-group v-model="editForm.state">
                                <el-radio-button class="radio" :label="1">未审核</el-radio-button>
                                <el-radio-button class="radio" :label="2">通知面试</el-radio-button>
                                <el-radio-button class="radio" :label="3">审核通过</el-radio-button>
                                <el-radio-button class="radio" :label="4">审核拒绝</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="通知" prop="header">
                            <el-radio-group v-model="editForm.is_notified">
                                <el-radio-button class="radio" :label="0">未通知</el-radio-button>
                                <el-radio-button class="radio" :label="1">已通知</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="editForm.states" v-for="(item,index) in editForm.states" :key="index" :label="item.name">
                            <el-input placeholder="请输入内容" v-model="item.text" class="input-with-select">
                                <el-input v-model="item.name" slot="prepend" placeholder="请输入名称" style="width: 100px;">

                                </el-input>
                                <el-button @click="deleteSelector(editForm.states, index)" slot="append">删除</el-button>
                            </el-input>
                        </el-form-item>
                        <el-button-group>
                            <el-button @click="newSelector(editForm.states)">添加新项</el-button>
                            <el-button @click="saveStorage">保存至浏览器</el-button>
                            <el-button @click="loadStorage">从浏览器加载</el-button>
                        </el-button-group>
                    </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>






        <el-dialog top="5vh" title="发送通知" v-model="notiFormVisible" :close-on-click-modal="false">
            <el-form :model="notiForm" label-width="80px" ref="notiForm">
                <el-form-item label="编号">
                    <el-select v-model="choose" placeholder="请选择" @change="changeTemplate">
                        <el-option
                                v-for="(item, index) in templates"
                                :key="index"
                                :label="item.title"
                                :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div>{{notiForm.touser}} 的formid是 {{notiForm.form_id}}</div>
            <el-button @click="delFormid">DEL</el-button>
            <div v-for="(item,index) in notiForm.data" :key="index">
                【{{item.value || '未定义'}}】
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="notiFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="notiSubmit" :loading="notiLoading">发送通知</el-button>
            </div>
        </el-dialog>







        <el-dialog top="5vh" :title="lookForm.name + '(' + lookForm.nickName + ') 的表单'"
                   v-model="lookVisible" :close-on-click-modal="false">
            <div>
                <div>提交于 {{ lookForm.create_at }}</div>
            </div>
            <div v-for="(item, index) in lookForm.ct.form">
                <div class="look-item" v-if="activity.content.items[index].title">
                    <div class="look-title">{{activity.content.items[index].title}}:</div>
                    <div class="look-content" v-if="activity.content.items[index].name!=='image'"> {{item || '未填写'}}</div>
                    <div class="look-content" v-else>
                        <img :src="item" class="image"><a :href="item"  target="_blank">查看大图</a>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="lookVisible = false">关闭</el-button>
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
    import {getSubmits, getActivity, getSubmit, newSubmit, editSubmit,
        deleteSubmit, newMemberTitle, getFormids, deleteFormids, getToken, sendTemplates} from '../../api/api';

    export default {
        components: {
            quillEditor
        },
        data() {
            return {
                pagesize: 10,
                activity: {
                    content: '',
                    activity_name: ''
                },
                token: '',
                choose: -1,
                activeName: 'first',
                states: [{ text: '未定义', value: '未定义' }, { text: '未审核', value: '未审核' },
                    { text: '等待面试', value: '等待面试' }, { text: '已通过', value: '已通过' },
                    { text: '未通过', value: '未通过' }],
                newtitle: [],
                inputValue: '',
                inputVisible: false,
                filters: {
                    name: ''
                },
                editorOption: { /* quill options */ },
                submits: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

                lookVisible: false,//编辑界面是否显示
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                notiFormVisible: false,
                notiLoading: false,
                editForm: {
                    submit_id: '',
                    title: '',
                    content: '',
                    for_title: '',
                    owner: '',
                    type: 0,
                    created_at: '',
                    draft: 1,
                    header: ''
                },
                lookForm: {
                    submit_id: 0,
                    name: '',
                    nickName: '',
                    create_at: '',
                    content: '',
                    ct: {form: []}
                },
                notiForm: {
                    touser: '',
                    template_id: '',
                    page: '',
                    form_id: '',
                    data: {},
                    emphasis_keyword: 'keyword1.DATA'
                },
                templates: [{
                    template_id: 'EpTSgRWId5kxKmVY58zUmu_gzS8u-Of5tQi2aWxcQCo',
                    title: '日程|名称开始结束地点描述',
                    count: 5,
                }, {
                    template_id: 'HYUOVEUQdRw7s4zgPMLwS5QT59UwpPMwXZRFJYFryko',
                    title: '线下面试|编号姓名时间地点提醒',
                    count: 5,
                }, {
                    template_id: 'if8-OasTtystWzAcS6cK-1__dNxKEkwSvlwWXDPjgTw',
                    title: '报名失败|项目原因备注',
                    count: 3,
                }, {
                    template_id: 'QT4WuVd6q-9VBZXLni-3eGUJBc2dGcw5D0HWgPmA2Ic',
                    title: '报名成功|项目类别提示',
                    count: 3,
                }, {
                    template_id: 'QT4WuVd6q-9VBZXLni-3ePLaxfZa0tgpfWNXEd7tKbo',
                    title: '报名成功|项目类别时间地点提示',
                    count: 5,
                }, {
                    template_id: 'pYuHY4FfJTQTCWqFeFFHLwMDlBGiO2KGd91qZdpo3mg',
                    title: '审核成功|卡号姓名类型项目备注',
                    count: 5,
                }, {
                    template_id: 'W7NdT_Emv2aWk3OEps6BosCqrx7R_Jz04S19EtvhEHk',
                    title: '投票结果|标题类型发起人人数类型',
                    count: 5,
                }, {
                    template_id: 'CvvXvDe0h_R1Eas9R-HnHsG5MAMu6WhSHWQUKhD4TcY',
                    title: '活动取消|项目组织者时间原因备注',
                    count: 5,
                }, {
                    template_id: 'ciyG41NQKqTbiZFcCZwt6eLo3xr33SYx-cdRTqF7RmU',
                    title: '审核未过|项目结果原因备注',
                    count: 4,
                }, {
                    template_id: 'lCNbtGW28pUVkdnHzYQLNz6Zuwbg2CBgDZWOuWUjxgI',
                    title: '赛程|赛项比赛时间地点',
                    count: 4,
                }]

            }
        },
        methods: {
            deleteSelector(item, index) {
                item.splice(index, 1)
            },
            newSelector(item) {
                item.push({name: '', text:''})
            },
            filterState(value, row) {
                return row.State === value;
            },
            onEditorBlur(quill) {
                console.log('editor blur!', quill)
            },
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            onEditorReady(quill) {
                console.log('editor ready!', quill)
            },
            saveStorage() {
                localStorage.setItem('states', JSON.stringify(this.editForm))
            },
            loadStorage() {
                let se = JSON.parse(localStorage.getItem('states'))
                this.editForm.states = se.states
                this.editForm.state = se.state
                this.editForm.is_notified = se.is_notified
            },
            changeTemplate(option) {
                this.notiForm.data = new Object()
                console.log(this.choose)
                if (this.choose >= 0) {
                    this.notiForm.template_id = this.templates[this.choose].template_id
                    for (let i = 1; i <= this.templates[this.choose]['count']; i++) {
                        this.notiForm.data["keyword"+i] = {value: this.editForm.states[i-1]?this.editForm.states[i-1].text:''}

                    }
                }
            },

            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {id: row.submit_id};
                    deleteSubmit(para).then((res) => {
                        console.log(res)
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSubmitList(this.$route.query.id)
                    });
                }).catch(() => {

                });
            },
            handleSizeChange(val) {
                this.pagesize = val
                this.getSubmitList(this.$route.query.id);
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getSubmitList(this.$route.query.id);
            },
            getActivityById(id) {
                this.listLoading = true;
                getActivity({
                    pms: true,
                    id: id,
                    ctype: '1'
                }).then((res) => {
                    console.log(res)
                    this.activity = res.data;
                    this.activity.content = JSON.parse(this.activity.content)
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            getSubmitList(id) {
                let para = {
                    activity: id,
                    page: this.page,
                    limit: this.pagesize,
                    pms: true
                    // name: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                getSubmits(para).then((res) => {
                    console.log(res)
                    this.submits = res.data.submits;
                    this.submits.forEach(e => {
                        e.ct = JSON.parse(e.content) || {form: []};
                        for (let i=1; i<e.ct.form.length; i++) {
                            if (this.activity.content.items[i].name === 'selector') {
                                let j = e.ct.form[i]
                                if (!j || !parseInt(j))
                                    e.ct.form[i] = '未选择'
                                else
                                    e.ct.form[i] = this.activity.content.items[i].range[parseInt(j)].text
                            } else if (this.activity.content.items[i].name === 'checkbox') {
                                if (e.ct.form[i]) {
                                    e.ct.form[i] = e.ct.form[i].join(',')
                                }
                            } else if (this.activity.content.items[i].name === 'other-selector' &&
                                this.activity.content.items[i].mode === 'region') {
                                if (e.ct.form[i]) {
                                    e.ct.form[i] = e.ct.form[i].join(',')
                                }
                            }
                        }
                    })
                    this.listLoading = false;
                    //NProgress.done();
                });
            },

            //显示编辑界面
            handleEdit: function (index, row) {
                // getSubmits({pms:true, id: row.submit_id}).then(res => {
                //     console.log(res)
                //     this.editForm = res.data
                // })
                // this.editForm = row;
                 this.editForm = {
                     owner_id: row.member_id,
                     submit_id: row.submit_id,
                     state: row.state,
                     is_notified: row.is_notified,
                     states: JSON.parse(row.state_json || '[]')
                 },
                 this.editFormVisible = true;
            },

            loadToken: function() {
                getToken().then(res => {
                    console.log(res)
                    this.token = res.data.access_token
                })
            },

            //*********
            handleNoti: function (index, row) {
                this.notiForm.page = 'pages/acti/index?id=' + this.activity.activity_id

                getFormids({member: row.member_id}).then(res => {
                    console.log(res)
                    this.notiForm.touser = res.data.formid.openId
                    this.notiForm.form_id = res.data.formid.formid
                })
                this.editForm.states = JSON.parse(row.state_json || '[]');


                this.changeTemplate()
                this.notiFormVisible = true;
            },

            handleLook: function (index, row) {
                this.lookForm = row
                this.lookVisible = true
            },
            //编辑
            editSubmit: function () {
                console.log(this.editForm)
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.editLoading = true;
                    this.editForm.state_json = JSON.stringify(this.editForm.states)
                    //NProgress.start();
                    let para = Object.assign({}, {
                        state_json: this.editForm.state_json,
                        submit_id: this.editForm.submit_id,
                        state: this.editForm.state,
                        is_notified: this.editForm.is_notified
                    });
                    editSubmit(para).then((res) => {
                        if (parseInt(this.editForm.state) === 3 && this.activity.is_attached_title === 1) {
                            let title = parseInt(this.activity.attach_title_id)
                            newMemberTitle({member_id: this.editForm.owner_id, title_id: title}).then((res) => {
                                console.log('new ' + title + ' member: ' + this.editForm.owner_id)
                                console.log(res)
                            }).catch(err => console.log(err))
                        }
                        console.log(res)
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.getSubmitList(this.$route.query.id)
                        this.$refs['editForm'].resetFields();
                        this.editFormVisible = false;
                    });
                });


            },
            delFormid () {
                deleteFormids({id: this.notiForm.form_id}).then(res1 => {
                    this.$message({
                        message: '更换成功',
                        type: 'success'
                    });
                    getFormids({member: row.member_id}).then(res => {
                        console.log(res)
                        this.notiForm.touser = res.data.formid.openId || ''
                        this.notiForm.form_id = res.data.formid.formid || ''
                    })
                    this.editForm.states = JSON.parse(row.state_json || '[]');
                })
            },
            notiSubmit: function (res) {
                console.log(this.notiForm)
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.notiLoading = true;
                    let para = Object.assign({}, this.notiForm);
                    console.log(para)
                    sendTemplates(this.token, para).then((res) => {
                        if (res.data.errcode === 0) {

                            console.log(res)
                            deleteFormids({id: this.notiForm.form_id}).then(res1 => {
                                this.$message({
                                    message: '发送成功',
                                    type: 'success'
                                });
                                console.log(res1)
                            })
                        } else {
                            this.$message({
                                message: res.data.errcode + ' - ' + res.data.errmsg,
                                type: 'error'
                            });
                        }

                        console.log(res, res.config.data)
                        this.notiLoading = false;
                        //NProgress.done();
                        this.notiFormVisible = false;
                    });
                });

            },
            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        beforeMount() {
            this.getActivityById(this.$route.query.id)
            this.getSubmitList(this.$route.query.id)

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
        width: 30px;
        height: 30px;
    }
    .quill-editor {
        height: 80%;
    }
    .editor-container {
        height: 400px;
    }
    .look-item {
        display: flex;
        margin: 5px 0 5px 0;
    }
    .look-title {
        font-weight: bold;
        width:200px;
    }
    .image {
        width: 100px;
        height: 100px;
    }
</style>