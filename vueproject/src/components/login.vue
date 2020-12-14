<template>
  <div class="login_container">
    <div class="login_box">
      <!--logo区域-->
      <div class="logo_box">
        <img src="../assets/logo.png" />
      </div>
      <!--表单区域-->
      <div class="form_box">
        <!--用户名-->
        <el-form
          :model="logindata"
          :rules="logindatarules"
          label-width="0px"
          class="login_form"
          ref="logindataref"
        >
          <el-form-item prop="username">
            <el-input v-model="logindata.username">
              <i slot="prefix" class="el-input__icon el-icon-user-solid"></i
            ></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input v-model="logindata.password" type="password">
              <i slot="prefix" class="el-input__icon el-icon-lock"></i
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btn">
            <el-button type="primary" round @click="login">登陆</el-button>
            <el-button type="info" round @click="logindataref">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 双向数据绑定
      logindata: {
        username: "admin",
        password: "123456"
      },
      // 表单的验证规则
      logindatarules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    logindataref() {
      // console.log(this);
      this.$refs.logindataref.resetFields();
    },
    login() {
      this.$refs.logindataref.validate(async zhq => {
        if (!zhq) return;
        const { data: res } = await this.$http.post("login", this.logindata);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登陆失败");
        this.$message.success("登陆成功");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    }
  }
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  background-color: #ffffff;
  height: 500px;
  width: 600px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}
.logo_box {
  height: 200px;
  width: 200px;
  border: 2px solid #eee;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}
.logo_box img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  border: 2px solid #eee;
}
.btn {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 50px;
  box-sizing: border-box;
}
</style>
