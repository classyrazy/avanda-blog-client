<template>
    <div class="post-con" v-if="data">
        <div class="post-header">
            <button v-if="editable" @click="editPost" class="btn">Edit</button>
            <button v-if="editable" class="btn">Delete</button>
            <div class="post-meta">
                <img
                    :src="'http://192.168.43.215:4000/post-imgs/' + data.post_image"
                    :alt="data.title"
                />
                <h1 class="post-title">{{ data.title }}</h1>
                <h2>{{ data.author }}</h2>
            </div>
        </div>
        <div class="post-content">
            <div class="post-content-body">
                <!-- <p>{{ data.content }}</p> -->
                <div class="post-content ql-editor" v-html="data.content"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Graph from "../libs/avanda.ts"
import { computed, onMounted, ref } from "@vue/runtime-core"
import { createToast, withProps } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import ToastText from "../components/toast-text.vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
let router = useRouter();
let route = useRoute();
let data = ref(null)
let editable = ref(false)
function getImgUrl(path) {
    return images('./' + path + ".png")
}


async function checkIfValidPost() {
    try {
        let req = new Graph().service('Blog/checkIfValidPost')
        data.value = await (await req.post(route.params)).getData()
        let postImage = computed(() => {
            return "http://192.168.18.4:4000/" + data.value.post_image
        })
        checkIfPostIsownByUser()

    } catch (error) {
        if (error.getMsg()) {
            createToast(withProps(ToastText, { text: error.getMsg() ?? "Error in Post check your network" }), {
                showIcon: "true",
                swipeClose: "true",
                type: "danger",
                transition: "bounce",
                position: "bottom-center"
            })
        }
    }
}

async function checkIfPostIsownByUser() {
    console.log(data.value)
    if (!data.value) return
    try {
        let req = await new Graph().service('Blog/isOwnedByUser')
        let userData = await req.get()
        if (userData.getData() === data.value.user_id) {
            editable.value = true
        }

    } catch (error) {
        // if (error) {
        //     createToast(withProps(ToastText, { text: error ?? "Error in Post check your network" }), {
        //         showIcon: "true",
        //         swipeClose: "true",
        //         type: "danger",
        //         transition: "bounce",
        //         position: "bottom-center"
        //     })
        // }
        console.log(error)
    }
}
function editPost() {
    router.push({
        name: "Create Post",
        query: {
            edit: data.value.id + '-' + data.value.post_id
        }
    })
    console.log({"test":data.value})
}
onMounted(() => {
    if (route.params) {
        checkIfValidPost()
    }
})
console.log(route.params)
</script>

<style>
.post-con {
    width: 70%;
    margin: auto;
    background-color: #fff;
    border-radius: 20px;
}
.post-meta img {
    width: 100%;
    object-fit: cover;
    max-height: 250px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}
.post-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 10px;
    margin-left: 10px;
}
.quillWrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.ql-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
}
.ql-editor {
    padding: 20px 16px 30px;
}
pre.ql-syntax {
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
    padding: 1rem;
    border-radius: 10px;
}

pre {
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
}
.ql-editor .ql-video {
    display: block;
    margin: auto;
    /* max-width: 700px; */
}
iframe.ql-video {
    min-height: 300px;
    min-width: 500px;
    width: 100%;
}
</style>

