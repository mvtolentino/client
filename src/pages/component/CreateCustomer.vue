<template>
    <q-card class="bg-white" style="width: 90% !important;">
        <q-card-section class="row items-center">
            <div class="text-h6">Create Customer</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <div class="q-pa-sm" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; gap: 10px;">
            <q-input style="width: 100%;" outlined v-model="form.first_name" label="First Name" />

            <q-input style="width: 100%;" outlined v-model="form.last_name" label="Last Name" />

            <q-input style="width: 100%;" outlined v-model="form.email" label="Email Address" />

            <q-input 
                style="width: 100%;" 
                type="tel" 
                outlined 
                v-model="form.contact" 
                label="Contact Number"
                :maxlength="11"
                @input="(e) => form.contact = e.target.value.replace(/\D/g, '')"
            />

            <div class="q-pa-xs" style="display: flex; justify-content: end; width: 100%;">
                <q-btn class="q-px-md" dense color="green" label="Save" @click="createCustomer" />
            </div>
        </div>

        <div v-if="is_loading" class="spinner-overlay">
            <q-spinner
                color="white"
                size="3em"
                :thickness="2"
            />
        </div>
    </q-card>


</template>

<style lang="scss" scoped src="./CreateCustomer.scss"></style>

<script setup>
import { 
    ref, 
    watch,
    defineEmits,
} from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar()

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  contact: ""
});

const is_loading = ref(false)

watch(
    () => form.value.contact,
    (newValue) => {
        form.value.contact = newValue.replace(/\D/g, "").slice(0, 11);
    }
);
const emit = defineEmits(['success-close']);

const showNotif = (message) => {
    $q.notify({
        message: message,
        color: 'green',
        position: 'top',
        timeout: 3000
    })
}

const createCustomer = async () => {
  try {
    is_loading.value = true
    await api.post('/customer/create', form.value);
    form.value = {
        first_name: "",
        last_name: "",
        email: "",
        contact: ""
    };

    showNotif('Customer Created Successfully')

    setTimeout(() => {
        emit('success-close');
    }, 1000)
  } catch (err) {
    console.log(err);
  }finally{
    is_loading.value = false
  }


};
</script>