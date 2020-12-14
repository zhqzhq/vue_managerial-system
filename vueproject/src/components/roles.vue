<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addroleVisible = true"
        >添加角色</el-button
      >
      <el-table :data="roleslist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removerightbyid(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removerightbyid(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i2) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removerightbyid(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showeditroleform(scope.row.id)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removerole(scope.row.id)"
            >
              删除</el-button
            >
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="showsetdata(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addroleVisible"
      width="50%"
      @close="addroleclose"
    >
      <el-form
        :model="addroleForm"
        ref="addroleref"
        label-width="80px"
        :rules="addrolerules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addroleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addroleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addroleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" :visible.sync="editroleVisible" width="50%">
      <el-form
        :model="editroleForm"
        ref="editroleref"
        label-width="80px"
        :rules="addrolerules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editroleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editroleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editroleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editrole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setrightVisible"
      width="50%"
      @close="setrightclose"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setrightVisible = false">取 消</el-button>
        <el-button type="primary" @click="editright">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleslist: [],
      setrightVisible: false,
      addroleVisible: false,
      editroleVisible: false,
      rightslist: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleid: "",
      addroleForm: {
        roleName: "",
        roleDesc: "",
      },
      editroleForm: {
        roleId: "",
        roleName: "",
        roleDesc: "",
      },
      addrolerules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getroleslist();
  },
  methods: {
    async getroleslist() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.roleslist = res.data;
      console.log(res.data);
    },
    removerightbyid(role, rightid) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightid}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          role.children = res.data;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //分配权限对话框方法
    async showsetdata(role) {
      this.roleid = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      console.log(res);
      this.rightslist = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.setrightVisible = true;
    },
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    setrightclose() {
      this.defKeys = [];
    },
    async editright() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idstr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleid}/rights`,
        { rids: idstr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改权限失败");
      }
      this.$message.success("修改权限成功！");
      this.getroleslist();
      this.setrightVisible = false;
    },
    async addrole() {
      this.$refs.addroleref.validate(async (valid) => {
        if (!valid) return this.$message.error("填写有误，请重新验证");
        const { data: res } = await this.$http.post("roles", this.addroleForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.addroleVisible = false;
        this.getroleslist();
      });
    },
    addroleclose() {
      this.$refs.addroleref.resetFields();
    },
    async removerole(roleinfoid) {
      const { data: res } = await this.$http.delete("roles/" + roleinfoid);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败！");
      }
      this.$message.success("删除角色成功");
      this.getroleslist();
    },
    async showeditroleform(roleinfoid) {
      const { data: res } = await this.$http.get("roles/" + roleinfoid);
      this.editroleForm = res.data;
      console.log(res.data);
      this.editroleVisible = true;
    },
    editrole() {
      this.$refs.editroleref.validate(async (valid) => {
        if (!valid) return this.$message.error("填写有误，请重新验证");
        const { data: res } = await this.$http.put(
          "roles/" + this.editroleForm.roleId,
          {
            roleName: this.editroleForm.roleName,
            roleDesc: this.editroleForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户信息失败！");
        }
        this.$message.success("修改成功！");
        this.editroleVisible = false;
        this.getroleslist();
      });
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px;
  border-bottom: antiquewhite 1px solid;
}
.el-row {
  border-bottom: #eee 1px solid;
  display: flex;
  align-items: center;
}
</style>