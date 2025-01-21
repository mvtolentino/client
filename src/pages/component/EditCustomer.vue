<template>
    <q-card class="bg-white" style="width: 90% !important;">
        <q-card-section class="row items-center">
            <div class="text-h6">Edit Customer</div>
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
                <q-btn class="q-px-md" dense color="green" label="Update" @click="updateCustomer" />
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
    defineProps,
    defineEmits
} from 'vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const emit = defineEmits(['success-close']);
const is_loading = ref(false)
const $q = useQuasar()

const props = defineProps({
    customer_data: {
    type: Object,
    required: true,
  },
});

const form = ref({
  first_name: props.customer_data.first_name,
  last_name: props.customer_data.last_name,
  email: props.customer_data.email,
  contact: props.customer_data.contact,
});

const showNotif = (message) => {
    $q.notify({
        message: message,
        color: 'green',
        position: 'top',
        timeout: 3000
    })
}

const updateCustomer = async () => {
    try{
        is_loading.value = true

        const params = {
            id: props.customer_data.id,
            first_name: form.value.first_name,
            last_name: form.value.last_name,
            email: form.value.email,
            contact: form.value.contact,
        };

        await api.put('customer/update', params);
        showNotif('Customer updated successfully.')

        setTimeout(() => {
            emit('success-close');
        }, 1000)
    }catch(err){
        console.log('err', err)
    }finally{
        is_loading.value = false
    }
}
</script>