<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="orderNo">
        <el-input v-model="queryParams.orderNo" placeholder="请输入订单编号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="设备编号" prop="innerCode">
        <el-input v-model="queryParams.innerCode" placeholder="请输入设备编号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="洗车名称" prop="skuName">
        <el-input v-model="queryParams.skuName" placeholder="请输入洗车名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="城市名称" prop="regionName">
        <el-input v-model="queryParams.regionName" placeholder="请选择城市名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="加盟账号" prop="partnerId">
        <el-input v-model="queryParams.partnerId" placeholder="请输入加盟账号" clearable @keyup.enter="handleQuery" />
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

      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['merchant:userOrder:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['merchant:userOrder:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userOrderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" prop="id" />
      <el-table-column label="用户昵称" align="center" prop="nickname" />
      <el-table-column label="订单编号" align="center" prop="orderNo" />
      <el-table-column label="洗车名称" align="center" prop="skuName" />
      <el-table-column label="订单状态" align="center">
        <template v-slot="{ row }">
          <span v-if="row.status == 0">待支付</span>
          <span v-if="row.status == 1">已支付</span>
          <span v-if="row.status == 2">正在洗车</span>
          <span v-if="row.status == 3">洗车完成</span>
          <span v-if="row.status == 4">洗车失败</span>
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" prop="amount" />
      <!-- <el-table-column label="支付状态" align="center" prop="payStatus" /> -->
      <el-table-column label="支付状态" align="center">
        <template v-slot="{ row }">
          <span v-if="row.payStatus == 0">未支付</span>
          <span v-if="row.payStatus == 1">支付完成</span>
          <span v-if="row.payStatus == 2">退款中</span>
          <span v-if="row.payStatus == 3">退款完成</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handleDelete(scope.row)"
            v-hasPermi="['merchant:userOrder:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改订单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="userOrderRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="UserOrder">
import { listUserOrder, getUserOrder, delUserOrder, addUserOrder, updateUserOrder } from "@/api/merchant/userOrder";

const { proxy } = getCurrentInstance();

const userOrderList = ref([]);
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
    userId: null,
    orderNo: null,
    innerCode: null,
    skuName: null,
    status: null,
    payStatus: null,
    regionName: null,
    partnerId: null,
    createTime: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询订单列表 */
function getList() {
  loading.value = true;
  listUserOrder(queryParams.value).then(response => {
    userOrderList.value = response.rows;
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
    userId: null,
    orderNo: null,
    thirdNo: null,
    innerCode: null,
    channelCode: null,
    skuId: null,
    skuName: null,
    classId: null,
    status: null,
    amount: null,
    price: null,
    payType: null,
    payStatus: null,
    bill: null,
    addr: null,
    regionId: null,
    regionName: null,
    businessType: null,
    cancelDesc: null,
    openId: null,
    nodeId: null,
    nodeName: null,
    partnerId: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("userOrderRef");
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
  title.value = "添加订单";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getUserOrder(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改订单";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userOrderRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateUserOrder(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUserOrder(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除订单编号为"' + _ids + '"的数据项？').then(function () {
    return delUserOrder(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('merchant/userOrder/export', {
    ...queryParams.value
  }, `userOrder_${new Date().getTime()}.xlsx`)
}

getList();
</script>
