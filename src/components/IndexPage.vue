<template>
  <div class="content">
    <div v-show="inited&&showMenu" id="menuId">
      <a-button-group v-for="row in this.routes" :key="row[0].path">
        <a-button v-for="it in row" :key="it.path" :disabled="it.meta.auth&&!configQueryData[it.meta.auth]" ghost
                  style="width: 90px"
                  :type="currentRoutePath()===it.path?'primary':''" @click="toPage(it.path)">
          {{ it.meta.title }}
        </a-button>
      </a-button-group>
      <a-divider id="divider" style="margin:  0">
      </a-divider>
    </div>
    <router-view id="router-view" @inited="initedFunc"></router-view>
  </div>
</template>

<script>
import {CONFIG_QUERY, INITED} from "@/store/storeKeys";
import {mapGetters} from "vuex";

export default {
  components: {},
  props: {
    showMenu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      targetOffset: undefined,
      routes: [],
      span: 5
    }
  },
  computed: {
    ...mapGetters({'inited': INITED}),
    ...mapGetters({'configQueryData': CONFIG_QUERY})
  },
  created() {
    // console.log('getRoutes', this.$router.getRoutes())
    let routes = this.$router.getRoutes().filter(o => o.path && !o.meta.hide);
    let length = routes.length;
    for (let i = 0; i < length; i += 3) {
      this.routes.push(routes.slice(i, i + 3))
    }
  },
  mounted() {

  },
  methods: {
    initedFunc(inited) {
      this.toDivider()
    }
    ,
    toPage(route) {
      this.$router.push(route)
      this.toDivider()
    }
    ,
    toDivider() {
      setTimeout(() => {
        if (this.inited) {
          this.toLocal("divider")
        }
      }, 500)
    }
    ,
    toLocal(id) {
      //滚动到指定的元素
      let toElement = document.getElementById(id)
      if (toElement) {
        toElement.scrollIntoView(true)
      }
    },
    currentRoutePath() {
      return this.$router.currentRoute.path
    }
  },
  watch: {}
}
</script>
<style scoped>
#menuId {
  /*position: fixed;*/
  top: 0;
  width: 100vw;
  /*z-index: 2;*/
  background-color: rgba(0, 0, 0, 60%);
}

#router-view {
  margin-top: 3em;
}
</style>
