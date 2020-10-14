<template>
  <div class="main">
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      class="user-layout-login"
      @submit="handleSubmit"
      @submit.native.prevent
    >
      <a-alert v-if="isLoginError" type="error" show-icon style="margin-bottom: 24px;" :message="errorMsg" />

      <a-form-model-item prop="account">
        <a-input v-model="form.account" size="large" type="text" placeholder="请输入帐户名">
          <a-icon slot="addonBefore" :component="userSvg" />
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="password">
        <a-input-password v-model="form.password" size="large" placeholder="请输入密码">
          <a-icon slot="addonBefore" :component="pawSvg" />
        </a-input-password>
      </a-form-model-item>

      <a-form-model-item prop="code">
        <a-input v-model.trim="form.code" type="text" size="large" placeholder="验证码">
          <a-icon slot="prefix" type="mail" />
        </a-input>
      </a-form-model-item>
      <img :src="verifyCode.image" height="40" alt="加载失败" title="点击刷新" @click="getCaptcha" />

      <a-form-model-item>
        <a-checkbox v-model="form.checked">自动登录</a-checkbox>
        <!-- <router-link :to="{ name: 'recover', params: { user: 'aaa' } }" class="forge-password" style="float: right;">
          忘记密码
        </router-link>-->
      </a-form-model-item>

      <a-form-model-item style="margin-top: 24px;">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >
          登录
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { password } from '@/utils/formRules'
import userSvg from '@/assets/icons/username.svg?inline'
import pawSvg from '@/assets/icons/password.svg?inline'
import { mapActions } from 'vuex'
import { timeFix, debounce } from '@/utils/util'
import setting from '@/config/settings'
import { getPublicKey, getCaptcha } from '@/api/system'
import { RSAencrypt } from '@/utils/jsencrypt'

export default {
  data() {
    this.userSvg = userSvg
    this.pawSvg = pawSvg
    return {
      isLoginError: false,
      errorMsg: '',
      form: {
        account: '',
        password: '',
        code: '',
        checked: false
      },
      state: {
        loginBtn: false
      },
      verifyCode: {
        image: '',
        key: ''
      },
      rules: {
        account: { required: true, message: '请输入帐户名', trigger: 'blur' },
        password,
        code: { required: true, message: '请输入验证码', trigger: 'blur' }
      }
    }
  },
  created() {
    this.getCaptcha()
    this.handleSubmit = debounce(this.handleSubmit)
    this.getCaptcha = debounce(this.getCaptcha, 300)
    this.form.password = this.$route.params?.password ?? ''
  },
  methods: {
    ...mapActions('user', ['Login', 'Logout']),
    getCaptcha() {
      this.form.captcha = ''
      getCaptcha().then(res => {
        this.verifyCode = res.data
      })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        valid && this.handleLogin()
      })
    },
    async handleLogin() {
      try {
        this.state.loginBtn = true

        const { data: key } = await getPublicKey()

        const { account, password, code, checked } = this.form

        const pwd = RSAencrypt(password, key) // 密码加密

        const res = await this.Login({ account, password: pwd, code, checked, key: this.verifyCode.key })

        this.loginSuccess(res)
      } catch (error) {
        this.requestFailed(error)
        this.state.loginBtn = false
      }
    },
    loginSuccess() {
      this.$router.push({ path: setting.path }).then(() => {
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 3000)
      })
      this.isLoginError = false
    },
    requestFailed(err) {
      console.error(err)
      this.errorMsg = err?.message ?? (err ? '系统开小差了，请联系管理人员！' : '您的网络不稳定，请检查后重试！')
      this.isLoginError = true
      this.isLoginError = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  /deep/ .ant-alert-message {
    display: block;
    .text-overflow-multi(2, #fff1f0);
  }
}
</style>
