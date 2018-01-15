<template>
    <div class="ac-form">
        <div class="ac-page">
            <div class="ac-form-container">
                <div class="ac-item" v-for="(item, index1) in forms.items" :key="item.id">

                    <el-row class="ac-item" :gutter="3">
                        <el-col :span="2">
                            <el-input v-model="item.id" placeholder="ID"></el-input>
                        </el-col>
                        <el-col :span="2" v-if="item.name === 'input' || item.name === 'textarea'">
                            <el-select v-model="item.name" placeholder="名称" class="selector">
                                <el-option
                                        v-for="option in options_input"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2" v-else>
                            <el-input v-model="item.name" placeholder="名称" disabled></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-select v-model="item.show" placeholder="是否显示" class="selector">
                                <el-option
                                        v-for="option in options_show"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="2" v-if="item.name !== 'rich-text'">
                            <el-select v-model="item.important" placeholder="是否必填" class="selector">
                                <el-option
                                        v-for="option in options_important"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value">
                                </el-option>
                            </el-select>
                        </el-col>

                        <el-col :span="3" v-if="item.name !== 'rich-text'">
                            <el-input v-model="item.title" placeholder="标题"></el-input>
                        </el-col>
                        <el-col :span="3" v-if="item.name !== 'rich-text'">
                            <el-input v-model="item.desc" placeholder="描述"></el-input>
                        </el-col>
                        <el-col :span="2" v-if="item.name !== 'checkbox' && item.name !== 'rich-text'">
                            <el-input v-model="item.value" placeholder="默认值"></el-input>
                        </el-col>

                        <el-col :span="3" v-if="item.name === 'other-selector'">
                            <el-select v-model="item.mode" placeholder="模式" class="selector">
                                <el-option
                                        v-for="option in options_mode"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value">
                                </el-option>
                            </el-select>
                        </el-col>


                        <el-col :span="2" v-if="item.name === 'input' || item.name === 'textarea'">
                            <el-select v-model="item.type" placeholder="类型" class="selector">
                                <el-option
                                        v-for="option in options_inputtype"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value">
                                </el-option>
                            </el-select>
                        </el-col>

                        <el-col :span="2" v-if="item.name === 'input' || item.name === 'textarea'">
                            <el-input v-model="item.placeholder" placeholder="place holder"></el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button-group>
                                <el-button @click="copySomething(forms.items, index1)" type="primary">复</el-button>
                                <el-button @click="deleteSelector(forms.items, index1)" type="danger">删</el-button>
                                <el-button @click="item.o = !item.o">{{item.o?'缩':'展'}}</el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                    <div v-if="item.o && (item.name === 'selector')" class="sub">
                        <el-row
                                v-for="(option, index2) in item.range" :gutter="3" :key="index2">
                            <el-col :span="5">
                                <el-input v-model="option.text" placeholder="选项内容"></el-input>
                            </el-col>
                            <el-col :span="3">
                                <el-input v-model="option.trigger" placeholder="触发器"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="deleteSelector(item.range, index2)">删除</el-button>
                            </el-col>
                        </el-row>
                        <el-button @click="newSelector(item.range)">创建新选项</el-button>
                    </div>
                    <div v-if="item.o && (item.name === 'rich-text')" class="sub">
                        <quill-editor v-model="item.text"
                                      class="quill-editor"
                                      ref="myQuillEditor"
                                      @blur="onEditorBlur($event)"
                                      @focus="onEditorFocus($event)"
                                      @ready="onEditorReady($event)"
                        ></quill-editor>
                    </div>
                    <div v-if="item.o && (item.name === 'checkbox')" class="sub">
                        <el-row
                                v-for="(option, index2) in item.values" :gutter="3" :key="index2">
                            <el-col :span="5">
                                <el-input v-model="option.text" placeholder="选项内容"></el-input>
                            </el-col>
                            <el-col :span="3">
                                <el-input v-model="option.trigger" placeholder="触发器"></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click="deleteSelector(item.values, index2)">删除</el-button>
                            </el-col>
                        </el-row>
                        <el-button @click="newSelector(item.values)">创建新选项</el-button>
                    </div>
                </div>
            </div>
        </div>
        <el-row class="ac-item" :gutter="5">
            <el-col :span="7">
                <el-dropdown @command="addNewItem" trigger="click">
                    <el-button type="primary">添加新题目</el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="0">文本框</el-dropdown-item>
                        <el-dropdown-item :command="1">选择器</el-dropdown-item>
                        <el-dropdown-item :command="2">富选择</el-dropdown-item>
                        <el-dropdown-item :command="3">多选框</el-dropdown-item>
                        <el-dropdown-item :command="4">富文本</el-dropdown-item>
                        <el-dropdown-item :command="5">图片上传</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            <el-col :span="5">
                <el-input v-model="forms.submit" placeholder="提交按钮"></el-input>
            </el-col>
            <el-col :span="8">
                <el-input v-model="forms.success" placeholder="提交后提示"></el-input>
            </el-col>
            <el-col :span="2">
                <el-button type="danger" @click="forms = anotherForms">清空</el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="danger" @click="saveForms">同步</el-button>
            </el-col>
        </el-row>
    </div>

