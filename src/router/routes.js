const routes = [{
    //Main
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        path: '',
        name: 'Home',
        meta: {
          index: 0,
          keepAlive: true,
          scrollTop: 0,
        },
        component: () => import('pages/Home/Home.vue'),
      }, {
        path: 'newpost',
        name: 'NewPost',
        meta: {
          index: 1,
          keepAlive: true,
        },
        component: () => import('pages/Home/NewPost.vue'),
      }, {
        path: 'post/:postID/:postTitle',
        name: 'Post',
        meta: {
          index: 2,
          keepAlive: false,
        },
        component: () => import('pages/Home/Post.vue'),
      },
      {
        path: 'friend',
        meta: {
          index: 0,
          keepAlive: true,
          scrollTop: 0,
        },
        component: () => import('pages/Friend/Friend.vue'),
      }, {
        path: 'message',
        meta: {
          index: 0,
          keepAlive: true,
          scrollTop: 0,
        },
        component: () => import('pages/Message/Message.vue'),
      },
      //User
      {
        path: 'user',
        meta: {
          index: 999,
        },
        component: () => import('pages/User/User.vue'),
      }, {
        path: 'profile/:nickName',
        meta: {
          index: 1000,
        },
        component: () => import('pages/User/Profile.vue')
      },
      //Setting
      {
        path: 'settings',
        meta: {
          index: 999,
        },
        component: () => import('pages/Settings/Settings.vue'),
      }, {
        path: 'settings/language',
        meta: {
          index: 1000
        },
        component: () => import('pages/Settings/Language.vue')
      }, {
        path: 'settings/theme',
        meta: {
          index: 1000
        },
        component: () => import('pages/Settings/Theme.vue')
      }, {
        path: 'settings/theme/themecolor',
        meta: {
          index: 1001
        },
        component: () => import('pages/Settings/ThemeColor.vue')
      }, {
        path: 'settings/theme/accentcolor',
        meta: {
          index: 1001
        },
        component: () => import('pages/Settings/AccentColor.vue')
      }
    ]
  },
  //Login
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{
      path: '',
      meta: {
        index: 0,
      },
      component: () => import('pages/Login/Login.vue')
    }, {
      path: 'register',
      meta: {
        index: 1,
      },
      component: () => import('pages/Login/Register.vue'),
    }, {
      path: 'forgot',
      meta: {
        index: 1,
      },
      component: () => import('pages/Login/Forgot.vue')
    }]
  },
  {
    path: '/index.html',
    component: () => import('pages/fakeIndex.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
