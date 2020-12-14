<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="quertinfo.query"
            clearable
            @clear="getuserlist"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuserlist"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adduserVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userstatechange(scope.row)"
            ></el-switch
          ></template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showeditform(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeuser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="setright(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
</el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="quertinfo.pagenum"
        :page-sizes="[1, 2, 5, 9]"
        :page-size="quertinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="adduserVisible"
      width="50%"
      @close="adduserclose"
    >
      <el-form
        :model="adduserForm"
        :rules="adduserrules"
        ref="adduserref"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adduserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" type="password">
          <el-input v-model="adduserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="adduserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="adduserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adduserVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的弹出框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="edituserVisible"
      width="50%"
      @close="edituserclose"
    >
      <el-form
        :model="edituserForm"
        :rules="edituserrules"
        ref="edituserref"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="edituserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edituserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="edituserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edituserVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出框 -->
    <el-dialog title="分配权限" :visible.sync="setrightVisible" width="50%">
      <div>
        <p>当前的用户：{{ this.userright.username }}</p>
        <p>当前角色：{{ this.userright.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedrole" placeholder="请选择">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setrightVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkemail = (rule, value, callback) => {
      const regemail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regemail.test(value)) {
        return callback();
      }
      callback(new Error(`请输入合法的邮箱`));
    };
    var checkmobile = (rule, value, callback) => {
      const regmobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regmobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号"));
    };
    return {
      edituserVisible: false,
      quertinfo: {
        query: "",
        pagenum: 1,
        pagesize: 9,
      },
      userlist: [],
      total: 0,
      adduserVisible: false,
      adduserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      edituserForm: {
        username: "",
        email: "",
        mobile: "",
      },
      adduserrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      edituserrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      setrightVisible: false,
      userright: {},
      rolelist: [],
      selectedrole: "",
    };
  },
  created() {
    this.getuserlist();
  },
  methods: {
    async getuserlist() {
      const { data: res } = await this.$http.get("users", {
        params: this.quertinfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败！");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(this.userlist);
    },
    handleSizeChange(newsize) {
      console.log(newsize);
      this.quertinfo.pagesize = newsize;
      this.getuserlist();
    },
    handleCurrentChange(newpage) {
      console.log(newpage);
      this.quertinfo.pagenum = newpage;
      this.getuserlist();
    },
    async userstatechange(scoperow) {
      const { data: res } = await this.$http.put(
        `users/${scoperow.id}/state/${scoperow.mg_state}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("用户状态更改失败");
      }
      this.$message.success("用户状态更改成功");
    },
    adduserclose() {
      this.$refs.adduserref.resetFields();
    },
    edituserclose() {
      this.$refs.edituserref.resetFields();
    },
    adduser() {
      this.$refs.adduserref.validate(async (valid) => {
        if (!valid) return this.$message.error("填写有误，请重新验证");
        const { data: res } = await this.$http.post("users", this.adduserForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.adduserVisible = false;
        this.getuserlist();
      });
    },
    edituser() {
      this.$refs.edituserref.validate(async (valid) => {
        if (!valid) return this.$message.error("填写有误，请重新验证");
        const { data: res } = await this.$http.put(
          "users/" + this.edituserForm.id,
          {
            email: this.edituserForm.email,
            mobile: this.edituserForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户信息失败！");
        }
        this.edituserForm.email;
        this.$message.success("修改成功！");
        this.edituserVisible = false;
        this.getuserlist();
      });
    },
    removeuser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("users/" + id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getuserlist();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async showeditform(id) {
      this.edituserVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return;
        this.$message("获取用户信息失败！");
      }
      console.log(res);
      this.edituserForm = res.data;
    },
    async setright(userright) {
      this.userright = userright;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户权限列表失败！");
      }
      this.rolelist = res.data;
      this.setrightVisible = true;
    },
    async addrole() {
      if (!this.selectedrole) {
        return this.$message.error("请选择要分配的角色");
      }
      console.log(this.userright.id);
      console.log(this.selectedrole);

      const { data: res } = await this.$http.put(
        `users/${this.userright.id}/role`,
        {
          rid: this.selectedrole,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配新角色失败！");
      }
      this.$message.success("分配新角色成功！");
      this.getuserlist();
      this.setrightVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
</style>