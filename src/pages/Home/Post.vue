<template>
  <section id='home__post' v-if="post" class='page footer comment-footer'>
    <van-pull-refresh v-model="load" :head-height="0" @refresh="refresh" success-duration=0 pulling-text=" "
      loosing-text=" " loading-text=" " success-text=" ">
      <div class="post--card post--poster mdui-ripple" @click.stop='commentFocus()'>
        <!-- 卡片头部，包含头像、标题、副标题 -->
        <div class="mdui-card-header" @click.stop='profile(post.nickName)'>
          <img class="mdui-card-header-avatar" :src="post.avatarURL" @error="imgErr($event)" />
          <div class="mdui-card-header-title">
            {{post.nickName}}
            <span class='mdui-text-color-theme' :class="{'mdui-text-color-theme-accent':$store.state.Setting.darkMode}">
              {{post.postTime}}
            </span>
          </div>
          <div class="mdui-card-header-subtitle">{{post.school}} {{post.majority}} {{post.grade}}级
          </div>
        </div>

        <!-- 卡片的内容 -->
        <div class="mdui-card-content post-content text">{{post.postContent}}</div>
        <div class='mdui-divider'></div>
      </div>


      <!-- 卡片头部，包含头像、标题、副标题 -->
      <div class="post--card mdui-ripple" v-for='(item,index1) of post.reply' @click.stop='commentFocus(index1)'>
        <div class="mdui-card-header" @click.stop='profile(item.nickName)'>
          <img class="mdui-card-header-avatar" :src="item.avatarURL" @error="imgErr($event)" />
          <div class="mdui-card-header-title">
            {{item.nickName}}
            <span class='mdui-text-color-theme' :class="{'mdui-text-color-theme-accent':$store.state.Setting.darkMode}">{{item.replyTime}}
            </span>
          </div>
          <div class="mdui-card-header-subtitle">{{item.school}} {{item.majority}} {{item.grade}}级
          </div>
        </div>


        <!-- 卡片的内容 -->
        <div class="mdui-card-content post-content text">{{item.postContent}}</div>





        <!-- children -->
        <div class='post--children' v-if='commentLength(item.children)'>
          <div class='mdui-ripple' v-for="(child,index2) of item.children" @click.stop='commentFocus(index1,index2)'
            v-if='index2<3'>
            <!-- 卡片的内容 -->
            <div class="mdui-card-content post-content text" :id="`comment-${index1}-${index2}`">
              <a href='#' class='mdui-text-color-theme' :class="{'mdui-text-color-theme-accent':$store.state.Setting.darkMode}"
                @click.stop.prevent='profile(child.nickName)'>
                {{child.nickName}}
              </a>
              <a href='#' v-if="child.target" class='mdui-text-color-theme' :class="{'mdui-text-color-theme-accent':$store.state.Setting.darkMode}"
                @click.stop.prevent='profile(child.target)'>
                @{{child.target}}
              </a> :
              {{child.postContent}}
            </div>
          </div>
          <div class='mdui-card-content post-content text mdui-ripple' v-if='commentLength(item.children)>3'>
            <a href='#' class='mdui-text-color-theme' :class="{'mdui-text-color-theme-accent':$store.state.Setting.darkMode}"
              @click.stop.prevent='more()'>
              共{{item.children.length}}条回复
            </a>
          </div>
        </div>
        <div class='mdui-divider'></div>
      </div>
      <div class='post--comment mdui-color-theme-200'>
        <div class="mdui-textfield">
          <!-- <a class='mdui-btn mdui-btn-icon'> 发送评论按钮-->
          <i class="mdui-icon material-icons mdui-btn-icon mdui-ripple">&#xe163;</i>
          <!-- </a> -->
          <input id='comment-input' class="mdui-textfield-input mdui-text-color-theme" type="text" :placeholder="$t('post.message')" />
        </div>
      </div>
    </van-pull-refresh>

    <van-pagination v-model="currentPage" :total-items="totalReply" :show-page-size="5" force-ellipses class='mdui-text-color-theme'
      v-if="post" />
  </section>
