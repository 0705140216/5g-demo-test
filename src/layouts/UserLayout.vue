<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <span class="title">{{ config.title }}</span>
          </a>
        </div>
        <div class="desc">欢迎登陆</div>
      </div>

      <route-view></route-view>

      <div class="footer">
        <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2020 清大视光科技有限公司
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import config from '@/config/settings'

export default {
  name: 'UserLayout',
  components: { RouteView },
  data() {
    this.config = config
    return {}
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url(~@/assets/icons/login-back.svg) no-repeat 100% 100%;
    background-size: cover;
    padding: 110px 0 144px;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        height: 44px;
        line-height: 44px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }

        .title {
          font-size: 33px;
          color: #fff;
          font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 400;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 27px;
        color: #fff;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      min-width: 260px;
      width: 388px;
      margin: 0 auto;
      background: #fff;
      padding: 30px 30px 20px;
      border-radius: 8px;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
}
</style>
