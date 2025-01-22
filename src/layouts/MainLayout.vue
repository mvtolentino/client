<template>
  <div class="q-pa-lg">
    <div style="display: flex; justify-content: end; align-items: center;">
      <q-btn 
        class="q-px-md"
        dense
        label="Create Customer" 
        color="primary"
        @click="openCreateCustomer" 
        />
    </div>
  </div>

  <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
    <q-markup-table 
        style="width: 100%;"
        bordered
        separator="cell"
    >
        <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody v-if="is_table_loading">
            <tr class="spinner-overlay">
                    <q-spinner
                        color="white"
                        size="3em"
                        :thickness="2"
                    />
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-for="(lists, index) in list" :key="index">
                <td class="text-center">{{ lists.id }}</td>
                <td class="text-center">{{ lists.first_name }}</td>
                <td class="text-center">{{ lists.last_name }}</td>
                <td class="text-center">{{ lists.email }}</td>
                <td class="text-center">{{ lists.contact }}</td>
                <td>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                        <q-btn color="secondary" icon="people" label="View" @click="viewCustomer(lists)" />
                        <q-btn color="amber" icon="edit" label="Edit" @click="editCustomer(lists)" />
                        <q-btn color="red" icon="delete" label="Delete" @click="openDeleteDialog(lists)" />
                    </div>
                </td>
            </tr>
        </tbody>
    </q-markup-table>
  </div>

    <div class="row justify-center q-mt-md pagination">
        <q-pagination
          @update:modelValue="paginate"
          v-model="pagination_info.page"
          :max="pagination_info.last_page"
          :max-pages="10"
          direction-links
          flat
          color="grey"
          active-color="primary"
        />
        <div class="per_page">
          <select
            @change="paginate"
            v-model="pagination_info.per_page"
            class="page-limit"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
    </div>

    <q-dialog v-model="is_customer_delete" transition-show="scale" transition-hide="scale">
      <q-card class="text-black" style="width: 400px">
        <q-card-section>
          <div class="text-h6">Delete Customer</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            Are you sure you want to delete the customer?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-primary">
            <q-btn flat label="Cancel" @click="cancelDelete" />
            <q-btn flat label="OK" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>


  <q-dialog v-model="is_create_customer">
    <create-customer @success-close="successClosed" />
  </q-dialog>

  <q-dialog v-model="is_customer_view">
    <ViewCustomer :view_list="view_list" />
  </q-dialog>

  <q-dialog v-model="is_customer_edit">
    <EditCustomer :customer_data="customer_data" @success-close="successClosed" />
  </q-dialog>
</template>

<style lang="scss" scoped src="./MainLayout.scss"></style>
<style scoped>
.per_page{
 position: absolute;
 right: 0px
}
.pagination{
  position: relative;
}
.loading {
    opacity: 0.6;
}
</style>

<script setup>
import CreateCustomer from 'src/pages/component/CreateCustomer.vue';
import ViewCustomer from 'src/pages/component/ViewCustomer.vue';
import EditCustomer from 'src/pages/component/EditCustomer.vue';
import { ref, onMounted, watch } from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar'

const $q = useQuasar()

const pagination_info = ref({
    page: 1,
    per_page: 10,
    last_page: 1
})

onMounted(() => {
  const per_page_item = localStorage.getItem('customer');
  pagination_info.value.per_page = per_page_item ? parseInt(per_page_item, 10) : 10;

  getList();
});

watch(
  () => pagination_info.value.per_page, 
  (newValue) => {
    localStorage.setItem('customer', newValue);
  }
);

const is_create_customer = ref(false)
const view_list = ref([])
const is_customer_view = ref(false)
const is_customer_edit = ref(false)
const customer_data = ref([])
const is_table_loading = ref(false)
const is_customer_delete = ref(false)
const delete_data = ref([])



//Open the create dialog
const openCreateCustomer = async () => {
    is_create_customer.value = !is_create_customer.value
}

//Closed the dialog
const successClosed = async () => {
    is_create_customer.value = false;
    is_customer_edit.value = false
    window.location.reload();
}

const list = ref([])

//List of the customers
const getList = async () => {
  try{
    is_table_loading.value = true
    const params = {
        page: pagination_info.value.page,
        per_page: pagination_info.value.per_page,
    }
    const res = await api.get('/customer', { params })
    list.value = res.data.data.data;

    pagination_info.value.per_page = res.data.data.per_page; 
    pagination_info.value.page = res.data.data.current_page;
    pagination_info.value.last_page = res.data.data.last_page;

    }catch(err){
        console.log(err)
    }finally{
        is_table_loading.value = false
    }
}

//View Customer
const viewCustomer = async (data) => {
    is_customer_view.value = true
    view_list.value = data
}

//Edit Customer
const editCustomer = async (data) => {
    is_customer_edit.value = true
    customer_data.value = data
}

//Delete Customer
const openDeleteDialog = (data) => {
  delete_data.value = data 
  is_customer_delete.value = true
}

const confirmDelete = async () => {
  try {
    const params = {
      id: delete_data.value.id,
      is_deleted: 1
    }

    await api.post('customer/delete', params)

    showNotif('Deleted Succssfully.')

    is_customer_delete.value = false 

    setTimeout(() => {
        window.location.reload();
    }, 2000)
  } catch (err) {
    console.log('err', err)
  }
}

const showNotif = (message) => {
    $q.notify({
        message: message,
        color: 'green',
        position: 'top',
        timeout: 3000
    })
}

const cancelDelete = () => {
  is_customer_delete.value = false 
}

//Pagination
const paginate = async (newPage) => {
  pagination_info.value.page = newPage; 
  await getList(); 
};

</script>

