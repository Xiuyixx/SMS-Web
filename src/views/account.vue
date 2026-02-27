<template>
  <div id="Account">
    <van-nav-bar title="账户" left-text="" left-arrow @click-left="onClickLeft" />
    <van-contact-card type="add" @click="onAdd" add-text="添加账户" />

    <van-radio-group v-model="checked" v-for="(item, index) in accountList" :key="index">
      <van-cell
        center
        clickable
        :class="{ active: item.id === checked }"
        @click="ClickChecked(item.id)"
      >
        <template #title>
          <div class="accountInfo">
            <van-image round width="2.5rem" height="2.5rem" :src="defaultAvatar" />
            <span class="custom-title">{{ item.deviceName || item.serverUrl }}</span>
          </div>
        </template>

        <template #value>
          <div class="accountActions" @click.stop>
            <van-button size="small" type="primary" @click="onEdit(item.id)">编辑</van-button>
            <van-button size="small" type="danger" @click="onDelete(item.id)">删除</van-button>
            <van-button
              size="small"
              :type="item.id === checked ? 'success' : 'success'"
              :plain="item.id !== checked"
              :disabled="item.id === checked"
              @click="ChangeChecked(item.id)"
            >{{ item.id === checked ? '启用中' : '启用' }}</van-button>
          </div>
        </template>

      </van-cell>
      <div class="line"></div>
    </van-radio-group>

    <!-- 新增账户弹窗 -->
    <van-action-sheet v-model:show="show" title="新增账户" :style="{ height: '50%' }">
      <div id="AccountList">
        <van-image round width="100px" height="100px" :src="defaultAvatarLarge" />
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="deviceName"
              name="deviceName"
              label="设备名称"
              placeholder="设备名称（可选）"
              :rules="[]"
            />
            <van-field
              v-model="username"
              name="serverUrl"
              label="服务器"
              placeholder="服务器"
              :rules="[{ required: true, message: '请填服务器地址' }]"
            />
            <van-field
              v-model="password"
              :type="!passwordStatus ? 'password' : 'text'"
              :right-icon="passwordStatus ? 'eye' : 'closed-eye'"
              @click-right-icon="passwordStatus = !passwordStatus"
              name="sign"
              label="秘钥"
              placeholder="秘钥（可选）"
              :rules="[]"
            >
            </van-field>
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">确认添加</van-button>
          </div>
        </van-form>
      </div>
    </van-action-sheet>

    <!-- 修改账户弹窗 -->
    <van-action-sheet v-model:show="editShow" title="修改账户" :style="{ height: '50%' }">
      <div id="AccountList">
        <van-image round width="100px" height="100px" :src="defaultAvatarLarge" />
        <van-form @submit="onEditSubmit">
          <van-cell-group inset>
            <van-field
              v-model="deviceName"
              name="deviceName"
              label="设备名称"
              placeholder="设备名称（可选）"
              :rules="[]"
            />
            <van-field
              v-model="username"
              name="serverUrl"
              label="服务器"
              placeholder="服务器"
              :rules="[{ required: true, message: '请填服务器地址' }]"
            />
            <van-field
              v-model="password"
              :type="!passwordStatus ? 'password' : 'text'"
              :right-icon="passwordStatus ? 'eye' : 'closed-eye'"
              @click-right-icon="passwordStatus = !passwordStatus"
              name="sign"
              label="秘钥"
              placeholder="秘钥（可选）"
              :rules="[]"
            >
            </van-field>
          </van-cell-group>
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">确认修改</van-button>
          </div>
        </van-form>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { ref, onBeforeMount } from 'vue'
import axios from '@/axios/axios'
import { Notify, Dialog } from 'vant'
import store from '../store/index'
import Util from '@/util/SmsForwardUtil'
import defaultAvatar from '@/assets/remote/63e13682c4d10b45.jpg'
import { useRouter } from 'vue-router'

const defaultAvatarLarge = defaultAvatar

