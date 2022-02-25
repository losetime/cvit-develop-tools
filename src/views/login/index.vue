<template>
  <div class="login-wrapper">
    <div class="header-wrap">
      <img src="../../assets/images/login/logo.png" alt="国家电网" />
    </div>
    <div class="container-wrap">
      <div class="left-image-wrap">
        <img src="../../assets/images/login/login-left-img.png" alt="logo" />
      </div>
      <div class="form-wrap">
        <div class="title-wrap">
          <p class="title-text">CVIT开发管理系统</p>
          <p class="subtitle-text">CVIT DEVELOPMENT MANAGEMENT SYSTEM</p>
        </div>
        <a-form :label-col="labelCol">
          <a-form-item has-feedback v-bind="validateInfos.userName">
            <a-input v-model:value="loginInfo.userName" placeholder="请输入用户名" @keyup.enter="loginSubmit">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item has-feedback v-bind="validateInfos.passWord">
            <a-input
              v-model:value="loginInfo.passWord"
              type="password"
              placeholder="请输入密码"
              @keyup.enter="loginSubmit"
            >
              <template #prefix>
                <UnlockOutlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="code" v-bind="validateInfos.code">
            <a-row type="flex" justify="space-between" align="middle">
              <a-col :span="16">
                <a-input v-model:value="loginInfo.code" placeholder="请输入校验码" @keyup.enter="loginSubmit">
                  <template #prefix>
                    <UnlockOutlined />
                  </template>
                </a-input>
              </a-col>
              <a-col :span="6">
                <div class="login-code">
                  <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click.prevent="loginSubmit" :loading="loginLoading" block>登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { Form } from 'ant-design-vue'
import { UserOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import { loginRules } from '@/validator/login'
import { apiGetCodeImage, apiSubmitLogin } from '@/service/api/login'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
// import { getRouters } from '@/router'

const labelCol = { span: 0 }

const router = useRouter()

const store = useStore()

const loginInfo = reactive({
  userName: '',
  passWord: '',
  code: '',
  uuid: '',
})

const codeUrl = ref<string>('')

const loginLoading = ref<boolean>(false)

const useForm = Form.useForm

const { validate, validateInfos } = useForm(loginInfo, loginRules)

onMounted(() => {
  getCode()
})

const getCode = async () => {
  const { code, data } = await apiGetCodeImage()
  if (code === 20000) {
    codeUrl.value = 'data:image/gif;base64,' + data.img
    loginInfo.uuid = data.uuid
  }
}

const loginSubmit = () => {
  validate().then(async () => {
    loginLoading.value = true
    const { code, data } = await apiSubmitLogin({
      username: loginInfo.userName,
      password: loginInfo.passWord,
      code: loginInfo.code,
      uuid: loginInfo.uuid,
    })
    loginLoading.value = false
    if (code === 20000) {
      store.commit('SET_TOKEN', data.token)
      localStorage.setItem('ymToken', data.token)
      // await getRouters()
      // 获取路由第一个
      const firstLevelRoute = router.getRoutes().filter((val) => val.meta.level === 1)
      const routerName = firstLevelRoute[0].name
      router.replace({ name: routerName })
    } else {
      getCode()
    }
  })
}
</script>

<style lang="less" scoped>
.login-wrapper {
  .header-wrap {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    img {
      margin-left: 20px;
    }
  }
  .container-wrap {
    width: 100%;
    height: calc(100vh - 56px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: radial-gradient(#286062, #132d2e);
    .left-image-wrap {
      width: 40%;
      img {
        width: 100%;
      }
    }
    .form-wrap {
      min-width: 428px;
      height: 536px;
      padding: 65px 49px;
      margin: 0 10% 0 5%;
      border-radius: 10px;
      background: #ffffff;
      .title-wrap {
        margin-bottom: 44px;
        p {
          margin: 0;
        }
        .title-text {
          font-size: 26px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #015c61;
        }
        .subtitle-text {
          margin-top: 7px;
          font-size: 11px;
          font-family: Arial;
          font-weight: 400;
          color: #b5b5b5;
        }
      }
      .login-tip {
        font-size: 13px;
        text-align: center;
        color: #bfbfbf;
      }
      .login-code {
        height: 32px;
        .login-code-img {
          height: 32px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
