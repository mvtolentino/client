<template>
    <q-card class="bg-white" style="width: 90% !important;">
        <q-card-section class="row items-center">
            <div class="text-h6">View Customer</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <div class="q-pa-sm" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; gap: 10px;">
            <q-input style="width: 100%;" outlined v-model="form.first_name" disable label="First Name" />

            <q-input style="width: 100%;" outlined v-model="form.last_name" disable label="Last Name" />

            <q-input style="width: 100%;" outlined v-model="form.email" disable label="Email Address" />

            <q-input 
                style="width: 100%;" 
                outlined 
                v-model="form.contact" 
                disable
                label="Contact Number"
            />
        </div>
    </q-card>
</template>

<script setup>
import { 
    ref, 
    defineProps
} from 'vue';

const props = defineProps({
  view_list: {
    type: Object,
    required: true,
  },
});

const form = ref({
  first_name: props.view_list.first_name,
  last_name: props.view_list.last_name,
  email: props.view_list.email,
  contact: props.view_list.contact,
});



</script>