export default {
  name: 'Account',
  components: {},
  setup() {
    const router = useRouter()

    onBeforeMount(() => {
      accountList.value = JSON.parse(window.localStorage.getItem('accountList')) ?? []
      checked.value = JSON.parse(window.localStorage.getItem('ID'))
    })

    const checked = ref(null)
    const accountList = ref([])
    const deviceName = ref('')
    const username = ref('')
    const editId = ref(null)
    const password = ref('')
    const passwordStatus = ref(false)
    const show = ref(false)
    const editShow = ref(false)

    const onClickLeft = () => {
      // On desktop/browser, history may be empty; fallback to Settings.
      if (window.history.length > 1) {
        router.back()
      } else {
        router.push({ path: '/setting' })
      }
    }

    const onAdd = () => {
      show.value = true
      deviceName.value = ''
      username.value = ''
      password.value = ''
    }

    const ClickChecked = (id) => {
      ChangeChecked(id)
    }

    const ChangeChecked = (id) => {
      checked.value = JSON.parse(window.localStorage.getItem('ID'))
      if (id === checked.value) return

      return new Promise(() => {
        Dialog.confirm({ title: '确定切换账户吗？' })
          .then(() => {
            const changeThisSelect = accountList.value.find((item) => item.id == id)

            const timestamp = new Date().getTime()
            const serverUrl = (changeThisSelect.serverUrl || '').trim()
            const sign = (changeThisSelect.sign || '').trim()

            const data = {
              data: {},
              timestamp: timestamp,
              sign: Util.sisgn(timestamp, sign)
            }

            const url = serverUrl + '/config/query'

            axios
              .post(url, data)
              .then((response) => {
                if (response.data.code === 200) {
                  Util.serverUrl(serverUrl)
                  Util.sign(sign)

                  window.localStorage.setItem('ID', changeThisSelect.id)
                  store.dispatch('SAVE_SERVER_URL', serverUrl)
                  store.dispatch('SAVE_SIGN', sign)

                  checked.value = changeThisSelect.id
                  checked.value = JSON.parse(window.localStorage.getItem('ID'))

                  Notify({
                    type: 'success',
                    message: '账户切换成功,请手动刷新页面生效配置'
                  })
                } else {
                  Notify({ type: 'danger', message: response.data.msg })
                }
              })
              .catch(() => {
                Notify({
                  type: 'danger',
                  message: '服务器连接失败,请检查地址/CORS/HTTPS(混合内容)'
                })
              })
          })
          .catch(() => {})
      })
    }

    const onSubmit = (values) => {
      const ids = accountList.value.map((item) => item.id)
      const maxId = ids.length > 0 ? Math.max.apply(null, ids) : 0

      values.id = maxId + 1
      values.deviceName = (values.deviceName || '').trim()
      values.serverUrl = (values.serverUrl || '').trim()
      values.sign = (values.sign || '').trim()

      accountList.value.push(values)

      window.localStorage.setItem('accountList', JSON.stringify(accountList.value))
      Notify({ type: 'success', message: '账户添加成功' })
      show.value = false
    }

    const onEditSubmit = (values) => {
      values.id = editId
      values.deviceName = (values.deviceName || '').trim()
      values.serverUrl = (values.serverUrl || '').trim()
      values.sign = (values.sign || '').trim()

      const numID = accountList.value.map((item) => item.id).indexOf(editId.value)
      accountList.value.splice(numID, 1, values)

      window.localStorage.setItem('accountList', JSON.stringify(accountList.value))
      Notify({ type: 'success', message: '账户修改成功' })
      editShow.value = false
    }

    const onEdit = (id) => {
      editShow.value = true
      const obj = accountList.value.find((item) => item.id === id)
      deviceName.value = obj.deviceName || ''
      username.value = obj.serverUrl
      password.value = obj.sign
      editId.value = id
    }

    const onDelete = (id) => {
      if (id === JSON.parse(window.localStorage.getItem('ID'))) {
        return Notify({ type: 'warning', message: '不能删除当前启用项' })
      }

      Dialog.confirm({ title: '确定删除吗？' })
        .then(() => {
          const numID = accountList.value.map((item) => item.id).indexOf(id)
          accountList.value.splice(numID, 1)
          window.localStorage.setItem('accountList', JSON.stringify(accountList.value))
        })
        .catch(() => {})
    }

    return {
      onClickLeft,
      onAdd,
      checked,
      show,
      editId,
      editShow,
      deviceName,
      username,
      password,
      accountList,
      onSubmit,
      passwordStatus,
      ClickChecked,
      ChangeChecked,
      onEditSubmit,
      onEdit,
      onDelete,
      defaultAvatar,
      defaultAvatarLarge
    }
  }
}
</script>

<style scoped lang="less">
#Account {
  height: 100vh;
  overflow: auto;
  background-color: @dominant-tone;
}

::v-deep .van-contact-list__bottom {
  display: none;
}

.accountInfo {
  display: flex;
  align-items: center;
}

.custom-title {
  margin-left: 0.31rem;
}

.accountActions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
}

::v-deep(.van-cell.active) {
  background: #e8f7ee;
}

::v-deep(.van-cell.active .van-cell__title),
::v-deep(.van-cell.active .van-cell__value) {
  color: #1f7a3a;
}

.line {
  height: 2px;
  background: repeating-linear-gradient(
    245deg,
    #c18c8c 0,
    #966affc4 20%,
    #ac7bd1cc 0,
    #726e45 25%,
    #dfcdcd 0,
    #d919fa0d 45%,
    transparent 0,
    transparent 50%
  );
  background-size: 80px;
}

#AccountList {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: @dominant-tone;
}
</style>
