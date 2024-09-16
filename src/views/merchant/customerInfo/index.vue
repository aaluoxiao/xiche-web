<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="queryParams.nickname" placeholder="请输入用户昵称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="queryParams.phone" placeholder="请输入电话" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择用户" clearable>
          <el-option v-for="dict in customer_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable v-model="queryParams.createTime" type="date" value-format="YYYY-MM-DD"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['merchant:customerInfo:add']"
        >新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['merchant:customerInfo:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['merchant:customerInfo:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="55" align="center" prop="id" />
      <el-table-column label="用户昵称" align="center" prop="nickname" />
      <el-table-column label="性别" align="center" width="100">
        <template #default="scope">
          <!-- 使用作用域插槽来访问当前行的数据 -->
          <!-- 根据gender的值来显示不同的文本 -->
          <span>{{ scope.row.gender == 1 ? '男' : (scope.row.gender == 2 ? '女' : '') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="头像" align="center" prop="avatarUrl" /> -->

      <el-table-column label="头像" align="center" width="120">
        <template #default="scope">
          <!-- 使用v-slot:default的简写形式#default -->
          <img :src="scope.row.avatarUrl" alt="用户头像" style="width: 40%; height: auto; border-radius: 50%;">
        </template>
      </el-table-column>


      <el-table-column label="电话" align="center" prop="phone" />



      <!-- <el-table-column label="状态" align="center" key="status">
        <template #default="scope">
          <CustomSwitch v-model="scope.row.status" active-value="1" inactive-value="0" />
        </template>
      </el-table-column> -->


      <el-table-column label="状态" align="center">
        <template #default="scope">
          <span v-if="scope.row.status == 1">正常</span>
          <span v-else-if="scope.row.status == 0">禁用</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['merchant:customerInfo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改用户列表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="customerInfoRef" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CustomerInfo">
import { changeUserStatus, listCustomerInfo, delCustomerInfo, updateCustomerInfo, getCustomerInfo } from "@/api/merchant/customerInfo";
import { onMounted } from 'vue';
import CustomSwitch from '@/components/CustomSwitch'
const { proxy } = getCurrentInstance();
const { customer_status } = proxy.useDict('customer_status');

const customerInfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    nickname: null,
    phone: null,
    status: null,
    createTime: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);


/** 用户状态修改  */
function handleStatusChange(row) {
  console.log("--------------")
  console.log(row.status)
  console.log("--------------")
  let text = row.status == "1" ? "启用" : "停用";



  proxy.$modal.confirm('确认要"' + text + '""' + row.nickname + '"用户吗?').then(function () {
    return changeUserStatus(row.id, row.status);
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status === "0" ? "1" : "0";
  });
};



/** 查询用户列表列表 */
function getList() {
  loading.value = true;
  listCustomerInfo(proxy.addDateRange(queryParams.value)
  ).then(response => {
    customerInfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    wxOpenId: null,
    nickname: null,
    gender: null,
    avatarUrl: null,
    phone: null,
    status: null,
    createTime: null,
    updateTime: null,
    isDeleted: null
  };
  proxy.resetForm("customerInfoRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加用户列表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCustomerInfo(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户列表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["customerInfoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCustomerInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCustomerInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除用户列表编号为"' + _ids + '"的数据项？').then(function () {
    return delCustomerInfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('merchant/customerInfo/export', {
    ...queryParams.value
  }, `customerInfo_${new Date().getTime()}.xlsx`)
}
getList();
</script>
