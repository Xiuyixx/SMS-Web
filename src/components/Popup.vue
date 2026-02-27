<template>
  <div id="login">
    <van-popup
      :transition-appear="true"
      v-model:show="show"
      :round="true"
      closeable
      :style="{
        width: 'min(520px, 95vw)',
        maxHeight: '90vh',
        padding: '16px 16px 8px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }"
    >
      <van-image
        round
        fit="cover"
        width="100px"
        height="100px"
        :src="logo"
      />
      <van-form class="form" @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="deviceName"
            name="deviceName"
            label="设备名称"
            placeholder="设备名称（可选）"
            :rules="[]"
          />
          <van-field v-model="username" name="serverUrl" label="服务器" placeholder="服务器"
            :rules="[{ required: true, message: '请填服务器地址' }]" />
          <van-field v-model="password" :type="!passwordStatus ? 'password' : 'text'"
            :right-icon="passwordStatus ? 'eye' : 'closed-eye'" @click-right-icon="passwordStatus = !passwordStatus"
            name="sign" label="秘钥" placeholder="秘钥（可选）" :rules="[]">
          </van-field>
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
<script>
import { ref, computed } from 'vue';
import logo from '@/assets/remote/63e13682c4d10b45.jpg';
// 导入Axios
import axios from '@/axios/axios'
import { Notify } from 'vant';
import store from '../store/index'
import { useRouter } from 'vue-router'
import Util from "@/util/SmsForwardUtil";
export default {
  name: "Popup",
  setup() {
    const deviceName = ref('');
    const username = ref('');
    const password = ref('');
    const passwordStatus = ref(false);
    const router = useRouter();
    const show = computed(() => {
      return (store.state.loginPopup)
    });
    const onSubmit = (values) => {
      const serverUrl = (values.serverUrl || '').trim();
      const sign = (values.sign || '').trim();
      const deviceName = (values.deviceName || '').trim();

      let timestamp = new Date().getTime();
      let data = {
        "data": {},
        "timestamp": timestamp,
        "sign": Util.sisgn(timestamp, sign)
      }
      let url = serverUrl + '/config/query'
      axios.post(url, data).then(response => {
        if (response.data.code === 200) {
          router.push('/phone')
          Notify({ type: 'success', message: '获取配置成功' });
          Util.serverUrl(serverUrl)
          Util.sign(sign)
          values.id = 1
          values.serverUrl = serverUrl
          values.sign = sign
          values.deviceName = deviceName
          let AccountList = []
          AccountList.push(values)
          let locAccountList = JSON.stringify(AccountList)
          window.localStorage.setItem('accountList', locAccountList)
          window.localStorage.setItem('ID', values.id)
          store.dispatch('SAVE_SERVER_URL', serverUrl)
          store.dispatch('SAVE_SIGN', sign)
          show.value = false;
        } else {
          Notify({ type: 'danger', message: response.data.msg });
        }
      }).catch(response => {
        Notify({ type: 'danger', message: '服务器连接失败,请检查地址' });
      })
    };
    return {
      show,
      deviceName,
      username,
      password,
      onSubmit,
      passwordStatus,
      logo
    };
  },
};
</script>
<style lang="less" scoped>
#login {
  .van-popup {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: @dominant-tone;
  }

  .form {
    width: 100%;
    margin-top: 12px;
  }

  ::v-deep(.van-cell-group) {
    width: 100%;
  }

  ::v-deep(.van-image) {
    flex: 0 0 auto;
  }

  ::v-deep(.van-image__img) {
    width: 100px !important;
    height: 100px !important;
    object-fit: contain;
  }
}
</style>