</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor} from 'vue-quill-editor'

    export default {
        components: {
            quillEditor
        },
        props: {
            value: {type: String}
        },
        data() {
            return {
                editorOption: {/* quill options */},
                showvalue: false,
                opens: {},
                isChanged: false,
                options_show: [{value: true, label: '显示'}, {value: false, label: '隐藏'}],
                options_input: [{value: 'input', label: 'input'}, {value: 'textarea', label: 'textarea'}],
                options_inputtype: [{value: 'text', label: '文本'}, {value: 'number', label: '数值'},
                    {value: 'idcard', label: '身份证'}, {value: 'digit', label: '实数'}],
                options_important: [{value: true, label: '必填'}, {value: false, label: '选填'}],
                options_mode: [{value: 'time', label: '时间'}, {value: 'date', label: '日期'},
                    {value: 'region', label: '地点'}],
                forms: {
                    items: [],
                    submit: '',
                    success: ''
                },
                anotherForms: {
                    items: [],
                    submit: '',
                    success: ''
                },
                relatedForm: {
                    o: true,
                    show: true,
                    important: false,
                    title: '',
                    desc: ''
                },
                defaultForm: [{
                    name: 'input',
                    value: '',
                    type: 'text',
                    placeholder: '',
                }, {
                    name: 'selector',
                    value: 0,
                    range: [{text: '', trigger: ''}]
                }, {
                    name: 'other-selector',
                    mode: 'time',
                    value: '',
                }, {
                    name: 'checkbox',
                    value: '',
                    values: [{text: '', checked: false, trigger: ''}]
                }, {
                    name: 'rich-text',
                    show: true,
                    text: '',
                    o: false
                }, {
                    name: 'image',
                    value: ''
                }]
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

            copySomething(item, index) {
                let newitem = item[index]
                newitem.id = this.getNewId()
                item.push(newitem)
            },
            deleteSelector(item, index) {
                item.splice(index, 1)
            },
            getNewId() {
                let newId = 1
                if (this.forms.items)
                    this.forms.items.forEach(item => {
                        if (parseInt(item.id) >= newId) {
                            newId = parseInt(item.id) + 1
                        }
                    })
                return newId
            },
            newSelector(item) {
                item.push({text: '', trigger: ''})
            },
            addNewItem(type = 0) {
                type = parseInt(type)
                console.log('trigger: ' + type)
                if (type === 4)
                    this.forms.items.push({...this.defaultForm[type], id: this.getNewId()})
                else
                    this.forms.items.push({...this.relatedForm, ...this.defaultForm[type], id: this.getNewId()})
            },
            saveForms() {
                this.forms.items.sort((a, b) => a.id > b.id)
                this.isChanged = false
                this.$emit('update:value', JSON.stringify(this.forms))
            }

        },
        watch: {
            value: function () {
                if (this.value !== "" && this.value !== "{}" )
                    this.forms = JSON.parse(this.value)
                console.log('watched!')
                console.log(this.value)
                console.log(this.forms)
            }
        },
        mounted() {
            if (this.value !== "" && this.value === "{}" )
                this.forms = JSON.parse(this.value)
            console.log('mounted!')
            console.log(this.forms)
        }
    }
</script>

<style scoped>
    .ac-flex {
        display: flex;
    }

    .ac-item {
        margin: 10px;
    }

    .ac-page {
        border: 1px solid #e4e4e4;
        overflow: auto;
        height: 350px;
        margin-bottom: 10px;

    }

    .ac-form-container {
        margin: 0px;
    }

    .selector {
    }

    .sub {
        padding: 20px;
        border: 1px solid #c0ccda;
    }

    .footer {
        margin-bottom: 40px;
    }

</style>