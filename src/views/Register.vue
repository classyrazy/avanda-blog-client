<template>
    <div class="wrapper">
        <h1>Sign Up</h1>
        <form class="form-wrapper" @submit.prevent="handleFormRequest()">
            <div class>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    class="input"
                    v-model="form.email.value"
                />
                <span class="error-text">{{ form.email.error }}</span>
            </div>
            <div class>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    class="input"
                    v-model="form.username.value"
                />
                <span class="error-text">{{ form.username.error }}</span>
            </div>
            <div class>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    class="input"
                    v-model="form.password.value"
                />
                <span class="error-text">{{ form.password.error }}</span>
            </div>
            <div class>
                <input
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    class="input"
                    v-model="form.confirmPassword.value"
                />
                <span class="error-text">{{ form.confirmPassword.error }}</span>
            </div>
            <div class="btn-wrapper">
                <button type="submit" class="btn">Sign up</button>
                <router-link to="/login">
                    <button type="button" class="btn">Login</button>
                </router-link>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import Graph from "../libs/avanda.ts"
import { createToast, withProps } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import ToastText from "../components/toast-text.vue";
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

let form = reactive({
    email: {
        value: null,
        error: null
    },
    username: {
        value: null,
        error: null
    },
    password: {
        value: null,
        error: null
    },
    confirmPassword: {
        value: null,
        error: null
    }
});
function validateForm() {
    let valid = true;
    Object.keys(form).forEach(key => {
        if (form[key].value === null) {
            form[key].error = "Please fill the form above";
            valid = false;
        }
    });
    return valid;
}
function clearError() {
    Object.keys(form).forEach(key => {
        form[key].error = null;
    });
}
let ServerForm = {}

function toServerForm() {
    Object.keys(form).forEach(key => {
        ServerForm[key] = form[key].value;
    });
    console.log(ServerForm);
}
async function handleFormRequest() {
    clearError()
    if(!validateForm()) return;
    toServerForm()
    try {
        let req = new Graph().service('User/signup')
        let user = await req.post(ServerForm)
        console.log(user.getData())
    } catch (error) {
        let errObj = error.getData()
        if (errObj) {
            Object.keys(errObj).forEach(key => {
                form[key].error = errObj[key]
            });
            return
        }
        console.log(error.getMsg())
        createToast(withProps(ToastText, { text: error.getMsg()?? "Error logging in check your network" }), {
            showIcon: "true",
            swipeClose: "true",
            type: "danger",
            transition: "bounce",
            position: "bottom-center"
        })
    }
}

</script>

<style scoped>
.wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 500px;
    margin: auto;
}
.form-wrapper {
    width: 100%;
    display: grid;
    grid-gap: 30px;
}
.input {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
}
.btn {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    max-width: 200px;
    cursor: pointer;
}
.btn-wrapper {
    display: flex;
    justify-content: space-between;
}
.error-text {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}
</style>