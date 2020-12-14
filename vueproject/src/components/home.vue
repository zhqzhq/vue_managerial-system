<template>
  <el-container class="homecontainer">
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isclosemenu ? '64px' : '200px'">
        <div class="closemenu" @click="iscollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isclosemenu"
          :collapse-transition="false"
          router
          :default-active="activepath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="cloosemenu('/' + subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconObj: {
        125: "el-icon-user",
        103: "el-icon-coordinate",
        101: "el-icon-goods",
        102: "el-icon-document",
        145: "el-icon-monitor",
      },
      isclosemenu: false,
      activepath: "",
    };
  },
  created() {
    this.getmunelist();
    this.activepath = window.sessionStorage.getItem("activepath");
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getmunelist() {
      const { data: res } = await this.$http.get("menus");
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("获取菜单数据失败");
      this.menulist = res.data;
    },
    iscollapse() {
      this.isclosemenu = !this.isclosemenu;
    },
    cloosemenu(activepath) {
      window.sessionStorage.setItem("activepath", activepath);
      this.activepath = activepath;
    },
  },
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: aliceblue;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.homecontainer {
  height: 100%;
}
.closemenu {
  color: #fff;
  text-align: center;
}
</style>
