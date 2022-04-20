<template>
    <div>
        <h1 :class="loading ? 'fade-in-out' : ''">Verifying your mail...</h1>
        <h1 v-if="resent">Resent Verify Email!!</h1>

        <button class="btn" @click="handleResendEmail">Resend verify Email</button>
        <router-link to="/login"><button class="btn">To login</button></router-link>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from '@vue/runtime-core'
import { useRouter, useRoute } from 'vue-router'
import Graph from '../libs/avanda';
import { createToast, withProps } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import ToastText from "../components/toast-text.vue";
const router = useRouter()
const route = useRoute()
let tokenfromurl = computed(() => {
    return route.query.token
})
let loading = ref(true)
let hasExpired = ref(false)
let resent = ref(false)
async function handleVerifyemail(){
    if (tokenfromurl.value) {
        try {
            let req = new Graph().service('User/verifyEmail')
            let data = await (await req.post({ token: tokenfromurl.value })).getData()
            if (data) {
                console.log(data)
                loading.value = false
            }

        } catch (error) {
            loading.value = false
            if (error.getMsg() == "jwt expired") {
                hasExpired.value = true
                createToast(withProps(ToastText, { text: "Token Expired" }), {
                    showIcon: "true",
                    swipeClose: "true",
                    type: "danger",
                    transition: "bounce",
                    position: "bottom-center"
                })
            }
        }
    }
}
// async function handleResendEmail() {
//     if (localStorage.getItem("user-token") && hasExpired.value) {
//         try {
//             let req = new Graph().service('User/resendVerifyEmail')
//             let data = await (await req.post({ token: tokenfromurl.value })).getData()
//             if (data) {
//                 console.log(data)
//                 resent.value = true
//             }

//         } catch (error) {
//             resent.value = false
//             if (error.getMsg()) {
//                 hasExpired.value = true
//                 createToast(withProps(ToastText, { text: "Token Expired" }), {
//                     showIcon: "true",
//                     swipeClose: "true",
//                     type: "danger",
//                     transition: "bounce",
//                     position: "bottom-center"
//                 })
//             }
//         }
//     }else{
//         setTimeout(() => {
//             router.push({ name: "Login" })
//         }, 1000);
//     }
// }

onMounted(() => {
    handleVerifyemail()
    
})
</script>

<style scoped>
.fade-in-out {
    animation: fade-in-out 1s ease-in-out infinite alternate;
}
@keyframes fade-in-out {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
.btn {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    max-width: 200px;
}
</style>