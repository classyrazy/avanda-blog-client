<template>
    <div>
        <div class v-if="showVerifiedMsg">
            <h1>Your email has not been verified you won't be able to use all the features of avanda blog</h1>
            <button class="btn" @click="resendVerifyEmail">Resend Verify Email</button>
            <h3 v-if="resent">Email resent check your mail</h3>
        </div>
        {{ showVerifiedMsg }}
        <div class="posts-wrapper" v-if="posts">
            <div class="post-item" v-for="(post, idx) in posts" :key="idx" @click="handlePostClick(post)">
                <div class="post-item-header">
                    <h1>{{ post.author }}</h1>
                    <h3>{{ post.title }}</h3>
                    <img :src="post.post_image" class="post-image" v-if="post.post_image" alt />
                </div>
                <div class="post-item-body">
                    <!-- <p>{{post.body}}</p> -->
                </div>
            </div>
        </div>
        <h2 v-else>Posts are loading</h2>
    </div>
</template>

<script setup lang="ts">
import Graph from "../libs/avanda.ts"
import { onMounted, ref } from "@vue/runtime-core"
import { createToast, withProps } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import ToastText from "../components/toast-text.vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

let showVerifiedMsg = ref(false);
let resent = ref(false);
let posts = ref(null);
let router = useRouter();
let route = useRoute();
let data = ref(null)
async function checkUserIsVerified() {
    try {
        let req = new Graph().service('User/checkIfVerified')
        data = await (await req.get()).getData()

    } catch (error) {
        if (error.getMsg() == "not verified") {
            showVerifiedMsg.value = true
        } else {
            createToast(withProps(ToastText, { text: error.getMsg() ?? "Error logging in check your network" }), {
                showIcon: "true",
                swipeClose: "true",
                type: "danger",
                transition: "bounce",
                position: "bottom-center"
            })
        }


    }
}   
async function resendVerifyEmail() {
    try {
        let req = new Graph().service('User/resendVerifyEmail')
        let data = await (await req.get()).getData()
        console.log(data)
        if (data) {
            console.log(data)
            resent.value = true
        }

    } catch (error) {
        resent.value = false
        if (error.getMsg()) {
            createToast(withProps(ToastText, { text: error.getMsg() ?? "Error logging in check your network" }), {
                showIcon: "true",
                swipeClose: "true",
                type: "danger",
                transition: "bounce",
                position: "bottom-center"
            })
        }
    }
}
async function getPosts() {
    try {
        let req = new Graph().service('Blog/getAll')
        let _posts = await (await req.get()).getData()
        posts.value = _posts
        console.log(_posts)
    } catch (error) {
        console.log(error)
    }
}

function handlePostClick(po:any){
    let title = po.title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
    let author = po.author.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
    let strTitle = title.replace(/\s+/g, '-').toLowerCase();
    let strAuthor = author.replace(/\s+/g, '-').toLowerCase();
    let postLink = `/post/${strAuthor}/${po.id}-${strTitle}-${po.post_id}`

    router.push(postLink)

}

onMounted(() => {
    checkUserIsVerified()
    getPosts()
})

</script>

<style scoped>
.posts-wrapper{
    width: 100%;
    max-width: 1000px;
    display: grid;
    place-content: center;
    justify-content: center;
    margin: auto;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 30px;
}
.post-image{
    width: 100%;
    height: auto;
}
.post-item{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    max-width: 200px;
    cursor: pointer;
}
</style>