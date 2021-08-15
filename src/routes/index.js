import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import AxiePriceTracer from '../components/AxiePriceTracer.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HelloWorld,
        meta: {
            title: '首页'
        }
    },
    {
        path: '/axie',
        name: 'axie',
        component: AxiePriceTracer,
        meta: {
            title: 'Axie Price Tracer'
        }
    },
    // {
    //     path: '/about',
    //     name: 'about',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    //     meta: {
    //         title: '关于'
    //     }
    // },
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

export default router