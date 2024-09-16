<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">

      <el-form-item label="选择经营方式" prop="operateType">
        <el-select v-model="queryParams.operateType" placeholder="请选经营方式" clearable>
          <el-option
            v-for="dict in operate_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择城市" prop="city">
        <el-select v-model="queryParams.regionId" placeholder="请选择城市" clearable>
          <el-option v-for="city in cityList" :key="city.id" :label="city.regionName" :value="city.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="站点名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入站点名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="站点负责人" prop="owner">
        <el-input v-model="queryParams.owner" placeholder="请输入站点负责人" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="站点电话" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入站点电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="站点状态" prop="openingHours">
        <el-select v-model="queryParams.openingHours" placeholder="请选择站点状态" clearable>
          <el-option v-for="dict in station_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['merchant:station:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['merchant:station:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['merchant:station:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['merchant:station:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="站点名称" align="center" prop="name" />
      <el-table-column label="经营方式" align="center" prop="operateType" :formatter="formatOperateType" />
      <el-table-column label="站点地址" align="center" prop="address" />
      <el-table-column label="站点负责人" align="center" prop="owner" />
      <el-table-column label="站点电话" align="center" prop="phoneNumber" />
      <el-table-column label="所属城市" align="center" prop="region.regionName" />
      <!-- <el-table-column label="设备数量" align="center" prop="deviceCount"></el-table-column> -->

      <el-table-column label="设备数量" align="center" prop="deviceCount">
        <template #default="scope">
          <span v-if="scope.row.deviceCount > 0" @click="handleClick(scope.row.name)"
            :style="{ cursor: 'pointer', color: 'blue' }">
            {{ scope.row.deviceCount }}
          </span>
          <span v-else :style="{ color: 'inherit' }">
            {{ scope.row.deviceCount }}
          </span>
        </template>
      </el-table-column>


      <el-table-column label="站点状态" align="center" prop="openingHours">
        <template #default="scope">
          <span :style="{ color: getStatusColor(scope.row.openingHours) }">
            <dict-tag :options="station_status" :value="scope.row.openingHours" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['merchant:station:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['merchant:station:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改站点列表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="stationRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="站点名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入站点名称" />
        </el-form-item>
        <el-form-item label="选择城市" prop="regionId">
        <el-select v-model="form.regionId" placeholder="请选择城市" clearable>
          <el-option v-for="city in cityList" :key="city.id" :label="city.regionName" :value="city.id"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="站点地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入站点地址" />
        </el-form-item>
        <el-form-item label="站点负责人" prop="owner">
          <el-input v-model="form.owner" placeholder="请输入站点负责人" />
        </el-form-item>
        <el-form-item label="站点电话" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入站点电话" />
        </el-form-item>
        <el-form-item label="站点状态" prop="openingHours">
          <el-select v-model="form.openingHours" placeholder="请选择站点状态">
            <el-option v-for="dict in station_status" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>


    <!-- 设备列表 -->
    <el-dialog title="设备列表" v-model="nameRefOpen" width="80%" append-to-body>
      <el-table :data="vmList">
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column label="设备类型" align="center" prop="deviceType" />
        <el-table-column label="设备编号" align="center" prop="deviceSn" />
        <el-table-column label="投放时间" align="center" prop="deploymentTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.deploymentTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="运营状态" align="center" prop="operatingStatus">
          <template #default="scope">
            <dict-tag :options="device_operate_status" :value="scope.row.operatingStatus" />
          </template>
        </el-table-column> -->
        <el-table-column label="设备状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <span :style="{ color: getStatusColor(scope.row.deviceStatus) }">
              {{ scope.row.deviceStatus === 1 ? '工作中' : '' }}
              {{ scope.row.deviceStatus === 2 ? '空闲中' : '' }}
              {{ scope.row.deviceStatus === 3 ? '已停用' : '' }}
            </span>
            <!-- <dict-tag :options="device_status" :value="scope.row.deviceStatus"/> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


  </div>
</template>

<script setup name="Station">
import { listStation, getStation, delStation, addStation, updateStation } from "@/api/merchant/station";
import { listRegion } from "@/api/merchant/region"
import { listDevice } from "@/api/merchant/device";
import { loadAllParams } from "@/api/page";
const { proxy } = getCurrentInstance();
const { operate_type } = proxy.useDict('operate_type');
const { station_status } = proxy.useDict('station_status');

const stationList = ref([]);
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
    name: null,
    address: null,
    owner: null,
    phoneNumber: null,
    openingHours: null,
  },
  rules: {
    name: [
      { required: true, message: "站点名称不能为空", trigger: "blur" }
    ],
    city: [
      { required: true, message: "城市名称不能为空", trigger: "blur" }
    ],
  }
});


function formatOperateType(row, column, cellValue, index) {
    // 根据cellValue（即operateType的值）返回相应的文本
    if (cellValue == 0) {
      return '自营';
    } else if (cellValue == 1) {
      return '加盟';
    }
    // 如果operateType的值不是0或1，可以选择返回一个默认值或null（这将不会显示任何内容）
    return '未知'; // 或者你可以根据需求返回null或''（空字符串）
  }


const nameRefOpen = ref(false);
const vmList = ref([]);

function handleClick(name) {
  const siteInfo = name;
  console.log(name);
  // this.$router.push({ name: 'device', params: { franchiseeAccount } });

  listDevice({ siteInfo }).then(response => {
    // franchiseeList.value = response.rows;
    vmList.value = response.rows;
    console.log(vmList);
    nameRefOpen.value = true;


  })
}


function getStatusColor(status) {
  switch (status) {
    case '已停用':
      return 'red';

    case 1:
      return 'green';
    case 2:
      return 'black';
    case 3:
      return 'red';
    default:
      return 'black'; // 默认颜色
  }
}

const { queryParams, form, rules } = toRefs(data);

/** 查询站点列表列表 */
function getList() {
  loading.value = true;
  listStation(queryParams.value).then(response => {
    stationList.value = response.rows;
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
    name: null,
    address: null,
    owner: null,
    phoneNumber: null,
    openingHours: null,
    createTime: null
  };
  proxy.resetForm("stationRef");
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
  title.value = "添加站点列表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getStation(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改站点列表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["stationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateStation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addStation(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除站点列表编号为"' + _ids + '"的数据项？').then(function () {
    return delStation(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('merchant/station/export', {
    ...queryParams.value
  }, `station_${new Date().getTime()}.xlsx`)
}

/**
 * 获取城市列表
 */
const cityList = ref([]);
function getCityList() {
   listRegion(loadAllParams).then(response => {
    cityList.value = response.rows;
    console.log("cityList" + JSON.stringify(cityList.value));
    // // 使用Set来存储唯一的city值
    // const uniqueCities = new Set(cityList.value.map(item => item.city));

    // // 如果你需要将Set转换回数组
    // cityList.value = Array.from(uniqueCities);
    // // 打印结果
    // console.log(cityList.value); // 输出: ["西安", "济南"]


  });
}
getCityList()


getList();
</script>
