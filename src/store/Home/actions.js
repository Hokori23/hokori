import mdui from 'mdui'
var getPost = function({
  commit,
  state
}, event) {
  if (!state.load) {
    commit('changeLoad', true);
    event.$axios({
      methods: 'get',
      url: '/public/post.json',
      timeout: 5000,
      data: {
        page: event.currentPage
      }
    }).then(function(res) {
      event.$store.commit('Home/changePost', res.data.data.post);
      // if (event.$store.state.Home.load && event.$route.name === 'Home') {
      //   mdui.snackbar({
      //     message: event.$t('post.refresh'),
      //     timeout: '300',
      //     position: 'right-bottom'
      //   })
      // }
    }).catch(function(err) {
      console.log(err)
      if (event.$store.state.Home.load && event.$route.name === 'Home') {
        mdui.snackbar({
          message: err,
          timeout: '2000',
          position: 'right-bottom'
        })
      }
    }).finally(() => {
      event.$store.commit('Home/changeLoad', false)
      event.load = false;
    })
  }
}

var newPost = function({
  commit,
  state
}, event) {
  if (!state.load) {
    commit('changeLoad', true);
    event.$axios({
      methods: 'get',
      url: '/public/post.json',
      data: {
        account:event.$store.state.User.account,
        postTitle: event.title,
        postContent: event.content
      },
      timeout: 5000,
    }).then(function(res) {
      console.log(res)
      //成功则跳转至新帖子
    }).catch(function(err) {
      if (event.$store.state.Home.load && event.$route.name === 'NewPost') {
        mdui.snackbar({
          message: err,
          timeout: '2000',
          position: 'left-bottom'
        })
      }
    }).finally(() => {
      event.$store.commit('Home/changeLoad', false)
    })
  }
}

var getSinglePost = function({
  commit,
  state
}, event) {
  if (!state.load) {
    commit('changeLoad', true);
    event.$axios({
      methods: 'get',
      url: '/public/singlePost.json',
      data: {
        postID: event.$route.params.postID,
        page: event.currentPage
      },
      timeout: 5000,
    }).then(function(res) {
      event.$store.commit('Home/changeSinglePost', res.data)
      // if (event.$store.state.Home.load && event.$route.name === 'Post') {
      //   mdui.snackbar({
      //     message: event.$t('post.refresh'),
      //     timeout: '300',
      //     position: 'right-bottom'
      //   })
      // }
    }).catch(function(err) {
      if (event.$store.state.Home.load && event.$route.name === 'Post') {
        mdui.snackbar({
          message: err,
          timeout: '2000',
          position: 'left-bottom'
        })
      }
    }).finally(() => {
      event.$store.commit('Home/changeLoad', false);
      event.load = false;
    })
  }
}

export {
  getPost,
  newPost,
  getSinglePost
}
