const Login = resolve => require(['./views/Login.vue'],resolve)
const NotFound = resolve => require(['./views/404.vue'],resolve)
const Home = resolve => require(['./views/Home.vue'],resolve)
const Main = resolve => require(['./views/Main.vue'],resolve)
const Users = resolve => require(['./views/nav1/Users.vue'],resolve)
const Articles = resolve => require(['./views/nav2/Articles.vue'],resolve)
const Submits = resolve => require(['./views/nav2/Submits.vue'],resolve)
const Activities = resolve => require(['./views/nav2/Activities.vue'],resolve)
const Activity = resolve => require(['./views/nav2/Activity.vue'],resolve)
const Matches = resolve => require(['./views/nav1/Matches.vue'],resolve)
const Banners = resolve => require(['./views/nav1/Banners.vue'],resolve)

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        redirect: '/users',
        name: '用户',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/users', component: Users, name: '用户管理' },
            { path: '/matches', component: Matches, name: '比赛管理' },
            { path: '/banners', component: Banners, name: '头图管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '内容',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/articles', component: Articles, name: '文章管理' },
            { path: '/activities', component: Activities, name: '活动管理' },
            { path: '/activity', component: Activity, name: '编辑活动', hidden: true },
            { path: '/submits', component: Submits, name: '回收报名问卷管理', hidden: true }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;