</template>

<script>
  export default {
    name: 'post',
    computed: {
      post() {
        return this.$store.state.Home.singlePost || false
      },
      input() {
        return document.getElementById('comment-input');
      },
      commentLength() {
        return function(e) {
          if (e) {
            return e.length
          }
        }
      }
    },
    methods: {
      imgErr(e) { //错误图片处理
        e.target.src = './statics/icons/avatar-fill.png';
        e.onerror = null;
      },
      commentFocus() {
        if (arguments.length === 1) {
          /*************NOW************/
        }
        console.log('comment')
        for (let i of arguments) {
          console.log(i)
        }
        this.input.focus();
      },
      refresh() {
        this.$store.dispatch('Home/getSinglePost', this)
      },
      profile(e) {
        this.$router.push(`/profile/${e}`);
      },
      more() {
        console.log('more')
      }
    },
    data() {
      return {
        fold: 0,
        load: false,
        currentPage: 1,
        totalReply: 1,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        //改变顶部title
        vm.$store.commit('changeTitle', vm.$route.params.postTitle)

        //修改组件状态
        vm.$store.commit('Display/fab', false)
        vm.$store.commit('Display/searchBar', false)
        vm.$store.commit('Display/refresh', true)
        vm.$store.commit('Display/nav', false)

        //获取帖子数据
        vm.$store.dispatch('Home/getSinglePost', vm)
      })
    },
    beforeRouteUpdate(to, from, next) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
    },
    // beforeRouteLeave(to, from, next) {
    //   //保存本页滚动位置
    //   const $content = document.querySelector('html');
    //   const scrollTop = $content ? $content.scrollTop : 0;
    //   from.meta.scrollTop = scrollTop;
    //   next()
    // },
  }
</script>

<style scoped>
  ::selection {
    background-color: #009688;
    color: #fff;
  }

  .mdui-card-header-title {
    display: flex;
    justify-content: space-between;
  }

  .mdui-card-header-title>span {
    font-size: 11px;
    font-weight: normal;
  }

  .mdui-card-content {
    padding: 0px 17px;
    line-height: 24px;
  }

  .card-bottom {
    display: flex !important;
    justify-content: flex-end
  }

  .post--card {
    max-width: 500px;
    margin: 0 auto;
    position: relative;
  }

  .mdui-divider {
    margin-top: 16px;
  }

  .card-bottom {
    margin: 5px 0;
    display: flex;
    justify-content: flex-end;
    font-size: 11px;
  }

  .mdui-theme-layout-dark .post--children {
    background-color: rgba(255, 255, 255, .07);
  }

  .post--children {
    box-sizing: border-box;
    margin: 3px 15px 3px 51px;
    padding: 8px 13px;
    background-color: rgba(0, 0, 0, .07);
  }

  .post--children .mdui-card-content {
    padding: 0 10px 0 0;
  }

  .post-content {
    cursor: text !important;
  }

  .comment-footer.footer {
    padding-bottom: calc(40px + 60px);
  }

  .comment-footer.footer:after {
    bottom: 60px;
    line-height: 40px;
    height: 40px;
  }

  .mdui-theme-layout-dark .post--comment {
    color: #fff !important;
    background-color: #212121 !important;
  }

  .post--comment {
    z-index: 999;
    position: fixed;
    bottom: 0px;
    height: 60px;
    box-sizing: border-box;
    padding: 10px 0;
    width: 100%;
  }

  .post--comment .mdui-textfield {
    padding-top: 0;
    display: flex;
    justify-content: flex-end;
  }

  .post--comment .mdui-icon {
    right: 8px;
  }

  .post--comment .mdui-textfield-input {
    margin-right: 56px;
  }

  a {
    text-decoration: none;
  }
</style>
